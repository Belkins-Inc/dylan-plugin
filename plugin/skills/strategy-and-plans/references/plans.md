# Plan templates

`set_plans` takes a strategy and its templates, and replaces every template it has. It is refused
once any lead's plan was copied from them. Steps get their places in the order given; the first
step's delay is always zero.

## The ask ladder (write it into each step's guidance)

| Place | Asks | Guidance pattern |
| --- | --- | --- |
| first | interest, at low friction | open on the signal, one line of why it matters, offer something free for a yes |
| middle | a reason or a proof, softly | another side of the offer: proof, a number, a consequence; a soft question |
| last | the meeting directly, or a polite close | name the goal, or close and leave the door open |
| only step | the meeting directly | no polite close: it is a first approach |

Guidance is an instruction to the writer, not copy: what the step is for, what to open on, what to
argue, what to ask. It never names a person and never says who signs. It may refer only to steps
sure to have gone out. It carries no em or en dash (refused): the writer lifts its wording, and
copy with a dash is refused too. A line to be used word for word is written as it should be sent.

## Email only (the default shape)

```json
{
  "plans": [
    {
      "appliesWhen": "email_only",
      "steps": [
        { "channel": "email", "guidance": "Open on the company's signal. One sentence on what it usually means for this role. Offer the free check from the brief and ask whether they want it.", "hypothesis": "The signal and a free check earn a reply from a third of the interested." },
        { "channel": "email", "delayDays": 3, "guidance": "Same thread. Do not repeat the opening. Give the approved proof in one or two sentences and ask softly whether a similar result would matter.", "hypothesis": "Proof converts the curious." },
        { "channel": "email", "delayDays": 4, "guidance": "Same thread. Another side: what the problem costs at their size. One question." },
        { "channel": "email", "delayDays": 5, "guidance": "Last touch, same thread. Make the first email's offer once more and ask for it directly, or close politely and leave the door open.", "hypothesis": "A direct ask recovers the undecided." }
      ]
    }
  ]
}
```

## Email and LinkedIn

```json
{
  "appliesWhen": "email_and_linkedin",
  "steps": [
    { "channel": "email", "guidance": "As the first step of the email-only plan." },
    { "channel": "linkedin_invite", "delayDays": 1 },
    { "channel": "email", "delayDays": 3, "guidance": "Proof step in the email thread. Never mentions LinkedIn." },
    { "channel": "linkedin_message", "anchor": "invite_accepted", "condition": "invite_accepted", "delayDays": 1, "maxWaitDays": 7, "guidance": "Thanks for connecting. One sentence of value, one soft question. Stands on its own; never relies on the emails having arrived." },
    { "channel": "email", "delayDays": 4, "guidance": "Last touch. A direct ask or a polite close. Refers only to the earlier emails." }
  ]
}
```

A lead whose invitation is never accepted skips the LinkedIn message after its longest wait and goes
on with the next step. A fallback step for that case carries `"condition": "invite_not_accepted"`.
A lead already connected to the sending account gets no invitation: the step counts as accepted at
once, so the messages that wait on acceptance go on their delays from then.

Invitations go without a note. Only when the person asks for notes does the invitation step carry
`"withoutNote": false` and a guidance such as "Connection note, under 200 characters. Asks for
nothing but the connection; does not pitch; does not mention the email." Say that the account's
cap on notes will stop them after a handful.

## LinkedIn only

```json
{
  "appliesWhen": "linkedin_only",
  "steps": [
    { "channel": "linkedin_invite" },
    { "channel": "linkedin_message", "anchor": "invite_accepted", "condition": "invite_accepted", "delayDays": 1, "maxWaitDays": 10, "guidance": "Opens on the signal, then an interest question; two or three sentences." },
    { "channel": "linkedin_message", "delayDays": 4, "condition": "invite_accepted", "guidance": "Proof and a direct, polite ask for a call." }
  ]
}
```

## Changing plans later

- The templates are frozen from the first enrolment: `set_plans` is refused. Each piece still
  changes, running leads included:
  - `update_step` with the step id (from `get_strategy`): `guidance`, `hypothesis`, `delayDays`
    (not the first step), `withoutNote` (an invitation), `withdrawAfterDays` (an invitation:
    withdraw it when still unaccepted after 1 to 30 days, invitations already out included; null
    to stop), `newThread` or `threadOf` (a follow-up email).
  - `add_step` with `after` (the position it follows), the step as above, and `plan` when the
    strategy has several templates; `dryRun` first. Leads that have sent nothing past that point get
    it, needing copy.
  - `remove_step` with the template's last step: its unsent messages are cancelled.
  - `add_plan` with one template of a mix the strategy lacks.
- A new shape of plan altogether is a new strategy, enrolled into (one contact, one live strategy).
- What a step says can still change too: the strategy's brief and angles change with
  `update_strategy`, and a `rule` note on the strategy tells every writer what to do differently.
  Messages already written are rewritten with `write_copy` while they are not yet sent, or taken
  back to the queue with `clear_copy`.

```json
{ "strategy": "…", "after": 3, "step": { "channel": "email", "delayDays": 5, "guidance": "Last touch, same thread. Ask for the call directly, or close politely." }, "dryRun": true }
```
