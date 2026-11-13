# Examples

Invented for the example: the company, the proof and the facts below. In real copy every fact comes
from the brief, the persona's angle, the signal or the lead's facts.

Context: the brief offers outsourced first-line customer support, and a free review of a store's
public reviews with the three complaints costing it the most; approved proof "Acme Outdoor cut
first-reply time from 19 hours to 45 minutes in six weeks". Persona angle (Head of Support): reviews
complain about slow replies. Signal: rated 2.9 across 340 public reviews, the main complaint "no
reply for days". Lead: Ada Byron, Head of Customer Support, Northwind Goods. Template: email only,
four steps.

## One lead's plan as one story

Step 1 (interest), angle `signal:review-slow-replies`. Footprint, what it means, what they get for a
yes, the question.

```
Subject: replies at northwind

Hi Ada,

Most of Northwind's 340 recent reviews say the same thing: no answer for days.

At that volume the complaint is usually the first thing a new customer reads, and it tends to mean tickets arrive faster than the team can open them.

We can go through your last 90 days of reviews for free and show you the three complaints costing you the most.

Want the review?
```

Step 2 (value), angle `proof:acme-outdoor`, same thread.

```
Subject: replies at northwind

Hi Ada,

Acme Outdoor had the same pattern last spring. Their first-reply time went from 19 hours to 45 minutes in six weeks, without adding anyone to their own team.

Would a result like that matter for Northwind?
```

Step 3 (value), angle `pain:review-rating`, same thread.

```
Subject: replies at northwind

Hi Ada,

One thing we see at stores your size: once the rating drops under 3, ads cost more to convert because shoppers check reviews first.

Reply time is usually the fastest lever on the rating. Worth a look?
```

Step 4 (the ask), angle `close:last-touch`, same thread: one offer, asked for directly.

```
Subject: replies at northwind

Hi Ada,

Last note from me. The review of your last 90 days still stands, and it takes us a day.

Want me to set it up?

If reply times are not a priority right now, I will stop here.
```

No sign-off (the signature is appended), no dash, one short question each with one obvious answer,
each step on another side of the brief. "Would Tuesday or Wednesday work?" would be a choice, and
"Is getting first replies under an hour something you're working on this quarter?" is too long to
answer at a glance.

## LinkedIn

Invitation note, only where the step asks for one (angle `signal:review-slow-replies`, 136
characters):

```
Ada, I work with support teams at consumer brands on reply times and saw Northwind's reviews mention slow answers. Glad to connect.
```

Message after acceptance (angle `proof:acme-outdoor`):

```
Thanks for connecting, Ada. Acme Outdoor took first replies from 19 hours to 45 minutes in six weeks with us handling first-line tickets. Is reply time something you're looking at this year?
```

## A referral's first message

```
Subject: anna suggested i write

Hi Priya,

Anna Smith said you own support operations at Northwind and that reply times are yours to decide on.

Acme Outdoor went from 19 hours to 45 minutes on first replies in six weeks.

Worth a short call to see if it applies?
```

Angle `referral:anna-smith`. Say only what the referrer actually wrote.

## Coming back later

```
Subject: back in january, as agreed

Hi Ada,

In October you asked me to come back after the holiday peak, so here I am.

If reply times are on this year's plan, I can show you what Acme Outdoor changed in their first six weeks. Would a call next week be useful?
```

Angle `reengage:after-peak`. A new thread with its own subject.

## Bad, and why

```
Subject: Transform Your Customer Support Today!

Hi there,

I hope this email finds you well! We are a world-class support partner — we help brands like
[Company] leverage seamless support. Can we book 30 minutes? Also, would you share this with your COO?

Best regards,
Kate
```

Title Case and "!" in the subject; an empty greeting; a burned opener; opens with "We"; hype; a
dash; a placeholder (refused); two asks; a meeting ask in the first email; a sign-off and a name on
top of the signature; nothing specific to the company. `check_copy` reports all of it but the
meeting ask, the name and the missing specifics: those are yours.

## A batch for `check_copy` and `write_copy`

```json
[
  { "messageId": "<id of step 1>", "subject": "replies at northwind", "body": "Hi Ada,\n\nMost of Northwind's 340 recent reviews ...", "angle": "signal:review-slow-replies" },
  { "messageId": "<id of a LinkedIn message>", "subject": null, "body": "Thanks for connecting, Ada. ...", "angle": "proof:acme-outdoor" }
]
```
