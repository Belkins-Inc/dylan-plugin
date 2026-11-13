---
name: company-brief
description: Turns what the person tells you and gives you (their website, deck, price list, customer stories, ideal-customer and exclusion lists, the outreach they already ran) plus your own research on their market into the brief every later step is written from, and into the project's checkable memory (rules, decisions, do-not-contact). Use when a project is new, when its brief is thin, when new material arrives, and when the company changes what it wants.
---

# Company brief

The brief is what segments, personas and copy are written from. It holds two kinds of statement
and never mixes them. What it says **about the company** (who they are, what they sell, to whom)
comes only from the company's own material and the person's words; whatever that leaves open
becomes a question to the person, not a guess. What it says **about the market** (its size, the
incumbents buyers already pay, what those claim) is your own research, marked as research.

The brief is the first thing the person approves before any money is spent (`segment-design`,
"Propose, then stop"). Analysis is free; collecting waits for that approval.

## Read first

- `get_brief`: the brief as it stands, rules, decisions, exclusions, feedback. You are usually
  revising, not starting over.
- The material the person gives you, and the company's own website, read with your own web tools
  (free). `read_page` is a paid read: keep it for pages your own tools cannot open.
- **The outreach the company already ran**, before anything else you write: it is the only record
  of what this market answers.

## What to ask for

| Material | What it feeds |
| --- | --- |
| A call or a conversation with the person: what they sell, to whom, why customers buy, what they will not do | Everything. The brief cannot be written without it. |
| Website, including pages for partners, suppliers and investors | Product, business model, proof. The business model is often stated plainly only on a page that is not for buyers. |
| Deck, one-pager, price list | Offer, pricing words, proof. |
| Customer stories, named customers, figures | Proof copy may use. Only what the company lets you name. |
| Ideal-customer description, won and lost deals | Segments and personas. |
| Exclusions: current customers, competitors, partners, markets they will not serve | Do-not-contact and rules. |
| Previous outreach: campaigns, sends and replies per channel, the replies themselves, who was written to | What answers, what does not, who must not be written to again. |

Missing material is a question to the person, asked once and recorded.

## Procedure

1. **Read the previous outreach first.** Sends and replies per channel, the replies read in full,
   meetings and where they came from, where the lists came from. What it teaches goes into the
   brief's last part: the objections actually heard, the channel that answered, the audiences
   already worked. Whatever could not be had is said plainly ("No export of the 2025 campaign;
   asked 2026-10-02"), never skipped. Everyone who opted out, complained or bounced there goes on
   do-not-contact (step 7).
2. **Extract, do not summarise.** Carry names, prices (currency and period), customers, figures,
   titles, geographies and the exact sentence an offer or a guarantee is made in. Drop slogans and
   the third restatement of a value proposition.
3. **Research the market and the incumbents** with your own web tools: the market's size and
   direction, the two or three companies buyers already pay for this, what each claims and which
   ground they own so we do not fight on it, and how directories and review sites classify the
   company, because that classification is a cold reader's first objection. Find the incumbents
   yourself; the company's own view of its competition names the rivals it worries about, not the
   ones buyers pay. Every item carries its source and date.
4. **Write the brief** in the shape of [references/brief-template.md](references/brief-template.md).
   Every statement carries its source in brackets: `[call 2026-09-12]`, `[deck]`, `[site /pricing]`,
   `[research: <site>, 2026-09-24]`, `[outreach]`. A sentence with no source is one nobody can check:
   do not write it.
5. **Empty is an answer.** Where a part about the company has nothing behind it, write "Not in the
   material." and ask the person. Never fill the company's parts from general knowledge of the
   industry or from market research.
6. **Conflicts are questions.** Where two sources disagree on something that changes what we do (a
   price, a market, a number), write both readings with their sources and ask. A difference of
   wording is not a conflict.
7. **Turn the checkable parts into data**, so the tools enforce them instead of people remembering:
   - current customers, competitors, partners, and everyone who opted out before: `add_dnc` by
     `email` or `domain`, with the reason that fits (`existing_customer`, `competitor`,
     `client_request`, `unsubscribed`, `complaint`, `bounced`). Nothing is ever written to them.
     `list_dnc` shows what is there. Ask for the customer list before the first launch: launching
     without it is how a company's own customers get cold email.
   - hard rules on who is out (a country, an industry, a size, a business model): a `rule` note per
     rule, in the company's words with the source. Exclusions already set on the project show in
     the brief, and `judge_companies` refuses to qualify a company that breaks one; a rule kept as
     a note you check yourself on every verdict.
   - constraints on how we write or send (topics to avoid, claims never to make, tone): a `rule`
     note each, so every writer follows it.
   - choices made with the person (markets in or out, priorities, the offer): a `decision` note.
8. **Keep the brief itself in the project.** Where the project's brief is empty, keep yours as a
   `decision` note titled "Brief: <company>, what we sell and to whom", the whole brief in its body.
   A revision is a new note with `supersedes`, holding all of it, not the changes. Each strategy
   carries the parts its copy needs in its own `brief` (`strategy-and-plans`).
9. **Saving is not approval.** On a new project, or when the brief changes who we sell to or what we
   say, put it in front of the person with what the material could not answer, and wait for their
   yes before anything is collected.
10. **The goal**: how many meetings a month, and whether a meeting counts when booked or only when
    held. It comes from the person. If the project has none, ask, and record the answer as a
    `decision`.

## Quality bar

- About the company, only what its material and the person support. Never invent a customer, a
  figure, a certification, a case or a result.
- About the market, only what a source you can name says, marked as research. Research tells us
  what not to claim and where not to fight; it never becomes a claim about the company.
- Proof is what a source names (a customer, a figure, a case). "Industry-leading" is not proof.
- Never-claim rules are read off what the material conspicuously does not support: guarantees,
  figures, customers or capabilities nobody stated. Each is a `rule` note.
- Target companies and people are described so a segment and a persona can be built from them
  (industries, size, geography, triggers; who decides, who champions, who blocks, the titles), but
  segments and personas are made with their own guides.
- Plain markdown, short paragraphs, no marketing adjectives, no preamble.

## Common mistakes

- A plausible ideal customer written from the industry instead of from what the person said.
- No market part, so copy walks onto an incumbent's ground and the reader's first objection is
  never answered.
- Research written into the company's parts without a research marker.
- The previous outreach left as a heading with nothing behind it and no question asking for it.
- Hiding a conflict by picking one reading.
- Hard exclusions left only in prose, where nobody checks them on a verdict.
- Launching before the customer and competitor lists are on do-not-contact.
