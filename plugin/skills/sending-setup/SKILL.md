---
name: sending-setup
description: Gets a project ready to send and keeps its senders healthy. Senders, connecting the person's own Google or Microsoft mailboxes and LinkedIn accounts, buying lookalike domains and ordering mailboxes on them, their DKIM and DMARC, letting a domain go, warm-up, daily limits, the inbox tests that say where the mail lands, and what Dylan does when a domain's mail starts landing in spam. Use on a new project (get_setup shows what is missing), when more sending capacity is needed, and when a mailbox or account shows a problem.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Sending set-up

`get_setup` lists what a project still needs before it can send, each step done or not. Work down
it. The pieces:

| Piece | What it is | Tools |
| --- | --- | --- |
| Sender | A person the project writes as: name, title, signature, photo. Mailboxes and LinkedIn accounts belong to a sender. One person on several projects is a shared sender. | `list_senders`, `add_sender`, `update_sender`, `set_sender_photo`, `list_shared_senders`, `add_shared_sender`, `share_sender`, `unshare_sender` |
| Mailbox | A Google, Microsoft or any SMTP and IMAP mailbox Dylan sends from and reads replies in. | `list_mailboxes`, `connect_mailbox`, `connect_smtp_mailbox`, `update_mailbox` |
| Domain | A lookalike domain bought for sending, redirecting to the company's site. | `list_domains`, `quote_domains`, `buy_domains`, `order_mailboxes`, `list_mailbox_orders`, `cancel_mailbox_order`, `retry_mailbox_order`, `retry_domain`, `publish_dkim`, `set_dmarc`, `release_domain`, `transfer_domain`, `get_domain_dns`, `add_domain_record`, `delete_domain_record`, `set_domain_redirect` |
| Warm-up | Notes exchanged with a network of real mailboxes, which keeps the mailbox's reputation up and measures where its mail lands. | `get_warmup` |
| Inbox tests | Notes Dylan sends each week from every mailbox to test mailboxes behind each kind of receiver, and where each landed. | `get_inbox_tests` |
| LinkedIn account | The sender's own account, for invitations and messages. | `list_linkedin_accounts`, `connect_linkedin` |

## 1. Senders

One sender per real person the copy signs as. `add_sender` with the name and title, and a
signature: an email from a sender with none goes out unsigned. The `sender-signatures` guide
writes it. Mailboxes and LinkedIn accounts are then attached to that sender when they connect.
`update_sender` changes a sender's name, title or signature later, `set_sender_photo` the face a
lead's mail client shows beside their name. A person who writes for several of the organisation's
projects is one shared sender (`add_shared_sender`, then `share_sender` on each project), not a
sender added again on each: the `sender-signatures` guide has both.

## 2. Never send cold from the company's own domain

A bounce or a complaint on the company's main domain follows its everyday mail for years. Cold
email goes from lookalike domains that redirect to the company's site, a few mailboxes on each.

### Choosing names

- The brand plus a short word: `getacme.com`, `tryacme.com`, `acmehq.com`, `meetacme.com`,
  `acme-team.com`. Readable aloud, no digits, no misspelling of the brand.
- `.com` first; `.co`, `.io` or `.net` when it is gone. Never the cheap zones (`.xyz`, `.top`,
  `.online`): filters already distrust them.
- Five mailboxes on one domain: the practice to plan by and to offer. More volume is more domains,
  not more mailboxes on one. A person who wants more on a domain gets them: say once why five
  (one domain's reputation, and the daily domain cap, are shared by all its mailboxes), then order
  what they asked.
- Buy about four weeks before the volume is needed: new mailboxes climb slowly (section 4).

### Buying

1. `quote_domains` (free, up to ten names): whether each is free to buy, what it costs a year, and
   whether it is on a blocklist or carries a past owner's abuse record (those are not offered).
   Drop what is taken and quote replacements.
2. Show the person the names, the yearly price per name from the quote and the total. **They
   approve the purchase**; then `buy_domains` with `maxCents` set to the highest yearly price the
   quote gave, never more (a premium name, or one above $15, is not bought), and `redirectTo` set to the company's real site (a domain that opens nothing reads as
   abandoned). The wallet pays; a wallet that cannot carry it refuses the whole batch and buys
   nothing.
3. Dylan registers the domains, writes their DNS (SPF, DKIM, DMARC) and the redirect on its
   next passes. `list_domains` follows each one to ready.
4. Bought Google mailboxes live in a Google Workspace organisation of the company's own, made with
   the first domain. `get_google_organisation` says how far it is and what it waits for:
   - the company details, given once with `set_company_details` (before or after the first
     purchase): legal name, website, postal address, phone, and the contact the providers write
     to — an address the company reads today, never one on a domain being bought. They serve
     Microsoft too; `get_company_details` says what is still missing;
   - then nothing for the person to do: Dylan makes the organisation and sets it up by itself.
     Once it is ready the company has a super admin of its own there (`owner`): an organisation
     admin takes its password once with `get_google_admin_login` — give it to the person at once,
     since it is not kept, and tell them to sign in at admin.google.com, where Google asks for
     their own password. Dylan keeps its own admin and delegation there to do its work.

   Microsoft mailboxes, where `get_microsoft_tenant` says they are sold (`sold`), live in a
   Microsoft 365 tenant of the company's own, made for it by Dylan as its Microsoft reseller with the first
   domain bought with `platform: microsoft`. Otherwise buy for Google, or connect the company's own
   Microsoft mailboxes (section 3). Before the first Microsoft purchase:
   - the Microsoft Customer Agreement: show the person its link and version from
     `get_microsoft_tenant`; once they have read it and agree, `accept_microsoft_agreement` with
     the name and work address of the person who accepted — Microsoft is told they signed it;
   - the same company details as for Google, with the website and phone too.

   Then `get_microsoft_tenant` follows it: Dylan orders the tenant and sets it up by itself, with
   nothing for the person to do. Once it is ready, the company has a Global Administrator of its
   own there (`admin`): an organisation admin takes its password once with
   `get_microsoft_admin_login` — give it to the person at once, since it is not kept, and tell them
   to sign in at admin.microsoft.com, where Microsoft asks for their own password and an
   authenticator. Dylan keeps an admin and an app of its own in the tenant to do its work.
   `leave_microsoft_tenant` (an organisation admin) takes Dylan out again; the tenant and its
   mailboxes stay the company's.
5. `order_mailboxes` on a domain: five unless the person wants more, each a first name, a last name and a username
   (`jane`, `jane.doe`), tied to the sender who signs as them. Each mailbox is a seat paid monthly,
   so order what the plan needs (`strategy-and-plans`, capacity), not a stock. The person approves
   the order. Dylan makes and connects them: `list_mailbox_orders` follows each order (and says
   why one failed), `list_mailboxes` shows them once connected.
   - An order nothing was made for yet (ordered or held) is called off for good with
     `cancel_mailbox_order`, with the person's yes: no seat is taken. A mailbox already made is
     archived instead (`update_mailbox`).
   - A failed order goes back in the queue with `retry_mailbox_order` once its cause is fixed (a
     seat paid monthly once made, so the person agrees as they did to the order).
   - A domain that failed on its way into the organisation's Google or Microsoft organisation goes
     back on its way with `retry_domain` once what `list_domains` says is fixed; nothing is bought
     again. Then retry its failed orders.
6. A bought domain's DNS is the company's to add to: `get_domain_dns` lists its records (each with
   its id) and redirects, `add_domain_record` adds one (a site verification, a subdomain pointed
   somewhere, a subdomain's MX for a service that sends from it, such as a bounce domain, priority
   10 unless given) and `delete_domain_record` deletes one. The mail setup Dylan keeps (the
   domain's own MX, SPF, DKIM, DMARC) is marked `sending` and refused either way. `set_domain_redirect` moves the redirect to
   another site, or removes it with `url: null`.
7. Its mail records. Dylan writes MX, SPF and DMARC itself, and DKIM for Microsoft domains.
   - **DKIM for a Google domain** is minted in the organisation's Google Admin console (Apps →
     Google Workspace → Gmail → Authenticate email, Generate new record) — the one step Google gives
     no way around. When Dylan asks for it, the organisation's admin generates the record there and
     hands you the TXT value; `publish_dkim` puts it in the domain's DNS, and the admin presses
     Start authentication once Google sees it. `get_domain_dns` shows what is published.
   - **DMARC** says what receivers do with mail that fails SPF and DKIM. A bought domain starts at
     `none`; once only the company's own outreach goes out from it, raise it to `quarantine` with
     `set_dmarc`. `set_dmarc` with `dryRun: true` is the check: it answers what it would change
     (a missing or wrong MX, SPF or DMARC record included) and changes nothing; without it, it
     puts them right.
8. A domain no longer wanted: `release_domain`, with the person's yes. It is not renewed: it keeps
   working until it expires and is then gone for good, with the reputation its mail built; the year
   paid is not refunded. Archive the mailboxes on it first, and move their volume elsewhere. A
   domain still waiting to be bought is called off instead, and its price goes back to the wallet.
9. A bought domain is the company's: `transfer_domain` (an organisation admin, with the person's
   yes) asks for its transfer code to move it to a registrar of their own. Dylan's people mail the
   code to the person who asked, and it keeps renewing until it has moved; a domain moves only 60
   days after its registration, and the answer says from when.

## 3. Connecting mailboxes and accounts the person already has

- `connect_mailbox` answers a sign-in link (good for ten minutes) for a Google or Microsoft
  mailbox. Give it to the person to open in a browser; it signs in as them, never through you.
  Name the sender it belongs to, and the daily limit (section 4).
- A mailbox on any other host (one that speaks SMTP and IMAP) is connected by its password: the
  person does it on Senders in Dylan's app, where the password stays out of the chat.
  `connect_smtp_mailbox` takes it from you only when the person chooses to hand it over; it needs
  the address, the password (an app password where the host asks for one) and both servers.
- A mailbox the company has used for everyday mail for months may be connected as already warmed;
  a new one never.
- `connect_linkedin` answers a sign-in link for the person's own LinkedIn account, with the country
  it is used from. Every password goes into that page, never into the chat.
- `list_mailboxes` and `list_linkedin_accounts` show each one's status, sender, limits and today's
  counts. A disconnected mailbox sends and reads nothing until it is connected again with a new
  link; its leads wait, they are not moved.

## 4. Limits, warm-up and the ladder

These are Dylan's own numbers; `get_behaviour` has them in full under its topic on limits
and pacing.

- **Daily limit**: 40 a day unless set, at most 60. One number for everything a mailbox sends,
  warm-up notes included. More volume means more mailboxes and domains, never a higher limit.
- **The ladder**: a mailbox not yet warmed is paced over about 28 sending days: nothing but
  warm-up for the first days, then a trickle of one to three outreach emails a day to the end of
  its second week, then climbing to its full share. Plan on a new mailbox carrying a test batch in
  its first two weeks and its full share from about its fifth.
- **Young domains**: under 60 days old, a mailbox sends at most 30 a day in all and the domain at
  most 40 outreach emails a day across its mailboxes.
- **Warm-up** is always on for every active mailbox, from the organisation's approval: there is no
  switch. `get_warmup`'s description says whether it is charged and at what price. Pausing a
  mailbox (`update_mailbox`) stops it. It writes ordinary notes to a network of real mailboxes,
  which open them, answer them and pull them out of spam; where they land tells how the mailbox's
  mail is placed. `get_warmup` shows each mailbox's days, where its notes land (inbox, spam, tabs)
  and whether its outreach is held. A warmed mailbox keeps a few notes a day going as a sensor.
- **Protection**: when a domain's warm-up notes slip into spam, its mailboxes stop climbing; when
  they fall well below the inbox, Dylan holds that domain's outreach, opens an urgent task,
  and lets it go again by itself once the notes are back in the inbox for three days. A held
  mailbox's leads wait. Without warm-up nothing measures placement, so nothing can hold a domain
  before its reputation is spent.
- **Inbox tests**: whether or not warm-up is on, Dylan tests each sending mailbox about once a
  week (a warmed domain's mailboxes in turn): a few notes, the strategy's own emails where it has
  some, to test mailboxes behind Google Workspace, Microsoft 365, Microsoft 365 with Defender and
  Proofpoint, the filters most leads sit behind. `get_inbox_tests` answers, per mailbox and per
  domain, how many landed in the inbox, promotions or spam, bounced or went missing on each side,
  and the latest tests note by note; a note in spam is checked again with two more by itself.
  Tests are Dylan's to run, not asked for. Read them before raising volume and when replies dry
  up: spam on one side with the inbox on the others is that side's filter; spam everywhere is the
  domain (DKIM, DMARC, its reputation) or the copy.
- **One company a day**: the project sends at most 3 emails a day to one company's domain unless
  set, across all its mailboxes and strategies; a lead beyond it waits for the next day.
  `get_domain_cap` reads it, `set_domain_cap` sets it (1 to 50). Raise it only when the person
  wants many people at one company written to the same day.
- **LinkedIn**: each account sends up to 15 invitations and 40 messages a day by default, on send
  days. One invitation per lead, so an account opens at most about 75 new leads a week.

Pause a mailbox that should not send with `update_mailbox` (status `paused`); archive one that is
done. `update_mailbox` also changes its limits and its sender.

## 5. Health of a sending domain

- Bounces cost a domain its reputation: send only to addresses a check called valid
  (`email-finding`).
- Dylan opens a task, and for a self-serve organisation pauses the strategy, at 3% hard
  bounces or 2% unsubscribes and complaints; it signals a strategy with no replies after 200 sends.
  The `results-review` guide reads these.
- A domain whose mail is refused or listed is not fixed by sending more from it. Rest it, and move
  volume to other domains while it recovers. `get_inbox_tests` shows when its notes are back in
  the inbox.

## Common mistakes

- Cold email from the company's main domain.
- Buying domains the week the volume is needed: new mailboxes send a trickle for two weeks.
- Five mailboxes on one new domain to get volume quickly: the domain cap binds at 40 a day.
- A daily limit raised to send more: the limit protects the mailbox; add mailboxes instead.
- Marking a new mailbox warmed to skip the ladder.
- A sender with no signature when copy is about to be written.
- Asking the person for a password in chat instead of giving them the sign-in link.
- Releasing a domain to stop its cost while mailboxes still send from it: archive them first, and
  know the name and its reputation are gone once it expires.
- DMARC raised to `reject` on a domain that also sends the company's other mail: check with
  `dryRun: true` and raise in steps.
