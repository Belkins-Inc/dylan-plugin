# Dylan for Claude Code

**AI-native B2B outbound from your terminal and Claude Code.**

Dylan is an outbound engine built for agents and the humans steering them. Dylan handles the
infrastructure and system of record — companies, contacts, multi-channel sequences, mailbox warm-up,
inbox placement protection, reply classification, opt-out compliance, and calendar booking — while
your agent handles the thinking: who to target, what to say, and how to reply.

This repository packages the complete Dylan setup for Claude Code:

- **The `dylan` CLI** — runs every Dylan tool against your account, plus batch workflows a chat
  window cannot hold (CSV imports, paginated JSONL exports, scripted analysis).
- **16 outbound workflow skills** (plus `using-dylan`) — structured playbooks that Claude reaches
  for automatically across research, targeting, copywriting, inbox triage, daily autopilot, and deliverability.

Learn more at [meetdylan.ai/mcp](https://meetdylan.ai/mcp) or sign in at
[app.meetdylan.ai](https://app.meetdylan.ai).

---

## 30-second quickstart

Requires a Dylan account ([app.meetdylan.ai](https://app.meetdylan.ai)), Claude Code, and Node.js
22.18 or newer.

### Option 1: Claude Code (recommended)

Open Claude Code and send:

```text
Set me up for Dylan: follow https://github.com/Belkins-Inc/dylan-plugin/blob/main/SETUP.md
```

Claude checks prerequisites, installs the plugin and `dylan` CLI, and signs you in through the
browser ([SETUP.md](SETUP.md)).

Or install from Claude Code directly:

```text
/plugin marketplace add Belkins-Inc/dylan-plugin
/plugin install dylan@dylan
```

Then ask Claude to run `dylan login` and say: `"Let's work on my Dylan project"`.

### Option 2: One-line terminal installer

Installs any missing prerequisites (`git`, Node.js, Claude Code), adds the plugin and `dylan` CLI,
and launches browser sign-in:

```sh
curl -fsSL https://raw.githubusercontent.com/Belkins-Inc/dylan-plugin/main/install.sh | bash   # macOS / Linux
irm https://raw.githubusercontent.com/Belkins-Inc/dylan-plugin/main/install.ps1 | iex          # Windows PowerShell
```

### Option 3: Standalone CLI or any MCP client

- **CLI (`@meetdylan/cli`)** — for Codex, Cursor, Windsurf, scripts, or terminal use:
  ```sh
  npm install -g @meetdylan/cli
  dylan login
  ```
- **Direct MCP server** — connect any MCP-compatible client to:
  ```text
  https://mcp.meetdylan.ai/mcp
  ```
  Setup guides for every client live at [meetdylan.ai/mcp](https://meetdylan.ai/mcp) and on the Home
  tab of [app.meetdylan.ai](https://app.meetdylan.ai).

---

## All 16 outbound skills

Every skill ships inside this plugin (alongside `using-dylan` for CLI patterns) and is loaded by
Claude automatically as you move through an outbound campaign:

| Phase | Skill | What it drives |
|---|---|---|
| **Strategy** | `orientation` | Picks a project, reads live state with `get_brief`, keeps memory with `add_note`, runs `run_sql`, and hands off cleanly |
| **Strategy** | `autopilot` | Runs the daily autonomous outbound sweep across channel health, wallet headroom, inbox triage, follow-through queues, and pipeline pace |
| **Strategy** | `company-brief` | Turns your site, deck, pricing, and customer stories into the brief, rules, and exclusions every message draws from |
| **Strategy** | `segment-design` | Defines target company segments, sizes markets with free counts first, and qualifies companies with copy-ready signals |
| **Strategy** | `persona-design` | Builds title and exclusion libraries and sets per-company persona ladders and contact caps |
| **Strategy** | `strategy-and-plans` | Builds multi-channel email and LinkedIn plans, dry-runs enrollment, checks readiness, and launches safely |
| **Strategy** | `results-review` | Breaks down replies, meetings, and spend by segment, persona, channel, and angle to decide what to iterate next |
| **Sourcing & Copy** | `data-sources` | Picks the lowest-cost data path first: project record, then free shared cache, then the cheapest paid enrichment |
| **Sourcing & Copy** | `sourcing` | Counts before searching, paginates cleanly, deduplicates people, checks current employment, and stores evidence |
| **Sourcing & Copy** | `email-finding` | Finds and verifies work emails in batches, handles catch-alls and bounces, and looks up phone numbers when needed |
| **Sourcing & Copy** | `copywriting` | Writes cohesive multi-step copy per lead, runs quality checks, sends test previews, and drafts warm-up samples |
| **Inbox & Replies** | `inbox-triage` | Reviews classified replies, drafts answers for approval, turns deferrals into follow-ups, handles referrals, and books calls |
| **Inbox & Replies** | `writing-answers` | Prepares waiting reply drafts and follow-up copy on a schedule so answers are ready for one-click approval |
| **Infrastructure** | `sending-setup` | Connects Google, Microsoft, and LinkedIn accounts, buys lookalike domains, manages DNS, warm-up, limits, and placement |
| **Infrastructure** | `sender-signatures` | Creates clean plain-text outreach signatures and optional HTML thread signatures for every sender |
| **Infrastructure** | `linkedin-posts` | Schedules profile and company-page LinkedIn posts with images and first comments after dry-run approval |

---

## Built-in safety guardrails

- **Human-in-the-loop approvals (`--yes`):** Nothing launches a strategy, sends a message, books a
  meeting, buys a domain/mailbox, or spends credits without explicit confirmation. The CLI refuses
  any guarded action until `--yes` is passed after you approve it.
- **Deliverability and warm-up protection:** Mailboxes ramp on an automatic warm-up ladder, inbox
  placement is continuously monitored, and domains showing spam pressure pause automatically before
  reputation degrades.
- **Compliance and opt-out enforcement:** Unsubscribes and hostile replies automatically stop the
  lead and add them to do-not-contact; booked meetings and replies pause colleagues at the same
  company.
- **Transparent pay-as-you-go wallet:** Every paid tool prints its cost in its description, and all
  spend is tracked live in your wallet at [app.meetdylan.ai](https://app.meetdylan.ai).

---

## Using the `dylan` command directly

```sh
dylan autopilot --project acme                # read-only daily outbound sweep snapshot
dylan tools                                   # list every tool (reads, writes, and guarded actions)
dylan tool save_companies                     # inspect one tool's input schema
dylan call list_projects
dylan call get_brief project=acme
dylan call save_companies project=acme --each companies --from companies.csv
dylan call list_leads project=acme --all --out leads.jsonl
dylan --help
```

For scripts or scheduled automation, create an API key in [app.meetdylan.ai](https://app.meetdylan.ai)
and export `DYLAN_API_KEY` instead of interactive browser login.

---

## Other agents and updates

- **Other coding agents:** [instructions/AGENTS.md](instructions/AGENTS.md) maps every skill to its
  plain HTTPS guide on `https://mcp.meetdylan.ai/guides/` so any agent with shell access can follow
  the same workflow.
- **Stay current in Claude Code:** run `/plugin marketplace update dylan` to pull the latest skills
  and CLI release.
- **License:** [MIT](LICENSE)
