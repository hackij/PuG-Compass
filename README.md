# PuG Lerncoach (lokale Web-App)

## Starten
1. Öffne `index.html` direkt im Browser (Doppelklick).
2. Die App läuft komplett lokal ohne Server.
3. Lernfortschritt und Punkte werden im Browser (`localStorage`) gespeichert.

## Struktur
- `index.html` - App Oberfläche mit 4 Bereichen (Karteikarten, Quiz, KI Coach, Statistik)
- `style.css` - Mobile-First Design, Karten-Flip-Animation, Gamification-Look
- `app.js` - komplette Logik (Fragen laden, Fortschritt speichern, Statistik berechnen)
- `data/fragen.json` - strukturierter Fragenkatalog
- `lib/chart.umd.min.js` - lokale Chart.js Datei für das Spinnennetzdiagramm
- `scripts/convert_pdf.js` - optionales Konvertierungsskript PDF -> JSON

## Fragenkatalog anpassen
1. Ersetze die PDF-Datei `Fragenkatalog PuG Lerncoach.pdf` im Projektordner.
2. Erzeuge danach `data/fragen.json` neu.

Hinweis: Das optionale Script `scripts/convert_pdf.js` benötigt eine lokale Node.js-Installation.
Falls Node.js nicht verfügbar ist, kann `data/fragen.json` auch manuell ergänzt werden.

## Neue Fragen manuell hinzufügen
Öffne `data/fragen.json` und füge ein weiteres Objekt im gleichen Format hinzu:

```json
{
  "id": 58,
  "category": "Beispielkategorie",
  "type": "open",
  "question": "Beispielfrage",
  "points": 3,
  "answer": "Beispielantwort"
}
```

Wichtig:
- `id` eindeutig vergeben
- `type` nur `open` oder `closed`
- `points` als Zahl
