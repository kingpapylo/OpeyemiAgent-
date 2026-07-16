"""OpeyemiAgent SMS plugin — ports MobileClaw SMS skill via host-bridge.

Requires the AgentZero _a0_connector host-bridge CLI (`a0`) configured to
reach the user's phone. Adjust the `a0 host ...` subcommands to match the
connector's actual interface.
"""
import subprocess
import json


def _bridge(args: list[str]) -> dict:
    """Call the host-bridge CLI and parse JSON output."""
    try:
        out = subprocess.run(["a0", "host", *args],
                             capture_output=True, text=True, timeout=30)
        if out.returncode != 0:
            return {"ok": False, "error": out.stderr.strip() or "bridge failed"}
        try:
            return json.loads(out.stdout)
        except json.JSONDecodeError:
            return {"ok": True, "raw": out.stdout}
    except FileNotFoundError:
        return {"ok": False, "error": "host-bridge (a0) not available"}


def send(to: str, body: str) -> dict:
    """Send an SMS. Caller MUST confirm with user before invoking."""
    if not to or not body:
        return {"ok": False, "error": "to and body required"}
    return _bridge(["sms", "send", to, body])


def search(limit: int = 20, since_ms: int | None = None) -> dict:
    """Search recent SMS. since_ms = unix millis lower bound."""
    args = ["sms", "list", str(limit)]
    if since_ms is not None:
        args += ["--since", str(since_ms)]
    return _bridge(args)


if __name__ == "__main__":
    print(json.dumps(search(5), indent=2))
