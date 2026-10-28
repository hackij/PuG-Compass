# PuG Compass

Lern-App für die Prüfung **Wirtschafts- und Sozialkunde** an der BS1 Bayreuth –
für Handwerksberufe (Gesellenprüfung, z. B. Klempner) und IHK-Berufe (Abschlussprüfung, z. B. Mechatroniker).

Live: https://hackij.github.io/PuG-Compass/

## Funktionen
- **Profil beim ersten Start:** Handwerk oder IHK, Beruf, Prüfungstag, Bayern-Fragen an/aus,
  Lerntage, Minuten pro Lerntag und Uhrzeit. Die Inhalte werden passend gefiltert.
- **Lernplan:** drei Phasen bis zur Prüfung (Neues lernen → Festigen → Endspurt), tägliche
  **Tagesmission**, feste **Probeprüfungen** (6, 4, 2 Wochen und 3 Tage vorher), **Prognose** der
  Prüfungsreife, Kalenderansicht und **Export in den Handy-Kalender** (.ics mit Erinnerung).
  Verpasste Lerntage werden automatisch auf die folgenden verteilt.
- **Lernen:** Karteikarten mit Leitner-System (Wiederholung nach 1, 3, 7, 14, 30 Tagen),
  Lösungsbausteine zum Abhaken bei „Nennen Sie …“-Fragen.
- **Fallsituationen** aus dem Arbeitsalltag.
- **Training:** Schnell-Quiz, Zuordnen, Reihenfolge, Lückentext, Lohnzettel-Rechner.
- **Begriff des Tages** auf der Startseite.
- **Prüfungssimulation:** 60 Minuten (oder 20-Min.-Kurztest), gebundene + offene Aufgaben,
  Selbstbewertung der offenen Antworten, Note nach 100-Punkte-Schlüssel, Auswertung nach Themen.
- **Plan → Mehr:** KI-Lerncoach (fobizz), Zusatzübungen, Lernstand sichern/laden.
- Läuft offline und lässt sich auf dem Handy „Zum Home-Bildschirm“ hinzufügen.
- Der Lernstand bleibt nur im Browser des Geräts (keine Anmeldung, keine Daten an Dritte).

## Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst |
| `app.css` | Design (BS1-Farben ganz oben als Variablen) |
| `app.js` | App-Logik |
| `data/katalog.js` | **Lernkarten** inkl. Fallsituationen – hier werden Fragen gepflegt |
| `data/extras.js` | Trainingsaufgaben (Zuordnen, Reihenfolge, Lückentext) und Begriffe des Tages |
| `sw.js`, `manifest.json`, `icons/` | Offline-Nutzung & App-Icon |
| `fonts/` | Schrift „Plus Jakarta Sans“ für den Schriftzug (freie Lizenz, siehe OFL-Lizenz.txt) |
| `logo/` | Logo als SVG und PNG, z. B. für Arbeitsblätter oder Präsentationen |

## Aktuelle Werte pflegen (z. B. nach einer Wahl oder zum 1. Januar)
Ganz oben in `data/katalog.js` steht der Block **AKTUELLE WERTE** (`const F = { … }`, darunter `const R` mit denselben Beitragssätzen als Zahl für den Lohnzettel-Rechner).
Dort stehen Bundestag, Landtag, Bundespräsident, Beitragssätze, Mindestlohn usw.
Wert ändern, `stand` anpassen – fertig. Alle betroffenen Karten zeigen automatisch den neuen Wert
und den Hinweis „Stand …“ mit Link zum Nachprüfen.

## Neue Frage hinzufügen
In `data/katalog.js` in der passenden Gruppe eine Zeile ergänzen:

```js
K("ar99", "arbeit", "all", 2, "Frage …?", "Musterlösung …",
  { mc: ["richtige Antwort", "falsch", "falsch", "falsch"] });
```

- `"all"` = alle Berufe, `"hwk"` = nur Handwerk, `"ihk"` = nur IHK
- optional `k: [...]` Lösungsbausteine und `n: 3` (wie viele verlangt), `by: true` für Bayern-Fragen
- Themen-IDs: ausbildung, arbeit, sozial, mitbest, tarif, recht, wirtschaft, politik

Nach Änderungen in `sw.js` die Versionsnummer (`CACHE`) erhöhen, damit Handys die neue Version laden.
