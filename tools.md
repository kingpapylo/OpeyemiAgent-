# tools.md

## OpeOpeNationAiAgent v3 Tools

These are the core built-in tools and capabilities the agent can use or simulate.

### Core agent tools

- **session**: create, update, and finish sessions
- **memory**: store and retrieve episodic, semantic, and procedural notes
- **teaching**: save rules, knowledge, workflows, and corrections
- **health scan**: check system readiness and report issues
- **status**: display current session and memory state

### Work mode tools

- **automation**:
  - task tracking
  - workflow planning
  - shell command guidance
- **research**:
  - fact gathering
  - summarization
  - note capture
- **coding**:
  - repository inspection
  - change planning
  - safe edit suggestions

### Termux-friendly utilities

- `pkg` package management
- Node.js runtime
- Git clone / pull workflows
- local file and directory operations

### Safety tools

- permission prompts before destructive commands
- `yy` auto-approve mode for the current task only
- minimal-change bias
- session save on exit

### CLI reference

- `opeyemiagent automation "..."`
- `opeyemiagent research "..."`
- `opeyemiagent coding "..."`
- `opeyemiagent memory`
- `opeyemiagent teach <bucket> "..."`
- `opeyemiagent health`
- `opeyemiagent status`

Keep this file aligned with the actual CLI and agent behavior.