"""OpeyemiAgent Navigation plugin — ports MobileClaw navigation skill."""
import urllib.parse


def directions_url(destination: str, mode: str = "driving") -> str:
    """Return a google.navigation: intent URI for turn-by-turn nav."""
    dest = urllib.parse.quote_plus(destination)
    mode = mode[0]  # d/w/b/t
    return f"google.navigation:q={dest}&mode={mode}"


def search_url(query: str) -> str:
    """Return a maps search URL for a place/category."""
    q = urllib.parse.quote_plus(query)
    return f"https://www.google.com/maps/search/?api=1&query={q}"


def open_map_url(lat: float, lon: float, label: str = "") -> str:
    """Return a maps URL for coordinates."""
    q = urllib.parse.quote_plus(label) if label else f"{lat},{lon}"
    return f"https://www.google.com/maps/search/?api=1&query={lat},{lon}&query_place_id={q}"


if __name__ == "__main__":
    print(directions_url("Taipei 101", "walking"))
