# mob_calendar plugin

## Purpose
Query and create calendar events for OpeyemiAgent (ports MobileClaw calendar skill).

## Local Contracts
- Reads go through Google Calendar API (or host calendar via bridge).
- `add` creates an event; confirm details with user before creating.
- Store tokens in usr/ secrets, never commit.
