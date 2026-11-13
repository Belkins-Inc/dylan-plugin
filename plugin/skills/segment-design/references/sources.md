# Sources by kind

A source is where a segment's companies are looked for. Its query is what you would ask the search
tool, in that tool's own terms (its schema names the fields); its instructions are the recipe a
later session follows; its estimate is how many companies it holds. How to run each kind of search
is in `sourcing`.

## linkedin

The default: companies described by industry, location, size and company type, searched with
`count_companies` (free) and `search_companies` (paid per result).

- Use the search's own vocabulary for industries and locations, exactly as it spells them: a label
  of your own finds nobody. When a count comes back near zero, the spelling is wrong; when it comes
  back in the millions, a filter is missing.
- Size as bands. Company type where it matters (privately held, public, self-employed).
- The recipe says which facts to keep and how the signal is found. A company's profile alone rarely
  gives a signal: plan where it comes from (its own site, its job ads, its reviews).
- Some markets have no industry of their own (data centres, for one). They are not a `linkedin`
  source: take the list from a directory, an association or a conference, or reach the people
  through titles that exist only in that market (`persona-design`, self-qualifying titles).

## trustpilot (a review site)

When the segment is defined by a company's presence or reputation on a review site: a rating band,
a review count, a category.

- Read the site's own category and listing pages with `read_page`; a category page names many
  companies at once.
- The rating, the review count and the category arrive with the company: put them in the signal
  (the rating as a number) with the complaint that repeats in recent reviews.
- A review site rarely gives size or industry: the recipe says how the company is looked up
  afterwards.
- Split rating bands into separate sources when they will be judged or written to differently.

## directory

Members of an association, exhibitors or speakers at a conference, an award shortlist, a ranking.

- Propose only sites your own web search actually returned: a site you remember but did not find
  is a guess that costs a page read to disprove. The site must name companies of this segment; a
  directory of the right kind about another market is the dearest wrong answer.
- Read list pages, not profiles: one roster naming forty companies beats forty profile pages.
  Prefer the current list over the archived one. Skip pages that name nobody.
- Query: the site and the pages to read; the cursor is the next page of a paginated list.
- Take only companies the page names; the domain is the company's own site, looked up if the page
  does not give it, never the directory's address. The same company on two pages is one row.
- People named on the page (speakers, members) are material for contacts later.

## web

Companies only a web search surfaces: a funding round, a job post, a technology on their site, a
press mention.

- Find the pages with your own web search (free), then read the ones that hold the answer with
  `read_page`. Name in the recipe which sites hold the answer (the press for funding, job boards for
  hiring).
- A search bounded to nothing is money spent on noise.

## import

A list the company gave. Query: the file's name, when it came, how many rows. Every row is still
judged; the company's list is not a verdict.

## Criteria that cost money

A criterion that needs a fact no source returns costs money on every company found. Add one only
where the segment is defined by it, and say in the recipe where the fact comes from: the company's
own site first (cheap), a paid lookup only where the site cannot answer.
