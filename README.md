# OpeyemiAgent
### Your personal AI Agent that gets things done.

OpeyemiAgent is an open agent framework for work that needs more than chat:
a Dockerized Linux desktop, a browser with DOM annotation, live document
cowork, projects, skills, plugins, and a bridge back to your host machine.

It supports **ALL LLM providers** (OpenAI, Anthropic Claude, Ollama, and any
LiteLLM-compatible endpoint) and runs on your local machine or your own server.

## Features
- Full Linux desktop (Canvas) the agent can drive
- Browser DOM annotation - turn page elements into instructions
- Live document cowork (Markdown, Writer, Spreadsheet, Presentation)
- Plugin Hub - install 100+ community plugins or publish your own
- Projects & memory - isolated per project
- Host-machine bridge - same agent works in your real local repos
- Multi-agent cooperation - delegate to focused subagents
- Transparent internals - prompts, tools, plugins, skills all editable

## Built-in Skills (Plugins)
| Plugin | Capability |
|---|---|
| mob_sms | SMS send + search |
| mob_calendar | Calendar events |
| mob_email | Gmail read/compose/reply |
| mob_weather | Weather + forecast |
| mob_clipboard | Clipboard read/write |
| mob_telegram | Telegram Bot msg |
| mob_notion | Notion search/create |
| mob_homeassistant | Home Assistant control |
| mob_navigation | Maps directions/search |
| mob_photos | Photos find/share |

## Quick Start
```bash
curl -fsSL https://bash.agent-zero.ai | bash
# then open the WebUI and point it at your preferred LLM in Settings
```

## License
OpeyemiAgent is a rebrand of [OpeyemiAgent](https://github.com/agent0ai/agent-zero)
(MIT License, Copyright (c) 2025 OpeyemiAgent, s.r.o.).
The original MIT LICENSE file is retained in this repository.
