---
name: orientation
description: Start here, in every working session on a project. Picks the project, reads its state with get_brief, decides what to do first, keeps the project's memory with add_note and hands over with end_session. Also lists which tool does which job and which tools need the person's yes. Use at the start of any session, whenever the state of a project is in doubt, and before you stop.
---

# Orientation

Dylan is an outbound engine: it holds the project's record, sends email and LinkedIn steps, reads
the replies and protects the senders. You do the thinking through its tools: who to write to, what
to say, how to answer. These guides are the method.

The project is the only memory. The person you work with, their colleagues and other sessions work
the same project before and after you; nothing in your head or in this chat survives the session.
Never assume an earlier session did or did not do something: read it.

## Start of session

1. `list_projects`: the projects this connection reaches, with their slugs. Every other tool names
   a project by its slug. If the person did not say which project, ask; never pick one for them.
   Once chosen, name it back in one line ("Working on Northwind (northwind).") so a wrong pick is
   caught before anything is done on it.
2. `get_brief`: read all of it before doing anything (below).
3. `get_setup` on a new project: what still stands between it and its first send (senders,
   mailboxes, calendars, goals), and for each step the request to work from. The owner and the time
   zone (`set_owner`, `set_time_zone`, the people from `list_people`) and this month's goal
   (`set_goal`) are the person's answers, set by you once they give them; the brief is yours to
   write (`company-brief`); the channels are in `sending-setup`.
4. Then read in full what matters for today (`get_dashboard`, `list_strategies`, `list_inbox`,
   `list_tasks`), and decide.

## Reading the brief

| Part | What to do with it |
| --- | --- |
| The project's brief | What the company sells, to whom, and what we say. Thin or empty: the `company-brief` guide comes first. |
| The goal | This month's meeting target and progress. Behind pace: filling the pipeline (sourcing, enrolling) outranks polish. |
| Rules and exclusions | Hard rules on every action. `judge_companies` refuses to qualify a company that breaks an exclusion; prose rules nobody checks but you. |
| Decisions | Settled. Do not reopen without new evidence; if you do, supersede the note (below). |
| Insights and feedback | What worked, what the person said. Read before copy, segments and triage. |
| Open tasks | Work Dylan or a person asked for. If one is done, close it with `close_task` and a note of what you saw. |
| Open questions | What the person was asked and the work waits on. An answer they gave goes in with `answer_question`. |
| Hypotheses | Ideas being tested or waiting for a yes, with how each will be judged (below). |
| Queues | Replies to triage, drafts waiting for approval, positive threads gone quiet (`positiveToChase`), due "not now" follow-ups (`followUpsDue`), past-due meetings to settle (`meetingsToSettle`), steps with no copy, leads that cannot move. |
| Channels | Mailboxes and LinkedIn accounts with a problem: sending and reading stop for that channel until the person fixes it. |
| Last sessions | The last hand-overs: pick up what was left, check what was flagged to watch. |

**Order of work** when several things are open: replies waiting for triage and answers with a
deadline, then broken channels, then stuck leads and missing copy, then open tasks you can settle,
then a pipeline below target, then everything else. A reply left for days is the costliest failure
there is: positive answers go cold.

## Which tool does which job

| Job | Tools | Guide |
| --- | --- | --- |
| Orientation and memory | `list_projects`, `get_brief`, `get_setup`, `get_dashboard`, `get_spend`, `get_behaviour`, `list_tasks`, `open_task`, `close_task`, `add_note`, `ask_question`, `answer_question`, `add_hypothesis`, `update_hypothesis`, `end_session` | this one |
| The project's set-up | `get_setup`, `set_time_zone`, `list_people`, `set_owner`, `set_goal` | this one |
| What the company sells | `get_brief`, `save_brief`, `add_note`, `add_exclusion`, `add_dnc`, `list_dnc`, `ask_question` | `company-brief` |
| Senders and channels | `list_senders`, `add_sender`, `update_sender`, `list_mailboxes`, `connect_mailbox`, `update_mailbox`, `get_warmup`, `set_warmup`, `list_linkedin_accounts`, `connect_linkedin` | `sending-setup`, `sender-signatures` |
| Domains and mailboxes to buy | `list_domains`, `quote_domains`, `buy_domains`, `get_company_details`, `set_company_details`, `get_google_organisation`, `set_google_organisation`, `order_mailboxes` | `sending-setup` |
| Which companies | `list_segments`, `save_segment`, `list_sources`, `save_source`, `list_segment_companies`, `save_companies`, `judge_companies` | `segment-design` |
| Which people | `list_personas`, `save_persona` | `persona-design` |
| Finding them | `count_companies`, `search_companies`, `count_people`, `search_people`, `enrich_profile`, `read_page`, `record_search`, `get_provider_call`, `save_contacts`, `list_contacts` | `sourcing` |
| Addresses | `find_emails`, `collect_emails`, `verify_email`, `check_address`, `replace_address` | `email-finding` |
| Strategies and plans | `list_strategies`, `get_strategy`, `create_strategy`, `update_strategy`, `set_plans`, `stand_contacts`, `enroll_leads`, `launch_strategy`, `pause_strategy`, `list_leads`, `pause_lead`, `unpause_lead`, `stop_lead` | `strategy-and-plans` |
| Copy | `copy_queue`, `check_copy`, `write_copy`, `list_copy`, `preview_message` | `copywriting` |
| Replies and meetings | `list_inbox`, `get_thread`, `triage_reply`, `draft_reply`, `list_drafts`, `approve_reply`, `discard_reply`, `close_thread`, `reengage`, `refer`, `list_meetings`, `list_calendars`, `list_free_times`, `offer_slots`, `booking_link`, `book_meeting`, `cancel_meeting` | `inbox-triage` |
| Results | `get_dashboard`, `list_strategies`, `get_strategy`, `list_leads`, `get_spend` | `results-review` |
| Privacy | `erase_person`, `list_erasures` | below |

## Ask the person first

Some tools launch, enrol, buy, spend or send. They are marked destructive, and your client asks the
person before each call. Do not work around that: say what the call will do and what it costs
first, in one or two lines, and wait for a yes.

- **Spends money**: the paid search and lookup tools, `collect_emails`, `verify_email`,
  `check_address`, `read_page`, `buy_domains`, `order_mailboxes`, `set_warmup`. Each tool's description gives its
  price; quote it from there, never from memory. `get_spend` shows what was spent.
- **Writes to people**: `launch_strategy`, `approve_reply`, `book_meeting`, `cancel_meeting`,
  `reengage`, `refer`, `replace_address`, `unpause_lead`, `enroll_leads` on an active strategy.
- **Cannot be undone**: `stop_lead`, `erase_person` (an admin's act: it forgets a person who asked
  to be forgotten, across the organisation), `add_dnc`.

A scheduled run of an agent, with nobody watching, is refused every destructive tool: it reads,
triages, drafts and keeps notes, and leaves the rest to a person's session.

Refusals come back with a message and a hint. Read both and do what the hint says; do not retry
the same call unchanged.

## How Dylan behaves

Before answering any "what happens when..." question (a lead already connected on LinkedIn, a
reply mid-plan, a mailbox at its limit, a paused strategy), read `get_behaviour`: without a topic
it lists the topics, with one it gives that topic's entries. Answer from the entry and say which.
If no entry covers it, say so plainly rather than guessing from tool names.

## Keeping the project's memory

Write down, as you go, anything the next session needs. Text in chat is lost. `add_note` keeps one
note of a kind:

- `rule`: a constraint every future action must keep ("never mention pricing", "LinkedIn only for
  Germany").
- `decision`: something chosen, with the why in the body ("dropped the retail segment: 2 of 40
  qualified").
- `insight`: something learned from data ("the reviews angle draws three times the replies").
- `client_feedback`: what the person or their team said about the work, verbatim where possible,
  with who and when.
- `todo`: a loose end for a later session.

Titles are the claim itself, not a topic ("Canada is in scope from 1 October", not "Canada").
Notes are never edited: to change one, add the new note with `supersedes` naming the old note's
id; the old one stays as history and leaves the brief. Tie a note to its strategy or segment when
it is about one.

**An idea worth testing** (a buyer other than the brief names, a market not tried yet, a second
strategy beside the first) is an `add_hypothesis`: the claim, a sentence that can turn out false;
the evidence, why you think so; the metric and the threshold that would confirm it. Nothing is
bought, sourced or enrolled for it until the person says yes; then `update_hypothesis` to
`testing`. When results settle it, `update_hypothesis` to `confirmed` or `rejected` with the verdict,
its figures and their base. A fact that bears on one along the way is an `addEvidence` line.

**A question the person must answer** (a price, a market, a customer you may name) is asked in the
conversation and recorded with `ask_question`, so the next session sees it waiting; on a lead's
thread, its draft waits for the answer. Their answer goes in with `answer_question`, in their words.

**Work only a person can do** (a call to make, material to send, a decision with someone else) is an
`open_task`: the title is what to do, `doneWhen` what done looks like. It goes to the project's owner
unless you name one of the organisation's people; they hear of it by mail.

## End of session

`end_session` with a summary, every time, even after a short session. Three parts, in plain
sentences with ids and numbers:

- **Done**: what changed (segments, companies judged, contacts, enrolments, copy, replies triaged,
  notes), with counts.
- **Left**: what the next session should pick up, in order, and what it waits on.
- **Watch**: what might go wrong or needs a check on a given day (an address batch to collect, a
  strategy near a health limit, a source near its end, a draft with offered times).

Before it: close the tasks you saw done, supersede the notes you contradicted, record every search
you ran (`record_search`) and collect every address batch you started, or leave its request id in a
`todo` note.

## Common mistakes

- Starting work before reading the brief to the end, or trusting the last summary without checking
  the data it describes.
- Calling a destructive tool without telling the person what it does and costs.
- Facts that matter on a date (offered times, a return date, a promised follow-up) left only in
  chat.
- Contradicting a decision with a new note without `supersedes`: both then show.
- Answering "what happens when..." from a guess instead of `get_behaviour`.
- A summary like "worked on sourcing": say what, how many, what is left.
