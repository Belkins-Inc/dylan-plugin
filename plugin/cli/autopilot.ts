import { callTool } from './api.ts'
import { DylanError, usage } from './errors.ts'

// Read-only daily outbound autopilot snapshot: resolves one project and reads its brief, health,
// dashboard, wallet, open tasks, waiting drafts, and inbox triage queue in parallel.

export type AutopilotSnapshot = {
  project: string
  brief: Record<string, unknown> | null
  health: Record<string, unknown> | null
  dashboard: Record<string, unknown> | null
  wallet: Record<string, unknown> | null
  walletNote: string | null
  tasks: unknown[]
  drafts: unknown[]
  inbox: unknown[]
}

function asArray(value: unknown, keys: readonly string[]): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    for (const k of keys) if (Array.isArray(obj[k])) return obj[k] as unknown[]
  }
  return []
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function num(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

function money(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Resolves the target project slug, auto-picking the sole project when `--project` is omitted. */
export async function resolveProject(
  server: string,
  requested?: string,
  caller: typeof callTool = callTool,
): Promise<string> {
  if (requested?.trim()) return requested.trim()
  const listed = await caller(server, 'list_projects', {})
  const projects = asArray(listed, ['projects', 'items'])
    .map((row) => asRecord(row))
    .filter(
      (row): row is Record<string, unknown> => row !== null && typeof row['slug'] === 'string',
    )
  if (projects.length === 0)
    throw new DylanError(
      'No projects found in this organisation',
      'Create one with: dylan call create_project name="<name>"',
      1,
    )
  if (projects.length === 1) return projects[0]!['slug'] as string
  const slugs = projects.map((p) => String(p['slug']))
  throw usage(
    'More than one project is available; pass --project <slug>',
    `Available projects: ${slugs.join(', ')}`,
  )
}

/** Reads all seven autopilot views in parallel (strictly read-only). */
export async function fetchAutopilot(
  server: string,
  requestedProject?: string,
  caller: typeof callTool = callTool,
): Promise<AutopilotSnapshot> {
  const project = await resolveProject(server, requestedProject, caller)
  let walletNote: string | null = null
  const walletRead = caller(server, 'get_wallet', {}).catch((error: unknown) => {
    if (
      error instanceof DylanError &&
      error.code !== 'unauthenticated' &&
      error.code !== '401' &&
      error.code !== 'network'
    ) {
      walletNote = error.message
      return null
    }
    throw error
  })
  const [brief, health, dashboard, wallet, tasks, drafts, inbox] = await Promise.all([
    caller(server, 'get_brief', { project }),
    caller(server, 'get_health', { project }),
    caller(server, 'get_dashboard', { project }),
    walletRead,
    caller(server, 'list_tasks', { project, status: 'open' }),
    caller(server, 'list_drafts', { project }),
    caller(server, 'list_inbox', { project, state: 'triage' }),
  ])
  return {
    project,
    brief: asRecord(brief),
    health: asRecord(health),
    dashboard: asRecord(dashboard),
    wallet: asRecord(wallet),
    walletNote,
    tasks: asArray(tasks, ['tasks', 'items']),
    drafts: asArray(drafts, ['drafts', 'replies', 'items']),
    inbox: asArray(inbox, ['items', 'replies', 'threads']),
  }
}

/** Formats a compact, scannable terminal report for the daily autopilot sweep. */
export function formatAutopilot(snapshot: AutopilotSnapshot): string {
  const briefProject = asRecord(snapshot.brief?.['project'])
  const name = str(briefProject?.['name']) ?? str(snapshot.health?.['name']) ?? snapshot.project
  const status = str(briefProject?.['status']) ?? str(snapshot.health?.['status'])
  const goal = asRecord(snapshot.brief?.['goal'])
  const goalDone =
    num(goal?.['meetingsDone']) ??
    num(goal?.['meetings_done']) ??
    num(snapshot.health?.['goalDone'])
  const goalTarget =
    num(goal?.['meetingsTarget']) ??
    num(goal?.['meetings_target']) ??
    num(snapshot.health?.['goalTarget'])

  const lines: string[] = [
    `Autopilot: ${name} (${snapshot.project})${status ? ` [${status}]` : ''}`,
  ]
  if (goalTarget !== null) lines.push(`Goal: ${goalDone ?? 0} / ${goalTarget} meetings this month`)

  // Health & channels
  const issues = asArray(snapshot.health?.['issues'], ['issues'])
    .map((i) => asRecord(i))
    .map((i) => str(i?.['text']))
    .filter((t): t is string => t !== null)
  const channels = asArray(snapshot.brief?.['channels'], ['channels'])
    .map((c) => asRecord(c))
    .filter((c): c is Record<string, unknown> => c !== null)
  const troubledChannels = channels.filter(
    (c) => str(c['problem']) !== null || str(c['status']) === 'disconnected',
  )
  lines.push('')
  lines.push('Health & channels:')
  if (issues.length === 0 && troubledChannels.length === 0) {
    lines.push('  All clear (no health issues or disconnected channels)')
  } else {
    for (const issue of issues) lines.push(`  - ${issue}`)
    for (const ch of troubledChannels)
      lines.push(
        `  - ${str(ch['kind']) ?? 'channel'} ${str(ch['name']) ?? ''}: ${str(ch['problem']) ?? str(ch['status']) ?? 'problem'}`.trimEnd(),
      )
  }

  // Wallet headroom
  lines.push('')
  lines.push('Wallet:')
  if (snapshot.wallet) {
    const balanceCents =
      num(snapshot.wallet['balanceCents']) ?? num(snapshot.wallet['balance_cents'])
    const balanceUsd =
      num(snapshot.wallet['balanceUsd']) ??
      num(snapshot.wallet['balance']) ??
      (balanceCents !== null ? balanceCents / 100 : null)
    const dailyUsd =
      num(snapshot.wallet['dailyUsd']) ??
      num(snapshot.wallet['dailyCostUsd']) ??
      (num(snapshot.wallet['dailyCents']) !== null
        ? num(snapshot.wallet['dailyCents'])! / 100
        : null)
    const daysLeft = num(snapshot.wallet['daysLeft']) ?? num(snapshot.wallet['daysRemaining'])
    const autoTopUp =
      asRecord(snapshot.wallet['autoTopUp']) ?? asRecord(snapshot.wallet['auto_top_up'])
    const parts = [
      balanceUsd !== null ? `balance ${money(balanceUsd)}` : null,
      dailyUsd !== null ? `burn ${money(dailyUsd)}/day` : null,
      daysLeft !== null ? `${Math.round(daysLeft)}d runway` : null,
      autoTopUp ? `auto-top-up ${autoTopUp['enabled'] ? 'on' : 'off'}` : null,
    ].filter(Boolean)
    lines.push(`  ${parts.length ? parts.join(' | ') : 'loaded (see --json for details)'}`)
  } else {
    lines.push(`  ${snapshot.walletNote ?? 'unavailable'}`)
  }

  // Queues & inbox
  const queues = asRecord(snapshot.brief?.['queues'])
  const untriaged = num(queues?.['untriaged']) ?? snapshot.inbox.length
  const draftsWaiting = num(queues?.['draftsToApprove']) ?? snapshot.drafts.length
  const positiveToChase = num(queues?.['positiveToChase']) ?? 0
  const followUpsDue = num(queues?.['followUpsDue']) ?? 0
  const meetingsToSettle = num(queues?.['meetingsToSettle']) ?? 0
  const needsCopy = num(queues?.['needsCopy']) ?? 0
  const stalled = num(queues?.['stalled']) ?? 0
  const activeLeads = num(queues?.['activeLeads'])

  lines.push('')
  lines.push('Queues:')
  lines.push(
    `  Untriaged: ${untriaged} | Drafts to approve: ${draftsWaiting} | Quiet positives: ${positiveToChase} | Due follow-ups: ${followUpsDue} | Meetings to settle: ${meetingsToSettle}`,
  )
  lines.push(
    `  Active leads: ${activeLeads ?? 'n/a'} | Needs copy: ${needsCopy} | Stalled: ${stalled}`,
  )

  // Dashboard snapshot
  const totals = asRecord(snapshot.dashboard?.['totals']) ?? snapshot.dashboard
  const contacted = num(totals?.['contacted'])
  const replied = num(totals?.['replied'])
  const positive = num(totals?.['positive'])
  const meetings = num(totals?.['meetings'])
  if (contacted !== null || replied !== null || meetings !== null) {
    lines.push('')
    lines.push('Pipeline:')
    lines.push(
      `  Contacted: ${contacted ?? 0} | Replied: ${replied ?? 0} | Positive: ${positive ?? 0} | Meetings: ${meetings ?? 0}`,
    )
  }

  // Open tasks
  lines.push('')
  lines.push(`Open tasks (${snapshot.tasks.length}):`)
  if (snapshot.tasks.length === 0) {
    lines.push('  None')
  } else {
    for (const raw of snapshot.tasks.slice(0, 5)) {
      const task = asRecord(raw)
      if (!task) continue
      const pri = str(task['priority']) === 'urgent' ? '[urgent] ' : ''
      lines.push(`  - ${pri}${str(task['title']) ?? '(untitled)'}`)
    }
    if (snapshot.tasks.length > 5) lines.push(`  ...and ${snapshot.tasks.length - 5} more`)
  }

  // Next actions
  const next: string[] = []
  if (troubledChannels.length > 0) next.push('Reconnect broken channels before sending')
  if (untriaged > 0)
    next.push(`Triage ${untriaged} waiting ${untriaged === 1 ? 'reply' : 'replies'}`)
  if (draftsWaiting > 0)
    next.push(
      `Review ${draftsWaiting} waiting ${draftsWaiting === 1 ? 'draft' : 'drafts'} (approval requires --yes)`,
    )
  if (positiveToChase > 0)
    next.push(`Draft follow-ups for ${positiveToChase} quiet positive thread(s)`)
  if (followUpsDue > 0)
    next.push(`Propose re-engagement for ${followUpsDue} due follow-up(s) (requires --yes)`)
  if (meetingsToSettle > 0) next.push(`Ask for outcomes on ${meetingsToSettle} past-due meeting(s)`)
  if (needsCopy > 0) next.push(`Write copy for ${needsCopy} waiting step(s)`)

  lines.push('')
  lines.push('Suggested order:')
  if (next.length === 0) {
    lines.push('  Nothing urgent waiting; hand over with end_session if you made changes.')
  } else {
    for (const [i, step] of next.entries()) lines.push(`  ${i + 1}. ${step}`)
  }

  return lines.join('\n')
}
