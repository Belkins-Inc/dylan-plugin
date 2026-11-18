---
name: orientation
description: Start here, in every working session on a project. Picks the project, reads its state with get_brief, decides what to do first, keeps the project's memory with add_note and hands over with end_session. Also lists which tool does which job, which tools need the person's yes, how to count and break down the data with run_sql and how to report what is wrong or missing in Dylan. Use at the start of any session, whenever the state of a project is in doubt, when something in Dylan fails or is missing, and before you stop.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

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
   write (`company-brief`); the channels are in `sending-setup`. An optional step the person
   decides to go without (the client's rules, LinkedIn) is skipped with `skip_setup_step`.
4. Then read in full what matters for today (`get_health` for what waits and what is broken,
   `get_dashboard`, `list_strategies`, `list_inbox`, `list_tasks`), and decide.

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
| Queues | Replies to triage, drafts waiting for approval, positive threads gone quiet (`positiveToChase`), due "not now" follow-ups (`followUpsDue`), past-due meetings to settle (`meetingsToSettle`: ask the person how each went and record it with `record_meeting_outcome`), steps with no copy, leads that cannot move. |
| Channels | Mailboxes and LinkedIn accounts with a problem: sending and reading stop for that channel until the person fixes it. |
| Last sessions | The last hand-overs: pick up what was left, check what was flagged to watch. |

**Order of work** when several things are open: replies waiting for triage and answers with a
deadline, then broken channels, then stuck leads and missing copy, then open tasks you can settle,
then a pipeline below target, then everything else. A reply left for days is the costliest failure
there is: positive answers go cold.

## Which tool does which job

| Job | Tools | Guide |
| --- | --- | --- |
| Orientation and memory | `list_projects`, `get_brief`, `get_setup`, `get_health`, `get_dashboard`, `get_spend`, `get_wallet`, `get_behaviour`, `list_tasks`, `open_task`, `close_task`, `add_note`, `ask_question`, `answer_question`, `list_hypotheses`, `add_hypothesis`, `update_hypothesis`, `end_session` | this one |
| The project's set-up | `get_setup`, `skip_setup_step`, `set_time_zone`, `list_people`, `set_owner`, `set_goal` | this one |
| What the company sells | `get_brief`, `save_brief`, `add_note`, `list_exclusions`, `add_exclusion`, `remove_exclusion`, `add_dnc`, `list_dnc`, `check_dnc`, `ask_question` | `company-brief`, `segment-design` |
| Senders and channels | `list_senders`, `add_sender`, `update_sender`, `list_sender_images`, `add_sender_image`, `remove_sender_image`, `get_sender_photo`, `set_sender_photo`, `list_shared_senders`, `add_shared_sender`, `share_sender`, `unshare_sender`, `list_mailboxes`, `connect_mailbox`, `connect_smtp_mailbox`, `update_mailbox`, `get_warmup`, `set_warmup`, `get_inbox_tests`, `get_domain_cap`, `set_domain_cap`, `list_linkedin_accounts`, `connect_linkedin` | `sending-setup`, `sender-signatures` |
| Domains and mailboxes to buy | `list_domains`, `quote_domains`, `buy_domains`, `get_company_details`, `set_company_details`, `get_google_organisation`, `set_google_organisation`, `get_google_admin_login`, `get_microsoft_tenant`, `get_microsoft_admin_login`, `accept_microsoft_agreement`, `leave_microsoft_tenant`, `order_mailboxes`, `list_mailbox_orders`, `cancel_mailbox_order`, `retry_mailbox_order`, `retry_domain`, `publish_dkim`, `set_dmarc`, `release_domain`, `transfer_domain`, `get_domain_dns`, `add_domain_record`, `delete_domain_record`, `set_domain_redirect` | `sending-setup` |
| Which companies | `list_segments`, `save_segment`, `set_segment_status`, `list_sources`, `save_source`, `set_source_status`, `list_segment_companies`, `list_verdicts`, `save_companies`, `judge_companies` | `segment-design` |
| Which people | `list_personas`, `save_persona` | `persona-design` |
| Labels on companies and contacts | `list_labels`, `add_label`, `update_label`, `remove_label`, `apply_label`, `take_off_label` | this one |
| Finding them | `count_companies`, `search_companies`, `count_people`, `search_people`, `enrich_profile`, `read_page`, `quote_data`, `record_search`, `get_provider_call`, `save_contacts`, `list_contacts` | `sourcing` |
| Keeping people straight | `list_duplicate_contacts`, `merge_contacts`, `mark_departed`, `check_employer` | `sourcing` |
| Data: which tool, its price, the cache | `look_up_people`, `match_person`, `look_up_companies`, `enrich_company`, `map_site`, `order_reviews`, `check_reviews_order`, `collect_reviews`, `get_cached_person`, `get_cached_company`, `list_cached_people` | `data-sources` |
| Addresses | `find_emails`, `collect_emails`, `verify_email`, `list_address_checks`, `check_address`, `replace_address` | `email-finding` |
| Phone numbers | `find_phones`, `list_phones`, `add_phones`, `set_phone`, `check_phone` | `email-finding` |
| Strategies and plans | `list_strategies`, `get_strategy`, `create_strategy`, `update_strategy`, `set_plans`, `add_plan`, `add_step`, `update_step`, `remove_step`, `exclude_companies`, `include_companies`, `stand_contacts`, `enroll_leads`, `launch_strategy`, `unlaunch_strategy`, `pause_strategy`, `archive_strategy`, `respread_starts`, `repick_mailboxes`, `list_leads`, `get_lead`, `pause_lead`, `unpause_lead`, `resume_lead`, `stop_lead` | `strategy-and-plans` |
| Copy | `copy_queue`, `check_copy`, `write_copy`, `list_copy`, `clear_copy`, `preview_message`, `test_copy`, `list_samples`, `write_samples`, `remove_sample` | `copywriting` |
| Replies and meetings | `list_inbox`, `count_inbox`, `get_pipeline`, `get_thread`, `triage_reply`, `draft_reply`, `list_drafts`, `approve_reply`, `unapprove_reply`, `discard_reply`, `close_thread`, `reopen_thread`, `set_deal_stage`, `reengage`, `refer`, `list_meetings`, `list_calendars`, `list_free_times`, `offer_slots`, `booking_link`, `book_meeting`, `move_meeting`, `cancel_meeting`, `keep_meeting`, `retry_meeting`, `record_meeting_outcome` | `inbox-triage` |
| Drafts, threads and automatic answers | `revise_draft`, `list_draft_versions`, `assign_reviewer`, `reschedule_reply`, `retry_reply`, `redraft_from_mailbox`, `undo_triage`, `close_threads`, `forward_thread`, `list_attachments`, `refetch_message`, `pause_colleagues`, `list_reply_templates`, `approve_reply_template`, `archive_reply_template`, `remove_dnc`, `import_dnc` | `inbox-triage` |
| Calendars and a meeting's record | `connect_calendar`, `add_external_calendar`, `update_calendar`, `archive_calendar`, `update_meeting`, `get_meeting_record` | `inbox-triage` |
| Answers written on a schedule | `list_answers_waiting`, `ask_for_rewrite` | `writing-answers` |
| Results | `get_dashboard`, `get_funnel`, `get_channels`, `list_strategies`, `get_strategy`, `list_leads`, `get_lead`, `get_spend` | `results-review` |
| Privacy | `erase_person`, `list_erasures` | below |
| Questions no tool answers | `get_schema`, `run_sql` | below |
| What is wrong or missing in Dylan | `report_issue`, `list_issues`, `get_issue` | below |

## Ask the person first

Some tools launch, enrol, buy, spend or send. They are marked destructive, and your client asks the
person before each call. Do not work around that: say what the call will do and what it costs
first, in one or two lines, and wait for a yes.

- **Spends money**: the paid search and lookup tools, `collect_emails`, `verify_email`,
  `check_address`, `check_employer`, `find_phones`, `check_phone`, `read_page`, `match_person`, `enrich_company`, `look_up_companies`, `map_site`,
  `order_reviews` and `collect_reviews`, `buy_domains`, `order_mailboxes`, `retry_mailbox_order`,
  `set_warmup`. What was bought before is kept and answered free: look in the project's data and
  the cache first (`data-sources`). Each tool's description gives its
  price, and `quote_data` (free) gives the most a data call will cost for so many results; quote
  from them, never from memory. `get_spend` shows what was spent; `get_wallet` the balance, what
  is held costs a day, how many days it lasts and automatic top-up. Topping up, saving a card and
  setting automatic top-up are a person's, on the app's Wallet page: say so, do not try.
- **Writes to people**: `launch_strategy`, `test_copy` (to someone of your organisation only),
  `approve_reply`, `retry_reply`, `forward_thread`, `approve_reply_template` (Dylan then answers by
  itself), `book_meeting`, `move_meeting`,
  `cancel_meeting`, `reengage`, `refer`, `replace_address`, `unpause_lead`, `resume_lead`,
  `enroll_leads` on an active strategy.
- **Cannot be undone**: `release_domain` (the domain is gone once it expires),
  `cancel_mailbox_order`, `stop_lead`, `archive_strategy`, `remove_step`, `erase_person` (an admin's act: it forgets a person who asked
  to be forgotten, across the organisation), `add_dnc`, `merge_contacts` (only the person can say two contacts are one
  person).

A scheduled run of an agent, with nobody watching, is refused every destructive tool: it reads,
triages, drafts and keeps notes, and leaves the rest to a person's session.

Refusals come back with a message and a hint. Read both and do what the hint says; do not retry
the same call unchanged.

## How Dylan behaves

Before answering any "what happens when..." question (a lead already connected on LinkedIn, a
reply mid-plan, a mailbox at its limit, a paused strategy), read `get_behaviour`: without a topic
it lists the topics, with one it gives that topic's entries. Answer from the entry and say which.
If no entry covers it, say so plainly rather than guessing from tool names.

## Questions no tool answers

A count or a breakdown across the data (replies by angle, leads by segment and step, meetings by
sender) is one `run_sql` select: read `get_schema` first for the tables and columns you may read,
and name the columns you want. It reads your organisation's projects alone, read-only, up to 500
rows and 5 seconds; a query that times out wants a narrower `where`. It never changes anything:
every change goes through the tool for it, which keeps who did it and why.

## When something in Dylan is wrong or missing

A tool that fails, answers wrongly or refuses what it should do, a behaviour no entry explains, or
a job no tool does: report it with `report_issue` (`bug`, `question` or `wish`), with the project,
what you did, what you expected, what happened, and the tool, its input and its refusal in
`context`. Do not route around it silently; tell the person you reported it and give the number.
At the start of a session, `list_issues` shows what is still open; `get_issue` gives Dylan's answer
once one is settled, and the work it unblocks can go on.

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

**Labels** are the project's own tags on its companies and contacts ("Partner", "Competitor",
"Event 2026"): the person sorts and filters leads by them. `list_labels` lists them with how many
carry each; `add_label` makes one, `update_label` renames it everywhere, `remove_label` takes it off
everything (the companies and contacts stay). `apply_label` puts one, by name, on companies and
contacts (made when the project has none of that name); `take_off_label` takes it off them. Ask before renaming or removing one the person made.

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
- Working around a broken or missing tool without reporting it: the next session meets it again.
