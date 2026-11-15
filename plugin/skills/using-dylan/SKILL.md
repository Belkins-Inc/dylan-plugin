---
name: using-dylan
description: How to run Dylan's tools from Claude Code with the dylan command — signing in (dylan login), reading and changing a project (brief, segments, strategies, leads, inbox), importing a CSV or list the person gave, saving or judging hundreds of companies and contacts, reading every page of a list into a file, and asking the person before anything that launches, sends, buys or spends. Use whenever you work on the person's Dylan projects, before any other Dylan skill's first tool.
---

# Using Dylan

Every tool the other Dylan skills name (`get_brief`, `save_companies`, `list_leads`,
`launch_strategy` …) runs through the `dylan` command in the terminal:

```sh
dylan call get_brief project=acme
```

`dylan tools` lists every tool and whether it reads, writes or asks the person first; `dylan tool
<name>` gives one tool's fields, limits and price. The answer comes back as JSON; refusals come
with what to do. What a skill says about a tool holds as written: only the way of calling it is
this command.

For a short read or a single change, call it and read the answer. For volume, the command does
what a single call cannot: read rows from a file and send them in batches, read every page of a
list in one go, and write the answer to a file instead of the conversation.

## When to work in files

- The input is a file: a CSV or spreadsheet export the person gave, a list of domains, rows you
  built in a script.
- More than about a hundred rows go in (`save_companies`, `save_contacts`, `judge_companies`,
  `write_copy`) or come out (`list_segment_companies`, `list_leads`, `list_inbox`).
- You need to count, filter, join or compare across many rows. Write the rows to a file, work on
  the file, and bring only the result into the conversation. Two thousand companies printed into
  the conversation cost more than the work on them.

Keep each project's files in one folder (`./dylan/<project>/`), named for what they hold
(`segment-saas-new.jsonl`, `contacts-batch-2.csv`), so the next session finds them.

## Signing in

`dylan whoami` says who is signed in and into which organisation; run it first in a session.
Nobody: run `dylan login`. It prints a link and opens the browser; the person signs in with their
work email and picks the organisation, and the command waits up to ten minutes for them (give it
that long). A script with nobody to sign in uses `DYLAN_API_KEY`, a key the person makes in
Dylan's app.

## The commands

```sh
dylan tools                          # every tool: reads, writes, or asks the person first
dylan tool save_contacts             # one tool: what it does, its fields, how many at once
dylan call list_segments project=acme
```

Fields are `name=value`, typed by the tool's schema: `limit=200` is a number, `again=true` a
boolean. A list field takes the name again for each item (`titles=CFO titles="Head of Finance"`);
`name:=<json>` is JSON as it is (`criteria:='{"minEmployees":50}'`); `name=@file` reads the value
from a file, a list one item a line (`excludeDomains=@held.txt`); `name:=@file.json` a JSON file.

| Option | What it does |
| --- | --- |
| `--each <field> --from <file>` | sends the file's rows as that field, in batches the tool takes (a CSV or TSV with a header, JSON Lines, or a JSON list) |
| `--batch <n>` | rows a batch, at most the tool's own limit |
| `--all` | every page of a list tool, as one list (tools that only read) |
| `--pick a,b,c` | only these fields of each row (`a.b` reaches into one) |
| `--out <file>` | the answer to a file (`.jsonl` one row a line), and one line about it instead |
| `--input <file>` | the input as a JSON object; fields given after it override it |
| `--yes` | runs a tool that launches, sends, buys or spends — after the person's yes |

A refusal is two lines, `dylan: <what went wrong>` and `hint: <what to do>`; do what the hint
says. Exit code 1 is Dylan's refusal or a failed call, 2 a command written wrong.

## Recipes

**A CSV of companies the person gave.** Look at its header first (`head -3 companies.csv`). A
column named as a field of the tool's rows goes into it (`dylan tool save_companies` lists them:
`domain`, `name`, `linkedinUrl`, `industry`, `employeeCount`, `country`, …); rename a header that
means a field but is spelled otherwise. Every other column goes into the row's `facts` as it is.

```sh
dylan call save_companies project=acme --each companies --from companies.csv --out ./dylan/acme/saved.json
```

Then judge them as the `segment-design` guide says: read the new ones into a file, decide each,
write each verdict as a line of JSON as you go, and send the file.

```sh
dylan call list_segment_companies segment=<id> status=new --all --pick id,domain,name,industry,employeeCount,facts --out ./dylan/acme/new.jsonl
dylan call judge_companies segment=<id> --each verdicts --from ./dylan/acme/verdicts.jsonl
```

**Leaving out what the project already holds.** A paid search takes `excludeDomains`; read the held
domains into a file and pass the file.

```sh
dylan call list_segment_companies segment=<id> --all --pick domain --out ./dylan/acme/held.json
node -e 'const r=require("./dylan/acme/held.json");console.log(r.map(x=>x.domain).join("\n"))' > ./dylan/acme/held.txt
dylan call count_companies industries="Software Development" sizes=51-200 excludeDomains=@./dylan/acme/held.txt
```

`count_companies` is free; `search_companies` is paid, so it asks the person first (below).

**Contacts found elsewhere.** A file with `email`, `firstName`, `lastName`, `title`,
`companyDomain` or `linkedinUrl` columns; the rest go into `facts`.

```sh
dylan call save_contacts project=acme --each contacts --from people.csv --out ./dylan/acme/contacts-saved.json
```

**Copy for many steps at once.** Write each message's copy as a line of JSON in the shape
`write_copy` takes (`dylan tool write_copy`), check a sample with `check_copy` first, then send the
file with `--each messages`.

**Working over a big answer.** Read it to a file and compute with a short script; bring back the
figure, not the rows.

```sh
dylan call list_leads project=acme state=stuck --all --out ./dylan/acme/stuck.json
node -e 'const r=require("./dylan/acme/stuck.json");const by={};for(const l of r)by[l.stuckReason]=(by[l.stuckReason]||0)+1;console.log(by)'
```

## Rules

- **`--yes` only after the person's yes**, in this conversation, for this call: say what it does,
  how many, and what it costs (`dylan tool <name>` gives the price), and wait. A yes to one call is
  not a yes to the next.
- **A refused batch stops the run.** The refusal says which rows went in before it; correct the
  rows it names and send the rest of the file from that row on, never the whole file again for a
  tool that adds rather than updates (`save_contacts`).
- Do not print a large file into the conversation to look at it: `head`, `wc -l`, or a script that
  prints what you need.
- Files hold the person's data. Keep them in the project's folder, and delete what they ask you to.
- Record what you did as the guides say (`record_search`, `add_note`, `end_session`); a file on
  this machine is not the project's memory.
