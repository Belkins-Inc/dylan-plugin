---
name: email-finding
description: Finds and verifies work email addresses for the people a strategy will write to, and their phone numbers when the person wants calls. Who needs one, holding out incomplete names, finding addresses in batches (find_emails, then collect_emails), verifying every address before it is used (verify_email, check_address), what each address status means, what to do with catch-all, unknown and bounced addresses, and finding, checking and correcting phone numbers (find_phones, check_phone). Use when contacts need addresses or numbers, or an address's status is in doubt.
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
- `check_dnc` (free) with the batch's addresses, domains and profiles: do not pay for an address at
  a domain or of a person that is on do-not-contact, or for a person already rejected for the
  strategy. Drop them from the batch first.

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
   accepts everything) is `catch_all`; anything else is `unknown`. For a contact already saved,
   `check_address` with reason `new_contact` does the same check and keeps it with the contact
   (`list_address_checks`); on the contact's own address its verdict becomes the contact's status.
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
- A catch-all contact's own address checked again (`check_address`, reason `catch_all`) answers
  risky again while the domain takes everything; check again only when something changed (the
  company moved its mail), not to hope for another answer.
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
4. **Check each** with `check_address` (1¢ each, a yes first; reason `bounce_replacement`, its
   default). Up to three per contact; a fourth is refused. `valid` → step 5. `risky` means the domain takes everything: nothing confirms a guess
   there, so treat it as not confirmed.
5. **Replace** with `replace_address`, after the person's yes: it sends. Only a `valid` address is
   taken. The step that bounced goes again to it a minute later, the lead's other email steps come
   back, and Dylan closes its task.
6. **None confirmed** after three: let the email channel go. `close_task` as cancelled with a note
   that says so; the lead goes on by LinkedIn where its plan has LinkedIn steps.

## D. Phone numbers (when the person wants calls)

Numbers cost far more than addresses: look for them only when the person wants to call these
people, and quote first (`quote_data` with `find_phones`).

1. **Save the contacts first**, with their LinkedIn address: a number is matched to a person by
   their profile, name, address and company as the project holds them.
2. **`find_phones`** with up to 10 contacts at a time. It answers at once who was matched; their
   numbers arrive by themselves, within minutes and sometimes an hour, onto each contact
   (`list_phones`). A person matched with no number has none to be found there. A number on a
   do-not-call registry arrives on do-not-contact too, and no call list takes it.
3. **For those it found none for**, and only if the person wants to pay more: `find_emails` with
   `phones: true` (and `emails: false` when their addresses are settled), then `collect_emails`; a
   number found comes back with its person. Add it with `add_phones`.
4. **Numbers from elsewhere** (the client's own list, a number on the company's site) go in with
   `add_phones`: the number with its country code, its kind (`mobile`, `direct`, `company`,
   `other`), where it came from, and `dnc: true` when the source says it is on a do-not-call
   registry. Each goes after the contact's numbers already there. A number is never a fact of the
   contact.
5. **Check before anyone dials** (`check_phone`, a yes first): whether the number exists, its line
   type and the name it is registered to. A number that does not exist is marked invalid; a
   landline or VoIP number goes last in the dial order; `callerMatches` says whether the name is the
   contact's. Check the numbers a call list will dial first, not every number found.
6. **Correct** with `set_phone`: a dead number (state invalid, with why), the dial order (rank 1 is
   dialled first), its kind.

## Before you stop

- Collect every batch you started, or leave its request id in a `todo` note.
- `end_session`: addresses found, valid, catch-all, unknown, invalid; numbers found and checked;
  what was spent; who went LinkedIn-only for want of an address.

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
- Counting a person as having no number while their numbers are still to arrive after
  `find_phones`.
- Writing a phone number into a contact's facts instead of `add_phones`.
