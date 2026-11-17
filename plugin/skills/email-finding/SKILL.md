---
name: email-finding
description: Finds and verifies work email addresses for the people a strategy will write to. Who needs one, holding out incomplete names, finding addresses in batches (find_emails, then collect_emails), verifying every address before it is used (verify_email), what each address status means, and what to do with catch-all, unknown and bounced addresses. Use when contacts need addresses or an address's status is in doubt.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Finding and verifying addresses

**Email goes only to an address a check called deliverable.** Nothing is sent to an address nobody
checked. Every bounce costs the sending domain its reputation, and a strategy is flagged (and, for
a self-serve organisation, paused) at 3% hard bounces. A person with no deliverable address can
still be written to on LinkedIn.

## Address statuses

| Status | Means | What Dylan does at enrolment |
| --- | --- | --- |
| `valid` | the check said deliverable | email steps go |
| `catch_all` | the domain accepts every address; this mailbox is unconfirmed | the strategy's catch-all policy: `hold`, `linkedin_only` or `send` |
| `unknown` | the check could not settle | no email; LinkedIn only if there is a profile |
| `invalid` | the check said undeliverable | no email; LinkedIn only if there is a profile |
| none | never checked | no email; LinkedIn only if there is a profile |
| `bounced` | Dylan saw a hard bounce | no email; LinkedIn steps go on |

## Read first

- `get_strategy`: its catch-all policy and personas.
- `list_dnc`: do not pay for an address at a domain or of a person that is on do-not-contact, or for
  a person already rejected for the strategy. Drop them from the batch first.

## A. Addresses for new contacts

The match goes first and the check decides: a match gives a candidate cheaply and is silent where
it cannot tell; an address counts only once `verify_email` calls it `valid`. A batch search is the
second try, for whom the match found nothing that checks out.

1. **Who needs one**: the strategy's candidates with no address and no earlier attempt (the facts of
   each contact say whether an address was looked for before).
2. **Hold out incomplete names before paying.** An address is built from a full name. A person whose
   last name is missing or one or two letters ("Karen A", "Ben L", as some profiles show them) is
   not submitted. Note it in their facts ("email search: name incomplete, last name 'A' on the
   profile, 2026-09-24"), then find the full name first (the profile, the company's team page) or
   work that person on LinkedIn only.
3. **Match first, one at a time**, with `match_person`: by the contact's LinkedIn profile (or
   `lookupId`) and name and employer, its `contactId` given. About 1¢ when matched, nothing when
   not; a person matched in the last 30 days is answered free. Its `emailCandidate` is a candidate:
   verify it (step 6). `catchAllDomain: true`: no check can confirm it, so do not pay to verify
   it and do not save it — the person goes by LinkedIn (section B), with a note in their facts.
   Everyone else the match left without a `valid` address goes on to the batch.
4. **Start a batch** with `find_emails`: up to 100 people, each with first and last name, the
   company's domain and name, and the LinkedIn address when known. Starting is free; the tool's
   description says what each address found costs. Keep the request id it answers: leave it in a
   `todo` note ("Collect address batch <id>: <strategy>, <n> people") so another session can
   collect it, and supersede the note once collected.
5. **Collect** with `collect_emails` and that request id a few minutes later; it says pending until
   it is done. Match each answer to its person by name and LinkedIn address.
6. **Verify every address found** with `verify_email`, one call each, tied to the contact. The
   answer maps to a status: deliverable is `valid`; undeliverable is `invalid`; risky (the domain
   accepts everything) is `catch_all`; anything else is `unknown`.
7. **Save** with `save_contacts`, always including the LinkedIn address the contact already has, so
   the row updates that contact instead of making a second one: the address, its status, and the
   facts of the search ("found, verified deliverable 2026-10-07"). Save `invalid` addresses too, with
   their status, so nobody pays for them again. Read the warnings on each saved row: the profile stayed
   with another contact (two people on one profile), or the address is not at the company. A row
   `refused` names a contact that already has the address and is someone else by name or profile:
   the provider gave two people one address, nothing was saved, and this person's address is still
   to find. Only when it is the same person (a name corrected) send it again with `samePerson: true`.
8. **Not found**: note it in the contact's facts ("not found, 2026-10-07"). There is no third try:
   the person goes LinkedIn-only.

**An address at another organisation is not the contact's address.** Deliverable says only that the
mailbox exists; a search often answers with a person's address at a new or second employer. Before
saving an address as `valid`, compare its domain with the company's: the same domain, a subdomain of
it or the domain it is a subdomain of belongs to the company, and so does a domain recorded in the
company's related_domains fact (a parent group, a sister brand, a former domain). Anything else:
look for an address at the company's own domain; found none, the person goes LinkedIn-only, with a
note in their facts that their current employer needs checking.

Never take an address from a profile search or a web page as found without a check. Never save a
guessed pattern (first.last@) as an address without a check that calls it deliverable.

## B. Catch-all and unknown

- `unknown`: Dylan does not email it; the contact goes LinkedIn-only when it has a profile and
  is skipped otherwise. Nothing to do: do not hold it for a check that will not come.
- `catch_all`: the strategy's catch-all policy decides at enrolment. `linkedin_only` and `hold` go
  by LinkedIn when there is a profile; `hold` without one keeps the person held. `send` emails it
  anyway: that is the person's choice for the strategy, made with its risk said, not yours.
- **Two spellings on a catch-all domain is not an address.** When two sources give one person two
  addresses at the same domain and the domain accepts everything, verification accepts both and one
  goes nowhere. Never pick one: save the contact as `unknown` with both spellings in its facts, so
  it goes LinkedIn-only.

## C. After a hard bounce

Dylan marks the contact `bounced`, ends its email steps (LinkedIn steps go on) and opens a task
to replace the address. Read the bounce as a signal about the batch too: if several bounce, check
how their addresses were found before buying more the same way.

1. **Find the contact**: `list_contacts` with the bounced address gives its id.
2. **See what was checked already**: `list_address_checks` with the contact's id (free). A `valid`
   one other than the bounced address goes straight to step 5.
3. **Guess up to three addresses**, on evidence, most likely first: the pattern of valid addresses
   at the same domain (`list_contacts` with the domain), else the common ones (`first.last`,
   `first`, `flast`, `firstlast`, `firstl`, `f.last`). Never the address that
   bounced. A changed domain (the company rebranded, the person moved) is a different question:
   check the company first.
4. **Check each** with `check_address` (1¢ each, a yes first). Up to three per contact; a fourth is
   refused. `valid` → step 5. `risky` means the domain takes everything: nothing confirms a guess
   there, so treat it as not confirmed.
5. **Replace** with `replace_address`, after the person's yes: it sends. Only a `valid` address is
   taken. The step that bounced goes again to it a minute later, the lead's other email steps come
   back, and Dylan closes its task.
6. **None confirmed** after three: let the email channel go. `close_task` as cancelled with a note
   that says so; the lead goes on by LinkedIn where its plan has LinkedIn steps.

## Before you stop

- Collect every batch you started, or leave its request id in a `todo` note.
- `end_session`: addresses found, valid, catch-all, unknown, invalid; what was spent; who went
  LinkedIn-only for want of an address.

## Common mistakes

- Saving an address without the contact's LinkedIn address: a second contact is created.
- Holding an `unknown` or catch-all contact for a deeper check that does not exist.
- Paying to search a person whose last name is an initial.
- Choosing between two spellings on a catch-all domain because both "verified".
- Reading risky as undeliverable: it means catch-all or unknown.
- Verifying the same address twice in a month.
- Saving a match's candidate address as `valid` without `verify_email`, or paying to verify one on
  a domain the match called catch-all.
- Emailing an address nobody checked because it "looks right".
