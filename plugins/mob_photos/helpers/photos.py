"""OpeyemiAgent Photos plugin — ports MobileClaw photos skill via host-bridge."""
import subprocess
import json


def search(query: str = "", limit: int = 10) -> dict:
    """Search photos by name/date via host-bridge."""
    try:
        out = subprocess.run(["a0", "host", "photos", "search", query, str(limit)],
                             capture_output=True, text=True, timeout=20)
        return json.loads(out.stdout) if out.stdout else {"ok": False, "error": "no output"}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def share(photo_id: str, target: str) -> dict:
    """Share a photo to target app via Android share sheet."""
    try:
        out = subprocess.run(["a0", "host", "photos", "share", photo_id, target],
                             capture_output=True, text=True, timeout=20)
        return {"ok": True, "raw": out.stdout}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


if __name__ == "__main__":
    print(json.dumps(search("", 5), indent=2))
