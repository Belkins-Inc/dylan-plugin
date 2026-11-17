---
name: data-sources
description: Which data tool answers which question, what each costs, and how to spend least: what the project already holds, then the shared cache (free), then the cheapest paid tool that answers. Covers looking people and companies up, matching a person to their profile and work address, enriching a company by its domain, a site's pages, Trustpilot reviews bought by the order, and reading what was bought before. Use before any paid data call, when choosing a tool, or when reading what a call cost.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Data: which tool, what it costs, and how not to pay twice

Every data tool is priced in the organisation's money: the data's cost and 30%, each call rounded up
to the cent, debited from the wallet as it is made. A call the wallet cannot carry is refused before
anything is bought. Each paid tool states its price in its description; `quote_data` (free) gives
the most a call or a batch will cost. Quote before a batch and tell the person what it will cost.

## Look before you buy

In this order, every time:

1. **The project's own data.** `list_contacts`, `list_segment_companies` (with a domain or a name
   as `q`) and `list_sources` say what is already held and what each source's searches found. A
   company with its facts or a person with an address needs no call.
2. **Calls already paid for.** A search is refused when the same one was paid for in the last 30
   days; the refusal names the earlier call, and `get_provider_call` reads its answer again, free.
   Use it rather than paying again.
3. **The shared cache.** What anyone has bought before is kept and free to read:
   - `get_cached_person` by a LinkedIn profile: the profile read and the person matched, with when;
   - `get_cached_company` by a LinkedIn company page or a domain: the company a search found, and
     the company enriched;
   - `list_cached_people` by a company's LinkedIn page: the people bought so far who work there —
     not all its people, only those bought.

   The paid tools look there themselves: `enrich_profile` (a profile read in the last 30 days),
   `match_person` by profile or lookupId (a person matched in the last 30 days), `enrich_company`
   (a company enriched in the last 180 days) and `read_page` (a page read in the last 14 days) are
   answered from the cache free, with `cached: true` and `cachedAt`. Set `again` only when the data
   must be today's: it buys anew.
4. **The cheapest paid tool that answers** (below), small first.

## Which tool for which question

| Question | Tool | Price |
| --- | --- | --- |
| How many companies or people match (size a market, test a filter) | `count_companies`, `count_people` | free |
| Companies in a market, LinkedIn data | `search_companies` | about $0.006 a company |
| People inside a company, or off a segment | `search_people` | about $0.006 a person |
| People by name, title or employer (domain, country, size, industry), first look | `look_up_people` | free |
| One person's whole record and a candidate work address | `match_person` (by `lookupId`, profile, or name and employer) | about 1¢ when matched, nothing when not |
| A person's current title and employer from their profile | `enrich_profile` | 1¢, free from the cache |
| A company's size, locations, branches, keywords and group, by domain | `enrich_company` | about 1¢ when found, free from the cache |
| Companies by name or domain, or hiring for a role now | `look_up_companies` | about 1¢ a page of up to 100 |
| A work address for many people | `find_emails`, then `collect_emails` | $0.065 an address found |
| Does this address take mail | `verify_email` | 1¢ |
| A web page as text | `read_page` | 1¢, free from the cache |
| Which pages a site has | `map_site` | 1¢ a site |
| Companies with bad (or good) Trustpilot reviews | `order_reviews`, `check_reviews_order`, `collect_reviews` | about $0.00325 a review |

Rules that cut across tools:

- **Count before you page, page small before you page wide.** Read the first page and check it is
  the market you meant.
- **Tie every paid call to its work** with `refs` (segment, source, strategy, company, contact):
  its cost lands there, and `get_spend` shows it by kind of work.
- **Record every search** with `record_search`, its call ids and where the next one picks up.
- **A candidate address is not an address.** `match_person` and a search answer candidates;
  only `verify_email` calling one `valid` makes it a contact's address (`email-finding`).
- A source that is busy or failing answers "did not answer this time": try again in a minute. It is
  not a verdict on the data.

## People: look up free, then match the ones who fit

`look_up_people` is free and answers a first name, the start of the last name, the title, the
employer and whether a work address is known, each with a `lookupId`. It is the cheapest way to
find people with given titles at given companies, or across a segment defined by industry, country
and size:

1. `look_up_people` with the persona's titles and the employers' domains (at most 25 a call) or
   the segment's countries, sizes and industries; a page at a time.
2. Choose who fits by title, then `match_person` with each one's `lookupId`: the full name, the
   LinkedIn profile, the employer with its size, and a candidate address. Match a few first:
   - **the employer's size is a hint, not a verdict**: re-check it on the match and judge the
     company by it;
   - **`catchAllDomain: true`** means no check can confirm the mailbox: do not pay to verify it;
     the person goes by LinkedIn (`email-finding`).
3. `verify_email` each candidate, then save the contact with what was checked.

`match_person` also answers "which LinkedIn profile is this named person": give the first and last
name and the employer's domain or name. It is silent when it cannot tell — no answer, nothing
charged — rather than guessing. A person with no profile in the answer is not a profile found.

## Companies: enrich by domain, look up by name or hiring

- `enrich_company` with a domain says what a search row does not: what it does, its keywords, how
  many locations and branches, and the group it belongs to. That tells a multi-site company from a
  single-site one, and a portfolio company by its parent, before it is judged. About $10 for a
  thousand companies; the cache makes the second look free.
- `look_up_companies` finds companies by name or domain (a company's LinkedIn page from its domain
  when `get_cached_company` has none), or by the roles they are hiring for now (`hiringFor`,
  `postedSince`): a hiring signal. One call is a page of up to 100, priced the same whatever it
  holds.

## The web: list, then read

`map_site` lists a site's pages with titles and descriptions for one cent, whatever the limit. Its
order is not relevance: choose the pages worth reading by title, or give `search` to rank them.
Leave subdomains out unless they matter: docs, status and careers sites are rarely about what the
company sells. Then `read_page` the few that hold the answer (`sourcing`, web research).

## Trustpilot reviews: ordered, checked, collected

A row is one **review**, not one company: a company comes once per review of it. Reviews are bought
by the order, and the order is the commitment:

1. **Quote it**: `quote_data` with `collect_reviews` and the limit. Tell the person. The wallet must
   hold the most the order can cost, or it is refused.
2. **Order** with `order_reviews`: countries, a rating band, a floor of reviews in all (50 to 100,
   so a rating means something) and a ceiling for small firms, up to four categories, reviews since
   a year back, and from the second order the Trustpilot ids already held in `excludeCompanies`.
   Always a `limit`: start with 50 to 100. Ordering is free; the reviews are charged once ready.
   Leave the order id in a `todo` note at once.
3. **Check** with `check_reviews_order` until it says `ready` (usually a minute, up to five).
   `failed` with "nothing_matched" is an empty or walked-out market; with "not_taken", try again
   later — nothing was charged.
4. **Collect** with `collect_reviews`, once: the reviews, grouped by company, are charged here. A
   lost answer is read back free with `get_provider_call`.

One order per project is open at a time: a second waits until the first is collected or failed.
How a review becomes a company and a signal on a segment: `sourcing`, section D.

## Before you stop

- Every search recorded, every order collected (or its id in a `todo` note).
- `end_session` says what was spent and on what (`get_spend`).

## Common mistakes

- Paying for what the project, an earlier call or the cache already holds.
- `again` to "retry" a call that failed: a failed call is not kept, so it is not needed.
- Taking a candidate address, or an address a page shows, as the contact's address without
  `verify_email`.
- Matching a whole list before reading a few matches.
- Ordering reviews without a small limit first, or ordering again while an order waits to be
  collected.
