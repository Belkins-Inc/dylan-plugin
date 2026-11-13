# Capacity: can the senders carry the goal

Turn leads into messages, and messages into sender days, with Dylan's real limits
(`list_mailboxes`, `get_warmup`, `list_linkedin_accounts`; `get_behaviour` has the rules in full).

## The numbers

- **Messages needed** = leads times the steps on each channel. Every step spends capacity, not only
  the first touch; count a conditional step at the share expected to fire.
- **A mailbox** sends at most its daily limit (40 unless set, 60 at most), on the strategy's send
  days only. A warmed mailbox with warm-up on keeps a few notes a day going from the same limit
  (8 of 40), so it carries about 32 outreach emails.
- **The ladder**: a mailbox not yet warmed climbs for about four weeks of sending days: a few days
  with no outreach, a trickle of one to three a day to the end of its second week (about 20 in all),
  then climbing by two every other day to its full share, about 125 over those two weeks. Plan on a
  new mailbox carrying a test batch in its first two weeks and its full share from its fifth.
- **A young domain**, under 60 days old: each mailbox at most 30 a day in all, and the domain at
  most 40 outreach emails a day across all its mailboxes. Early volume needs more domains, not more
  mailboxes on one.
- **LinkedIn**: each account up to 15 invitations and 40 messages a day by default, on send days.
  One invitation per lead, so an account opens at most about 75 leads a week.
- **One recipient company**: a project sends at most a few emails a day to one company's domain
  (3 by default), across all its mailboxes and strategies; it binds when several people at one
  company are enrolled.
- **Dylan's own brake**: a mailbox starts each day only as many new leads as their whole
  sequences fit its daily limit (a four-email plan on 40 a day: about ten new leads), and sends
  follow-ups before first emails. Enrolling more than the mailboxes carry does not break sequences;
  it starts the extra leads days or weeks later. The arithmetic still decides when the goal is met.

## Worked example (Dylan's defaults)

250 leads on a four-step email plan are 1,000 messages. Four new mailboxes on one new domain send
about 80 in their first two weeks and about 500 in the two after; the domain's cap of 40 outreach a
day then carries the other 420 in about eleven more sending days, so the last step goes out around
week six or seven.

The other way round: a goal needing 1,000 leads a month on four steps is 4,000 messages in about 21
sending days. A warmed mailbox on an old domain gives about 670 of them; a domain under 60 days old
at most 840 however many mailboxes it has. The month needs six warmed mailboxes on old domains, or
five young domains of two mailboxes each, and 67 LinkedIn account days if every lead gets an
invitation.

## Write it down

A `decision` note on the strategy: the leads, the messages, the senders, the days, the date the last
step goes out, and the `targetActive` set from it. Where the senders fall short, the options go to
the person before anyone is enrolled.
