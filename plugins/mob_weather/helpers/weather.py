"""OpeyemiAgent Weather plugin — ports MobileClaw weather skill via wttr.in."""
import json
import urllib.request


def current(location: str) -> dict:
    """Return current weather for location (city, airport code, or coords)."""
    url = f"https://wttr.in/{location.replace(' ', '+')}?format=j1"
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.load(r)
        cur = data["current_condition"][0]
        return {
            "temp_c": cur["temp_C"],
            "temp_f": cur["temp_F"],
            "desc": cur["weatherDesc"][0]["value"],
            "humidity": cur["humidity"],
            "feels_c": cur["FeelsLikeC"],
        }
    except Exception as e:  # noqa: BLE001
        return {"ok": False, "error": str(e)}


def forecast(location: str, days: int = 3) -> list[dict]:
    """Return multi-day forecast (high/low/condition/rain chance)."""
    url = f"https://wttr.in/{location.replace(' ', '+')}?format=j1"
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.load(r)
        out = []
        for d in data.get("weather", [])[:days]:
            out.append({
                "date": d["date"],
                "max_c": d["maxtempC"],
                "min_c": d["mintempC"],
                "desc": d["hourly"][4]["weatherDesc"][0]["value"],
                "rain_pct": d["hourly"][4]["chanceofrain"],
            })
        return out
    except Exception as e:  # noqa: BLE001
        return [{"ok": False, "error": str(e)}]


if __name__ == "__main__":
    print(current("Taipei"))
