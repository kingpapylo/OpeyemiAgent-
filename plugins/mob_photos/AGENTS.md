# mob_photos plugin

## Purpose
Photo access for OpeyemiAgent (ports MobileClaw photos skill).

## Local Contracts
- Uses _a0_connector host-bridge to reach the phone's MediaStore / Google Photos.
- Share uses the Android share sheet via bridge.
- Confirm before deleting; deletes are recoverable for 30 days only.
