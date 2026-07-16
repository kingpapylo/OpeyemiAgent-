"""OpeyemiAgent Notion plugin — ports MobileClaw notion skill via Notion API."""
import json
import urllib.request


BASE = "https://api.notion.com/v1"
HEADERS = {"Notion-Version": "2022-06-28", "Content-Type": "application/json"}


def _req(token: str, method: str, url: str, body: dict | None = None) -> dict:
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.load(r)
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def search(token: str, query: str = "", limit: int = 10) -> dict:
    """Search pages and databases."""
    return _req(token, "POST", f"{BASE}/search",
                {"query": query, "page_size": limit})


def create_page(token: str, parent_id: str, title: str, body: str = "") -> dict:
    """Create a page under parent. Confirm with user first."""
    payload = {
        "parent": {"page_id": parent_id},
        "properties": {"title": [{"text": {"content": title}}]},
        "children": [{"object": "block", "type": "paragraph",
                      "paragraph": {"rich_text": [{"type": "text", "text": {"content": body}}]}}],
    }
    return _req(token, "POST", f"{BASE}/pages", payload)


if __name__ == "__main__":
    print("Notion plugin ready. Provide token at runtime.")
