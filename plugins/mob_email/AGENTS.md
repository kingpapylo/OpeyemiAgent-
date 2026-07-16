# mob_email plugin

## Purpose
Email operations for OpeyemiAgent (ports MobileClaw email skill).

## Local Contracts
- Uses Gmail API with OAuth token stored in usr/ secrets.
- Compose/reply requires user confirmation of recipient + subject first.
- Never log full message bodies externally.
