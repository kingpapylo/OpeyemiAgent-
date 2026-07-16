"""OpeyemiAgent Telegram plugin — ports MobileClaw telegram skill (Bot API).

Requires TELEGRAM_BOT_TOKEN in usr/ secrets. Confirm before sending.
"""
import json
import urllib.request
import urllib.parse


def _api(token: str, method: str, params: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(params).encode()
    try:
        with urllib.request.urlopen(url, data=data, timeout=15) as r:
            return json.load(r)
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def send_message(token: str, chat_id: str, text: str) -> dict:
    """Send a text message. Confirm with user before calling."""
    return _api(token, "sendMessage", {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"})


def get_updates(token: str, limit: int = 10, offset: int | None = None) -> dict:
    """Fetch recent incoming messages."""
    params = {"limit": limit}
    if offset is not None:
        params["offset"] = offset
    return _api(token, "getUpdates", params)


if __name__ == "__main__":
    print("Telegram plugin ready. Provide token at runtime.")
