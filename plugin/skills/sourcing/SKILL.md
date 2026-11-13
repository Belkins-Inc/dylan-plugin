---
name: sourcing
description: Finds the companies of an approved segment and the people inside them. Counts first (free), searches a page at a time from where the last search stopped, records every search with its cost, saves and judges companies, keeps only the people who fit a persona, and reads company sites and directories for the facts and signals copy needs. Use when a segment needs companies, a strategy needs people at qualified companies, or a company cannot be judged from what is stored.
---

# Sourcing

Sourcing spends money, so it runs only on a segment the person approved (`segment-design`,
"Propose, then stop"). Every paid tool states its price in its description; quote it from there
before a batch, and tell the person what the batch will cost.

## Read first

- `get_brief`: rules and exclusions, decisions, what the last session left.
- `list_segments`, `list_sources`: each source's query, where its searches stopped, what they found
  and cost.
- `list_personas`, and `get_strategy` for the strategy you are filling: its segments, its persona
  ladder in priority order, how many people per company.

## Where the next contacts come from: cheapest first

Decide before spending, and write the reason in one sentence (a note or the hand-over):

1. **Qualified companies nobody has looked inside yet** for this strategy: no market is bought,
   only people.
2. **People off the segment**, with no company named: only when the persona's titles are
   self-qualifying (`persona-design`) and the segment is defined by industry and country alone.
   Each person's employer must still pass the segment.
3. **More companies** from the source, from where its last search stopped.
4. Nothing left: the source is exhausted. Do not widen the segment yourself: propose a looser
   definition to the person, with what was exhausted and what it produced.

## Rules for every paid call

- **Count before paging, page small before paging wide.** `count_companies` and `count_people` are
  free. Adjust the query until the count is the market you meant (millions means a filter is
  missing; zero means a value is misspelled). Then a first page of about 25, read it, then wider.
- **Tie the call to its work**: pass the segment, source, strategy or company it is for, so its cost
  lands on that work.
- **Record every search** with `record_search`, straight after the call and before anything else:
  the kind (companies or contacts), the source or strategy, what was asked, how many results, how
  many were new, how many were already held, the call ids the tool answered, and the cursor where
  the next search picks up. A search not recorded is money nobody can see, and the next session
  pays for it again.
- **Never pay twice.** The same search within a month is refused unless you ask for it again on
  purpose; a page you paid for and lost is read back free with `get_provider_call`. A profile read
  before is answered free.
- **One source, one query.** A different query is a different source, or the cursor means nothing.
- Never invent a company, a person, a domain or a title. A company row without a domain is dropped.

## A. Companies for a segment

1. **The source** exists with its query (`save_source`). Put the hard rules into the query where the
   search can filter on them: excluded countries, industries, sizes.
2. **Count** with the same query; set the estimate on the source.
3. **Search** a page at a time with `search_companies`, starting from the source's cursor.
4. **Record** the search (above).
5. **Save** with `save_companies`: the domain (the company's own site), name, country as two
   letters, size, industry, the company's LinkedIn page (the people search inside a company needs
   it), the time zone where the head office makes it plain, and the rest as facts with their
   source (what they do, founded, company type).
6. **Judge** with `judge_companies`, every verdict with its source and search (`segment-design`,
   judging). A search's industry label is loose (a garage labelled software): judge what the
   company does, from its description or its site.
7. Repeat until a page comes back empty; then the source is exhausted.

## B. People for a strategy

1. **The ladder**: the strategy's personas in priority order, with their titles and excluded
   titles. Search for the whole ladder at once.
2. **Which companies**: qualified companies in the strategy's segments
   (`list_segment_companies`, status qualified) that have a LinkedIn page and no people for this
   strategy yet. A company with no page cannot be searched inside: find its page first or leave it.
3. **Search inside each company** with `search_people`, naming the company, about three times the
   strategy's people-per-company cap. Record each as a contacts search with the strategy and the
   company.
4. **Keep only people who fit**: still at the company; the title matches a persona as a whole
   phrase (the first rung that matches is their persona); no excluded title; within the cap,
   highest rung first. People who do not fit are not saved: the search's counts keep the record.
5. **Save** with `save_contacts`: the LinkedIn address in its plain form
   (`https://www.linkedin.com/in/<name>`, no query, no trailing slash), first and last name, title,
   the company's domain, country and time zone where plain, and facts (time in role, the rung the
   title matched). No email yet.
6. **Stand them** for the strategy with `stand_contacts`: candidates, with their persona.
7. **Addresses** next: the `email-finding` guide. A person with a LinkedIn profile and no address
   can still go on a LinkedIn-only plan.
8. A saved person who turns out wrong for the strategy is marked rejected with the reason, and never
   looked at again.

## C. Facts and signals from the web

When a company cannot be judged from what is stored, or copy needs a real signal, read its own
site. Your own web search is free: use it to find the page that holds the answer, then read that
page. `read_page` reads one page as text for a small price. How to choose pages, and how to read a
directory: [references/web-research.md](references/web-research.md).

## Before you stop

- Every search recorded; every source whose state changed described in its instructions.
- An `insight` note for what the next session needs (a filter that did not narrow, a sub-industry
  that produced only agencies, a better title list).
- `end_session`: companies found, qualified and disqualified per source, people added per strategy,
  what was spent, what is left in each source, what to do next.

## Common mistakes

- Searching before the person approved the segment.
- Company filters given where the search reads them as the person's own location, or the other way
  round: read the tool's schema for which field is the company's.
- Paging wide before reading the first small page.
- Country written as a name ("United Kingdom") where two letters (GB) are needed.
- Qualifying from the search's industry label alone.
- Saving former employees, or people whose title only shares a word with the persona.
- A search not recorded, so its cursor never moves and the next session pays for the same page.
