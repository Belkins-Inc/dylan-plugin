---
name: linkedin-posts
description: Schedules posts on LinkedIn from the project's own accounts, on the person's own profile or as a company page they manage, each at its time, with a first comment and images. Which account and page a post goes out as, allowing posts on the owner's profile, checking a batch with a dry run, the person's yes before anything is scheduled, following each post until it is out, and cancelling one. Use when the person wants something posted on LinkedIn, a content calendar scheduled, or asks how their posts went.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# LinkedIn posts

Dylan keeps the project's posts in a queue and publishes each one when its time comes, from one of
the project's LinkedIn accounts: on the owner's own profile, or as a company page they manage. A
first comment, if given, is left under the post by the same author once it is out.

| Step | Tools |
| --- | --- |
| Which account, which page | `list_linkedin_accounts`, `list_linkedin_pages` |
| Posts on the owner's own profile | `set_profile_posts` |
| Check, then schedule | `schedule_linkedin_posts` (`dryRun: true` first) |
| Follow them, cancel one | `list_linkedin_posts`, `cancel_linkedin_post` |

## 1. Who the post goes out as

- `list_linkedin_accounts` lists the project's accounts: only an active one posts. One not yet
  connected is connected with `connect_linkedin` (`sending-setup`).
- **As a company page**: `list_linkedin_pages` with the account answers the pages its owner
  manages; the page's id goes in the post's `pageId`. A page the owner does not manage is refused.
  An account that answers no pages, or is refused reading them, was connected without access to
  its pages: the person connects it again.
- **On the owner's own profile**: off until an organisation admin allows it for the account with
  `set_profile_posts` (`on: true`); `list_linkedin_accounts` shows it as `profilePosts`. Ask the
  person first: from then on a post that names no page goes out as them, in their own feed. Until
  it is on, a post with no `pageId` is refused, and one scheduled before it was taken away fails at
  its time, unsent.

## 2. What a post carries

- `text`: up to 3,000 characters, as it will read. Line breaks are kept; LinkedIn shows the first
  two or three lines before "see more", so the opening carries the post.
- `firstComment` (optional, up to 1,250 characters): left under the post once it is out, by the
  same author. The place for a link, which LinkedIn shows less of when it sits in the post itself.
- `images` (optional, up to 9): PNG or JPEG files of at most 5 MB and 6,012 pixels a side, each
  given as its file's name and its bytes in base64, in the order LinkedIn shows them. What a file
  is goes by its bytes, not its name. A bad one refuses the whole batch, saying which and why. One
  call carries at most 64 MB; split a batch whose images come to more.
- `publishAt`: the time with its offset (`2030-03-04T09:00:00-05:00`). Take the person's time zone
  from the project (`get_brief`), not your own. A time already past is refused.

## 3. Check, then schedule

1. Build the batch: up to 50 posts a call, each with its `linkedinAccountId`, its `publishAt`,
   its `text` and, as needed, `pageId`, `firstComment` and `images`.
2. `schedule_linkedin_posts` with `dryRun: true`: every post is checked as it would be scheduled
   (the account, the page, profile posts allowed, the time, the images) and the answer says who
   each goes out as and when. Nothing is written.
3. Show the person each post's author, time and opening line, and wait for their yes: a post goes
   out under their name or their company's.
4. The same call without `dryRun`. It schedules all of them or none: a refusal names the post
   (`Post 3: …`) and what to do. The same text twice on one profile or page is refused, so sending
   the batch again after a fix schedules nothing twice.

## 4. Following them

`list_linkedin_posts` lists the project's posts by time, `status` to narrow it:

- `scheduled`: waiting for its time. `cancel_linkedin_post` cancels it for good, with the
  person's yes; change a post by cancelling it and scheduling it again.
- `publishing`: going out now.
- `published`: out, with its link (`shareUrl`). A first comment that was not left says why
  (`commentError`). Taking a published post down is done on LinkedIn by the person.
- `failed`: not published, with why (`error`). A post LinkedIn refused, or whose fate is unknown,
  is never tried again by itself, since it may have gone out: look on LinkedIn before scheduling
  it again. When LinkedIn rests an account for its rate limit, its posts wait until the rest
  lifts, and one that would go out more than two hours late fails, saying so.
- `cancelled`: will not go out.

## Common mistakes

- Scheduling before the person saw each post's author, time and text.
- A post with no page on an account whose profile posts are off: name a page, or have an admin
  allow them first.
- A time in your own zone instead of the person's, or without its offset.
- Sending the batch again whole after one post failed at its time: schedule only that one, once
  LinkedIn shows it did not go out.
