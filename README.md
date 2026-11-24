# YouTube Video

Schlichtes Floating-Tool: YouTube-**Embed-Code** einfuegen, Video mit Sound abspielen, loeschen.

## Oeffnen

https://jsg1049294-png.github.io/YouTube-Video/

## Bedienung

1. Bei YouTube: **Teilen → Einbetten** → Code kopieren
2. In das Textfeld einfuegen (oder YouTube-Link / Video-ID)
3. **Video laden**
4. **Loeschen** entfernt das Video

Fenster: Titelzeile ziehen, **−** minimieren, **×** schliessen, runder Button zum Wiedereroeffnen.

## Bookmarklet

Unter „Bookmarklet“ den Code kopieren und als Safari-Lesezeichen speichern. Auf einer anderen Seite das Lesezeichen tippen → gleiches Panel.

## Werbung / Skip

- **Im Embed** (iframe von YouTube): Kein Skript kann den „Ueberspringen“-Button druecken (Same-Origin-Policy).
- **Auf youtube.com** (wenn das Bookmarklet dort laeuft): Das Skript versucht periodisch, sichtbare Skip-Buttons zu klicken. Best effort – YouTube kann das blockieren.

## Technik

Nur HTML/CSS/JS, keine externen Abhaengigkeiten.
