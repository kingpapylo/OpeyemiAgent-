"""OpeyemiAgent Clipboard plugin — ports MobileClaw clipboard skill via host-bridge."""
import subprocess
import json


def read() -> dict:
    """Read current clipboard text."""
    try:
        out = subprocess.run(["a0", "host", "clipboard", "get"],
                             capture_output=True, text=True, timeout=15)
        return {"ok": True, "text": out.stdout}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def write(text: str) -> dict:
    """Write text to clipboard."""
    try:
        subprocess.run(["a0", "host", "clipboard", "set", text],
                       capture_output=True, text=True, timeout=15, check=True)
        return {"ok": True}
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


if __name__ == "__main__":
    print(json.dumps(read(), indent=2))
