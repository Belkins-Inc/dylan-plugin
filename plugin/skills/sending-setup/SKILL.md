---
name: sending-setup
description: Gets a project ready to send and keeps its senders healthy. Senders, connecting the person's own Google or Microsoft mailboxes and LinkedIn accounts, buying lookalike domains and ordering mailboxes on them, warm-up, daily limits, and what Dylan does when a domain's mail starts landing in spam. Use on a new project (get_setup shows what is missing), when more sending capacity is needed, and when a mailbox or account shows a problem.
---

# Sending set-up

`get_setup` lists what a project still needs before it can send, each step done or not. Work down
it. The pieces:

| Piece | What it is | Tools |
| --- | --- | --- |
| Sender | A person the project writes as: name, title, signature. Mailboxes and LinkedIn accounts belong to a sender. | `list_senders`, `add_sender` |
| Mailbox | A Google or Microsoft mailbox Dylan sends from and reads replies in. | `list_mailboxes`, `connect_mailbox`, `update_mailbox` |
| Domain | A lookalike domain bought for sending, redirecting to the company's site. | `list_domains`, `quote_domains`, `buy_domains`, `order_mailboxes` |
| Warm-up | Notes exchanged with a network of real mailboxes, which keeps the mailbox's reputation up and measures where its mail lands. | `get_warmup`, `set_warmup` |
| LinkedIn account | The sender's own account, for invitations and messages. | `list_linkedin_accounts`, `connect_linkedin` |

## 1. Senders

One sender per real person the copy signs as. `add_sender` with the name and title, and a
signature: an email from a sender with none goes out unsigned. The `sender-signatures` guide
writes it. Mailboxes and LinkedIn accounts are then attached to that sender when they connect.

## 2. Never send cold from the company's own domain

A bounce or a complaint on the company's main domain follows its everyday mail for years. Cold
email goes from lookalike domains that redirect to the company's site, a few mailboxes on each.

### Choosing names

- The brand plus a short word: `getacme.com`, `tryacme.com`, `acmehq.com`, `meetacme.com`,
  `acme-team.com`. Readable aloud, no digits, no misspelling of the brand.
- `.com` first; `.co`, `.io` or `.net` when it is gone. Never the cheap zones (`.xyz`, `.top`,
  `.online`): filters already distrust them.
- At most five mailboxes on one domain. More volume is more domains, not more mailboxes on one.
- Buy about four weeks before the volume is needed: new mailboxes climb slowly (section 4).

### Buying

1. `quote_domains` (free, up to ten names): whether each is free to buy, what it costs a year, and
   whether it is on a blocklist or carries a past owner's abuse record (those are not offered).
   Drop what is taken and quote replacements.
2. Show the person the names, the yearly price per name from the quote and the total. **They
   approve the purchase**; then `buy_domains` with `maxCents` set to the total the quote gave, never
   more, and `redirectTo` set to the company's real site (a domain that opens nothing reads as
   abandoned). The wallet pays; a wallet that cannot carry it refuses the whole batch and buys
   nothing.
3. Dylan registers the domains, writes their DNS (SPF, DKIM, DMARC) and the redirect on its
   next passes. `list_domains` follows each one to ready.
4. Bought Google mailboxes live in a Google Workspace organisation of the company's own, made with
   the first domain. `get_google_organisation` says how far it is and what it waits for:
   - the company's legal name, postal address and contact, given once with
     `set_google_organisation` (before or after the first purchase);
   - then one link for the organisation's admin to open, signed in as that admin, to accept
     Google's terms. Only the person can do this: give them the link and say what it is.
5. `order_mailboxes` on a domain: up to five, each a first name, a last name and a username
   (`jane`, `jane.doe`), tied to the sender who signs as them. Each mailbox is a seat paid monthly,
   so order what the plan needs (`strategy-and-plans`, capacity), not a stock. The person approves
   the order. Dylan makes and connects them; `list_mailboxes` shows them once connected.

## 3. Connecting mailboxes and accounts the person already has

- `connect_mailbox` answers a sign-in link (good for ten minutes) for a Google or Microsoft
  mailbox. Give it to the person to open in a browser; it signs in as them, never through you.
  Name the sender it belongs to, and the daily limit (section 4).
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
- **Warm-up** is switched on per mailbox with `set_warmup` (paid by the month, the price in the
  tool's description; ask the person). It writes ordinary notes to a network of real mailboxes,
  which open them, answer them and pull them out of spam; where they land tells how the mailbox's
  mail is placed. `get_warmup` shows each mailbox's days, where its notes land (inbox, spam, tabs)
  and whether its outreach is held. A warmed mailbox keeps a few notes a day going as a sensor.
- **Protection**: when a domain's warm-up notes slip into spam, its mailboxes stop climbing; when
  they fall well below the inbox, Dylan holds that domain's outreach, opens an urgent task,
  and lets it go again by itself once the notes are back in the inbox for three days. A held
  mailbox's leads wait. Without warm-up nothing measures placement, so nothing can hold a domain
  before its reputation is spent.
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
  volume to other domains while it recovers.

## Common mistakes

- Cold email from the company's main domain.
- Buying domains the week the volume is needed: new mailboxes send a trickle for two weeks.
- Five mailboxes on one new domain to get volume quickly: the domain cap binds at 40 a day.
- A daily limit raised to send more: the limit protects the mailbox; add mailboxes instead.
- Marking a new mailbox warmed to skip the ladder.
- A sender with no signature when copy is about to be written.
- Asking the person for a password in chat instead of giving them the sign-in link.
