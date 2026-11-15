---
name: strategy-and-plans
description: Builds a strategy (segments x personas x what we say x how we send) on what the person approved. Its brief and angles, channels chosen from evidence, plan templates and their steps, whether the senders can carry the goal, enrolling leads with a dry run first, getting it ready for the person to launch, and keeping it full and healthy afterwards. Use when creating or changing a strategy, setting plans, enrolling contacts, preparing a launch, or when a task says a strategy is below its target or unhealthy.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Strategy and plans

A strategy picks segments and personas (in priority order, with an angle per persona), says what we
offer (its brief), holds plan templates (one per channel mix), senders and a schedule. Every
enrolled lead gets its own plan of steps, copied from the template. Dylan carries out the
plans and protects the senders; it never finds people, enrols or launches by itself.

## Read first

1. `get_brief`: the goal, rules, exclusions, decisions, tasks, queues.
2. `list_strategies`, then `get_strategy` for any strategy you touch: settings, personas, plans,
   leads by status, and the checks that stand before its launch.
3. `list_segments`, `list_personas`, `list_senders`, `list_mailboxes`, `list_linkedin_accounts`:
   the ids you will reference, and what can actually send.
4. The decisions that approved the segments this strategy draws on.
5. What each channel has answered so far: the brief's previous outreach, and `get_dashboard`
   broken down by channel.

## Procedure

### 1. Start from what the person approved

A strategy is built on segments the person approved (`segment-design`, "Propose, then stop"). No
approval: stop; nothing is bought for this strategy (people, addresses, checks) until there is one.

The strategy's own choices are part of that approval, because they change what the company gets:
which personas and in what order, people per company, the channels (section 3), and whether the
senders can carry the goal (section 5). Drafting a strategy is free; where a choice differs from
what was approved, put the difference to the person and stop before paying or enrolling.

### 2. Create it

`create_strategy` with a name and the settings; anything left out takes the default, and
`update_strategy` changes it later. A list given (segments, personas, senders) **replaces** the one
there: pass the whole list. The settings:

- `brief`: what every message is written from, in markdown, in four short parts: **offer and
  call to action**, **tone**, **avoid**, and **proof** the company approved. One or two sentences
  each. Write only what the company approved (the brief, notes); where there is nothing, say so in
  one sentence instead of inventing a claim, a number or a case. No placeholders.
- `personas`: the ladder in priority order. Each rung's `angle` is the persona level: the pain or
  trigger for this role in this segment, the one argument that lands, the proof that convinces. A
  role's concerns come from what is written down (the persona's description, the brief), never
  inferred from a job title.
- `senders`: senders whose mailboxes are active, each with a signature (`sender-signatures`).
- The schedule: send days, a send window in the lead's own time zone (weekdays, 09:00 to 17:00 by
  default), people per company (2 by default), how many leads to keep in flight (`targetActive`),
  how many days a batch's starts are spread over, how far apart colleagues at one company start,
  an optional daily cap on first emails, and the catch-all policy (`hold` unless there is a reason
  written down).

### 3. Choose channels from evidence

Channels follow what this market has answered, not habit and not only what is connected. Before
choosing templates, read the reply rate per channel from every history there is: this project's
own figures and the company's previous outreach. Compare like with like (replies per lead reached
on each channel, with the base beside each rate). One meeting is evidence too.

State the choice against the numbers in a `decision` note on the strategy ("Email and LinkedIn:
LinkedIn replied at 20% of accepted, email at 0.13% of sends"). Where the evidence favours LinkedIn
and no account is connected, tell the person and ask them to connect one (`sending-setup`); do not
build a quiet email-only plan. No history anywhere: say so, and give each step a hypothesis the
first results can answer.

### 4. Set the plan templates, before the first enrolment

`set_plans` replaces every template, and **is refused once any lead has a plan copied from them**.
Settle the steps first. Shapes and examples: [references/plans.md](references/plans.md).

- One template per channel mix, at most: `email_and_linkedin`, `email_only`, `linkedin_only`. Dylan picks per lead from its data: an address and a LinkedIn profile get `email_and_linkedin`
  (falling back to `email_only`, then `linkedin_only`, when that template is missing); an address
  only, `email_only`; a profile only, `linkedin_only`. Set only what the project can carry out: no
  LinkedIn account, `email_only` alone.
- Steps: `email`, `linkedin_invite`, `linkedin_message`, each a number of send days after the one
  before (three unless set; the first is always zero).
- A LinkedIn message after an invitation waits for it: `anchor` and `condition` set to
  `invite_accepted`, with a longest wait of 7 to 10 days, after which it is skipped and the plan
  goes on. A fallback for those who never accept carries `invite_not_accepted`.
- Invitations go **without a note** by default: a note is capped far below a bare invitation on
  LinkedIn, and a free account runs out after a handful. What a note would say goes into the first
  message after acceptance.
- An email step after the first goes in the same thread unless it starts a new one.
- `guidance` per step is the writer's instruction: what the step is for, what to open on, what to
  ask. It may fix the question word for word. No em or en dash anywhere in it (refused): the writer
  lifts its wording into copy.
- `hypothesis` per step: what the step should prove, read back when judging results.

**How many steps**: four emails over two to three weeks by default (0, 3, 4, 5 send days apart).
Fewer than three wastes a researched lead; more than five reads as a machine and wears out the
domain. The ask climbs, it does not repeat: the first asks at low friction whether it is of
interest; the middle ones give a reason or a proof and ask softly; the last asks for the meeting
directly or closes politely. Every step reads on its own and refers only to steps sure to have gone
out: an email never mentions LinkedIn, a LinkedIn message never relies on an email having arrived.

### 5. Can the senders carry it

Before enrolling, turn leads into messages and messages into sender days, with Dylan's real
limits. Method and a worked example: [references/capacity.md](references/capacity.md). Record the
arithmetic in a `decision` note on the strategy and set `targetActive` from it. Where the senders
fall short of the goal, that goes to the person before enrolling: more mailboxes (`sending-setup`),
a smaller batch, or a later goal.

### 6. Enrol

1. Stand the people for the strategy (`stand_contacts`): candidates, or held or rejected with the
   reason. Rejected means nobody looks at them again.
2. `enroll_leads` with `dryRun` first: each lead with its contact, segment and persona, up to 500 a
   call. The dry run answers, per lead, the template it would get and when it starts, or why it is
   skipped.
3. Read the skips and fix what can be fixed. What Dylan refuses: a contact on do-not-contact,
   or already live in another strategy (one contact, one live strategy); a segment or persona not in
   the strategy; a catch-all held back by the policy; no usable address and no LinkedIn profile; no
   template that fits; the company's cap or the persona's cap at the company; no active mailbox
   among the senders; the month's lead allowance used up.
4. Then, with the person's yes, enrol for real. Starts are spread over the strategy's spread days,
   and colleagues at one company start some days apart.

**The sample first.** Enrol one lead per persona before the rest, write their copy (`copywriting`)
and show it to the person. The plan templates are frozen from that first enrolment, so their edits
go into the strategy's brief and angles (`update_strategy`) and into a `rule` note on the strategy
that every later batch is written by. Only then enrol and write the rest.

After enrolling, every step of every lead needs copy: the `copywriting` guide, from `copy_queue`.

### 7. Ready, and the person launches

`get_strategy` lists the checks before launch, and all must pass: plan templates with steps, senders
with an active mailbox, leads enrolled, copy for every step of them. Before asking the person to
launch, also check that the company's customer and competitor lists are on do-not-contact, and read
a few messages end to end with `preview_message`. `launch_strategy` is the person's yes: after a
short undo window Dylan sends every lead its steps, inside the limits. Nothing is sent before.

New leads enrolled into a running strategy start on their next window once their copy is ready, so
write it in the same session.

### 8. Keep it full

`targetActive` is how many leads to keep in flight. Dylan only signals (a task) when fewer are
live or the candidates run out; finding and enrolling more is a session's work. When short: enrol
the standing candidates first, then source more (`sourcing`; a new market goes through the approval
first), then enrol and write copy.

### 9. Health

Dylan opens a task, and for a self-serve organisation pauses the strategy, when hard bounces
reach 3% of sends or unsubscribes and complaints reach 2%; it signals a strategy with no replies
after 200 sends. Read these only over enough volume (`results-review`). Bounces mean the addresses
were wrong (`email-finding`); unsubscribes mean the segment or the copy offends; silence means the
segment or the offer is wrong. Recommend a pause to the person with the figures; `pause_strategy`
stops new steps (replies are still read) until it is launched again.

Before calling a sender stuck, check: a mailbox sends only inside the window in the lead's time zone,
so a US project's mailboxes are quiet until the US morning; a mailbox on the ladder sends a trickle;
a domain whose outreach is held (`get_warmup`) waits for its notes to come back to the inbox.

To see where one lead stands, `get_lead` with its enrollment from `list_leads`: every step and what
became of it, why one was skipped or is stuck, what goes next and when, and its threads.

To hold one lead (the person wants to call them first, the company is in the news), `pause_lead`,
with the day it goes on by itself if there is one; `unpause_lead` lets it go on (a yes first: its
next step goes out). A lead Dylan paused itself, after an out-of-office or a booked meeting with a
colleague, goes on by itself and is not let go by hand. To end one lead's plan,
`stop_lead` with the reason; it cannot be undone.

## Record

- A `decision` note on the strategy for every choice someone would question: these personas, these
  channels against the evidence, this catch-all policy, this target and the capacity arithmetic.
- An `insight` for what results taught.
- `end_session`: what was built, what is left (copy, launch), what to watch.

## Common mistakes

- Buying people or addresses for a strategy on a market nobody approved, or on choices that changed
  since.
- An email-only plan by default while the evidence says LinkedIn answers and email does not.
- Several hundred leads against one or two new mailboxes without the arithmetic: steps queue for
  weeks and the month's goal slips.
- Enrolling before the plans are final: they are then frozen.
- `update_strategy` with part of the persona list: it replaces the list and drops the rest.
- A plan with LinkedIn steps in a project with no LinkedIn account.
- Guidance that refers to a conditional step ("as I said on LinkedIn").
- Skipping the dry run; reading "already in a live strategy" skips as failures.
- Launching with the customer list still outstanding.
