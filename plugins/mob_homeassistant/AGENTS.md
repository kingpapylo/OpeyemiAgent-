# mob_homeassistant plugin

## Purpose
Smart home control for OpeyemiAgent (ports MobileClaw smart-home skill).

## Local Contracts
- Uses Home Assistant REST API with long-lived token from usr/ secrets.
- Confirm destructive actions (all-off, locks) before executing.
- Entity IDs follow domain.object_id (light.*, switch.*, climate.*).
