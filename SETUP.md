# Setting up Dylan — instructions for the agent

You are Claude, running in the person's Claude Code. Take them from a bare machine to a working
`dylan` command signed in to their Dylan account, step by step. Check before you change anything;
skip a step whose check already passes. Say in one line what you are doing before each step. Speak
to the person in the language they write in.

Rules for the whole setup:

- **Never ask for a password, a code or a key in chat.** The person signs in in their own browser
  (step 2); nothing is copied by anyone.
- Tell the person before anything that needs `sudo` or opens a system dialog; the rest you run
  yourself.
- Do not clone or read any other repository, and do not write code. If a step fails in a way this
  file does not cover, stop and show the person the exact error.

## 1. Install

**Never download a script and run it** (`curl … | bash`, `irm … | iex`, a saved `.ps1`): every step
below is a plain command you run yourself, one at a time, checking first. Run `uname -s` to know the
machine: `Darwin` is macOS, `Linux` is Linux, `MINGW…` / `MSYS…` (or no `uname` in PowerShell) is
Windows — no WSL is needed.

### a. Node.js 22.18 or newer

Check: `node -v` prints `v22.18` or higher (`v24` is best).

- Windows: `winget install --id OpenJS.NodeJS.LTS --exact --silent --accept-package-agreements --accept-source-agreements`.
  This shell does not see the new PATH until Claude Code restarts: for the rest of the setup put
  `export PATH="/c/Program Files/nodejs:$APPDATA/npm:$PATH";` in front of each command (in
  PowerShell: `$env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:Path";`).
- macOS with Homebrew (`brew -v` works): `brew install node`.
- macOS or Linux without it — Node's official build into `~/.local`, nothing run from the download:

  ```sh
  arch=$(uname -m | sed 's/x86_64/x64/;s/aarch64/arm64/'); os=$(uname -s | tr A-Z a-z)
  file=$(curl -fsSL https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt | grep -o "node-v[0-9.]*-$os-$arch.tar.gz" | head -1)
  mkdir -p ~/.local && curl -fsSL "https://nodejs.org/dist/latest-v24.x/$file" | tar -xz -C ~/.local --strip-components=1
  ```

  Then `export PATH="$HOME/.local/bin:$PATH"` in front of each later command.

An older Node left first on the PATH is the most common failure later: `which -a node` must show
the new one first.

### b. git

Check: `git --version`. Claude Code installs the plugin with it.

- Windows: `winget install --id Git.Git --exact --silent --accept-package-agreements --accept-source-agreements`
  (then `/c/Program Files/Git/cmd` on the PATH as above).
- macOS: `xcode-select --install` opens a system dialog; the person clicks *Install* and waits.
- Linux: `sudo apt-get install -y git` (tell the person the password prompt is theirs).

### c. The plugin

Check: `claude --version`. If there is no `claude` in this shell (the desktop app has its own),
install the CLI with npm: `npm install -g @anthropic-ai/claude-code`. Then:

```sh
claude plugin marketplace add Belkins-Inc/dylan-plugin
claude plugin install dylan@dylan
```

If the marketplace is already there, `claude plugin marketplace update dylan` instead of `add`.

### d. `dylan` on the PATH

Claude Code puts the plugin's `dylan` on its own shell's PATH from the next session on; for this
session and for the person's own terminal, link it once:

- macOS and Linux:

  ```sh
  mkdir -p ~/.local/bin && ln -sf ~/.claude/plugins/marketplaces/dylan/plugin/bin/dylan ~/.local/bin/dylan
  ```

  If `~/.local/bin` is not on the person's PATH (`echo $PATH`), tell them to add it to their shell's
  profile; in this session put `export PATH="$HOME/.local/bin:$PATH";` in front of each command.
- Windows: in the steps below, `dylan` means
  `"$HOME/.claude/plugins/marketplaces/dylan/plugin/bin/dylan.cmd"`.

Check: `dylan --version` prints a version.

## 2. Sign in

They need a Dylan account first: https://app.meetdylan.ai, signed in with Google or their work email.
Without one, sign-in answers that the address has no access: they sign up there (or ask their
organisation's admin to add them), and you carry on from here.

Run `dylan login` **in the background** (it waits up to ten minutes). It opens the person's browser
where it can, and prints the link:

```
Sign in to Dylan in your browser:

  https://mcp.meetdylan.ai/authorize?…

Waiting…
```

Give the person the link as a clickable link and tell them: open it, sign in with their work email,
pick the organisation and allow it. Then wait for the command to end; it answers
`Signed in as <their address> to <organisation>`. If it times out, run it again.

## 3. It works

```sh
dylan whoami
dylan call list_projects
```

- `whoami` shows their address and organisation: signed in.
- A refusal to sign in first: back to step 2.
- `list_projects` is empty: they make their first project in Dylan's app (Projects → New project),
  or you name one with them and they make it there.

## 4. Done — the guide

Setup is finished when steps 1–3 pass. Before the last message, make the folder their work will
live in — do not ask, it is part of the setup: `mkdir -p ~/work/dylan` (keep a folder they already
named instead), then `cd ~/work/dylan && pwd` for its full path.

End with one message to the person, in their language, that holds the two parts below — short lines
and lists, no paragraphs of prose. Leave out anything that does not apply to them.

### What to do next

1. **Start a new Claude Code session** (so the plugin's skills and `dylan` are loaded) and pick the
   folder you made — give its full path. This session cannot move there; only a new one can.
2. **Say what you want to work on** — for example "Let's work on my Dylan project". The agent
   lists their projects, reads the one they pick and says what to do first. List the projects from
   step 3 by name so they can pick one.
3. **A new project** starts with their materials: the website, a deck, notes from a call, ideal
   customer and exclusion lists — "Here is what we have, write the brief".
4. **Decisions stay theirs.** Anything that spends money, sends, launches or buys — domains,
   mailboxes, a paid search, launching a strategy, approving a reply — the agent prepares, says what
   it costs and asks them to confirm; nothing goes out on its own.
5. **Dylan's app**, https://app.meetdylan.ai, shows the same projects: the figures, senders,
   domains, audience, strategies, leads, inbox, meetings and tasks, and the wallet.
6. **Updates**: `claude plugin marketplace update dylan` brings the latest skills and command.

### What Dylan does

Each line is one ask away; the skill in brackets is what the agent follows.

- **Brief** — what they sell, to whom, the offer, proof and exclusions, from their materials and
  your research (`company-brief`).
- **Market** — segments (which companies) and personas (who inside them), sized with free counts,
  and a proposal they approve before any money is spent (`segment-design`, `persona-design`).
- **Sourcing** — companies and people found, each company judged against the segment
  (`sourcing`); emails found and verified (`email-finding`).
- **Sending** — lookalike domains and mailboxes bought, their own mailboxes connected, warm-up,
  signatures (`sending-setup`, `sender-signatures`).
- **Strategies** — email and LinkedIn steps per segment and persona, the copy written and checked,
  leads enrolled, a launch they confirm (`strategy-and-plans`, `copywriting`).
- **Inbox** — each reply read and labelled, an answer drafted for them to approve, meetings booked
  (`inbox-triage`).
- **Results** — what works by segment, persona and step, and what to change (`results-review`).
- **Work at volume** — CSVs in, every page of a list out to a file, counts across thousands of rows
  without pasting them into the conversation (`using-dylan`).
