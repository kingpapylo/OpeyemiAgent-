"""OpeyemiAgent Home Assistant plugin — ports MobileClaw smart-home skill."""
import json
import urllib.request


def _req(base: str, token: str, method: str, path: str, body: dict | None = None) -> dict:
    url = f"{base.rstrip('/')}/api{path}"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.load(r)
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def list_states(base: str, token: str) -> dict:
    """List all entity states."""
    return _req(base, token, "GET", "/states")


def turn_on(base: str, token: str, entity_id: str, **attrs) -> dict:
    """Turn on a light/switch/climate. Confirm destructive changes."""
    return _req(base, token, "POST", f"/services/{entity_id.split('.')[0]}/turn_on",
                {"entity_id": entity_id, **attrs})


def turn_off(base: str, token: str, entity_id: str) -> dict:
    """Turn off a light/switch. Confirm before executing."""
    return _req(base, token, "POST", f"/services/{entity_id.split('.')[0]}/turn_off",
                {"entity_id": entity_id})


if __name__ == "__main__":
    print("Home Assistant plugin ready. Provide base URL + token at runtime.")
