# Sizing: from the goal to companies

A segment is sized against the goal, not on its own. The arithmetic runs backwards from the meetings
a month needs to the companies to find, then forwards from what the free counts say is there. Both
lines go into the proposal, and the gap between them is the first thing the person reads.

## The chain

| Step | Divide by | Where the rate comes from |
| --- | --- | --- |
| Meetings a month | | the goal in `get_brief`, and whether it counts booked or held meetings |
| leads needed | meetings per lead contacted | this project's history; else the company's previous outreach; else an assumption |
| people needed | share of people found with a usable address or LinkedIn profile | this project's address finding; else an assumption |
| qualified companies needed | people per company | the free people count divided by the company count, capped by people per company in the strategy |
| companies to find | share of found companies that qualify | this segment's qualified share (`list_segments`); else a small sample judged from free reads, or an assumption |

- **Name the source of every rate** in brackets: `[history: 4 strategies]`, `[outreach: 2025
  campaign, 1 meeting from about 800 leads]`, `[assumption]`. A rate with no source is an
  assumption, and the proposal says so.
- **History first.** Meetings per lead and the qualified share come from the project's own figures
  (`get_dashboard`, `list_segments`). Use the kind of meeting the goal counts: held meetings are
  fewer than booked ones.
- **Then the company's previous outreach.** Even one meeting from a known number of leads is a rate;
  say how thin it is.
- **An assumption is written once**, as a `decision` note on the segment, so the next session
  compares the result with it instead of assuming again.
- **Time.** Leads contacted in a month produce meetings over the plan's length (two to three weeks
  of steps) plus the days it takes to book. A month's goal needs its leads first touched in the
  weeks before it, and the senders have to carry them (`strategy-and-plans`, capacity).

## Available by free counts

- **Companies**: `count_companies` with the source's query, or the total a directory prints on its
  first page. Never a round guess where a count was free.
- **People**: `count_people` with the persona's titles and the same company filters. Titles that
  exist only in the market can be counted straight off the segment; titles that exist in any
  company can only be counted company first (`persona-design`).
- **Leads available** = qualified companies available, times people per company, times the address
  share. Divided by the leads needed a month, it is how many months the segment carries the goal.

## Worked example (invented figures)

```
Goal: 10 held meetings in 2026-10
Leads needed a month: 1,000      (10 / 1 meeting per 100 leads [assumption: no history; the
                                  company's own outreach gave 1 meeting, too few for a rate])
People needed: 1,140             (/ 0.88 with an address [measured: 113 of 128 in the first batch])
Qualified companies needed: 570  (/ 2 people per company [the strategy's cap; the count shows ~3])
Available by free counts: 2,244 companies [directory total], 60% qualify [assumption]
  -> 1,350 qualified x 2 people x 0.88 -> 2,370 leads
Gap: +1,370 in the first month; at 1,000 a month the segment carries the goal for about 2 months
```

When the gap is negative, the proposal opens with it:

> This segment cannot carry the goal: about 400 leads a month against 1,000 needed. Below, a
> second segment, or a lower October target.

## What the first batch costs

Rows times the price of each paid step the batch takes, as each tool's description states it:
company results, people per company, profile reads, addresses found, verification. Where a price is
not stated, say so and give the units instead of inventing a figure.
