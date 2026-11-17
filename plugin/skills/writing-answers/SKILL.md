---
name: writing-answers
description: Writes every answer to the person's leads and every follow-up copy waiting for them (list_answers_waiting), on a schedule in their desktop agent app, so the drafts are ready by the time they look; the person approves each. Use when the scheduled task fires, when asked to write the waiting answers or a rewrite someone asked for (ask_for_rewrite), and to set the schedule up on a new computer.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Writing answers

Dylan reads every reply and gives it a class; it never writes an answer to a lead. You do: you
run on the computer of the person whose leads they are, with their memory of the project, of what
they sell and of how they write. Every answer, every rewrite and every follow-up's copy is yours,
and a person approves each before it goes.

`list_answers_waiting` lists what waits for you, across the person's projects, urgent first (a
lead who wants to talk). Run it on a schedule so nothing waits for the morning.

## Set up the schedule (once per computer)

In the desktop app the person runs you in, create a scheduled task (its Scheduled tab, or your
scheduled-tasks tool if you have one):

- every 15 minutes, while the app is open (a run missed while it was closed runs when it opens);
- in a session where Dylan is connected, and where Dylan's tools that only read or draft are
  allowed without asking: nobody is there to answer a question. Dylan's tools that send stay
  asked-for, so a run cannot send even by mistake;
- prompt: `Use the writing-answers guide: list what waits to be written (list_answers_waiting) and
  write everything in it. Never approve, send or discard. End with one line: what you wrote, by
  project.`

Run `list_answers_waiting` once by hand there first, to see it answers. Keep the app open on a
working day: a lead who wants to talk waits for the next pass, not for the morning.

## A pass

1. `list_answers_waiting`. Nothing in it: end with "Nothing waiting".
2. For each project in it, in that order, read what every answer is written from: `get_brief`, the
   rule and feedback notes it shows, the answers the person gave to questions, and the
   `inbox-triage` guide's [references/answers.md](../inbox-triage/references/answers.md). Your own
   memory of the project and of how this person writes counts as much: use it.
3. Each item, by `kind`:
   - `reply`: a lead's reply with no answer. Read the whole thread (`get_thread`, always). Not yet
     triaged (`list_inbox` lists it)? Triage it first (`inbox-triage`, Procedure). Then answer it
     with `draft_reply` (a note for the approver, and `sendAt` or `approveBy` as `inbox-triage`
     says), or, when it needs none, `close_thread` with a note why. Times and booking:
     references/answers.md, Meetings (`list_free_times`, `offer_slots`). Colleagues still running at
     the company (`get_thread` lists them): name them in the draft's note for the approver, who
     holds them; never hold them yourself on a pass.
     A fact only the person has: a holding answer, and the question on the lead's thread with
     `ask_question` (the references say how to word it). The thread comes back as `question` once
     they answer it.
   - `ask`: someone asked for this (`ask` is what they said, `askedBy` who). `draftId` set: a new
     version of that draft changing only what was asked, with `revise_draft` and a note saying what
     changed. No draft: write the answer as they asked, with `draft_reply`.
   - `question`: the person answered a question (`question`, `answer`) the thread waited for. Write
     it in: `revise_draft` on the waiting draft (`draftId`), or draft the follow-up when the holding
     answer went already.
   - `chase`: a positive reply we answered at least two working days ago, with no word back and no
     meeting booked. Read the whole thread first. When a follow-up fits, draft one short,
     conversational nudge (`draft_reply`, offering fresh free times where it helps; never "just
     bumping this"). When it needs none (settled on a call, an event already past, a teammate on
     it), `close_thread` with why. Dylan stops chasing once two unanswered answers have gone.
   - `copy`: a follow-up plan (a re-engagement, a referral) has `steps` messages with no copy: the
     `copywriting` guide (`copy_queue` with the `strategyId`, then `write_copy`), with the lead's
     thread as context. A step someone else wrote in the meantime is refused with who and when:
     leave theirs.
   Writing, revising or closing in a thread settles what waited there; an item still listed on the
   next pass was not done.
4. **Never approve, send, retry or discard on a pass** (`approve_reply`, `retry_reply`,
   `discard_reply`, `forward_thread`): nobody is there to say yes. The draft waits for the person in
   Dylan's app, or in their next session with you.
5. End with one line: what you wrote, by project (`acme: 3 answers, 1 rewrite; globex: copy for 4
   steps`). No session summary per pass: it is not a working session.

## Asked for a rewrite

A person reading a draft somewhere else (Dylan's app, a teammate's session) asks for it to be
written again with `ask_for_rewrite`, saying what should change: the ask waits in
`list_answers_waiting` for the next pass, as an `ask` with the draft's id.

## Learning from the approver

When the person edits a draft before approving it, asks for a rewrite, or tells you what was wrong,
keep the lesson. One that holds for the whole project goes to its rules (`add_note`, kind `rule`),
so everyone's agent writes the same way; one about this person's own voice stays in your memory.
What went (`get_thread`) against your versions (`list_draft_versions`) shows what they changed.
