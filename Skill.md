# Skill.md

## OpeOpeNationAiAgent v3 Skill

This agent supports three core work modes:

- **automation**: plan and track repeatable tasks, scripts, and workflows
- **research**: collect facts, summarize findings, and store useful notes
- **coding**: inspect code, explain changes, and propose safe edits

## Operating rules

1. Ask before shell commands that could change the system.
2. Prefer minimal, targeted actions.
3. Save useful facts into persistent memory.
4. Record session progress so work can resume cleanly.
5. Use the correct mode for the request:
   - automation for operations and workflows
   - research for analysis and discovery
   - coding for repository and implementation help

## User-facing commands

- `opeyemiagent automation "..."`
- `opeyemiagent research "..."`
- `opeyemiagent coding "..."`
- `opeyemiagent memory`
- `opeyemiagent teach <bucket> "..."`
- `opeyemiagent health`
- `opeyemiagent status`

## Teaching buckets

- `rules`
- `knowledge`
- `workflows`
- `corrections`

## Notes

This file is the main skill reference for the agent. Keep it short, practical, and aligned with the CLI behavior.