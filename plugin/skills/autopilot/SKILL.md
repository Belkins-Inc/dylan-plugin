---
name: autopilot
description: Runs the daily autonomous outbound sweep for a project. Checks channel health, warm-up and placement, wallet headroom, inbox triage and waiting drafts, quiet positives, due follow-ups, unsettled meetings, and pipeline pace, then hands over cleanly while waiting for a yes before spending, sending or launching. Use for daily checks, morning reviews, or whenever asked to run autopilot on a project.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Autopilot

Run a disciplined daily outbound sweep on one project. Do every safe read, check, triage, draft,
note, and task cleanup yourself; pause and ask the person for an explicit yes only before any
action that spends credits, sends to a lead, books or changes a meeting, re-engages, enrolls on an
active strategy, or launches.

## Step 1: Read the full snapshot

Pick the project with `list_projects` (confirming the slug if there is more than one). In a
terminal with the command installed, run one read-only snapshot first:

```sh
dylan autopilot --project <slug>
```

Or read the same seven views directly in parallel: `get_brief`, `get_health`, `get_dashboard`,
`get_wallet`, `list_tasks`, `list_drafts`, and `list_inbox` (`state: "triage"`). Never skip reading
the brief's rules, exclusions, decisions, and last session hand-overs before acting.

## Step 2: Channel health, warm-up, and placement

1. Check `get_health` and the brief's `channels` list for disconnected mailboxes, disconnected
   social accounts, failed sends, or paused strategies. Sending and reading stop on any broken
   channel until the person reconnects it.
2. Check `get_warmup` and `get_inbox_tests` whenever deliverability issues appear or placement has
   not been checked recently. Flag domains with spam pressure or stalled warm-up before proposing
   more volume.
3. Report channel blockers at the very top of your update with the exact channel name and reason.

## Step 3: Wallet and automatic top-up headroom

1. Read `get_wallet` for balance, daily recurring cost, days of runway left, and automatic top-up
   status.
2. Flag low headroom (under 7 days of runway, or automatic top-up turned off or paused).
3. Remind the person that topping up, saving a card, or changing automatic top-up is done by them
   on the app's Wallet page; never try to charge or change billing from a tool.

## Step 4: Inbox triage and waiting drafts

Replies age fast; positive leads go cold first.

1. Read `list_inbox` (`state: "triage"`) oldest first, positives before the rest. For each reply,
   read the full conversation (`get_thread`), confirm or correct the class with `triage_reply`
   (including return or follow-up dates and a crisp one-line note), and follow the `inbox-triage`
   guide.
2. Draft answers with `draft_reply` for replies that need one, respecting all project rules and
   exclusions. Never call `approve_reply` without showing the draft and getting a yes first.
3. Check `list_drafts` for waiting drafts (especially any nearing their deadline) and also check
   `list_drafts` with `status: "failed"` for answers that failed to send. If a failed answer was
   blocked by a now-fixed channel, propose `retry_reply` for the person's yes.

## Step 5: Follow-through queues

Check the brief's three follow-through counters in order:

1. **Quiet positives (`positiveToChase`)**: open each thread (`get_thread`), check when we last
   wrote, and prepare a concise follow-up draft with `draft_reply` for approval.
2. **Due deferrals (`followUpsDue`)**: inspect due `not_now` replies (`list_inbox` with
   `label: "not_now"`), confirm the contact is not on do-not-contact and has not departed, and
   propose `reengage` (stating the strategy and start date) for the person's yes.
3. **Unsettled meetings (`meetingsToSettle`)**: read past-due meetings with `list_meetings`, list
   each one for the person, and ask how it went (`held` with outcome, `no_show`, or cancelled) so
   you can record it with `record_meeting_outcome`.

## Step 6: Open tasks and pipeline pace

1. Review `list_tasks` (`status: "open"`). Close any task whose condition is already met using
   `close_task` with a factual note. Open a focused task with `open_task` only for genuine human
   blockers (disconnected channel, missing client decision).
2. Review `get_dashboard` and `list_strategies` against this month's meeting goal:
   - Flag strategies with `needsCopy` steps, `stalled` leads, or low `activeLeads`.
   - If the pipeline is behind pace, size replenishment first with free tools (`count_companies`,
     `count_people`, `quote_data`) and present the cost and count before asking for a yes to search,
     verify, `enroll_leads`, or `launch_strategy`.

## Step 7: Hand over cleanly

Always finish with `end_session` using three crisp sections with exact counts and IDs:

- **Done**: replies triaged, drafts prepared, tasks closed, checks completed.
- **Needs your yes**: every spend, send, retry, re-engagement, enrollment, or launch proposal with
  exact counts and cost.
- **Watch**: broken channels, wallet runway warnings, unsettled meetings, and upcoming deadlines.

Record durable findings with `add_note` (`insight`, `decision`, or `todo`) so the next sweep starts
with accurate memory.
