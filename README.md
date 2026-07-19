# OpeOpeNationAiAgent v3

**The Operation Agent — ROOM!**

A Node.js agent for Termux with:
- long-term memory
- auto-save sessions
- task indicators
- boot scanning
- teaching and self-improvement hooks
- automation, research, and coding assistance

## Quick Start

```bash
cd ai_agent
bash setup.sh
opeyemiagent health
```

## Commands

See `Skill.md` for the skill definition and `tools.md` for the tool reference.

```bash
opeyemiagent automation "backup my downloads folder"
opeyemiagent research "termux battery optimization"
opeyemiagent coding "build a node cli logger"
opeyemiagent memory
opeyemiagent teach rules "Always ask before shell commands"
opeyemiagent health
opeyemiagent status
```

## Persistent Data

State is stored in:

```bash
~/.opeope_nation/
```

## Termux Install

```bash
pkg update -y && pkg install -y nodejs git && curl -fsSL https://raw.githubusercontent.com/kingpapylo/OpeyemiAgent-/session-019f7c4b-c083-736c-97b4-b6ba19876cf5/setup.sh | bash
```

## License

MIT
