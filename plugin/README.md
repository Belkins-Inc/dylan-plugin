# Dylan for Claude Code

Dylan is an outbound engine: it keeps your projects' record, sends email and LinkedIn steps, reads
the replies and protects your senders. Your agent does the thinking — who to write to, what to say,
how to answer — through Dylan's tools. This plugin gives Claude Code all of it:

- **The `dylan` command**, which runs every Dylan tool against your account: read a project,
  save companies, write copy, launch, answer replies; and at volume, a CSV of companies saved in
  batches, every page of your leads read into a file, an answer worked over in a script instead of
  the conversation.
- **The method, as skills**: orientation, the company brief, segments, personas, sourcing, finding
  addresses, strategies and plans, copywriting, sending setup, signatures, inbox triage and results.
  Claude reaches for the right one by itself.

You need a Dylan account (sign up at [app.meetdylan.ai](https://app.meetdylan.ai)), Claude Code,
and Node.js 22.18 or newer for the `dylan` command.

## Install

The simplest: open Claude Code and send it

```
Set me up for Dylan: follow https://github.com/Belkins-Inc/dylan-plugin/blob/main/SETUP.md
```

Claude installs what is missing, the plugin and the `dylan` command, and signs you in through the
browser ([SETUP.md](SETUP.md) is what it follows).

Or one line in a terminal installs what is missing (git, Node.js, Claude Code), the plugin and the
`dylan` command, and signs you in through the browser:

```sh
curl -fsSL https://raw.githubusercontent.com/Belkins-Inc/dylan-plugin/main/install.sh | bash   # macOS, Linux
irm https://raw.githubusercontent.com/Belkins-Inc/dylan-plugin/main/install.ps1 | iex          # Windows PowerShell
```

Or by hand, in Claude Code:

```
/plugin marketplace add Belkins-Inc/dylan-plugin
/plugin install dylan@dylan
```

then ask Claude to run `dylan login`; it opens the browser, you sign in with your work email and
pick the organisation.

Start with "Let's work on my Dylan project". Claude lists your projects, reads the one you pick and
says what to do first.

## What asks you first

Anything that launches a strategy, sends, books, buys or spends asks for your yes before it runs:
`dylan` refuses it until it is given `--yes`, which Claude passes only after you said yes. Prices are in each tool's description; spend is in
your wallet in Dylan's app.

## The command on its own

```sh
dylan tools                                   # every tool, and whether it reads, writes or asks
dylan tool save_companies                     # one tool's fields
dylan call list_projects
dylan call save_companies project=acme --each companies --from companies.csv
dylan call list_leads project=acme --all --out leads.jsonl
dylan --help
```

In a script or a scheduled job, set `DYLAN_API_KEY` to a key made in Dylan's app instead of
signing in.

Without the plugin, for any agent that runs commands, install it from npm:

```sh
npm install -g @meetdylan/cli
dylan login
```

## Other agents

The plugin is for Claude Code, and Claude Code is the only agent Dylan is offered in today. Others
come later; meanwhile [instructions/AGENTS.md](instructions/AGENTS.md) names each guide and where
to read it, for an agent that runs commands and reads its own instructions file.

## Updates

`/plugin marketplace update dylan` brings the latest skills and command.
