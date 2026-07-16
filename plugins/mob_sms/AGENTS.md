# mob_sms plugin

## Purpose
Send and search SMS messages for OpeyemiAgent, ported from MobileClaw's SMS skill.

## Local Contracts
- All sends require explicit user confirmation before dispatch.
- Use the `_a0_connector` host-bridge to reach the physical phone.
- Never log message bodies externally.

## Usage
- `send(to, body)` -> dispatches SMS, returns status.
- `search(limit=20, since=None)` -> returns recent messages.
