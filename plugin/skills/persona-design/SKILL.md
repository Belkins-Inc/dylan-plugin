---
name: persona-design
description: Defines who to write to inside a target company. The project's persona library (a name, job titles, excluded titles, a description), counted before it is saved, and each strategy's ladder of personas with its per-company caps. Use when a project has no personas, when a strategy needs people the library does not cover, when people searches return the wrong roles, or when setting which personas a strategy reaches and how many per company.
---

# Persona design

A **persona is a named set of job titles** that people are searched and judged by. Personas live in
the project's library (`list_personas`); strategies pick from it, in priority order. Titles never
live in segments: a segment is which companies, a persona is which people.

## Read first

- `get_brief`: who decides, who champions, who blocks, and the titles the company named.
- `list_personas`: the library, with each persona's titles, how many candidates it has and how they
  answered. Reuse before you add.
- Where the project has history, which roles replied and met: `get_dashboard` breaks results down
  by persona.

## Procedure

1. **Decide the people from the brief**, not from habit: who owns the problem the company removes,
   who signs, who would champion it. One persona per distinct group: a CFO and a Controller who
   read the same letter are one persona; a CFO and a Head of Support are two.
2. **Check the library.** If a persona already addresses these people, use it and extend its
   titles. A near-duplicate splits every report and makes "which persona worked" unanswerable.
3. **Write the title list** (below, and [references/title-lists.md](references/title-lists.md)).
4. **Write the description**: two to four plain sentences that let someone judging a job title tell
   whether it belongs: seniority, function, what these people answer for, how titles vary by
   company size or region. It qualifies titles and nothing else: no pains, no offer. Those go in
   the strategy's angle for the persona.
5. **Count it before saving.** `count_people` is free: send the whole title list in one call, with
   the segment's country. Count it twice when the segment has industries: once on the country
   alone, once with the industries added. The first number says whether the people exist; the gap
   between the two says whether the titles are self-qualifying (below). A title that counts almost
   nothing is invented: replace it with the spelling people use. Write the counts and the date
   into the persona's search hints ("US 1,697 on titles alone, 2026-09-24").
6. **Save it** with `save_persona`: the name, the titles, the excluded titles, the seniorities and
   departments, the search hints and the description. Saving the same name again changes that
   persona; a list you pass replaces the whole list, so pass all of it, not the additions.
7. **Build the ladder in the strategy.** A strategy's personas are a ladder in priority order:
   the first is tried first; the next is tried where a company has no one for the rung above. The
   strategy caps people per company in all, and each rung may cap its own. Keep it to about four
   rungs. The angle per persona is where the role's pain and argument go (`strategy-and-plans`).
8. **A buyer that is not the main line is an idea to test**, not a new default: when the brief names
   one buyer and the evidence suggests another, write it down as the `orientation` guide says (the
   claim, the evidence, how it will be judged) and put the persona on a strategy only once the
   person says yes.
9. **Record why**: a `decision` note with the personas, why these, why this order, the caps and the
   counts, tied to the strategy or the segment.

## Title lists

- **Cover seniority on purpose.** Name the levels that own the problem: C-level, VP, Head,
  Director, and Manager or Lead only where the company's size means they own it. In a 30-person
  company the owner may be "Support Lead"; in 5,000 it is a VP, and a Manager is too junior.
- **Spell the variants people actually use**: "Head of X", "X Director", "Director of X", "VP X",
  "VP of X", "X Lead", abbreviations ("CX", "CS", "RevOps"), synonyms of the function ("Customer
  Support", "Customer Service", "Customer Care", "Customer Experience"), and regional forms
  ("Managing Director" for a UK chief executive, "Geschaeftsfuehrer" in Germany).
- **Say what does not belong**, in the excluded titles and the description: Assistant, Intern,
  Coordinator, Specialist, Agent, Associate, recruiters for the function, and look-alikes ("Sales
  Operations" is not "Sales", "Product Marketing" is not "Product").
- **One function per persona.** A list spanning Support and Finance is two personas.
- 8 to 25 titles is typical. Fewer misses people; more usually means two personas in one.
- Founders and chief executives are their own persona, used where companies are small enough that
  the founder owns the problem: usually a lower rung, capped at one per company.

## Self-qualifying titles

A title either names the market or it does not. "Data Center Operations Manager" exists only where
there is a data centre; "Director of Procurement" exists anywhere. The two counts from step 5 tell
them apart:

- **Self-qualifying**: the count on titles alone is small and nearly all of it is the market. These
  can be searched straight off the segment, with no company named: the title does the company
  research. It is also how to reach a market with no industry to filter by.
- **Not self-qualifying**: the count on titles alone is the whole economy. Reach these only company
  first, inside companies already qualified. Searched without a company, they are a list of
  strangers.

Say in the persona's search hints which kind it is, so the next session searches it the right way.

## Judging people found

When a search returns people, judge each title against the persona's description, not by keyword.
A person who does not fit a strategy is marked rejected for it with `stand_contacts` and the reason
("Head of Sales Operations: not Sales leadership"), so no session looks at them again; one who fits
but should wait (an uncertain address) is held.

**Judge the role's territory, not only the company's country.** A person at an in-scope company can
still cover somewhere the target market does not. A title naming a region outside it (Europe, EMEA,
APAC, LATAM, Canada, International) is rejected for the strategy, with the title as the reason.

## Common mistakes

- Pains, offers or tone in the description (they go in the strategy's angle).
- A new persona that duplicates one in the library with slightly different titles.
- Passing only the new titles when extending a persona: the list is replaced and the old ones are
  gone.
- A title list of one seniority, or only the most common spelling.
- A persona saved with no count, or with titles written from job knowledge that count almost nobody.
- Searching titles that are not self-qualifying with no company named.
- No cap on a founder rung, so a small company gets the founder and two managers.
