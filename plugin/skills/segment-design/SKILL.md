---
name: segment-design
description: Defines and works a segment. Which companies to look for (a definition and criteria, never people), where to find them (sources), how big the market is by free counts and whether it carries the meeting goal, the proposal the person approves before any money is spent, and which companies found qualify, with the signal copy is written from. Use when opening a new market, adding or changing a source, sizing a market, or judging companies found for a segment.
---

# Segment design

A **segment is which companies**: the test every company must pass, wherever it was found. Its
**sources** say where to look. Its **companies** are every company found, each with a verdict and
the **signal** that put it there. Titles and people never belong here (`persona-design`). Segments
belong to the project, so several strategies can draw on one.

The order is fixed: **analyse, propose, get the person's yes, and only then collect.** Everything up
to the proposal is free: reading, research, counts, drafting segments. Nothing that costs money
runs until the person has approved the brief, the titles and the segment with its numbers (step 7).

## Read first

- `get_brief`: what the company sells and to whom, its rules and exclusions, decisions.
- `list_segments` and `list_sources`: what exists, what each source found and cost, and where each
  source's searches stopped. Never pay for a search that already ran; continue from its cursor.
- Decisions in the brief: whether this market was already approved.

## Procedure

1. **Draft two or three hypotheses from the brief**, so the person chooses between real
   alternatives. One segment is one market with one reason to buy now; say why now in one sentence.
   Check it does not overlap a segment the project already runs; if it does, add a source to that
   one instead. Where the previous outreach shows an audience that already answered, it is one of
   the hypotheses. Draft each as a segment so its counts are kept; the ones not chosen are paused
   or archived after the decision.
2. **Write the definition**, in markdown: who is in (what they do for a living, size, geography,
   company type, required facts), who is out and why, why they buy now, and how a company is
   judged. Name only what the segment is; project-wide "never" rules are rules and exclusions, not
   per-segment text. `save_segment` with the name, the definition, the criteria as data (sizes,
   countries) and the estimate once counted. Saving the same name again changes it and keeps what
   you leave out.
3. **Choose the kind of source by where these companies are listed**
   ([references/sources.md](references/sources.md)): `linkedin` (described by industry, location,
   size, type: the default), `directory` (an association's members, a conference's exhibitors, a
   ranked list), `trustpilot` (defined by their presence or reputation on a review site), `web`
   (only a web search surfaces them: a funding round, a job ad, a technology), `import` (a list the
   company gave). `save_source` with the kind, the query in the source's own terms, and the
   recipe: what to open, what to keep, what signal to look for, so the next session runs it
   without re-deriving it.
4. **Check the hard rules** in the brief (exclusions and `rule` notes): which countries, sizes,
   industries or business models are out. Put them into the query where the search can filter on
   them, so you do not pay for rows nobody may qualify.
5. **Size with free counts: companies and people.** `count_companies` is free: count the segment's
   companies with the source's query and set the estimate on the segment and the source (the real
   number, never a round guess). Then `count_people` with the persona's titles against the same
   company filters (`persona-design`). A segment with plenty of companies and nobody in the titles
   is not a market. A directory's own total, printed on its first page, is a free count too. Record
   each count with `record_search` (no results stored, the count in its note).
6. **Carry the numbers to the goal.** From the month's meeting target down through leads, people
   and companies, each rate with where it came from: this project's history, the company's
   previous outreach, or an assumption said to be one. The method and a worked example:
   [references/sizing.md](references/sizing.md). Per hypothesis:

   ```
   Goal: <n> meetings in <month>
   Leads needed a month: <n>        (goal / <meetings per lead> [<source>])
   People needed: <n>               (/ <share with a usable address or LinkedIn> [<source>])
   Qualified companies needed: <n>  (/ <people per company>)
   Available by free counts: <n> companies, <n> people, about <n> leads
   Gap: <available minus needed>; the segment carries the goal for <n> months
   ```

   Too small: widen, add sources, or a second segment. Far too large: tighten, so the signal is
   sharp. A negative gap is the proposal's first line.
7. **Propose, then stop.** Before the first paid call on a new project or a new market, put one
   proposal in front of the person, approved as a whole:
   1. **the brief**, with what the material could not answer;
   2. **the titles with their free counts**, so nobody approves a title that finds nobody;
   3. **the segments and the numbers**: who is in each, why they buy now, the free counts, the
      step 6 output, and what the first batch will cost (rows times each paid tool's price as its
      description states it, then address finding). Name each choice that changes what the company
      gets, with its alternative: the size floor, the geography, the personas, people per company,
      the channels.

   **No paid tool is called until the person says yes**: not a sample page, not one lookup "to
   check". Their answer is a `decision` note on the chosen segment, with what they approved and
   what they changed. A new geography, industry or segment later goes through the same gate; more
   batches from an approved segment do not.
8. **Search, store, judge**: the loop for every batch (`sourcing` has the details):
   1. the search, through the paid tool, with the segment and source passed as its references;
   2. `save_companies`: the company's own domain (never the page it was read on), name, industry,
      size, country (two letters), LinkedIn page, and facts with their sources;
   3. `record_search` with what was asked, the results, how many were new, the call ids and the
      cursor where the next search picks up;
   4. `judge_companies`: a verdict per company (below);
   5. a source that runs dry: say so in its instructions (`save_source` with the same name) and in
      the hand-over, so nobody pays to search it again.
9. **Record what you learned**: an `insight` note scoped to the segment (a source that yields 5%
   qualified, a size band that works) or a `decision` (a segment opened or paused, and why).

## Judging companies

Details and examples: [references/judging.md](references/judging.md). The core:

- Judge on **what the company does for a living**. A fund, an agency, a conference organiser or a
  publisher found in a segment of manufacturers is disqualified: the common case, not a borderline.
- **A missing fact is not a disqualification.** Leave the company `new`, with the reason naming the
  fact it waits on ("number of sites unknown"), until that fact is known.
- **Held on the person**: a company that turns on something only the person can answer stays `new`
  with that question as its reason, and you ask them.
- Rules kept as notes are never checked by the tool: check them yourself on every verdict.
- The reason is short and reusable ("too small: 12 employees", "competitor", "already a customer").
- **The signal is what copy is written from**: the concrete, sourced fact that put the company in
  (a rating and the complaint that repeats, three open roles for the function the company serves, a
  funding round with its date). No signal, nothing to say: usually not qualified.
- Every verdict is kept, so judging again is safe when facts or rules change.

## Common mistakes

- A paid call before the person approved, "propose" read as "write it down and carry on".
- One hypothesis put to the person, so the choice is yes or no instead of which.
- An estimate with nothing behind it when a count was free; counting companies and never people.
- Sizing that stops at companies, so nobody sees the segment cannot carry the goal until the money
  is spent.
- Titles or people in a segment definition.
- Paying for a search already run; not recording a search, so its cost is tied to nothing and the
  next session repeats it.
- Qualifying without a signal, or with a vague one ("good fit").
- Disqualifying for a missing field; qualifying a company whose size is unknown under a size rule.
- A directory's or review site's address stored as the company's domain.
- A new segment that is an existing one under another name.
