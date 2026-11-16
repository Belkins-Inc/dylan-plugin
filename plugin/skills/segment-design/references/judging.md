# Judging companies

`judge_companies` takes a segment and up to 1,000 verdicts. Each company must be saved first
(`save_companies`); a verdict for one that is not is answered as missing.

A verdict carries the company (its domain), a status, a reason, evidence, and for a qualified one
the signal; with the source and the search it came from. For example, in words:

- acme.com, **qualified**: "rated 2.8 across 340 reviews; slow replies top the complaints".
  Evidence: rating 2.8, read on the review page, today. Signal: rating 2.8, 340 reviews, top
  complaint "slow replies".
- bigco.com, **disqualified**: "too large: 12,000 employees". Evidence: employees 12,000, read on
  its company page, today.
- agency.io, **disqualified**: "a marketing agency, not a manufacturer". Evidence: business,
  "marketing agency for consumer brands", read on its about page.
- unknown-size.com, **new**: "employee count unknown". Evidence: employees not stated, its about
  page read today.

The answer says, per company, whether it was saved, or refused because it breaks an exclusion of
the project (and which). A refused company keeps its earlier status; it is usually disqualified,
with that rule as the reason.

## Verdicts

| Status | When |
| --- | --- |
| `qualified` | Passes every criterion of the definition and every rule, and has a signal worth writing from |
| `disqualified` | Fails a criterion or a rule, with the reason |
| `new` | Found, but a deciding fact is unknown (the reason names it), or it waits on the person |

- **What they do for a living decides.** Judge the business, not the page it was found on.
- **Plausibly in beats provably in** when only a detail is missing: a manufacturer whose headcount
  the page omits is still a manufacturer. Keep it `new` and find the headcount; do not disqualify.
- **Unknown facts pass the tool.** A size exclusion does not refuse a company with no size; a rating
  rule needs the rating as a number. Fill the facts before qualifying, or judge them yourself.
- **Countries** are two-letter codes (US, GB, DE); store them that way.
- When sources disagree on a fact, prefer the company's own site and say which source you used.

## Evidence: why, in a form someone can check

Every verdict says why the same way: a reason and evidence. Evidence is what was seen, as a list of
facts: what was checked (`employees`, `country`, `business`, `sites`, `rating`), what was found (a
number, a word, a list, or nothing when the page was read and the fact is not there), the page it
was read on (a full https address, never a search results page) and when.

The reason is the sentence a person reads ("too large: 12,000 employees"); the evidence is what they
open to check it. The signal is something else: what copy is written from. A qualified company has
all three.

## Waiting

A `new` company always says what it waits on:

- **a fact**: the reason names it ("number of sites unknown", "no headcount anywhere"). Anyone with
  the right source can settle it: the company's own site first, a paid lookup if the person agrees.
- **the person**: the reason is the question, asked in this session and recorded with
  `ask_question` until answered; judge it on the answer.

`list_segment_companies` with `waiting` set to fact or client lists either; with a status, the
companies in it; with `q`, those whose name or domain match. `list_verdicts` reads every verdict
ever passed on one company, with its reason and evidence, before a verdict is changed.

## Signals

The signal is why this company, now; the first line of the email is written from it. Good signals
are specific, sourced and dated:

- reputation: a rating, a review count, the complaint that repeats, a line from a recent review;
- change: a funding round (amount, date), a new market, a launch, an acquisition;
- hiring: open roles in the function the company serves (count, title, link, date seen);
- technology: what their site runs that the company replaces or works with;
- scale: locations, products, customers, only when it is the reason to buy.

Not signals: "good fit", "in the target market", the industry's name, a size band alone.

## Judging again

Every verdict is kept with who made it and when, so judging again is safe. Judge again when:

- a new rule puts already-qualified companies out;
- the person moves the line (a market comes into scope): record the decision, then judge the
  affected disqualified companies again;
- a reply shows a company was misjudged.
