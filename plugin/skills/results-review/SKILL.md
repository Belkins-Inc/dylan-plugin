---
name: results-review
description: Reads how the outbound is doing and turns it into a review for the person and their team (weekly, monthly or at a milestone). The figures against the goal, what worked by persona, segment, channel and angle, each strategy's health, what was spent, and what to change next. Use when asked "how are we doing", for a results update or report, before changing a strategy, or when a task says a strategy is unhealthy.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Results review

Dylan keeps the numbers; the review turns them into what a person acts on: what was done,
results against the goal, what worked and why, what changes next, and what is needed from them.

## Before anything

1. `get_brief`: the goal, notes, what is in flight.
2. Agree the period with the person. Default: since the last review (a note titled "Review
   <from>..<to>") to yesterday.
3. **Settle the inbox first.** If replies wait for triage, work them (`inbox-triage`) or say the
   reply figures are provisional: Dylan's unconfirmed classes can misstate the positives.
4. Read the person's side: feedback and decision notes, and how the meetings went (`list_meetings`).
   The review quotes their verdicts; it never invents one.

## Procedure

1. **Gather the figures** for the period: `get_dashboard` (companies, reached, contacts, leads,
   contacted, replied, positive, meetings, broken down by strategy, segment, persona and channel,
   counted over every lead a strategy ever had), `get_funnel` and `get_channels` for a month's own
   (leads written to, replied, positive and meetings in it; and by channel, how many were reached),
   `list_strategies` and `get_strategy` for each running one, `list_leads` by state (in plan,
   stuck, paused, replied, ended), `list_meetings`, and `get_spend` when cost is part of the review.
2. **Check the figures against each other** before writing a word: messages sent at least the
   people contacted; positives at least the meetings that came from replies; reply classes summing
   to the replies. A mismatch is a finding: find why (a reply outside the period, a rescheduled
   meeting, a reply nobody could tie to a message) and write the definition that makes it true.
3. **Decide what the numbers say:**
   - **against the goal**: meetings booked or held (whichever the goal counts) against the target,
     and the pace needed for the rest of the month;
   - **what worked**: the persona, segment, channel and angle whose positive rate stands out, and
     the person's verdict on the meetings they produced (quality beats count). Read angles from the
     copy that was answered (`list_copy`), ranked by positives, then reply rate;
   - **health**, per strategy: hard bounces (Dylan acts at 3% of sends), unsubscribes and
     complaints (2%), and silence (no replies after 200 sends). Bounces mean the addresses were
     wrong; unsubscribes, that the segment or the copy offends; silence, that the segment or the
     offer is wrong;
   - **ideas under test**: each one's measure over the period against what would confirm it, with
     the base. One that reached the volume it named gets a verdict proposed to the person;
   - **what slipped** and what was changed;
   - **what changes next**: only what the person decides now. A change nobody decided is a question
     for them, not a promise.
4. **Write it** as one page in plain language: the headline against the goal, then what worked,
   what did not, health, spend, what changes, what is needed from them. Use the words the person
   uses, not the tools' ("people who said not now", not the class name).
5. **Hand it to the person**, pointing out every figure that rests on a judgement (a class you
   re-read, a meeting's outcome read from their words) and every question in it.

## Rules

- Every number comes from a tool you called in this session, over the stated period, with the
  stated definition. No number from memory, a note, or an earlier review without reading it again.
- A person counts once per stage: "replied" is people, not messages; out-of-office notes, bounces
  and unrelated mail never count as replies.
- Meetings count from the meetings, never from reply classes. A rescheduled meeting is one meeting.
- Small samples are said to be small. Four positives do not prove an angle; they suggest one.
- Spend is what `get_spend` reports, by operation; do not add calls on top of it.

## Record, so the next review starts from this one

- The review: an `insight` note titled "Review <from>..<to>", with the headline figures, each with
  its definition and the tool it came from.
- Decisions the person confirmed: `decision` notes. Settled ideas: an `insight` with the figures,
  superseding the idea's note.
- What the review teaches beyond the period ("the reviews angle drew every meeting"): an `insight`,
  superseding the older one it replaces.
- `end_session`: the period, what was sent or is waiting, questions asked, what to watch.

## Common mistakes

- Counting a reply from someone contacted before the period without saying so, so the rate exceeds
  what was sent.
- Crediting every reply to the first message's angle instead of the message actually answered.
- Reporting Dylan's provisional classes as final while replies wait for triage.
- Promising next steps nobody decided, or leaving out what went wrong.
- Not recording the review, so the next one cannot say "since last time".
