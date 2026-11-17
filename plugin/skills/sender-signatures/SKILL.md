---
name: sender-signatures
description: Writes a sender's email signature, the plain-text one every email carries and an optional HTML one with links and a layout for answers in a thread, and sets it when the sender is added. Use when a sender has no signature, when the person hands over a signature to reproduce (a screenshot, an HTML file, a description), or when a signature shows raw links.
---

> In Claude Code, run every tool this skill names with the `dylan` command: `dylan call <tool> name=value`, its fields in `dylan tool <tool>`, signing in with `dylan login` (the `using-dylan` skill).

# Sender signatures

Every email carries its sender's signature after the body. A sender has two:

- **The plain-text signature** (`signature`): always set. Every step of a plan goes out as plain
  text, the body and then this signature after a blank line; never HTML, never a picture. Copy
  never signs itself: Dylan appends this.
- **The HTML signature** (`signatureHtml`): optional. Only an answer in a thread uses it: the
  answer goes out as text and as HTML, and a mail client shows the HTML one with links laid out
  as a person's own signature would be.

Both are given when the sender is added (`add_sender`). `list_senders` shows each sender's.
Setting one is the person's decision: show them the result and set it when they agree.

## 1. Gather what goes in

From the screenshot, file or description: name, title, company, the links with their text ("Book a
meeting with me" and the calendar address), phone, a tagline. Ask for what is missing rather than
inventing it: a wrong phone number goes to every lead.

Keep it short: one or two links (a calendar, the site), no link shorteners, no tracking
parameters, no rows of social icons. Every link is weighed by spam filters on a cold first touch.

A postal address or an opt-out line goes in only when the person asks. Which laws apply to their
outreach is their call; where an opt-out line is needed Dylan adds its own.

## 2. The plain text

The details in order, links as bare addresses:

```text
Jane Doe
Head of Partnerships, Acme
Book a meeting with me: https://acme.com/meet/jane
+1 555 010 0199
```

No "Best regards" above it: the copy's last sentence is the end of the body, and the signature
follows.

## 3. The HTML

What every mail client renders the same way:

- **Tables** for layout (`cellpadding="0" cellspacing="0" border="0"`), nothing positioned by CSS.
- **Inline styles only**, no style block. Web-safe fonts (Arial, Helvetica, Verdana, Georgia),
  13 to 14 px.
- Links as `<a href="https://..." style="color:#1a0dab">text</a>`; a phone as `tel:`, an address
  as `mailto:`.
- No scripts, event handlers, forms, frames, web fonts, and no picture or background loaded from
  an address: Dylan refuses them and says what and where.

```html
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#222">
  <tr>
    <td style="vertical-align:top;line-height:18px">
      <b style="color:#1f3c88;font-size:14px">Jane Doe</b><br>
      Head of Partnerships, Acme<br>
      <a href="https://acme.com/meet/jane" style="color:#1a0dab">Book a meeting with me</a><br><br>
      <b>P:</b> <a href="tel:+15550100199" style="color:#1a0dab">+1 555 010 0199</a>
    </td>
  </tr>
</table>
```

## 4. Pictures: a logo, a headshot

A picture in the HTML signature is uploaded first and named by its `src`, never loaded from an
address:

1. `add_sender_image` with the file, base64-encoded: PNG, JPEG or GIF, 100 KB at most. It goes
   inside every answer, so size it at twice what it shows at (a logo shown 120 px wide: 240 px)
   and save it as JPEG. Dylan refuses another type, or a larger file, and says which.
2. Name it in the HTML by the `src` the answer gives: `<img src="cid:…" width="120"
   style="display:block" alt="Acme">`, with a width and an `alt`. Dylan sends the picture inside
   each message.
3. `list_sender_images` lists a sender's pictures; `remove_sender_image` removes one no signature
   shows any more (change the signature first).

**The photo** is something else: the face a lead's mail client shows beside the sender's name, not
part of the signature. `set_sender_photo` with a square JPEG or PNG headshot (a 400 px square), or
one of their pictures by its id (`image`); Dylan sets it on each of their mailboxes bought here and
keeps at it until each shows it. `get_sender_photo` says where each mailbox stands: shown, waiting,
refused (and why), or outside — a mailbox the person connected by sign-in or password, whose photo
they set in the account themselves. `image: null` stops setting it.

## 5. One person on several projects

A sender added with `add_sender` belongs to its project. A person who writes for several of the
organisation's projects is added once for the whole organisation with `add_shared_sender` (an
organisation admin), then put on each project with `share_sender`: a title and signatures for that
project (a different company line, a different booking link), or none to use their own, and
`dailyShare`, the most that project takes a day from the mailboxes the sender shares across
projects. Their pictures serve every project. `list_shared_senders` shows who writes where;
`unshare_sender` takes them off a project once no strategy there writes as them.

## 6. Set it and check it

`add_sender` with `signature` and, if wanted, `signatureHtml`; for a sender already there,
`update_sender` (`null` clears one). A change reaches every email not yet sent. Then, once a
strategy has copy,
`preview_message` on one of its emails shows it as the lead gets it, the signature as text. Show
the person that preview before any strategy sends with the sender.

## Common mistakes

- A signature with a name in the copy too: the email is signed twice.
- Raw tracking links, shorteners, or five icons in a cold signature.
- A phone number or title guessed instead of asked.
- An HTML signature that loads its logo from a web address: refused, and blocked by many clients
  anyway.
- A logo uploaded at its full size: every answer carries it, and a heavy message reads as bulk.
- The same person added on each project with `add_sender`: one shared sender, put on each project,
  keeps their pictures and mailboxes in one place.
