# Dylan for Claude Code

Dylan is an outbound engine: it keeps your projects' record, sends email and LinkedIn steps, reads
the replies and protects your senders. Your agent does the thinking — who to write to, what to say,
how to answer — through Dylan's tools. This plugin gives Claude Code all of it:

- **Dylan's tools**, connected to your account at `mcp.meetdylan.ai`.
- **The method, as skills**: orientation, the company brief, segments, personas, sourcing, finding
  addresses, strategies and plans, copywriting, sending setup, signatures, inbox triage and results.
  Claude reaches for the right one by itself.
- **The `dylan` command**, for work at volume: a CSV of companies saved in batches, every page of
  your leads read into a file, an answer worked over in a script instead of the conversation.

You need a Dylan account (sign up at [app.meetdylan.ai](https://app.meetdylan.ai)), Claude Code,
and Node.js 22.18 or newer for the `dylan` command.

## Install

In Claude Code:

```
/plugin marketplace add Belkins-Inc/dylan-plugin
/plugin install dylan@dylan
```

Then sign in twice, once for each way in:

1. **The tools**: run `/mcp`, choose the `dylan` server and sign in. Pick the organisation to work in.
2. **The command**: ask Claude to run `dylan login`, or run it yourself. It opens the browser, you
   sign in and pick the organisation.

Start with "Let's work on my Dylan project". Claude lists your projects, reads the one you pick and
says what to do first.

## What asks you first

Anything that launches a strategy, sends, books, buys or spends asks for your yes before it runs:
the tools through Claude Code's own prompt, and `dylan` refuses them until it is given `--yes`,
which Claude passes only after you said yes. Prices are in each tool's description; spend is in
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

The plugin is for Claude Code. Any other agent connects to Dylan's MCP server,
`https://mcp.meetdylan.ai/mcp`; the Home screen of [Dylan's app](https://app.meetdylan.ai) has the
steps for each. For one that reads neither MCP prompts nor a plugin, paste
[instructions/AGENTS.md](instructions/AGENTS.md) into its own instructions file (`AGENTS.md`,
`GEMINI.md`, a Cursor rule): it names each guide and where to read it. The same text is at
`https://mcp.meetdylan.ai/guides/AGENTS.md`.

## Updates

`/plugin marketplace update dylan` brings the latest skills and command.
