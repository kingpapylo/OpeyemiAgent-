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

## Browser Development

Run the browser interface and persistent agent state with Docker Compose:

```bash
docker compose -f docker-compose.alloy.yaml up -d
```

Open `http://localhost:3000`. The Compose service uses host networking and does
not publish additional Docker ports.

## Commands

See `Skill.md` for the skill definition and `tools.md` for the tool reference.

### Smart ask behavior

- `opeyemiagent ask "..."` routes free text to the best mode
- Low-confidence prompts ask you to choose a mode
- Close matches can return a mixed response

```bash
opeyemiagent ask "backup my downloads folder"
opeyemiagent ask "termux battery optimization"
opeyemiagent ask "build a node cli logger"
opeyemiagent automation "backup my downloads folder"
opeyemiagent research "termux battery optimization"
opeyemiagent coding "build a node cli logger"
opeyemiagent memory
opeyemiagent teach auto "Always ask before shell commands"
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
curl -fsSL https://raw.githubusercontent.com/kingpapylo/OpeyemiAgent-/HEAD/install_opeyemiagent.sh | bash
```

### One-line install command

```bash
curl -fsSL https://raw.githubusercontent.com/kingpapylo/OpeyemiAgent-/HEAD/install_opeyemiagent.sh | bash
```

## License

MIT
