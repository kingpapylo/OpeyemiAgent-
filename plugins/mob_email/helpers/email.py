"""OpeyemiAgent Email plugin — ports MobileClaw email skill (Gmail API).

Requires Gmail OAuth token in usr/ secrets. Confirm recipient + subject with
the user before send/reply. Placeholder returns structure for wiring.
"""
from datetime import datetime, timezone


def read_inbox(limit: int = 10) -> list[dict]:
    """Return recent inbox messages (sender, subject, snippet, time)."""
    return [
        {
            "from": "<sender@example.com>",
            "subject": "<subject>",
            "snippet": "<preview>",
            "received": datetime.now(timezone.utc).isoformat(),
        }
        for _ in range(min(limit, 3))
    ]


def search(query: str, limit: int = 10) -> list[dict]:
    """Search mail with Gmail operators (from:, subject:, is:unread)."""
    return read_inbox(limit)


def send(to: str, subject: str, body: str) -> dict:
    """Send mail. Confirm to + subject with user first."""
    return {"ok": True, "to": to, "subject": subject}


def reply(message_id: str, body: str) -> dict:
    """Reply to a message. Confirm with user first."""
    return {"ok": True, "reply_to": message_id}


if __name__ == "__main__":
    print(read_inbox(2))
