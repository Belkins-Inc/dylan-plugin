---
name: copywriting
description: Writes the copy of every step of every enrolled lead's plan (emails, LinkedIn invitation notes and messages), including follow-ups with leads who said "not now" and colleagues they referred. Reads the queue (copy_queue), writes one lead's plan as one story, checks a whole batch (check_copy) and writes it (write_copy), with a sample the person approves first. Use whenever a strategy has messages that need copy, after enrolling, when a lead is stuck for want of copy, or when a follow-up or referral waits for its first message.
---

# Copywriting

Copy is written for **one named person**, every step up front at enrolment, so the person can
review a whole plan before launch. Dylan only sends it. A step whose copy is missing when it
falls due holds the lead.

## Read first

1. `get_brief`: rules are binding on copy too ("never mention pricing").
2. `get_strategy`: the strategy's brief (offer, tone, avoid, proof), each persona's angle, each
   step's guidance and hypothesis. Write only what these support.
3. Feedback and rule notes in the brief: what the person liked or banned in earlier samples.
4. `list_copy` on the strategy: what is already written, and the angles already in use.

## Procedure

1. `copy_queue` on the strategy (up to 200 at a time). Each item is one message still needing copy,
   ordered by lead, then step, with everything it is written from: the lead (name, title, time
   zone, facts), the company and its signal (why it is in the segment; empty when there is none),
   the persona and its angle, the step's guidance and hypothesis, whether it starts a new thread,
   the sender and signature, and the steps of this lead already written. An item may be a
   follow-up with someone who asked us to come back later, or the first message to a colleague a
   lead referred: read the conversation it follows (`get_thread`).
2. **Count the leads with no signal** in the batch and tell the person before writing them:
   nothing specific is known, so their copy makes no observation.
3. **Sample first, before any bulk.** Write every step for **one lead per persona** (a lead with a
   typical signal, not the richest), check it (step 6), and show it to the person as plain text:
   the subject, then each step's body. Take their edits into the strategy (`update_strategy`: the
   brief and the angles) and into a `rule` note on the strategy, and write the samples again until
   they approve. Only then write the rest. At a few hundred messages, copy written before anyone
   saw the style is copy written twice.
4. Write **one lead's whole plan as one story**: step 3 knows what steps 1 and 2 said. Follow each
   step's guidance and its place on the ask ladder (interest, then value, then the meeting). Where
   the guidance gives a question word for word, use it word for word.
5. One entry per message: its id, the subject (none for LinkedIn), the body, and the angle it leads
   with.
6. `check_copy` on the whole batch (up to 2,000) writes nothing and lists every message with a
   problem or a warning: Dylan's limits below plus the house rules a script can read (dashes
   and curly quotes, burned phrases and hype, the greeting with the real first name, a first
   sentence starting with I or We, the word limits per step, the question, the subject, one subject
   per thread, British spelling to a US reader, links and markdown, the same text to two
   colleagues at any step). Fix and check again until nothing is left. Check the batch together: colleagues are
   compared across it.
7. `write_copy`, up to 500 at a time. All or nothing: one refused message and nothing is written;
   the answer lists every problem per message. Fix and send the batch again.
8. `preview_message` on the first lead of each persona and template: the message as sent (from, to,
   subject, body with signature, when). Read it as the recipient would.
9. Repeat until the queue is empty: `get_strategy` then shows copy for every step.

A message can be rewritten until it is sending or sent.

## What Dylan refuses

- Email: a body under 20 characters or over 2,500; a subject missing, under 3 characters or over 90.
- LinkedIn invitation: refused outright on a step that sends its invitation without a note (the
  default); otherwise 1 to 200 characters, or 300 from an account with Premium. LinkedIn message: 1 to 1,900 characters. Neither takes a
  subject.
- Any channel: a placeholder left in the copy (double braces, or square brackets holding only words,
  such as a name or company in brackets).
- Every message needs an angle.

These are the floor. The house rules are stricter: [references/house-rules.md](references/house-rules.md),
with examples in [references/examples.md](references/examples.md).

## The rules that matter most

- **Specific or silent.** Where there is a signal or facts, one sentence is about them and could not
  go to any other company. Where there is none, take the angle from the brief and invent no
  observation: readers can tell.
- **Only what the brief supports.** No claim, number, customer or result that is not in the
  strategy's brief, the persona's angle, the notes or the lead's facts.
- **The first email connects the dots in three beats, then the question**: their footprint (a fact
  from the signal), what that usually means for this reader (hedged: "usually", "often"), and what
  they get free for a yes (a concrete deliverable matched to their pain); then the question that
  asks for it.
- **Simple beats clever.** The reader gets it in one read and can answer without thinking.
- **Every email ends on one short question**: under ten words, one obvious answer (a yes, a date or
  a name), never either-or, never two questions. **The first email offers value for a yes**, and the
  question asks for it: "Want us to check last month's invoices?". A question that only asks about
  them ("Who checks the invoices across your sites today?") gives nothing for the reply. The last
  email makes the offer once more and asks "Want me to set it up?"; it may close with one sentence
  after the question ("If this is not a priority right now, I will stop here.").
- **Greet by first name on its own line** ("Hi Ada,"), the real name written in. No first name, no
  greeting at all ("Hi there" is worse). The first sentence does not start with "I" or "We".
- **Short.** A first email at most 120 words, a follow-up 100, the last 70 (after the greeting). A
  few short paragraphs of uneven length, one idea, one ask. Plain text with blank lines between
  paragraphs: no markdown, lists or HTML, no link in the first email.
- **American spelling for US readers** (center, program, organize).
- **No sign-off, no signature.** Dylan appends the sender's signature; the body ends on its
  last sentence. A sender with no signature: stop and have the person add one.
- **Subject**: what a colleague would type, six words at most, sentence case or lower, no "!",
  emoji, dash or "quick question". Proper names keep their capitals. Write it last.
- **No dash as punctuation** (em dash, en dash, or a spaced hyphen); hyphens inside words are fine.
  Straight quotes and three dots, not typographic ones.

## Follow-ups and threads

- An email after the first goes in the same thread unless its step starts a new one: Dylan
  sends it as "Re: <the first email's subject>". Give it the first email's subject anyway, so the
  record reads cleanly.
- A follow-up does not repeat the opening, reuse the earlier observation or restate the same point;
  it moves to another side of the brief. No "just following up", no "bumping this".
- **Every step reads on its own and refers only to steps sure to have gone out.** A conditional
  LinkedIn message may never go; an email may bounce and LinkedIn go on. So an email never mentions
  LinkedIn, a LinkedIn message never relies on an email having arrived.

## LinkedIn

- Invitation note: only on a step that asks for one. At most 200 characters (300 from an account with Premium); two short sentences;
  asks for nothing beyond connecting; no pitch.
- Message: two to four sentences; no subject, no greeting line, no signature; one ask.

## Angles

Every message carries the idea it leads with, as kind and slug: `pain:slow-replies`,
`proof:acme-outdoor`, `trigger:new-funding`, `signal:review-rating`, `question:priority`,
`close:last-touch`, `referral:<referrer>`, `reengage:<topic>`. Reuse a slug for the same idea:
reply rates are read by angle.

## Referrals and coming back later

- **A referral's first message** names who referred them ("Anna Smith suggested I write to you")
  and says only what that person actually said: read their reply with `get_thread`.
- **Coming back later**, after a "not now": open on what they said ("You asked me to come back after
  the holidays"); do not replay the old sequence; one fresh reason, one ask. It is a new thread with
  its own subject. Its copy is due a couple of days before its start.

## Record

- An `insight` note when an angle or a step clearly works or fails; a `rule` note for a new copy
  rule from the person, so every writer follows it.
- `end_session`: strategies and leads written, what still needs copy.

## Common mistakes

- Writing step 2 without step 1 in view: four openings instead of one story.
- A bracketed placeholder or a double-brace token: refused, or worse, sent.
- Signing the email with the sender's name on top of Dylan's signature.
- An observation invented because the lead's facts were empty.
- Bulk copy before the person approved a sample.
- A question with "or" in it, or a second question "to be safe".
- `write_copy` without `check_copy` on the whole batch first.
- A batch left half written at the end of a session: stuck leads the next morning.
