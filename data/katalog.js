/*
  PuG Compass – Lernkarten WiSo
  -------------------------------
  Aufbau einer Karte:  K(id, thema, gilt, punkte, frage, musterloesung, extras)
    gilt:   "all" = alle Berufe | "hwk" = nur Handwerk | "ihk" = nur IHK
    extras: k  = Lösungsbausteine (für "Nennen Sie ..."-Fragen, zum Abhaken)
            n  = wie viele Bausteine verlangt sind (z. B. 3 bei "Nennen Sie 3")
            mc = Multiple Choice: [richtige Antwort, falsch, falsch, falsch]
            s  = Stand (bei Zahlen, die sich ändern – bitte jährlich prüfen!)
            by = true, wenn die Frage nur für Bayern gilt
  Neue Karten einfach unten in der passenden Gruppe ergänzen. IDs eindeutig halten.
*/
(function () {
  const T = [
    { id: "ausbildung", title: "Berufsausbildung & Weiterbildung", short: "Ausbildung", color: "#2563c9" },
    { id: "arbeit", title: "Arbeitsrecht & Arbeitsschutz", short: "Arbeitsrecht", color: "#c8102e" },
    { id: "sozial", title: "Lohn, Steuern & Sozialversicherung", short: "Sozialvers.", color: "#0e9384" },
    { id: "mitbest", title: "Mitbestimmung im Betrieb", short: "Mitbestimmung", color: "#7a5af8" },
    { id: "tarif", title: "Tarifrecht & Arbeitsmarkt", short: "Tarif & Markt", color: "#dc6803" },
    { id: "recht", title: "Unternehmen, Verträge & Kammern", short: "Unternehmen", color: "#1570ef" },
    { id: "wirtschaft", title: "Wirtschaftsordnung & -politik", short: "Wirtschaft", color: "#039855" },
    { id: "politik", title: "Staat, Politik & Europa", short: "Politik", color: "#344054" },
  ];

  /* ───────────── AKTUELLE WERTE ─────────────
     Alles, was sich mit Wahlen, Gesetzen oder zum Jahreswechsel ändert, steht HIER.
     In den Karten werden die Platzhalter {name} automatisch ersetzt.
     Nach einer Wahl / zum 1. Januar einfach diese Werte und "stand" anpassen. */
  const F = {
    stand: "Oktober 2026",
    mindestlohn: "13,90 €", mindestlohnNext: "ab 1.1.2027: 14,60 €",
    mav: "1. Jahr 724 €, 2. Jahr 854 €, 3. Jahr 977 €, 4. Jahr 1.014 €", mav1: "724 €",
    kv: "14,6 %", kvZusatz: "2,9 %", pv: "3,6 %", pvKinderlos: "0,6 %", rv: "18,6 %", alv: "2,6 %",
    kugDauer: "Regulär bis zu 12 Monate; per Verordnung für Ansprüche bis 31.12.2026 auf bis zu 24 Monate verlängert.",
    grundsicherung: "Grundsicherungsgeld (seit 1. Juli 2026, löste das Bürgergeld ab)",
    einwohner: "rund 83,5 Millionen", erwerbstaetige: "rund 46 Millionen",
    btWahlperiode: "21. Wahlperiode, gewählt 2025", btSitze: "630",
    btParteien: "CDU/CSU, AfD, SPD, Bündnis 90/Die Grünen, Die Linke (dazu 1 Abgeordneter des SSW)",
    regierung: "CDU/CSU und SPD", kanzler: "Friedrich Merz (CDU)",
    bpraes: "Frank-Walter Steinmeier (seit 2017, Amtszeit bis März 2027)",
    ltParteien: "CSU, Freie Wähler, AfD, Bündnis 90/Die Grünen, SPD (Landtagswahl 2023)",
    ltRegierung: "CSU und Freie Wähler", mp: "Markus Söder (CSU)",
    euStaaten: "27",
  };
  // Zahlen für den Lohnzettel-Rechner (gleiche Werte wie oben, nur als Zahl)
  const R = { kv: 14.6, kvZusatz: 2.9, pv: 3.6, pvKinderlos: 0.6, rv: 18.6, alv: 2.6, geringverdiener: 325 };
  // Wo Lernende den aktuellen Stand selbst nachprüfen können
  const Q = {
    bt: "https://www.bundestag.de/parlament/plenum/sitzverteilung_21wp",
    bpraes: "https://www.bundespraesident.de",
    lt: "https://www.bayern.landtag.de",
    sv: "https://www.deutsche-rentenversicherung.de",
    ml: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html",
    aa: "https://www.arbeitsagentur.de/unternehmen/finanziell/kurzarbeitergeld-formen-voraussetzungen",
    destatis: "https://www.destatis.de",
    gs: "https://www.arbeitsagentur.de",
  };

  const C = [];
  const fill = (v) => typeof v === "string" ? v.replace(/\{(\w+)\}/g, (m, k) => (k in F ? F[k] : m)) : Array.isArray(v) ? v.map(fill) : v;
  const K = (id, t, g, p, q, a, x = {}) => {
    const c = { id, t, g, p, q, a, ...x };
    ["q", "a", "k", "mc"].forEach((f) => { if (c[f]) c[f] = fill(c[f]); });
    if (c.s) c.s = F.stand;            // alle „wechselnden“ Karten zeigen denselben Stand
    if (c.src) c.src = Q[c.src] || c.src;
    C.push(c);
  };

  /* ───────────── 1. Berufsausbildung & Weiterbildung ───────────── */
  K("au01", "ausbildung", "all", 2, "Wie heißt das Ausbildungssystem in Deutschland und was kennzeichnet es?",
    "Duales System: Die Ausbildung findet an zwei Lernorten statt – praktisch im Ausbildungsbetrieb und theoretisch in der Berufsschule.",
    { mc: ["Duales System – Betrieb und Berufsschule", "Modulares System – nur Kurse beim Bildungsträger", "Schulisches System – nur Berufsfachschule", "Triales System – Betrieb, Kammer und Hochschule"] });
  K("au02", "ausbildung", "all", 2, "In welchen Gesetzen ist die Berufsausbildung geregelt?",
    "Im Berufsbildungsgesetz (BBiG) – im Handwerk zusätzlich in der Handwerksordnung (HwO). Für jeden Beruf gibt es außerdem eine Ausbildungsordnung; für Jugendliche gilt das Jugendarbeitsschutzgesetz.",
    { k: ["Berufsbildungsgesetz (BBiG)", "Handwerksordnung (HwO)", "Ausbildungsordnung", "Jugendarbeitsschutzgesetz"], n: 2 });
  K("au03", "ausbildung", "all", 6, "Nennen Sie 6 Mindestinhalte des Berufsausbildungsvertrags.",
    "Laut § 11 BBiG: Art und Ziel der Ausbildung (Beruf), Beginn und Dauer, Ausbildungsmaßnahmen außerhalb der Ausbildungsstätte, tägliche Ausbildungszeit, Dauer der Probezeit, Höhe der Vergütung, Urlaubsdauer, Kündigungsvoraussetzungen, Hinweis auf Tarifverträge/Betriebsvereinbarungen, Form des Ausbildungsnachweises.",
    { k: ["Ausbildungsberuf und -ziel", "Beginn und Dauer", "Maßnahmen außerhalb des Betriebs", "Tägliche Ausbildungszeit", "Probezeit", "Vergütung", "Urlaub", "Kündigungsvoraussetzungen", "Hinweis auf Tarifverträge", "Form des Ausbildungsnachweises"], n: 6 });
  K("au04", "ausbildung", "all", 2, "Wie lange dauert die Probezeit in der Ausbildung?",
    "Mindestens 1 Monat und höchstens 4 Monate.",
    { mc: ["1 bis 4 Monate", "genau 6 Monate", "2 bis 8 Wochen", "bis zu 12 Monate"] });
  K("au05", "ausbildung", "all", 3, "Wie kann ein Ausbildungsverhältnis während und nach der Probezeit gekündigt werden?",
    "In der Probezeit: von beiden Seiten jederzeit ohne Frist und ohne Grund. Nach der Probezeit: durch den Betrieb nur fristlos aus wichtigem Grund; durch den Azubi mit 4 Wochen Frist, wenn er die Ausbildung aufgibt oder den Beruf wechselt. Die Kündigung muss immer schriftlich erfolgen, nach der Probezeit mit Angabe der Gründe.",
    { k: ["Probezeit: jederzeit, ohne Frist", "Danach Betrieb: nur aus wichtigem Grund", "Danach Azubi: 4 Wochen bei Berufsaufgabe/-wechsel", "Immer schriftlich"], n: 3 });
  K("au06", "ausbildung", "all", 6, "Nennen Sie jeweils 3 Pflichten des Auszubildenden und des Ausbildenden.",
    "Azubi: Lernpflicht, Berufsschulpflicht, Weisungen befolgen, Sorgfaltspflicht, Schweigepflicht, Ausbildungsnachweis führen, Betriebsordnung beachten. Ausbildender: Ausbildungspflicht, Freistellung für Berufsschule und Prüfungen, kostenlose Ausbildungsmittel, Vergütung zahlen, Fürsorgepflicht, nur ausbildungsbezogene Tätigkeiten, Zeugnis ausstellen.",
    { k: ["Azubi: Lernpflicht", "Azubi: Berufsschule besuchen", "Azubi: Weisungen befolgen", "Azubi: Schweigepflicht", "Azubi: Ausbildungsnachweis führen", "Betrieb: Ausbildungspflicht", "Betrieb: Freistellung Berufsschule/Prüfung", "Betrieb: kostenlose Ausbildungsmittel", "Betrieb: Vergütung zahlen", "Betrieb: Fürsorgepflicht", "Betrieb: Zeugnis ausstellen"], n: 6 });
  K("au07", "ausbildung", "all", 2, "Wer muss die Verkürzung der Ausbildungszeit beantragen?",
    "Auszubildender und Ausbildender gemeinsam bei der zuständigen Stelle (Kammer). Gründe sind z. B. ein höherer Schulabschluss oder gute Leistungen.",
    { mc: ["Azubi und Betrieb gemeinsam bei der Kammer", "Nur die Berufsschule", "Nur der Auszubildende beim Arbeitsamt", "Die Eltern beim Kultusministerium"] });
  K("au08", "ausbildung", "all", 2, "Was passiert, wenn ein Azubi die Abschlussprüfung nicht besteht?",
    "Die Prüfung kann zweimal wiederholt werden. Auf Verlangen des Azubis verlängert sich das Ausbildungsverhältnis bis zur nächsten Wiederholungsprüfung, höchstens um ein Jahr.",
    { mc: ["Verlängerung auf Verlangen bis zur Wiederholung, max. 1 Jahr", "Die Ausbildung endet ohne Wiederholungsmöglichkeit", "Der Betrieb muss den Azubi unbefristet übernehmen", "Die Prüfung kann beliebig oft wiederholt werden"] });
  K("au09", "ausbildung", "all", 2, "Wann endet das Ausbildungsverhältnis?",
    "Mit Ablauf der vereinbarten Ausbildungszeit. Besteht der Azubi die Prüfung vorher, endet es mit der Bekanntgabe des Prüfungsergebnisses.",
    { mc: ["Mit Ablauf der Ausbildungszeit bzw. früher mit Bestehen der Prüfung", "Immer am 31. August", "Erst mit Aushändigung des Zeugnisses der Berufsschule", "Mit dem 18. Geburtstag"] });
  K("au10", "ausbildung", "all", 2, "Ein Azubi arbeitet nach bestandener Prüfung einfach weiter, ohne dass etwas vereinbart wurde. Was gilt?",
    "Es entsteht automatisch ein unbefristetes Arbeitsverhältnis (§ 24 BBiG).",
    { mc: ["Ein unbefristetes Arbeitsverhältnis", "Ein auf 6 Monate befristetes Arbeitsverhältnis", "Die Ausbildung verlängert sich um ein Jahr", "Ein Praktikumsverhältnis ohne Vergütung"] });
  K("au11", "ausbildung", "all", 1, "Warum ist der Ausbildungsnachweis (Berichtsheft) wichtig?",
    "Er dokumentiert den Ausbildungsverlauf und ist Voraussetzung für die Zulassung zur Abschluss- bzw. Gesellenprüfung. Der Betrieb muss ihn regelmäßig durchsehen.",
    { mc: ["Er ist Zulassungsvoraussetzung für die Prüfung", "Er ersetzt das Berufsschulzeugnis", "Er ist freiwillig und ohne Bedeutung", "Er dient nur der Lohnabrechnung"] });
  K("au12", "ausbildung", "all", 4, "Mindestausbildungsvergütung: Wie hoch ist sie aktuell (Ausbildungsbeginn im laufenden Jahr)?",
    "{mav} pro Monat. Tarifverträge können höhere Vergütungen vorsehen.",
    { s: 1, src: "ml", mc: ["{mav1} im 1. Ausbildungsjahr", "520 € im 1. Ausbildungsjahr", "13,90 € pro Stunde", "1.200 € im 1. Ausbildungsjahr"] });
  K("au13", "ausbildung", "all", 3, "Welche Voraussetzungen gelten in Bayern, um mit dem Berufsabschluss den mittleren Schulabschluss zu erhalten?",
    "Berufsschulabschluss mit einem Notendurchschnitt von mindestens 3,0, ausreichende Englischkenntnisse (entsprechend fünf Jahren Englischunterricht) und eine erfolgreich abgeschlossene Berufsausbildung.",
    { by: true, k: ["Berufsschulabschluss mit Ø 3,0 oder besser", "Ausreichende Englischkenntnisse", "Bestandene Berufsausbildung"], n: 3 });
  K("au14", "ausbildung", "all", 3, "Nennen Sie 3 Weiterbildungsmöglichkeiten nach der Ausbildung.",
    "Z. B. Meister (Handwerk) oder Industriemeister (IHK), staatlich geprüfter Techniker (Fachschule), Fachoberschule/Berufsoberschule (Fachabitur/Abitur), Studium, Fortbildungen und Lehrgänge. Förderung u. a. über das Aufstiegs-BAföG.",
    { k: ["Meister / Industriemeister", "Staatlich geprüfter Techniker", "FOS/BOS", "Studium", "Fachlehrgänge"], n: 3 });
  K("au15", "ausbildung", "all", 1, "Mit welcher staatlichen Förderung kann man eine Meister- oder Technikerausbildung finanzieren?",
    "Mit dem Aufstiegs-BAföG (früher Meister-BAföG): Zuschüsse und zinsgünstige Darlehen für Lehrgangs- und Prüfungskosten sowie den Lebensunterhalt.",
    { mc: ["Aufstiegs-BAföG", "Kindergeld", "Wohngeld", "Grundsicherungsgeld"] });
  K("au16", "ausbildung", "all", 2, "Welche Funktion hat die Berufsschule im dualen System?",
    "Sie vermittelt berufsbezogene Theorie und allgemeinbildende Inhalte (z. B. Deutsch, PuG/Sozialkunde, Englisch). Berufsschulpflicht besteht in Bayern während der Ausbildung.",
    { by: true, mc: ["Theorie und Allgemeinbildung vermitteln", "Die Abschlussprüfung abnehmen", "Den Ausbildungsvertrag genehmigen", "Die Ausbildungsvergütung zahlen"] });

  // Handwerk
  K("au20", "ausbildung", "hwk", 2, "Wer nimmt im Handwerk die Gesellenprüfung ab?",
    "Der Gesellenprüfungsausschuss der Handwerkskammer bzw. der von ihr ermächtigten Innung. Er besteht aus Arbeitgebern, Arbeitnehmern (Gesellen) und mindestens einer Berufsschullehrkraft.",
    { mc: ["Der Gesellenprüfungsausschuss (Kammer/Innung)", "Die Berufsschule allein", "Der Ausbildungsbetrieb", "Die Agentur für Arbeit"] });
  K("au21", "ausbildung", "hwk", 1, "Was ist die Lehrlingsrolle?",
    "Das Verzeichnis der Ausbildungsverhältnisse bei der Handwerkskammer. Jeder Ausbildungsvertrag im Handwerk muss dort eingetragen werden.",
    { mc: ["Verzeichnis der Ausbildungsverträge bei der Handwerkskammer", "Liste aller Meisterbetriebe", "Stundenplan der Berufsschule", "Mitgliederliste der Gewerkschaft"] });
  K("au22", "ausbildung", "hwk", 4, "Aus welchen 4 Teilen besteht die Meisterprüfung im Handwerk?",
    "Teil I: Fachpraxis, Teil II: Fachtheorie, Teil III: betriebswirtschaftliche, kaufmännische und rechtliche Kenntnisse, Teil IV: berufs- und arbeitspädagogische Kenntnisse (Ausbildereignung).",
    { k: ["I Fachpraxis", "II Fachtheorie", "III Betriebswirtschaft/Recht", "IV Berufs- und Arbeitspädagogik"], n: 4 });
  K("au23", "ausbildung", "hwk", 2, "Welche Voraussetzung braucht man in der Regel für die Zulassung zur Meisterprüfung?",
    "Die bestandene Gesellenprüfung im entsprechenden Handwerk. Berufsjahre als Geselle sind seit der Reform der Handwerksordnung 2004 keine Zulassungsvoraussetzung mehr.",
    { mc: ["Die bestandene Gesellenprüfung", "Mindestens 5 Gesellenjahre", "Das Abitur", "Ein abgeschlossenes Studium"] });
  K("au24", "ausbildung", "hwk", 3, "Wozu berechtigt der Meistertitel? Nennen Sie 3 Punkte.",
    "Selbstständige Führung eines zulassungspflichtigen Handwerksbetriebs (Eintrag in die Handwerksrolle), Ausbilden von Lehrlingen, Hochschulzugang ohne Abitur. Der Meister entspricht DQR-Stufe 6 (wie der Bachelor).",
    { k: ["Betrieb selbstständig führen", "Lehrlinge ausbilden", "Studieren ohne Abitur", "DQR 6 – gleichwertig zum Bachelor"], n: 3 });
  K("au25", "ausbildung", "hwk", 1, "Was ist die Freisprechung im Handwerk?",
    "Die feierliche Übergabe der Gesellenbriefe nach bestandener Gesellenprüfung, meist durch die Innung. Aus dem Lehrling wird der Geselle.",
    { mc: ["Feierliche Übergabe der Gesellenbriefe", "Kündigung in der Probezeit", "Freistellung für die Berufsschule", "Befreiung von der Sozialversicherung"] });

  // IHK
  K("au30", "ausbildung", "ihk", 2, "Wer nimmt in IHK-Berufen die Abschlussprüfung ab?",
    "Der Prüfungsausschuss der Industrie- und Handelskammer. Er besteht aus Arbeitgeber- und Arbeitnehmervertretern sowie mindestens einer Berufsschullehrkraft.",
    { mc: ["Der Prüfungsausschuss der IHK", "Die Berufsschule allein", "Die Handwerkskammer", "Der Ausbildungsbetrieb"] });
  K("au31", "ausbildung", "ihk", 2, "Was bedeutet „gestreckte Abschlussprüfung“?",
    "Die Abschlussprüfung besteht aus Teil 1 (etwa zur Mitte der Ausbildung) und Teil 2 (am Ende). Beide Teile fließen gewichtet in das Gesamtergebnis ein – Teil 1 ist also keine reine Zwischenprüfung.",
    { mc: ["Prüfung in zwei Teilen, die beide in die Endnote zählen", "Eine Prüfung, die über zwei Tage geht", "Eine verlängerte Probezeit", "Eine freiwillige Zusatzprüfung"] });
  K("au32", "ausbildung", "ihk", 1, "Wie heißt das Verzeichnis, in das die IHK Ausbildungsverträge einträgt?",
    "Verzeichnis der Berufsausbildungsverhältnisse.",
    { mc: ["Verzeichnis der Berufsausbildungsverhältnisse", "Handwerksrolle", "Handelsregister", "Lehrlingsrolle"] });
  K("au33", "ausbildung", "ihk", 2, "Nennen Sie 2 IHK-Aufstiegsfortbildungen für technische Berufe.",
    "Z. B. Industriemeister (Geprüfter Industriemeister / Bachelor Professional), Technischer Fachwirt, Technischer Betriebswirt (Master Professional). Alternativ an der Fachschule: Staatlich geprüfter Techniker.",
    { k: ["Industriemeister", "Technischer Fachwirt", "Technischer Betriebswirt", "Staatlich geprüfter Techniker (Fachschule)"], n: 2 });

  /* ───────────── 2. Arbeitsrecht & Arbeitsschutz ───────────── */
  K("ar01", "arbeit", "all", 6, "Nennen Sie 6 Inhalte eines Arbeitsvertrags.",
    "Vertragsparteien, Beginn (bei Befristung: Ende), Tätigkeit, Arbeitsort, Arbeitszeit, Vergütung und Zuschläge, Urlaub, Probezeit, Kündigungsfristen, Hinweis auf Tarifverträge. Die wesentlichen Bedingungen muss der Arbeitgeber schriftlich nachweisen (Nachweisgesetz).",
    { k: ["Vertragsparteien", "Beginn / Befristung", "Tätigkeit", "Arbeitsort", "Arbeitszeit", "Vergütung", "Urlaub", "Probezeit", "Kündigungsfristen", "Tarifverträge"], n: 6 });
  K("ar02", "arbeit", "all", 3, "Nennen Sie 3 Pflichten des Arbeitgebers.",
    "Vergütungspflicht, Beschäftigungspflicht, Fürsorgepflicht (inkl. Arbeitsschutz), Urlaub gewähren, Gleichbehandlung, Zeugnis ausstellen, Sozialversicherungsbeiträge abführen.",
    { k: ["Lohn zahlen", "Beschäftigen", "Fürsorge / Arbeitsschutz", "Urlaub gewähren", "Gleichbehandlung", "Zeugnis ausstellen", "SV-Beiträge abführen"], n: 3 });
  K("ar03", "arbeit", "all", 3, "Nennen Sie 3 Pflichten des Arbeitnehmers.",
    "Arbeitspflicht (persönlich), Weisungen befolgen (Gehorsamspflicht), Treuepflicht, Verschwiegenheit, Sorgfaltspflicht, Wettbewerbsverbot, Anzeige- und Nachweispflicht bei Krankheit.",
    { k: ["Arbeitsleistung", "Weisungen befolgen", "Treuepflicht", "Verschwiegenheit", "Sorgfalt", "Wettbewerbsverbot", "Krankmeldung"], n: 3 });
  K("ar04", "arbeit", "all", 2, "Welche gesetzliche Kündigungsfrist gilt grundsätzlich für Arbeitnehmer?",
    "4 Wochen zum 15. oder zum Ende eines Kalendermonats (§ 622 BGB). Für den Arbeitgeber verlängert sich die Frist mit der Dauer der Betriebszugehörigkeit. In der Probezeit (max. 6 Monate): 2 Wochen.",
    { mc: ["4 Wochen zum 15. oder zum Monatsende", "3 Monate zum Quartalsende", "1 Woche zum Freitag", "6 Monate zum Jahresende"] });
  K("ar05", "arbeit", "all", 1, "In welcher Form muss eine Kündigung erfolgen?",
    "Schriftlich mit eigenhändiger Unterschrift. Eine Kündigung per E-Mail, SMS oder WhatsApp ist unwirksam.",
    { mc: ["Schriftlich mit Unterschrift", "Per E-Mail reicht", "Mündlich vor Zeugen", "Per WhatsApp mit Lesebestätigung"] });
  K("ar06", "arbeit", "all", 3, "Wann gilt das Kündigungsschutzgesetz und welche Kündigungsgründe sind danach zulässig?",
    "Es gilt, wenn der Betrieb mehr als 10 Arbeitnehmer hat und das Arbeitsverhältnis länger als 6 Monate besteht. Eine Kündigung muss dann sozial gerechtfertigt sein: personenbedingt, verhaltensbedingt (meist nach Abmahnung) oder betriebsbedingt (mit Sozialauswahl).",
    { k: ["Mehr als 10 Arbeitnehmer", "Länger als 6 Monate beschäftigt", "Personenbedingt", "Verhaltensbedingt", "Betriebsbedingt"], n: 3 });
  K("ar07", "arbeit", "all", 1, "Innerhalb welcher Frist muss man gegen eine Kündigung Klage beim Arbeitsgericht erheben?",
    "Innerhalb von 3 Wochen nach Zugang der Kündigung.",
    { mc: ["3 Wochen", "3 Tage", "3 Monate", "1 Jahr"] });
  K("ar08", "arbeit", "all", 3, "Welche Personengruppen haben einen besonderen Kündigungsschutz? Nennen Sie 3.",
    "Schwangere und Mütter (Mutterschutz), Beschäftigte in Elternzeit, schwerbehinderte Menschen (Zustimmung des Inklusionsamts), Betriebsrats- und JAV-Mitglieder, Auszubildende nach der Probezeit.",
    { k: ["Schwangere / Mutterschutz", "Elternzeit", "Schwerbehinderte", "Betriebsrat / JAV", "Azubis nach der Probezeit"], n: 3 });
  K("ar09", "arbeit", "all", 1, "Was ist eine Abmahnung?",
    "Eine Rüge des Arbeitgebers wegen eines konkreten Fehlverhaltens mit dem Hinweis, dass im Wiederholungsfall die Kündigung droht. Sie ist meist Voraussetzung für eine verhaltensbedingte Kündigung.",
    { mc: ["Rüge mit Androhung der Kündigung im Wiederholungsfall", "Fristlose Kündigung", "Lohnkürzung um 10 %", "Versetzung in eine andere Abteilung"] });
  K("ar10", "arbeit", "all", 2, "Unterscheiden Sie einfaches und qualifiziertes Arbeitszeugnis.",
    "Einfaches Zeugnis: nur Art und Dauer der Tätigkeit. Qualifiziertes Zeugnis: zusätzlich Leistung und Verhalten – nur auf Wunsch des Arbeitnehmers. Es muss wohlwollend und wahr formuliert sein.",
    { mc: ["Qualifiziert = zusätzlich Leistung und Verhalten", "Einfach = mit Note, qualifiziert = ohne Note", "Qualifiziert gibt es nur für Meister", "Es gibt keinen Unterschied"] });
  K("ar11", "arbeit", "all", 3, "Welche Regeln gelten nach dem Arbeitszeitgesetz für Erwachsene?",
    "Höchstens 8 Stunden werktäglich, Verlängerung auf 10 Stunden möglich, wenn im Durchschnitt (6 Monate/24 Wochen) 8 Stunden nicht überschritten werden. Pausen: 30 Min. bei mehr als 6 Std., 45 Min. bei mehr als 9 Std. Ruhezeit zwischen zwei Arbeitstagen: 11 Stunden.",
    { k: ["Max. 8 Std. werktäglich (bis 10 mit Ausgleich)", "30 Min. Pause bei mehr als 6 Std.", "45 Min. Pause bei mehr als 9 Std.", "11 Std. Ruhezeit"], n: 3 });
  K("ar12", "arbeit", "all", 1, "Wie viele Tage Mindesturlaub haben Erwachsene nach dem Bundesurlaubsgesetz?",
    "24 Werktage (Montag bis Samstag) – das sind 4 Wochen bzw. 20 Arbeitstage bei einer 5-Tage-Woche.",
    { mc: ["24 Werktage", "30 Werktage", "18 Werktage", "36 Werktage"] });
  K("ar13", "arbeit", "all", 4, "Nennen Sie 4 Regelungen des Jugendarbeitsschutzgesetzes.",
    "Gilt unter 18: max. 8 Std. täglich und 40 Std. pro Woche, 5-Tage-Woche, Pausen 30 Min. (über 4,5 Std.) bzw. 60 Min. (über 6 Std.), 12 Std. Freizeit, keine Nachtarbeit (20–6 Uhr), Urlaub 30/27/25 Werktage, ärztliche Erstuntersuchung und Nachuntersuchung nach einem Jahr, keine gefährlichen Arbeiten.",
    { k: ["Max. 8 Std./Tag, 40 Std./Woche", "5-Tage-Woche", "Pausen 30 bzw. 60 Min.", "12 Std. Freizeit", "Keine Nachtarbeit 20–6 Uhr", "Mehr Urlaub (30/27/25)", "Ärztliche Untersuchungen", "Keine gefährlichen Arbeiten"], n: 4 });
  K("ar14", "arbeit", "all", 2, "Wie viel Urlaub steht Jugendlichen zu?",
    "Unter 16 Jahre: 30 Werktage, unter 17: 27 Werktage, unter 18: 25 Werktage – maßgeblich ist das Alter zu Beginn des Kalenderjahres.",
    { mc: ["30 / 27 / 25 Werktage je nach Alter", "Immer 24 Werktage", "20 Arbeitstage", "36 Werktage"] });
  K("ar15", "arbeit", "all", 2, "Wie wird ein Berufsschultag auf die Arbeitszeit angerechnet?",
    "Einmal pro Woche wird ein Berufsschultag mit mehr als 5 Unterrichtsstunden (à 45 Min.) mit der durchschnittlichen täglichen Arbeitszeit angerechnet – danach muss der Azubi nicht mehr in den Betrieb. Das gilt seit 2020 auch für volljährige Azubis.",
    { mc: ["Ein Tag mit mehr als 5 Stunden zählt als voller Arbeitstag", "Berufsschule zählt nicht als Arbeitszeit", "Nur für Azubis unter 16", "Nur die tatsächlichen Stunden zählen"] });
  K("ar16", "arbeit", "all", 2, "Wie lange zahlt der Arbeitgeber bei Krankheit den Lohn weiter?",
    "Bis zu 6 Wochen in voller Höhe (Entgeltfortzahlung). Der Anspruch besteht nach 4 Wochen Beschäftigung. Danach zahlt die Krankenkasse Krankengeld.",
    { mc: ["Bis zu 6 Wochen", "Bis zu 3 Tage", "Bis zu 6 Monate", "Gar nicht – das zahlt die Krankenkasse"] });
  K("ar17", "arbeit", "all", 2, "Was muss ein Arbeitnehmer tun, wenn er krank wird?",
    "Den Arbeitgeber unverzüglich (am ersten Tag) informieren. Dauert die Krankheit länger als 3 Kalendertage, braucht er spätestens am 4. Tag eine ärztliche Arbeitsunfähigkeitsbescheinigung – der Arbeitgeber ruft sie heute elektronisch bei der Krankenkasse ab (eAU). Der Arbeitgeber darf sie auch früher verlangen.",
    { mc: ["Sofort melden, ab dem 4. Tag ärztliche Bescheinigung", "Erst nach einer Woche melden", "Nur der Krankenkasse Bescheid geben", "Nichts – die eAU läuft automatisch ohne Arztbesuch"] });
  K("ar18", "arbeit", "all", 2, "Wie lange gilt der Mutterschutz rund um die Geburt?",
    "6 Wochen vor und 8 Wochen nach der Geburt (bei Früh- oder Mehrlingsgeburten 12 Wochen). Während der Schwangerschaft bis 4 Monate nach der Geburt besteht besonderer Kündigungsschutz.",
    { mc: ["6 Wochen vor und 8 Wochen nach der Geburt", "3 Monate vor und 3 Monate nach der Geburt", "Nur 2 Wochen nach der Geburt", "1 Jahr nach der Geburt"] });
  K("ar19", "arbeit", "all", 1, "Wie lange können Eltern Elternzeit nehmen?",
    "Bis zu 3 Jahre pro Kind, aufteilbar zwischen beiden Elternteilen. In dieser Zeit besteht Kündigungsschutz.",
    { mc: ["Bis zu 3 Jahre pro Kind", "Bis zu 6 Monate", "Bis zum 18. Geburtstag des Kindes", "Nur 14 Wochen"] });
  K("ar20", "arbeit", "all", 3, "Nennen Sie den Instanzenweg der Arbeitsgerichtsbarkeit.",
    "Arbeitsgericht → Landesarbeitsgericht → Bundesarbeitsgericht (Erfurt). In der ersten Instanz besteht kein Anwaltszwang; jede Partei trägt ihre Anwaltskosten selbst.",
    { k: ["Arbeitsgericht", "Landesarbeitsgericht", "Bundesarbeitsgericht"], n: 3 });
  K("ar21", "arbeit", "all", 2, "Wer überwacht den Arbeitsschutz in den Betrieben?",
    "Staatlich das Gewerbeaufsichtsamt (Arbeitsschutzbehörde), zusätzlich die Berufsgenossenschaften (Unfallverhütungsvorschriften). Im Betrieb unterstützen Fachkraft für Arbeitssicherheit, Sicherheitsbeauftragte, Betriebsarzt und Betriebsrat.",
    { k: ["Gewerbeaufsichtsamt", "Berufsgenossenschaft"], n: 2 });
  K("ar22", "arbeit", "all", 4, "Was bedeuten die Farben der Sicherheitszeichen?",
    "Rot: Verbot bzw. Brandschutz. Gelb: Warnung vor einer Gefahr. Blau: Gebot (z. B. Helm tragen). Grün: Rettung und Erste Hilfe.",
    { k: ["Rot = Verbot/Brandschutz", "Gelb = Warnung", "Blau = Gebot", "Grün = Rettung/Erste Hilfe"], n: 4,
      mc: ["Blau = Gebot (z. B. Gehörschutz tragen)", "Blau = Warnung vor Gefahr", "Blau = Rettungsweg", "Blau = Verbot"] });
  K("ar23", "arbeit", "all", 2, "Was ist ein Wegeunfall und wer kommt dafür auf?",
    "Ein Unfall auf dem direkten Weg zwischen Wohnung und Arbeitsplatz bzw. Berufsschule. Er gilt wie ein Arbeitsunfall – zuständig ist die gesetzliche Unfallversicherung (Berufsgenossenschaft). Behandlung beim Durchgangsarzt (D-Arzt).",
    { mc: ["Unfall auf dem Arbeitsweg – zahlt die Berufsgenossenschaft", "Unfall in der Freizeit – zahlt die Krankenkasse", "Unfall im Urlaub – zahlt der Arbeitgeber", "Jeder Verkehrsunfall – zahlt die Rentenversicherung"] });
  K("ar24", "arbeit", "all", 1, "Wie hoch ist der gesetzliche Mindestlohn aktuell?",
    "{mindestlohn} brutto pro Stunde ({mindestlohnNext}). Er gilt nicht für Auszubildende – für sie gilt die Mindestausbildungsvergütung.",
    { s: 1, src: "ml", mc: ["{mindestlohn}", "12,82 €", "15,00 €", "12,41 €"] });

  K("ar30", "arbeit", "hwk", 2, "Ein Klempner arbeitet auf dem Dach. Welche Pflichten hat der Betrieb beim Arbeitsschutz?",
    "Gefährdungsbeurteilung erstellen, Absturzsicherungen (Gerüst, Seitenschutz, Fangnetz) bzw. persönliche Schutzausrüstung gegen Absturz bereitstellen, Beschäftigte unterweisen und die Unfallverhütungsvorschriften der Berufsgenossenschaft (z. B. BG BAU) einhalten.",
    { k: ["Gefährdungsbeurteilung", "Absturzsicherung / PSA", "Unterweisung", "Unfallverhütungsvorschriften"], n: 2 });

  /* ───────────── 3. Lohn, Steuern & Sozialversicherung ───────────── */
  K("so01", "sozial", "all", 5, "Nennen Sie die 5 Zweige der gesetzlichen Sozialversicherung.",
    "Krankenversicherung, Pflegeversicherung, Rentenversicherung, Arbeitslosenversicherung, Unfallversicherung.",
    { k: ["Krankenversicherung", "Pflegeversicherung", "Rentenversicherung", "Arbeitslosenversicherung", "Unfallversicherung"], n: 5 });
  K("so02", "sozial", "all", 5, "Ordnen Sie den 5 Sozialversicherungen ihre Träger zu.",
    "Krankenversicherung: Krankenkassen (z. B. AOK, TK). Pflegeversicherung: Pflegekassen (bei den Krankenkassen). Rentenversicherung: Deutsche Rentenversicherung. Arbeitslosenversicherung: Bundesagentur für Arbeit. Unfallversicherung: Berufsgenossenschaften und Unfallkassen.",
    { k: ["KV → Krankenkassen", "PV → Pflegekassen", "RV → Deutsche Rentenversicherung", "ALV → Bundesagentur für Arbeit", "UV → Berufsgenossenschaften"], n: 5,
      mc: ["Unfallversicherung → Berufsgenossenschaft", "Unfallversicherung → Krankenkasse", "Unfallversicherung → Bundesagentur für Arbeit", "Unfallversicherung → Finanzamt"] });
  K("so03", "sozial", "all", 2, "Wer zahlt die Beiträge zur Sozialversicherung?",
    "Kranken-, Pflege-, Renten- und Arbeitslosenversicherung zahlen Arbeitgeber und Arbeitnehmer grundsätzlich je zur Hälfte (Ausnahme: den Kinderlosenzuschlag in der Pflege trägt der Arbeitnehmer allein). Die Unfallversicherung zahlt der Arbeitgeber allein.",
    { mc: ["Die Unfallversicherung zahlt der Arbeitgeber allein", "Alle Beiträge zahlt der Arbeitnehmer allein", "Alle Beiträge zahlt der Staat", "Die Rentenversicherung zahlt der Arbeitgeber allein"] });
  K("so04", "sozial", "all", 4, "Wie hoch sind die aktuellen Beitragssätze zur Sozialversicherung?",
    "Krankenversicherung {kv} plus Zusatzbeitrag der Kasse (Durchschnitt {kvZusatz}), Pflegeversicherung {pv} (Kinderlose ab 23 zusätzlich {pvKinderlos}), Rentenversicherung {rv}, Arbeitslosenversicherung {alv}. Unfallversicherung: je nach Branche/Gefahrklasse.",
    { s: 1, src: "sv", k: ["KV {kv} + Ø {kvZusatz} Zusatzbeitrag", "PV {pv} (+{pvKinderlos} kinderlos ab 23)", "RV {rv}", "ALV {alv}"], n: 4,
      mc: ["Rentenversicherung {rv}", "Rentenversicherung 9,3 %", "Rentenversicherung 24,0 %", "Rentenversicherung 14,6 %"] });
  K("so05", "sozial", "all", 2, "Erklären Sie den Unterschied zwischen Brutto- und Nettolohn.",
    "Bruttolohn ist der vereinbarte Lohn vor Abzügen. Nettolohn ist der ausgezahlte Betrag nach Abzug von Lohnsteuer (ggf. Solidaritätszuschlag und Kirchensteuer) und den Arbeitnehmeranteilen zur Sozialversicherung.",
    { mc: ["Netto = Brutto minus Steuern und SV-Anteile des Arbeitnehmers", "Netto = Brutto plus Arbeitgeberanteil", "Netto = Brutto minus Mehrwertsteuer", "Netto und Brutto sind bei Azubis gleich"] });
  K("so06", "sozial", "all", 4, "Welche Abzüge hat ein Arbeitnehmer von seinem Bruttolohn? Nennen Sie 4.",
    "Lohnsteuer, Solidaritätszuschlag (nur bei hohen Einkommen), Kirchensteuer (bei Kirchenmitgliedern; in Bayern 8 % der Lohnsteuer), Arbeitnehmeranteile zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung.",
    { k: ["Lohnsteuer", "Solidaritätszuschlag", "Kirchensteuer", "Krankenversicherung", "Pflegeversicherung", "Rentenversicherung", "Arbeitslosenversicherung"], n: 4 });
  K("so07", "sozial", "all", 4, "Rechenaufgabe: Ein 19-jähriger Azubi erhält 1.000 € brutto (Steuerklasse I, keine Lohnsteuer, Krankenkasse mit 2,9 % Zusatzbeitrag). Wie hoch ist sein Nettolohn?",
    "Arbeitnehmeranteile: KV 7,3 % + 1,45 % = 8,75 % → 87,50 €; PV 1,8 % → 18,00 € (unter 23, daher kein Kinderlosenzuschlag); RV 9,3 % → 93,00 €; ALV 1,3 % → 13,00 €. Summe 211,50 €. Nettolohn: 1.000 € − 211,50 € = 788,50 €.",
    { s: 1, mc: ["788,50 €", "854,00 €", "700,00 €", "811,50 €"] });
  K("so08", "sozial", "all", 2, "Was gilt bei sehr niedriger Ausbildungsvergütung für die Sozialversicherungsbeiträge?",
    "Liegt die Vergütung bei höchstens 325 € im Monat (Geringverdienergrenze), trägt der Arbeitgeber die Sozialversicherungsbeiträge allein.",
    { mc: ["Bis 325 € zahlt der Arbeitgeber alles allein", "Bis 325 € fallen keine Beiträge an", "Bis 538 € zahlt der Staat die Beiträge", "Azubis sind nie sozialversichert"] });
  K("so09", "sozial", "all", 3, "Erklären Sie das Solidaritätsprinzip am Beispiel der gesetzlichen Krankenversicherung.",
    "Die Beiträge richten sich nach dem Einkommen, die Leistungen nach dem Bedarf. Gesunde zahlen für Kranke, Gutverdienende für Geringverdienende, Singles für Familien (Familienversicherung).",
    { k: ["Beitrag nach Einkommen", "Leistung nach Bedarf", "Starke tragen Schwache"], n: 2,
      mc: ["Beitrag nach Einkommen, Leistung nach Bedarf", "Beitrag nach Risiko, Leistung nach Beitrag", "Jeder zahlt den gleichen Betrag", "Nur wer krank ist, zahlt Beiträge"] });
  K("so10", "sozial", "all", 2, "Was versteht man unter dem Generationenvertrag?",
    "Die gesetzliche Rente wird im Umlageverfahren finanziert: Die heute Beschäftigten zahlen mit ihren Beiträgen die Renten der heutigen Rentner und erwerben dadurch selbst Rentenansprüche.",
    { mc: ["Die Erwerbstätigen finanzieren die Renten der heutigen Rentner", "Jeder spart seine Rente auf einem eigenen Konto an", "Kinder müssen ihre Eltern im Alter pflegen", "Der Staat zahlt alle Renten aus Steuern"] });
  K("so11", "sozial", "all", 3, "Erklären Sie das Drei-Säulen-Modell der Altersvorsorge.",
    "1. Säule: gesetzliche Rentenversicherung. 2. Säule: betriebliche Altersvorsorge (z. B. Entgeltumwandlung). 3. Säule: private Vorsorge (z. B. Sparpläne, private Rentenversicherung, Wohneigentum).",
    { k: ["Gesetzliche Rente", "Betriebliche Altersvorsorge", "Private Vorsorge"], n: 3 });
  K("so12", "sozial", "all", 2, "Warum gerät die gesetzliche Rentenversicherung unter Druck?",
    "Demografischer Wandel: Die Menschen leben länger (längere Rentenbezugsdauer) und es werden weniger Kinder geboren. Immer weniger Beitragszahler finanzieren immer mehr Rentner.",
    { mc: ["Weniger Beitragszahler finanzieren mehr Rentner", "Die Beiträge sind zu hoch", "Es gibt zu viele Azubis", "Die Renten werden aus der Kfz-Steuer bezahlt"] });
  K("so13", "sozial", "all", 4, "Nennen Sie 4 Leistungen der Krankenversicherung.",
    "Ärztliche und zahnärztliche Behandlung, Arznei- und Hilfsmittel, Krankenhausbehandlung, Krankengeld (nach der Entgeltfortzahlung), Vorsorge und Früherkennung, Reha-Maßnahmen, Mutterschaftsgeld.",
    { k: ["Arztbehandlung", "Medikamente/Hilfsmittel", "Krankenhaus", "Krankengeld", "Vorsorge", "Reha"], n: 4 });
  K("so14", "sozial", "all", 2, "Wie hoch ist das Krankengeld?",
    "70 % des Bruttoarbeitsentgelts, höchstens 90 % des Nettoentgelts. Es wird nach Ende der 6-wöchigen Entgeltfortzahlung von der Krankenkasse gezahlt, für dieselbe Krankheit maximal 78 Wochen innerhalb von 3 Jahren.",
    { mc: ["70 % vom Brutto, max. 90 % vom Netto", "100 % vom Netto", "60 % vom Netto", "50 % vom Brutto"] });
  K("so15", "sozial", "all", 2, "Ist die Krankenkasse für einen Arbeitsunfall zuständig?",
    "Nein. Für Arbeitsunfälle, Wegeunfälle und Berufskrankheiten ist die gesetzliche Unfallversicherung zuständig – also die Berufsgenossenschaft bzw. Unfallkasse.",
    { mc: ["Nein, die Berufsgenossenschaft", "Ja, immer die Krankenkasse", "Nein, die Rentenversicherung", "Nein, der Arbeitnehmer selbst"] });
  K("so16", "sozial", "all", 4, "Nennen Sie 4 Leistungen der Arbeitslosenversicherung.",
    "Arbeitslosengeld I, Kurzarbeitergeld, Insolvenzgeld, Arbeitsvermittlung, Berufsberatung, Förderung der beruflichen Weiterbildung, Berufsausbildungsbeihilfe.",
    { k: ["Arbeitslosengeld I", "Kurzarbeitergeld", "Insolvenzgeld", "Arbeitsvermittlung", "Berufsberatung", "Weiterbildungsförderung"], n: 4 });
  K("so17", "sozial", "all", 3, "Wie hoch ist das Arbeitslosengeld I und wann bekommt man es?",
    "60 % des pauschalierten Nettoentgelts, mit Kind 67 %. Voraussetzung: in den letzten 30 Monaten mindestens 12 Monate versicherungspflichtig beschäftigt, arbeitslos gemeldet und verfügbar. Bezugsdauer je nach Alter und Beitragszeit 6 bis 24 Monate.",
    { k: ["60 % / 67 % mit Kind", "12 Monate Beiträge in 30 Monaten", "Arbeitslos gemeldet"], n: 2,
      mc: ["60 % (mit Kind 67 %) des Nettoentgelts", "100 % des letzten Nettolohns", "Fester Betrag von 563 €", "70 % des Bruttolohns"] });
  K("so18", "sozial", "all", 2, "Wann muss man sich arbeitssuchend melden?",
    "Spätestens 3 Monate vor Ende des Arbeitsverhältnisses; erfährt man es kurzfristiger, innerhalb von 3 Tagen. Sonst droht eine Sperrzeit beim Arbeitslosengeld.",
    { mc: ["Spätestens 3 Monate vorher bzw. innerhalb von 3 Tagen", "Erst am ersten Tag ohne Arbeit", "Innerhalb eines Jahres", "Gar nicht – das macht der Arbeitgeber"] });
  K("so19", "sozial", "all", 2, "Wie heißt die Grundsicherung für Arbeitsuchende und was ist sie?",
    "Die steuerfinanzierte Grundsicherung für erwerbsfähige Arbeitsuchende über das Jobcenter: {grundsicherung}. Anders als das Arbeitslosengeld I ist sie keine Versicherungsleistung, sondern hängt von der Bedürftigkeit ab.",
    { s: 1, src: "gs", mc: ["Steuerfinanzierte Grundsicherung über das Jobcenter", "Eine Leistung der Rentenversicherung", "Das Gehalt im öffentlichen Dienst", "Ein Zuschuss zur Meisterausbildung"] });
  K("so20", "sozial", "all", 3, "Nennen Sie 3 Leistungen der gesetzlichen Unfallversicherung.",
    "Prävention (Unfallverhütung), Heilbehandlung und Rehabilitation, Verletztengeld, Umschulung, Unfallrente bei bleibenden Schäden, Hinterbliebenenrente.",
    { k: ["Unfallverhütung", "Heilbehandlung/Reha", "Verletztengeld", "Umschulung", "Unfallrente"], n: 3 });
  K("so21", "sozial", "all", 2, "Nennen Sie 2 Leistungen der Pflegeversicherung.",
    "Pflegegeld (bei Pflege durch Angehörige), Pflegesachleistungen (ambulanter Pflegedienst), stationäre Pflege im Heim, Hilfsmittel, Tages- und Kurzzeitpflege. Der Umfang richtet sich nach dem Pflegegrad (1–5).",
    { k: ["Pflegegeld", "Pflegesachleistung", "Stationäre Pflege", "Hilfsmittel", "Kurzzeitpflege"], n: 2 });
  K("so22", "sozial", "all", 1, "Ab wann gilt die Regelaltersgrenze von 67 Jahren?",
    "Für alle, die 1964 oder später geboren sind. Für ältere Jahrgänge steigt die Grenze schrittweise von 65 auf 67.",
    { mc: ["Für Jahrgänge ab 1964", "Für alle schon seit 2000", "Für Jahrgänge ab 1990", "Sie gilt nur für Beamte"] });
  K("so23", "sozial", "all", 2, "Unterscheiden Sie Sozialversicherung und Sozialhilfe nach ihrer Finanzierung.",
    "Sozialversicherung: über Beiträge von Arbeitnehmern und Arbeitgebern (Versicherungsprinzip). Sozialhilfe und Grundsicherung: aus Steuern, nur bei Bedürftigkeit (Fürsorgeprinzip, nachrangig = Subsidiaritätsprinzip).",
    { mc: ["Versicherung über Beiträge, Sozialhilfe über Steuern", "Beide nur über Steuern", "Beide nur über Beiträge", "Sozialhilfe zahlt der Arbeitgeber"] });
  K("so24", "sozial", "all", 2, "Wozu dienen Steuer-ID und Sozialversicherungsnummer?",
    "Die Steuer-Identifikationsnummer (vom Bundeszentralamt für Steuern) braucht der Arbeitgeber für den Lohnsteuerabzug. Die Sozialversicherungsnummer (von der Rentenversicherung) dient der Zuordnung der Beiträge und Rentenansprüche. Beide gelten lebenslang.",
    { mc: ["Für Lohnsteuerabzug bzw. Zuordnung der SV-Beiträge", "Beide sind die Personalausweisnummer", "Sie werden jedes Jahr neu vergeben", "Sie braucht man nur im Ruhestand"] });
  K("so25", "sozial", "all", 2, "Warum lohnt sich für Azubis eine Einkommensteuererklärung oft?",
    "Weil zu viel gezahlte Lohnsteuer erstattet werden kann, z. B. durch Werbungskosten wie Fahrtkosten, Arbeitskleidung, Fachbücher. Der Arbeitnehmer-Pauschbetrag beträgt 1.230 € im Jahr.",
    { mc: ["Zu viel gezahlte Lohnsteuer kann zurückkommen", "Sie ist für Azubis verboten", "Man bekommt die SV-Beiträge zurück", "Nur so erhält man den Gesellenbrief"] });
  K("so26", "sozial", "all", 1, "Was bedeutet „progressiver Steuertarif“?",
    "Mit steigendem Einkommen steigt der Steuersatz. Wer mehr verdient, zahlt prozentual mehr Steuern. Bis zum Grundfreibetrag fällt keine Einkommensteuer an.",
    { mc: ["Höheres Einkommen → höherer Steuersatz", "Alle zahlen den gleichen Prozentsatz", "Höheres Einkommen → niedrigerer Steuersatz", "Steuern steigen jedes Jahr automatisch"] });

  /* ───────────── 4. Mitbestimmung im Betrieb ───────────── */
  K("mb01", "mitbest", "all", 2, "Ab wie vielen Arbeitnehmern kann ein Betriebsrat gewählt werden?",
    "In Betrieben mit mindestens 5 ständigen wahlberechtigten Arbeitnehmern, von denen 3 wählbar sind (Betriebsverfassungsgesetz).",
    { mc: ["Ab 5 wahlberechtigten Arbeitnehmern", "Ab 20 Arbeitnehmern", "Ab 50 Arbeitnehmern", "Ab 500 Arbeitnehmern"] });
  K("mb02", "mitbest", "all", 2, "Wer darf den Betriebsrat wählen und wer kann gewählt werden?",
    "Wählen dürfen alle Arbeitnehmer ab 16 Jahren (einschließlich Azubis). Wählbar ist, wer mindestens 18 ist und dem Betrieb seit 6 Monaten angehört. Gewählt wird alle 4 Jahre.",
    { mc: ["Wählen ab 16, wählbar ab 18 nach 6 Monaten", "Wählen und wählbar erst ab 21", "Nur Meister dürfen wählen", "Wählen ab 18, wählbar ab 25"] });
  K("mb03", "mitbest", "all", 3, "Unterscheiden Sie Mitbestimmungs-, Mitwirkungs- und Informationsrechte des Betriebsrats mit je einem Beispiel.",
    "Mitbestimmung (ohne Zustimmung keine Entscheidung): z. B. Beginn und Ende der Arbeitszeit, Pausen, Urlaubsplan, Überstunden, Betriebsordnung, Kameraüberwachung. Mitwirkung (Anhörung, Widerspruch): z. B. Einstellungen, Versetzungen, Kündigungen. Information: z. B. wirtschaftliche Lage, Personalplanung, Bauvorhaben.",
    { k: ["Mitbestimmung: z. B. Arbeitszeit, Urlaubsplan", "Mitwirkung: z. B. Kündigung, Einstellung", "Information: z. B. wirtschaftliche Lage"], n: 3 });
  K("mb04", "mitbest", "all", 2, "Was passiert, wenn der Arbeitgeber vor einer Kündigung den Betriebsrat nicht anhört?",
    "Die Kündigung ist unwirksam (§ 102 BetrVG). Der Betriebsrat kann die Kündigung zwar nicht verhindern, muss aber vorher angehört werden.",
    { mc: ["Die Kündigung ist unwirksam", "Der Arbeitgeber zahlt ein Bußgeld, die Kündigung gilt", "Nichts – die Anhörung ist freiwillig", "Der Betriebsrat wird aufgelöst"] });
  K("mb05", "mitbest", "all", 1, "In welcher Angelegenheit hat der Betriebsrat ein echtes Mitbestimmungsrecht?",
    "Z. B. bei der Lage der Arbeitszeit und Pausen, Urlaubsgrundsätzen, Überstunden, technischen Überwachungseinrichtungen, Fragen der Ordnung im Betrieb.",
    { mc: ["Festlegung von Beginn und Ende der täglichen Arbeitszeit", "Kauf einer neuen Maschine", "Höhe des Gewinns", "Wahl des Geschäftsführers"] });
  K("mb06", "mitbest", "all", 1, "Was ist eine Betriebsvereinbarung?",
    "Ein schriftlicher Vertrag zwischen Arbeitgeber und Betriebsrat, der für alle Beschäftigten des Betriebs gilt, z. B. zu Arbeitszeit oder Homeoffice.",
    { mc: ["Vertrag zwischen Arbeitgeber und Betriebsrat", "Vertrag zwischen Gewerkschaft und Arbeitgeberverband", "Der Arbeitsvertrag eines Einzelnen", "Ein Gesetz des Bundestages"] });
  K("mb07", "mitbest", "all", 3, "Unter welchen Voraussetzungen wird eine Jugend- und Auszubildendenvertretung (JAV) gewählt?",
    "Im Betrieb gibt es einen Betriebsrat und mindestens 5 Arbeitnehmer, die unter 18 Jahre alt sind oder eine Ausbildung machen (Azubis unabhängig vom Alter, seit 2021). Wählbar sind Beschäftigte unter 25 Jahren sowie alle Auszubildenden. Die Amtszeit beträgt 2 Jahre.",
    { k: ["Betriebsrat vorhanden", "Mind. 5 Jugendliche (unter 18) oder Azubis", "Amtszeit 2 Jahre"], n: 3,
      mc: ["Mind. 5 Jugendliche/Azubis und ein Betriebsrat", "Ab 1 Azubi im Betrieb", "Nur in Betrieben über 500 Beschäftigten", "Nur, wenn die Kammer zustimmt"] });
  K("mb08", "mitbest", "all", 2, "Welche Aufgaben hat die JAV? Nennen Sie 2.",
    "Interessen der Jugendlichen und Azubis gegenüber dem Betriebsrat vertreten, auf die Einhaltung von Gesetzen und Tarifverträgen (z. B. JArbSchG) achten, Anregungen und Beschwerden weitergeben, sich für Übernahme und gute Ausbildung einsetzen.",
    { k: ["Interessen vertreten", "Einhaltung von Gesetzen überwachen", "Beschwerden weitergeben", "Übernahme fördern"], n: 2 });
  K("mb09", "mitbest", "all", 1, "Wie oft muss eine Betriebsversammlung stattfinden?",
    "Einmal im Kalendervierteljahr; der Betriebsrat berichtet dort über seine Tätigkeit.",
    { mc: ["Einmal pro Vierteljahr", "Einmal pro Woche", "Alle 4 Jahre", "Nur bei Kündigungen"] });

  K("mb20", "mitbest", "ihk", 2, "Wie sind Arbeitnehmer im Aufsichtsrat großer Kapitalgesellschaften vertreten?",
    "Drittelbeteiligungsgesetz: bei 501 bis 2.000 Beschäftigten ein Drittel der Sitze. Mitbestimmungsgesetz: bei mehr als 2.000 Beschäftigten die Hälfte (paritätisch); bei Stimmengleichheit entscheidet die Zweitstimme des Vorsitzenden (Anteilseignerseite).",
    { mc: ["Bei mehr als 2.000 Beschäftigten paritätisch (Hälfte)", "Ab 5 Beschäftigten die Mehrheit", "Gar nicht – nur der Betriebsrat", "Ab 100 Beschäftigten ein Sitz"] });
  K("mb21", "mitbest", "ihk", 3, "Nennen Sie die 3 Organe einer Aktiengesellschaft und ihre Aufgabe.",
    "Vorstand: leitet die AG. Aufsichtsrat: bestellt und überwacht den Vorstand. Hauptversammlung: Versammlung der Aktionäre, wählt (Teile des) Aufsichtsrat(s), entscheidet über die Gewinnverwendung.",
    { k: ["Vorstand – leitet", "Aufsichtsrat – überwacht", "Hauptversammlung – Aktionäre"], n: 3 });

  /* ───────────── 5. Tarifrecht & Arbeitsmarkt ───────────── */
  K("ta01", "tarif", "all", 2, "Was versteht man unter Tarifautonomie?",
    "Gewerkschaften und Arbeitgeber(verbände) handeln Löhne und Arbeitsbedingungen selbstständig ohne Einmischung des Staates aus. Grundlage ist die Koalitionsfreiheit in Art. 9 Abs. 3 Grundgesetz.",
    { mc: ["Tarifparteien verhandeln ohne staatliche Einmischung", "Der Staat legt alle Löhne fest", "Jeder verhandelt seinen Lohn allein", "Der Betriebsrat legt die Löhne fest"] });
  K("ta02", "tarif", "all", 2, "Wer sind die Tarifvertragsparteien?",
    "Auf Arbeitnehmerseite die Gewerkschaften (z. B. IG Metall), auf Arbeitgeberseite Arbeitgeberverbände oder einzelne Arbeitgeber (Haus-/Firmentarifvertrag). Im Handwerk können auch Innungen und Innungsverbände Tarifverträge schließen.",
    { mc: ["Gewerkschaften und Arbeitgeberverbände", "Betriebsrat und Geschäftsführung", "Bundestag und Bundesrat", "Kammer und Berufsschule"] });
  K("ta03", "tarif", "all", 3, "Nennen und unterscheiden Sie die Arten von Tarifverträgen.",
    "Lohn-/Entgelttarifvertrag: regelt die Höhe der Löhne, kurze Laufzeit (ca. 1–2 Jahre). Rahmentarifvertrag: Lohngruppen und Eingruppierung. Manteltarifvertrag: allgemeine Arbeitsbedingungen wie Arbeitszeit, Urlaub, Zuschläge, Kündigungsfristen – längere Laufzeit.",
    { k: ["Lohn-/Entgelttarifvertrag", "Rahmentarifvertrag", "Manteltarifvertrag"], n: 2,
      mc: ["Manteltarifvertrag: Arbeitszeit, Urlaub, Zuschläge", "Manteltarifvertrag: nur die Lohnhöhe", "Manteltarifvertrag: Vertrag mit dem Betriebsrat", "Manteltarifvertrag: Ausbildungsvertrag"] });
  K("ta04", "tarif", "all", 1, "Was bedeutet Friedenspflicht?",
    "Während der Laufzeit eines Tarifvertrags sind Arbeitskämpfe (Streiks, Aussperrungen) über die darin geregelten Punkte verboten.",
    { mc: ["Kein Streik während der Laufzeit des Tarifvertrags", "Streiks nur am Wochenende", "Pflicht zur Teilnahme an Demonstrationen", "Verbot von Betriebsratswahlen"] });
  K("ta05", "tarif", "all", 1, "Was besagt das Günstigkeitsprinzip?",
    "Vom Tarifvertrag darf nur zugunsten des Arbeitnehmers abgewichen werden – z. B. durch einen höheren Lohn im Arbeitsvertrag.",
    { mc: ["Abweichungen nur zugunsten des Arbeitnehmers", "Der Arbeitgeber darf immer weniger zahlen", "Es gilt die für den Betrieb günstigste Regel", "Der günstigste Bewerber wird eingestellt"] });
  K("ta06", "tarif", "all", 2, "Für wen gilt ein Tarifvertrag? Was ist eine Allgemeinverbindlicherklärung?",
    "Rechtlich gilt er nur für Mitglieder der Tarifparteien (tarifgebundene Arbeitgeber und Gewerkschaftsmitglieder). Viele Arbeitgeber wenden ihn aber für alle an. Durch die Allgemeinverbindlicherklärung des Bundesarbeitsministeriums gilt er für alle Betriebe der Branche.",
    { mc: ["Allgemeinverbindlich = gilt für die ganze Branche", "Allgemeinverbindlich = gilt nur für Gewerkschaftsmitglieder", "Allgemeinverbindlich = gilt für ganz Europa", "Allgemeinverbindlich = gilt nur für Azubis"] });
  K("ta07", "tarif", "all", 5, "Beschreiben Sie den Ablauf einer Tarifauseinandersetzung.",
    "Kündigung des Tarifvertrags → Forderungen und Verhandlungen (Warnstreiks möglich) → Scheitern der Verhandlungen → ggf. Schlichtung → Urabstimmung (mind. 75 % der Mitglieder für Streik) → Streik, ggf. Aussperrung → neue Verhandlungen und Einigung → zweite Urabstimmung (mind. 25 % für das Ergebnis) → neuer Tarifvertrag mit Friedenspflicht.",
    { k: ["Kündigung des Tarifvertrags", "Verhandlungen / Warnstreik", "Schlichtung", "Urabstimmung (75 %)", "Streik / Aussperrung", "Einigung + 2. Urabstimmung (25 %)", "Neuer Tarifvertrag"], n: 5 });
  K("ta08", "tarif", "all", 2, "Wie nennt man die Abstimmung der Gewerkschaftsmitglieder über einen Streik und welche Zustimmung ist meist nötig?",
    "Urabstimmung; nach den Satzungen großer Gewerkschaften wie IG Metall müssen mindestens 75 % der abstimmenden Mitglieder zustimmen.",
    { mc: ["Urabstimmung – mind. 75 %", "Volksentscheid – mind. 50 %", "Betriebsversammlung – mind. 25 %", "Schlichtung – mind. 100 %"] });
  K("ta09", "tarif", "all", 2, "Was ist ein Warnstreik und wann ist er erlaubt?",
    "Ein kurzer, befristeter Streik, um während laufender Verhandlungen Druck aufzubauen. Er ist erst nach Ablauf der Friedenspflicht zulässig und benötigt keine Urabstimmung.",
    { mc: ["Kurzer Streik nach Ende der Friedenspflicht, ohne Urabstimmung", "Streik während der Laufzeit des Tarifvertrags", "Unbefristeter Streik nach Urabstimmung", "Eine Warnung des Arbeitgebers vor Kündigung"] });
  K("ta10", "tarif", "all", 2, "Wer darf streiken und wer bekommt Streikgeld?",
    "Streiken dürfen Arbeitnehmer, wenn eine Gewerkschaft zum Streik aufruft (keine „wilden“ Streiks) – auch Nichtmitglieder, die dann aber keinen Lohn und kein Streikgeld erhalten. Streikgeld zahlt die Gewerkschaft nur ihren Mitgliedern. Beamte dürfen nicht streiken.",
    { mc: ["Streikgeld erhalten nur Gewerkschaftsmitglieder", "Streikgeld zahlt der Arbeitgeber", "Streikgeld zahlt die Arbeitsagentur", "Beamte erhalten das höchste Streikgeld"] });
  K("ta11", "tarif", "all", 1, "Wie nennt man es, wenn Arbeitgeber die Belegschaft von der Arbeit und vom Lohn ausschließen?",
    "Aussperrung – das Kampfmittel der Arbeitgeberseite.",
    { mc: ["Aussperrung", "Abmahnung", "Kurzarbeit", "Freistellung"] });
  K("ta12", "tarif", "all", 4, "Nennen und erklären Sie 4 Arten der Arbeitslosigkeit.",
    "Konjunkturell (wirtschaftlicher Abschwung), strukturell (Wandel von Branchen/Technik, z. B. Automatisierung), saisonal (jahreszeitlich, z. B. Bau im Winter), friktionell (kurz beim Jobwechsel).",
    { k: ["Konjunkturell", "Strukturell", "Saisonal", "Friktionell"], n: 4,
      mc: ["Saisonal – z. B. weniger Bauarbeit im Winter", "Saisonal – durch Automatisierung", "Saisonal – beim kurzen Jobwechsel", "Saisonal – durch eine Wirtschaftskrise"] });
  K("ta13", "tarif", "all", 1, "Wodurch kann die Arbeitslosigkeit innerhalb eines Jahres stark ansteigen?",
    "Durch einen Konjunktureinbruch, z. B. Wirtschaftskrise, Pandemie, Energiekrise oder Handelskonflikte, die Nachfrage und Produktion senken.",
    { mc: ["Durch einen Konjunktureinbruch", "Durch mehr Feiertage", "Durch höhere Ausbildungsvergütungen", "Durch die Betriebsratswahl"] });
  K("ta14", "tarif", "all", 2, "Was ist Kurzarbeit und wie hoch ist das Kurzarbeitergeld?",
    "Bei vorübergehendem erheblichem Arbeitsausfall wird die Arbeitszeit verkürzt, statt zu kündigen. Die Agentur für Arbeit zahlt 60 % (mit Kind 67 %) des ausgefallenen Nettoentgelts. Der Arbeitgeber muss die Kurzarbeit anzeigen.",
    { mc: ["60 % bzw. 67 % des ausgefallenen Nettoentgelts", "100 % des Bruttolohns", "Ein fester Betrag von 500 €", "30 % des Nettolohns"] });
  K("ta15", "tarif", "all", 1, "Wie lange kann Kurzarbeitergeld bezogen werden?",
    "{kugDauer}",
    { s: 1, src: "aa", mc: ["Regulär 12 Monate, per Verordnung verlängerbar auf 24", "Unbegrenzt", "Maximal 6 Wochen", "Genau 3 Jahre"] });
  K("ta16", "tarif", "all", 1, "Wie viele Einwohner und Erwerbstätige hat Deutschland ungefähr?",
    "{einwohner} Einwohner, davon {erwerbstaetige} Erwerbstätige.",
    { s: 1, src: "destatis", mc: ["ca. 83 Mio. Einwohner, ca. 46 Mio. Erwerbstätige", "ca. 63 Mio. Einwohner, ca. 30 Mio. Erwerbstätige", "ca. 100 Mio. Einwohner, ca. 70 Mio. Erwerbstätige", "ca. 83 Mio. Einwohner, ca. 80 Mio. Erwerbstätige"] });
  K("ta17", "tarif", "all", 2, "Welche Aufgaben hat die Bundesagentur für Arbeit? Nennen Sie 2.",
    "Arbeits- und Ausbildungsvermittlung, Berufsberatung, Zahlung von Arbeitslosen- und Kurzarbeitergeld, Förderung von Weiterbildung, Arbeitsmarktstatistik.",
    { k: ["Vermittlung", "Berufsberatung", "Arbeitslosen-/Kurzarbeitergeld", "Weiterbildungsförderung", "Statistik"], n: 2 });
  K("ta20", "tarif", "hwk", 1, "Welche Gewerkschaft ist in der Regel für Klempner und das SHK-Handwerk zuständig?",
    "Die IG Metall. Auf Arbeitgeberseite verhandeln Innungen bzw. Fachverbände des Handwerks (z. B. Fachverband SHK).",
    { mc: ["IG Metall", "ver.di", "GEW", "Marburger Bund"] });

  /* ───────────── 6. Unternehmen, Verträge & Kammern ───────────── */
  K("re01", "recht", "all", 3, "Unterscheiden Sie die Stufen der Geschäftsfähigkeit.",
    "Geschäftsunfähig: bis zum 7. Geburtstag. Beschränkt geschäftsfähig: 7 bis 17 Jahre – Verträge brauchen die Zustimmung der Eltern (Ausnahme: Taschengeldparagraf). Voll geschäftsfähig: ab 18.",
    { k: ["Unter 7: geschäftsunfähig", "7–17: beschränkt geschäftsfähig", "Ab 18: voll geschäftsfähig"], n: 3,
      mc: ["Ein 15-Jähriger ist beschränkt geschäftsfähig", "Ein 15-Jähriger ist geschäftsunfähig", "Ein 15-Jähriger ist voll geschäftsfähig", "Geschäftsfähigkeit beginnt mit 16"] });
  K("re02", "recht", "all", 1, "Was besagt der Taschengeldparagraf?",
    "Ein Vertrag eines beschränkt Geschäftsfähigen ist von Anfang an wirksam, wenn er ihn mit Mitteln bezahlt, die ihm dafür oder zur freien Verfügung überlassen wurden (§ 110 BGB) – also bar und sofort, nicht auf Raten.",
    { mc: ["Kauf mit eigenem Taschengeld ist wirksam, wenn sofort bezahlt", "Jugendliche dürfen Ratenkäufe abschließen", "Eltern müssen Taschengeld zahlen", "Taschengeld ist steuerpflichtig"] });
  K("re03", "recht", "all", 2, "Wie kommt ein Kaufvertrag zustande und welche Pflichten entstehen?",
    "Durch zwei übereinstimmende Willenserklärungen: Antrag und Annahme. Der Verkäufer muss die Ware mangelfrei übergeben und das Eigentum verschaffen, der Käufer muss den Preis zahlen und die Ware abnehmen.",
    { mc: ["Durch Antrag und Annahme", "Erst durch Unterschrift beim Notar", "Nur schriftlich", "Erst mit der Bezahlung"] });
  K("re04", "recht", "all", 3, "Welche Rechte hat ein Käufer bei mangelhafter Ware?",
    "Zuerst Nacherfüllung (Reparatur oder Ersatzlieferung). Scheitert diese: Rücktritt vom Vertrag oder Minderung des Preises, ggf. Schadensersatz. Die gesetzliche Gewährleistung beträgt 2 Jahre.",
    { k: ["Nacherfüllung zuerst", "Rücktritt", "Minderung", "Schadensersatz", "2 Jahre Gewährleistung"], n: 3,
      mc: ["Zuerst Nacherfüllung (Reparatur oder Ersatz)", "Sofort Geld zurück ohne Prüfung", "Gar keine Rechte nach dem Kauf", "Nur ein Gutschein"] });
  K("re05", "recht", "all", 2, "Unterscheiden Sie Gewährleistung und Garantie.",
    "Gewährleistung: gesetzlicher Anspruch gegenüber dem Verkäufer (2 Jahre bei Neuware). Garantie: freiwilliges Versprechen, meist des Herstellers, mit selbst festgelegten Bedingungen.",
    { mc: ["Gewährleistung ist gesetzlich, Garantie freiwillig", "Garantie ist gesetzlich, Gewährleistung freiwillig", "Beides ist dasselbe", "Gewährleistung gibt es nur für Autos"] });
  K("re06", "recht", "all", 1, "Wann hat ein Verbraucher ein 14-tägiges Widerrufsrecht?",
    "Bei Fernabsatzverträgen (z. B. Online-Kauf) und bei Verträgen, die außerhalb von Geschäftsräumen geschlossen werden (z. B. an der Haustür) – nicht beim normalen Kauf im Laden.",
    { mc: ["Beim Online-Kauf", "Bei jedem Kauf im Laden", "Nur bei Lebensmitteln", "Nie"] });
  K("re07", "recht", "all", 4, "Vergleichen Sie Einzelunternehmen, GmbH und AG nach Mindestkapital und Haftung.",
    "Einzelunternehmen: kein Mindestkapital, Inhaber haftet unbeschränkt mit Privatvermögen. GmbH: 25.000 € Stammkapital, Haftung nur mit dem Gesellschaftsvermögen (UG haftungsbeschränkt ab 1 €). AG: 50.000 € Grundkapital, Haftung mit dem Gesellschaftsvermögen.",
    { k: ["Einzelunternehmen: kein Mindestkapital, volle Haftung", "GmbH: 25.000 €", "AG: 50.000 €", "GmbH/AG: Haftung nur mit Gesellschaftsvermögen"], n: 3,
      mc: ["GmbH: 25.000 € Stammkapital", "GmbH: 1 € Stammkapital", "GmbH: 50.000 € Stammkapital", "GmbH: 100.000 € Stammkapital"] });
  K("re08", "recht", "all", 2, "Wie haften die Gesellschafter einer KG?",
    "Komplementäre haften unbeschränkt mit ihrem gesamten Vermögen, Kommanditisten nur bis zur Höhe ihrer Einlage.",
    { mc: ["Komplementär unbeschränkt, Kommanditist bis zur Einlage", "Alle nur bis zur Einlage", "Alle unbeschränkt", "Niemand haftet"] });
  K("re09", "recht", "all", 2, "Welche Kammer ist für Ihre Ausbildung zuständig und was macht sie?",
    "Für Handwerksberufe die Handwerkskammer, für Industrie- und Handelsberufe die Industrie- und Handelskammer (IHK). Aufgaben als „zuständige Stelle“: Ausbildungsverträge eintragen, Betriebe überwachen und beraten (Ausbildungsberater), Prüfungen organisieren, Streitigkeiten schlichten.",
    { k: ["Verträge eintragen", "Ausbildung überwachen/beraten", "Prüfungen organisieren", "Schlichten"], n: 2 });

  K("re20", "recht", "hwk", 3, "Nennen Sie 3 Aufgaben der Handwerkskammer.",
    "Führung der Handwerksrolle und der Lehrlingsrolle, Regelung und Überwachung der Ausbildung, Abnahme der Meisterprüfung (und Regelung der Gesellenprüfung), Beratung der Betriebe, Interessenvertretung des Handwerks, Sachverständige bestellen.",
    { k: ["Handwerksrolle", "Lehrlingsrolle", "Ausbildung überwachen", "Meisterprüfung", "Beratung", "Interessenvertretung"], n: 3 });
  K("re21", "recht", "hwk", 2, "Unterscheiden Sie Handwerkskammer und Innung.",
    "Handwerkskammer: Pflichtmitgliedschaft aller Handwerksbetriebe eines Bezirks, öffentlich-rechtliche Selbstverwaltung. Innung: freiwilliger Zusammenschluss selbstständiger Handwerker eines Gewerks (z. B. SHK-Innung) – nimmt Gesellenprüfungen ab, schließt Tarifverträge, berät die Mitglieder.",
    { mc: ["Kammer = Pflicht, Innung = freiwillig", "Kammer = freiwillig, Innung = Pflicht", "Beide sind Gewerkschaften", "Innung ist eine Behörde des Bundes"] });
  K("re22", "recht", "hwk", 1, "Was ist die Kreishandwerkerschaft?",
    "Der Zusammenschluss aller Innungen eines Stadt- oder Landkreises.",
    { mc: ["Zusammenschluss der Innungen eines Kreises", "Die Gewerkschaft der Gesellen", "Eine Abteilung der Arbeitsagentur", "Der Prüfungsausschuss der IHK"] });
  K("re23", "recht", "hwk", 2, "Was ist die Handwerksrolle und was bedeutet „zulassungspflichtiges Handwerk“?",
    "Die Handwerksrolle ist das Verzeichnis der selbstständigen Handwerksbetriebe bei der Handwerkskammer. Wer ein zulassungspflichtiges Handwerk (Anlage A der HwO, z. B. Klempner, Installateur und Heizungsbauer) selbstständig betreiben will, braucht dafür in der Regel den Meistertitel oder eine gleichwertige Qualifikation.",
    { mc: ["Für die Selbstständigkeit ist in der Regel der Meister nötig", "Jeder darf ohne Ausbildung einen Betrieb eröffnen", "Man braucht ein Studium", "Nur die Innung darf Betriebe führen"] });
  K("re24", "recht", "hwk", 3, "Ein Kunde beauftragt einen Klempnerbetrieb mit einer neuen Dachrinne. Welcher Vertrag liegt vor und was ist typisch?",
    "Ein Werkvertrag: Geschuldet ist ein Erfolg (das fertige, mangelfreie Werk), nicht nur die Arbeitszeit. Der Kunde muss das Werk abnehmen; mit der Abnahme ist die Vergütung fällig und die Mängelhaftung beginnt (bei Bauwerken 5 Jahre nach BGB, 4 Jahre bei vereinbarter VOB/B).",
    { k: ["Werkvertrag", "Erfolg geschuldet", "Abnahme", "Mängelhaftung 5 Jahre bei Bauwerken"], n: 3,
      mc: ["Werkvertrag – ein Erfolg ist geschuldet", "Kaufvertrag – nur das Material ist geschuldet", "Arbeitsvertrag mit dem Kunden", "Mietvertrag über die Dachrinne"] });
  K("re25", "recht", "hwk", 1, "Was muss ein Handwerker tun, wenn ein Kostenvoranschlag deutlich überschritten wird?",
    "Er muss den Kunden unverzüglich informieren. Bei wesentlicher Überschreitung (Faustregel ca. 15–20 %) kann der Kunde den Vertrag kündigen und muss nur die bisher erbrachte Leistung bezahlen.",
    { mc: ["Den Kunden sofort informieren", "Einfach weiterarbeiten und mehr berechnen", "Den Auftrag abbrechen ohne Info", "Die Innung um Erlaubnis bitten"] });

  K("re30", "recht", "ihk", 2, "Nennen Sie 2 Aufgaben der Industrie- und Handelskammer.",
    "Zuständige Stelle für die Berufsausbildung (Verträge, Prüfungen, Ausbildungsberatung), Interessenvertretung der gewerblichen Wirtschaft gegenüber der Politik, Beratung von Unternehmen und Gründern, Aufstiegsfortbildungen und -prüfungen.",
    { k: ["Zuständige Stelle Ausbildung", "Prüfungen", "Interessenvertretung", "Beratung"], n: 2 });
  K("re31", "recht", "ihk", 1, "Sind Unternehmen in der IHK Mitglied – freiwillig oder Pflicht?",
    "Pflicht: Alle gewerblichen Unternehmen in Deutschland (außer Handwerk und freie Berufe) sind Pflichtmitglied in ihrer regionalen IHK.",
    { mc: ["Pflichtmitgliedschaft", "Freiwillig", "Nur Aktiengesellschaften", "Nur Betriebe mit Azubis"] });

  /* ───────────── 7. Wirtschaftsordnung & Wirtschaftspolitik ───────────── */
  K("wi01", "wirtschaft", "all", 3, "Nennen Sie 3 Merkmale der sozialen Marktwirtschaft.",
    "Freier Wettbewerb und Preisbildung am Markt, Privateigentum, Vertrags- und Gewerbefreiheit – kombiniert mit sozialem Ausgleich durch den Staat (Sozialversicherung, Arbeitnehmerschutz, Wettbewerbspolitik/Kartellamt, Steuerprogression). Geprägt von Ludwig Erhard.",
    { k: ["Wettbewerb / freie Preisbildung", "Privateigentum", "Vertragsfreiheit", "Sozialer Ausgleich durch den Staat", "Wettbewerbsschutz (Kartellamt)"], n: 3 });
  K("wi02", "wirtschaft", "all", 3, "Was ist eine Planwirtschaft und warum ist sie gescheitert?",
    "Der Staat plant zentral Produktion, Preise und Verteilung; Produktionsmittel sind in Staatseigentum (z. B. DDR). Gescheitert an Informationsproblemen, fehlenden Leistungsanreizen, Ineffizienz, Mangelwirtschaft und fehlender Innovation.",
    { k: ["Zentrale staatliche Planung", "Staatseigentum", "Fehlende Anreize", "Mangelwirtschaft", "Wenig Innovation"], n: 3 });
  K("wi03", "wirtschaft", "all", 2, "Wie bildet sich der Preis auf dem Markt?",
    "Durch Angebot und Nachfrage. Steigt die Nachfrage bei gleichem Angebot, steigt der Preis; steigt das Angebot bei gleicher Nachfrage, sinkt er. Im Gleichgewichtspreis stimmen angebotene und nachgefragte Menge überein.",
    { mc: ["Steigende Nachfrage bei gleichem Angebot → Preis steigt", "Steigendes Angebot → Preis steigt", "Der Staat legt jeden Preis fest", "Preise ändern sich nie"] });
  K("wi04", "wirtschaft", "all", 2, "Unterscheiden Sie die Marktformen nach der Zahl der Anbieter.",
    "Polypol: viele Anbieter. Oligopol: wenige Anbieter (z. B. Mineralöl). Monopol: ein Anbieter. Über den Wettbewerb wacht das Bundeskartellamt.",
    { mc: ["Oligopol = wenige Anbieter", "Oligopol = ein Anbieter", "Oligopol = viele Anbieter", "Oligopol = kein Anbieter"] });
  K("wi05", "wirtschaft", "all", 5, "Beschreiben Sie den Konjunkturverlauf und nennen Sie die Phasen.",
    "Die Wirtschaft schwankt um einen langfristigen Wachstumstrend. Phasen: Aufschwung (Expansion), Hochkonjunktur (Boom), Abschwung, Tiefstand (Rezession bzw. Depression). Merkmale z. B. im Boom: hohe Auslastung, steigende Preise, wenig Arbeitslosigkeit.",
    { k: ["Aufschwung", "Hochkonjunktur/Boom", "Abschwung", "Tiefstand/Rezession", "Trendlinie"], n: 4 });
  K("wi06", "wirtschaft", "all", 1, "Was ist das Bruttoinlandsprodukt (BIP)?",
    "Der Wert aller Waren und Dienstleistungen, die in einem Jahr im Inland hergestellt werden – nach Abzug der Vorleistungen. Es ist der wichtigste Maßstab für die Wirtschaftsleistung und das Wachstum.",
    { mc: ["Wert aller im Inland produzierten Güter und Dienstleistungen eines Jahres", "Summe aller Steuereinnahmen", "Vermögen aller Bürger", "Wert aller Exporte"] });
  K("wi07", "wirtschaft", "all", 4, "Wie kann der Staat den Konjunkturverlauf beeinflussen?",
    "Durch antizyklische Fiskalpolitik: Im Abschwung Staatsausgaben und Investitionen erhöhen, Steuern senken, Konjunkturprogramme und Kurzarbeit; im Boom Ausgaben senken, Schulden tilgen, ggf. Steuern erhöhen. Automatische Stabilisatoren wirken zusätzlich.",
    { k: ["Staatsausgaben/Investitionen", "Steuern anpassen", "Konjunkturprogramme", "Antizyklisch handeln"], n: 3 });
  K("wi08", "wirtschaft", "all", 4, "Wie kann die Europäische Zentralbank (EZB) die Konjunktur beeinflussen?",
    "Durch Geldpolitik: Leitzinsen senken (Kredite werden billiger → mehr Investitionen und Konsum) oder erhöhen (dämpft Inflation), Offenmarktgeschäfte, Mindestreserve, Anleihekäufe. Hauptziel ist Preisstabilität (Inflation mittelfristig 2 %).",
    { k: ["Leitzins", "Offenmarktgeschäfte", "Mindestreserve", "Anleihekäufe", "Ziel: Preisstabilität 2 %"], n: 3,
      mc: ["Leitzinsen senken macht Kredite billiger", "Die EZB legt die Steuern fest", "Die EZB zahlt das Kindergeld", "Leitzinsen senken bekämpft Inflation"] });
  K("wi09", "wirtschaft", "all", 2, "Was ist Inflation und wie wird sie gemessen?",
    "Ein anhaltender Anstieg des allgemeinen Preisniveaus – die Kaufkraft des Geldes sinkt. Gemessen wird sie vom Statistischen Bundesamt mit dem Verbraucherpreisindex (Warenkorb).",
    { mc: ["Steigende Preise, sinkende Kaufkraft – gemessen mit dem Warenkorb", "Sinkende Preise", "Steigende Arbeitslosigkeit", "Wachsende Exporte"] });
  K("wi10", "wirtschaft", "all", 4, "Nennen Sie die 4 Ziele des magischen Vierecks.",
    "Stabiles Preisniveau, hoher Beschäftigungsstand, außenwirtschaftliches Gleichgewicht, stetiges und angemessenes Wirtschaftswachstum (Stabilitätsgesetz 1967).",
    { k: ["Preisniveaustabilität", "Hoher Beschäftigungsstand", "Außenwirtschaftliches Gleichgewicht", "Angemessenes Wachstum"], n: 4 });
  K("wi11", "wirtschaft", "all", 2, "Welche 2 Ziele ergänzen das magische Viereck zum Sechseck?",
    "Schutz der Umwelt und gerechte Einkommens- und Vermögensverteilung.",
    { k: ["Umweltschutz", "Gerechte Einkommens- und Vermögensverteilung"], n: 2,
      mc: ["Umweltschutz und gerechte Verteilung", "Hohe Steuern und hohe Zinsen", "Mehr Feiertage und kürzere Arbeitszeit", "Niedrige Löhne und hohe Exporte"] });
  K("wi12", "wirtschaft", "all", 4, "Warum heißt das Viereck „magisch“? Erläutern Sie Zielkonflikt und Zielharmonie.",
    "Magisch, weil nicht alle Ziele gleichzeitig vollständig erreicht werden können. Zielkonflikt: Ein Ziel zu fördern verschlechtert ein anderes (z. B. Wachstum ↔ Umweltschutz, Vollbeschäftigung ↔ Preisstabilität). Zielharmonie: Ziele fördern sich gegenseitig (z. B. Wachstum → mehr Beschäftigung).",
    { k: ["Nicht alle Ziele gleichzeitig erreichbar", "Zielkonflikt mit Beispiel", "Zielharmonie mit Beispiel"], n: 3 });
  K("wi13", "wirtschaft", "all", 3, "Nennen Sie die 3 Dimensionen der Nachhaltigkeit.",
    "Ökologisch (Umwelt und Ressourcen schonen), ökonomisch (dauerhaft wirtschaftlich tragfähig), sozial (gerechte Lebens- und Arbeitsbedingungen).",
    { k: ["Ökologisch", "Ökonomisch", "Sozial"], n: 3 });
  K("wi14", "wirtschaft", "all", 2, "Nennen Sie je einen Vorteil und Nachteil der Globalisierung.",
    "Vorteile: größere Absatzmärkte, günstigere Produkte, internationale Arbeitsteilung, Wohlstand. Nachteile: Abhängigkeit von Lieferketten (z. B. aus China), Verlagerung von Arbeitsplätzen, Lohn- und Umweltdumping, mehr Transport.",
    { k: ["Vorteil genannt", "Nachteil genannt"], n: 2 });
  K("wi15", "wirtschaft", "all", 1, "Was bedeutet Enteignung?",
    "Der Entzug von Eigentum durch den Staat zum Wohl der Allgemeinheit (z. B. für den Straßenbau) – nur auf gesetzlicher Grundlage und gegen Entschädigung (Art. 14 GG).",
    { mc: ["Staatlicher Eigentumsentzug zum Allgemeinwohl gegen Entschädigung", "Diebstahl durch Privatpersonen", "Verkauf eines Hauses", "Eine Steuer auf Vermögen"] });
  K("wi16", "wirtschaft", "all", 2, "Nennen Sie die Teilnehmer des erweiterten Wirtschaftskreislaufs.",
    "Private Haushalte, Unternehmen, Staat, Banken (Vermögensänderung) und Ausland.",
    { k: ["Haushalte", "Unternehmen", "Staat", "Banken", "Ausland"], n: 4 });

  /* ───────────── 8. Staat, Politik & Europa ───────────── */
  K("po01", "politik", "all", 5, "Nennen Sie die 5 Verfassungsprinzipien aus Art. 20 Grundgesetz.",
    "Demokratie, Rechtsstaat, Sozialstaat, Bundesstaat, Republik. Sie sind durch die „Ewigkeitsklausel“ (Art. 79 Abs. 3 GG) vor Änderung geschützt.",
    { k: ["Demokratie", "Rechtsstaat", "Sozialstaat", "Bundesstaat", "Republik"], n: 5 });
  K("po02", "politik", "all", 5, "Nennen Sie die 5 ständigen Verfassungsorgane der Bundesrepublik Deutschland.",
    "Bundestag, Bundesrat, Bundesregierung, Bundespräsident, Bundesverfassungsgericht (dazu die nicht ständige Bundesversammlung).",
    { k: ["Bundestag", "Bundesrat", "Bundesregierung", "Bundespräsident", "Bundesverfassungsgericht"], n: 5 });
  K("po03", "politik", "all", 3, "Erklären Sie die Gewaltenteilung.",
    "Die Staatsgewalt ist aufgeteilt, damit sich die Gewalten gegenseitig kontrollieren: Legislative (Gesetzgebung: Bundestag, Bundesrat), Exekutive (Ausführung: Regierung, Verwaltung, Polizei), Judikative (Rechtsprechung: Gerichte).",
    { k: ["Legislative – Bundestag/Bundesrat", "Exekutive – Regierung/Verwaltung", "Judikative – Gerichte"], n: 3,
      mc: ["Judikative = Gerichte", "Judikative = Bundestag", "Judikative = Bundesregierung", "Judikative = Polizei"] });
  K("po04", "politik", "all", 2, "Wo stehen die Grundrechte und welches ist das wichtigste?",
    "In Artikel 1 bis 19 des Grundgesetzes. Art. 1: „Die Würde des Menschen ist unantastbar.“",
    { mc: ["Art. 1–19 GG, Art. 1 Menschenwürde", "Im BGB, § 1", "In der Bayerischen Verfassung Art. 100", "In Art. 20–30 GG"] });
  K("po05", "politik", "all", 5, "Nennen Sie die 5 Wahlrechtsgrundsätze.",
    "Allgemein, unmittelbar, frei, gleich, geheim (Art. 38 GG).",
    { k: ["Allgemein", "Unmittelbar", "Frei", "Gleich", "Geheim"], n: 5,
      mc: ["„Geheim“ – niemand darf erfahren, wie ich wähle", "„Geheim“ – die Ergebnisse bleiben geheim", "„Geheim“ – nur Parteimitglieder wählen", "„Geheim“ – der Wahltermin ist geheim"] });
  K("po06", "politik", "all", 2, "Welche Bedeutung haben Erst- und Zweitstimme bei der Bundestagswahl?",
    "Mit der Erststimme wählt man einen Kandidaten im Wahlkreis, mit der Zweitstimme die Landesliste einer Partei. Die Zweitstimme entscheidet über die Sitzverteilung; seit der Wahlrechtsreform zieht ein Wahlkreissieger nur ein, wenn seine Partei genug Zweitstimmen hat.",
    { mc: ["Die Zweitstimme entscheidet über die Sitzverteilung", "Die Erststimme entscheidet über die Sitzverteilung", "Beide Stimmen gehen an den Kanzler", "Die Zweitstimme ist eine Ersatzstimme"] });
  K("po07", "politik", "all", 2, "Was ist die 5-%-Hürde und welche Ausnahme gibt es?",
    "Parteien brauchen mindestens 5 % der Zweitstimmen, um in den Bundestag einzuziehen. Ausnahme: Parteien mit mindestens 3 Direktmandaten (Grundmandatsklausel) sowie Parteien nationaler Minderheiten (z. B. SSW).",
    { mc: ["Mind. 5 % Zweitstimmen, Ausnahme 3 Direktmandate", "Mind. 5 Abgeordnete", "Mind. 5 Wahlkreise", "Mind. 5 % Erststimmen"] });
  K("po08", "politik", "all", 1, "Wie viele Sitze hat der aktuelle Deutsche Bundestag?",
    "{btSitze} Sitze ({btWahlperiode}). Durch die Wahlrechtsreform ist die Größe fest begrenzt; die Verteilung auf die Parteien ändert sich mit jeder Wahl.",
    { s: 1, src: "bt", mc: ["{btSitze}", "598", "736", "709"] });
  K("po09", "politik", "all", 4, "Nennen Sie 4 Parteien, die im aktuellen Bundestag vertreten sind.",
    "{btParteien}. Regierungskoalition: {regierung}, Bundeskanzler {kanzler}.",
    { s: 1, src: "bt", k: ["CDU/CSU", "AfD", "SPD", "Bündnis 90/Die Grünen", "Die Linke"], n: 4 });
  K("po10", "politik", "all", 2, "Wer wählt den Bundeskanzler und wie kann er abgewählt werden?",
    "Der Bundestag wählt ihn auf Vorschlag des Bundespräsidenten. Abwählen kann ihn der Bundestag nur durch ein konstruktives Misstrauensvotum – also indem er gleichzeitig mit Mehrheit einen Nachfolger wählt.",
    { mc: ["Der Bundestag – Abwahl nur durch konstruktives Misstrauensvotum", "Das Volk direkt", "Der Bundesrat", "Der Bundespräsident ernennt ihn ohne Wahl"] });
  K("po11", "politik", "all", 2, "Wer ist Bundespräsident und wie wird er gewählt?",
    "{bpraes}. Gewählt wird der Bundespräsident von der Bundesversammlung für 5 Jahre; eine einmalige Wiederwahl ist möglich.",
    { s: 1, src: "bpraes", mc: ["Frank-Walter Steinmeier – gewählt von der Bundesversammlung", "Friedrich Merz – gewählt vom Volk", "Markus Söder – gewählt vom Bundesrat", "Olaf Scholz – gewählt vom Bundestag"] });
  K("po12", "politik", "all", 2, "Was ist der Bundesrat?",
    "Die Vertretung der 16 Länder auf Bundesebene. Er besteht aus Mitgliedern der Landesregierungen (69 Stimmen, Bayern hat 6) und wirkt an der Gesetzgebung mit (Einspruchs- und Zustimmungsgesetze).",
    { mc: ["Vertretung der Länder, 69 Stimmen", "Die Regierung des Bundes", "Ein Gericht", "Das Parlament der EU"] });
  K("po13", "politik", "all", 5, "Beschreiben Sie den Weg eines Bundesgesetzes.",
    "Gesetzesinitiative (Bundesregierung, Bundestag oder Bundesrat) → drei Lesungen im Bundestag mit Ausschussberatung und Beschluss → Bundesrat (ggf. Vermittlungsausschuss) → Gegenzeichnung durch Regierung, Ausfertigung durch den Bundespräsidenten → Verkündung im Bundesgesetzblatt.",
    { k: ["Initiative", "3 Lesungen im Bundestag", "Bundesrat / Vermittlungsausschuss", "Unterschrift Bundespräsident", "Verkündung Bundesgesetzblatt"], n: 4 });
  K("po14", "politik", "all", 2, "Nennen Sie 2 Möglichkeiten, politisch Einfluss zu nehmen.",
    "Wählen, Mitarbeit in einer Partei, Bürgerinitiative, Petition, Demonstration, Volks- oder Bürgerbegehren, Gewerkschafts- oder JAV-Arbeit, Kontakt zu Abgeordneten, Ehrenamt.",
    { k: ["Wählen", "Partei", "Petition", "Demonstration", "Bürger-/Volksbegehren", "Bürgerinitiative"], n: 2 });
  K("po15", "politik", "all", 2, "Ab welchem Alter darf man bei Bundestags- und Europawahl wählen?",
    "Bundestagswahl: ab 18 Jahren. Europawahl: ab 16 Jahren (seit 2024). Bei Landtags- und Kommunalwahlen in Bayern: ab 18.",
    { by: true, mc: ["Bundestag ab 18, Europawahl ab 16", "Beide ab 16", "Beide ab 21", "Bundestag ab 16, Europawahl ab 18"] });
  K("po16", "politik", "all", 2, "Welche Aufgaben haben Parteien in der Demokratie?",
    "Sie wirken an der politischen Willensbildung mit (Art. 21 GG): Interessen bündeln, Programme entwickeln, Kandidaten aufstellen, Regierung bilden oder kontrollieren (Opposition). Verbieten kann eine Partei nur das Bundesverfassungsgericht.",
    { k: ["Willensbildung", "Kandidaten aufstellen", "Regierung bilden / kontrollieren"], n: 2 });
  K("po17", "politik", "all", 1, "Aus welchen Parteien ging die Partei Die Linke hervor?",
    "Aus der PDS (Nachfolgepartei der SED der DDR) und der westdeutschen WASG, die sich 2007 zusammenschlossen.",
    { mc: ["Aus PDS und WASG", "Aus SPD und Grünen", "Aus CDU und FDP", "Aus der CSU"] });
  K("po18", "politik", "all", 2, "Was bedeutet Föderalismus? Nennen Sie ein Beispiel für Ländersache.",
    "Deutschland ist ein Bundesstaat aus 16 Ländern mit eigenen Parlamenten und Regierungen; die Aufgaben sind zwischen Bund und Ländern verteilt. Ländersache ist z. B. Bildung/Schule, Polizei, Kultur.",
    { mc: ["Schule und Bildung sind Ländersache", "Die Bundeswehr ist Ländersache", "Die Außenpolitik ist Ländersache", "Die Währung ist Ländersache"] });

  // Bayern
  K("po30", "politik", "all", 4, "Nennen Sie 4 Parteien, die im Bayerischen Landtag vertreten sind.",
    "{ltParteien}. Regierung: {ltRegierung}, Ministerpräsident {mp}.",
    { by: true, s: 1, src: "lt", k: ["CSU", "Freie Wähler", "AfD", "Grüne", "SPD"], n: 4 });
  K("po31", "politik", "all", 1, "Wie oft wird der Bayerische Landtag gewählt?",
    "Alle 5 Jahre (zuletzt 2023).",
    { by: true, mc: ["Alle 5 Jahre", "Alle 4 Jahre", "Alle 6 Jahre", "Alle 2 Jahre"] });
  K("po32", "politik", "all", 2, "Wie kann das Volk in Bayern selbst Gesetze beschließen?",
    "Durch Volksbegehren und Volksentscheid: Unterstützen mindestens 10 % der Wahlberechtigten ein Volksbegehren, wird es dem Landtag vorgelegt; lehnt der Landtag ab, stimmt das Volk im Volksentscheid ab (z. B. „Rettet die Bienen“ 2019 – vom Landtag angenommen).",
    { by: true, mc: ["Volksbegehren (10 %) und Volksentscheid", "Durch Demonstrationen", "Durch eine Petition an den Bundestag", "Gar nicht"] });
  K("po33", "politik", "all", 2, "Welche Organe gibt es auf der Ebene Ihrer Gemeinde bzw. Stadt?",
    "Gemeinderat bzw. Stadtrat und erster Bürgermeister bzw. Oberbürgermeister; im Landkreis Kreistag und Landrat. Kommunalwahlen finden in Bayern alle 6 Jahre statt (zuletzt März 2026).",
    { by: true, k: ["Gemeinde-/Stadtrat", "(Ober-)Bürgermeister", "Kreistag und Landrat"], n: 2 });

  // Europa
  K("po40", "politik", "all", 1, "Wie viele Mitgliedstaaten hat die Europäische Union?",
    "{euStaaten} Mitgliedstaaten (seit dem Austritt Großbritanniens 2020).",
    { s: 1, mc: ["{euStaaten}", "28", "25", "30"] });
  K("po41", "politik", "all", 4, "Nennen Sie die 4 Grundfreiheiten des EU-Binnenmarkts.",
    "Freier Warenverkehr, Personenfreizügigkeit, Dienstleistungsfreiheit, freier Kapital- und Zahlungsverkehr.",
    { k: ["Waren", "Personen", "Dienstleistungen", "Kapital"], n: 4 });
  K("po42", "politik", "all", 3, "Nennen Sie 3 Organe der EU und ihre Aufgabe.",
    "Europäisches Parlament (direkt gewählt, Gesetzgebung mit dem Rat), Rat der EU/Ministerrat (Fachminister der Staaten, Gesetzgebung), Europäische Kommission (schlägt Gesetze vor, überwacht die Einhaltung), Europäischer Rat (Staats- und Regierungschefs, Richtung), Europäischer Gerichtshof, Europäische Zentralbank.",
    { k: ["Europäisches Parlament", "Rat der EU", "Europäische Kommission", "Europäischer Rat", "EuGH", "EZB"], n: 3,
      mc: ["Die Kommission schlägt Gesetze vor", "Das Parlament wird von den Regierungen ernannt", "Der EuGH beschließt den Haushalt", "Die EZB wählt die Kommission"] });
  K("po43", "politik", "all", 1, "Wie oft wird das Europäische Parlament gewählt?",
    "Alle 5 Jahre direkt von den Bürgern (zuletzt 2024).",
    { mc: ["Alle 5 Jahre", "Alle 4 Jahre", "Alle 7 Jahre", "Es wird nicht gewählt"] });
  K("po44", "politik", "all", 2, "Welche Vorteile hat die EU für Auszubildende und Fachkräfte?",
    "Freizügigkeit (überall in der EU arbeiten und leben), Anerkennung von Abschlüssen, Auslandspraktika mit Erasmus+, gemeinsame Währung Euro, keine Grenzkontrollen im Schengen-Raum, Verbraucherschutz.",
    { k: ["Freizügigkeit", "Erasmus+", "Euro", "Anerkennung von Abschlüssen"], n: 2 });

  /* ───────────── Fallsituationen ─────────────
     f = kurze Situation aus dem Berufsalltag, die vor der Frage angezeigt wird */
  K("fa01", "ausbildung", "all", 2, "Darf Jonas den Ausbildungsvertrag so kündigen?",
    "Ja. In der Probezeit (1 bis 4 Monate) können beide Seiten jederzeit ohne Frist und ohne Angabe von Gründen kündigen – die Kündigung muss aber schriftlich erfolgen.",
    { f: "Jonas hat vor sechs Wochen seine Ausbildung begonnen. Er merkt, dass der Beruf nicht zu ihm passt, und möchte am Freitag aufhören.",
      mc: ["Ja, schriftlich und ohne Frist, weil er noch in der Probezeit ist", "Nein, erst nach der Probezeit", "Ja, aber nur mit 3 Monaten Frist", "Nur mündlich beim Chef"] });
  K("fa02", "arbeit", "all", 2, "Muss Lea heute noch in den Betrieb?",
    "Nein. Ein Berufsschultag mit mehr als 5 Unterrichtsstunden (à 45 Min.) wird einmal pro Woche als voller Arbeitstag angerechnet – das gilt seit 2020 auch für volljährige Azubis.",
    { f: "Lea (19) hat dienstags 6 Stunden Berufsschule von 8:00 bis 13:15 Uhr. Ihr Meister möchte, dass sie danach noch auf die Baustelle kommt.",
      mc: ["Nein, der Tag zählt als voller Arbeitstag", "Ja, weil sie volljährig ist", "Ja, für mindestens 4 Stunden", "Nur, wenn sie zustimmt und Überstunden bekommt"] });
  K("fa03", "arbeit", "all", 3, "Was muss Max jetzt tun – und wer zahlt seinen Lohn?",
    "Er muss den Betrieb sofort am ersten Tag informieren. Ab dem 4. Krankheitstag braucht er eine ärztliche Arbeitsunfähigkeitsbescheinigung (der Betrieb ruft sie elektronisch ab). Der Betrieb zahlt bis zu 6 Wochen den vollen Lohn weiter (Entgeltfortzahlung).",
    { f: "Max wacht am Montag mit hohem Fieber auf. Der Arzt sagt, er wird wohl die ganze Woche ausfallen.",
      k: ["Sofort im Betrieb melden", "Krankschreibung ab dem 4. Tag", "Betrieb zahlt bis 6 Wochen weiter"], n: 3 });
  K("fa04", "sozial", "all", 2, "Wer kommt für die Behandlung auf?",
    "Die gesetzliche Unfallversicherung (Berufsgenossenschaft), denn es ist ein Wegeunfall auf dem direkten Weg zur Arbeit. Sie geht zu einem Durchgangsarzt (D-Arzt).",
    { f: "Sophie fährt morgens mit dem Rad direkt zum Betrieb, rutscht auf nassem Laub aus und bricht sich das Handgelenk.",
      mc: ["Die Berufsgenossenschaft (Wegeunfall)", "Ihre Krankenkasse", "Ihr Betrieb privat", "Die Rentenversicherung"] });
  K("fa05", "sozial", "all", 2, "Warum ist Timos Nettolohn deutlich niedriger als sein Bruttolohn?",
    "Vom Bruttolohn werden die Arbeitnehmeranteile zur Kranken-, Pflege-, Renten- und Arbeitslosenversicherung abgezogen (zusammen gut 21 %), ggf. auch Lohnsteuer, Solidaritätszuschlag und Kirchensteuer. Ausgezahlt wird der Nettolohn.",
    { f: "Timo freut sich über seine Vergütung von 900 € im Monat. Auf dem Konto kommen aber nur gut 700 € an. Er glaubt, sein Chef hat sich verrechnet.",
      mc: ["Weil die Sozialversicherungsanteile abgezogen werden", "Weil der Chef einen Teil behält", "Weil Azubis Mehrwertsteuer zahlen", "Weil die Berufsschule Gebühren kostet"] });
  K("fa06", "mitbest", "all", 2, "An wen kann sich Elif wenden?",
    "An die Jugend- und Auszubildendenvertretung (JAV) bzw. den Betriebsrat. Die JAV achtet z. B. auf die Einhaltung des Jugendarbeitsschutzgesetzes und gibt Beschwerden an den Betriebsrat weiter. Außerdem kann sie sich an die Ausbildungsberatung der Kammer wenden.",
    { f: "Elif (17) muss in ihrem Betrieb regelmäßig bis 21 Uhr arbeiten und erledigt fast nur Hilfsarbeiten, die mit ihrem Beruf nichts zu tun haben.",
      k: ["JAV", "Betriebsrat", "Ausbildungsberater der Kammer"], n: 2 });
  K("fa07", "arbeit", "all", 2, "Ist Elifs Arbeitszeit erlaubt?",
    "Nein. Jugendliche unter 18 dürfen grundsätzlich nur zwischen 6 und 20 Uhr beschäftigt werden (Nachtruhe nach dem Jugendarbeitsschutzgesetz), höchstens 8 Stunden am Tag und 40 Stunden pro Woche.",
    { f: "Elif ist 17. Ihr Betrieb plant sie diese Woche jeden Tag von 12 bis 21 Uhr ein.",
      mc: ["Nein, Jugendliche dürfen nicht nach 20 Uhr arbeiten", "Ja, wenn sie zustimmt", "Ja, das Arbeitszeitgesetz erlaubt 10 Stunden", "Ja, nur Sonntagsarbeit ist verboten"] });
  K("fa08", "arbeit", "all", 3, "Ist die Kündigung wirksam? Was kann Herr Becker tun?",
    "Eine Kündigung per WhatsApp ist unwirksam, sie muss schriftlich mit Unterschrift erfolgen. Außerdem gilt hier das Kündigungsschutzgesetz (mehr als 10 Beschäftigte, länger als 6 Monate). Will er sich gegen eine Kündigung wehren, muss er innerhalb von 3 Wochen Klage beim Arbeitsgericht erheben.",
    { f: "Herr Becker arbeitet seit 3 Jahren in einem Betrieb mit 25 Beschäftigten. Abends bekommt er eine WhatsApp: „Sie sind gekündigt, ab Montag brauchen Sie nicht mehr kommen.“",
      k: ["Unwirksam – Schriftform fehlt", "Kündigungsschutzgesetz gilt", "Klage innerhalb von 3 Wochen"], n: 2 });
  K("fa09", "tarif", "all", 2, "Bekommt Paul während des Streiks Geld?",
    "Vom Arbeitgeber nicht – während des Streiks entfällt der Lohn. Streikgeld zahlt die Gewerkschaft nur an ihre Mitglieder. Paul ist kein Mitglied und erhält daher nichts.",
    { f: "Die Gewerkschaft ruft nach erfolgreicher Urabstimmung zum Streik auf. Paul ist kein Gewerkschaftsmitglied, streikt aber solidarisch mit.",
      mc: ["Nein, weder Lohn noch Streikgeld", "Ja, Streikgeld von der Gewerkschaft", "Ja, den vollen Lohn vom Arbeitgeber", "Ja, Arbeitslosengeld"] });
  K("fa10", "tarif", "all", 2, "Was ist das für ein Instrument und wer zahlt?",
    "Kurzarbeit: Die Arbeitszeit wird vorübergehend verkürzt, statt Beschäftigte zu entlassen. Die Agentur für Arbeit zahlt Kurzarbeitergeld – 60 % (mit Kind 67 %) des ausgefallenen Nettoentgelts. Der Betrieb muss die Kurzarbeit vorher anzeigen.",
    { f: "Wegen fehlender Aufträge arbeitet die ganze Belegschaft eines Betriebs drei Monate lang nur noch 3 statt 5 Tage pro Woche – ohne dass jemand gekündigt wird.",
      mc: ["Kurzarbeit – die Arbeitsagentur zahlt Kurzarbeitergeld", "Streik – die Gewerkschaft zahlt", "Elternzeit – der Staat zahlt Elterngeld", "Urlaub – der Betrieb zahlt alles"] });
  K("fa11", "recht", "all", 2, "Ist der Kauf wirksam?",
    "Nein, zunächst schwebend unwirksam. Mit 16 ist Emily beschränkt geschäftsfähig. Ein Ratenkauf fällt nicht unter den Taschengeldparagrafen, daher brauchen ihre Eltern zuzustimmen.",
    { f: "Emily (16) kauft sich ohne Wissen ihrer Eltern ein Smartphone für 900 € auf Raten (12 Monate).",
      mc: ["Nein – ohne Zustimmung der Eltern nicht wirksam", "Ja, mit 16 ist man voll geschäftsfähig", "Ja, wegen des Taschengeldparagrafen", "Ja, Ratenkäufe sind immer wirksam"] });
  K("fa12", "recht", "all", 2, "Welches Recht hat Can zuerst?",
    "Er hat Anspruch auf Nacherfüllung: Der Händler darf zuerst reparieren oder ein neues Gerät liefern. Erst wenn das scheitert, kann Can vom Vertrag zurücktreten oder den Preis mindern. Die gesetzliche Gewährleistung beträgt 2 Jahre.",
    { f: "Cans neue Akku-Bohrmaschine geht nach drei Monaten kaputt, ohne dass er etwas falsch gemacht hat. Er will sofort sein Geld zurück.",
      mc: ["Nacherfüllung (Reparatur oder neues Gerät)", "Sofort Geld zurück", "Nichts – nach dem Kauf hat er keine Rechte", "Nur eine Gutschrift"] });
  K("fa13", "recht", "hwk", 3, "Welcher Vertrag liegt vor und wann beginnt die Mängelhaftung?",
    "Ein Werkvertrag – der Betrieb schuldet das fertige, mangelfreie Werk. Mit der Abnahme durch den Kunden wird die Vergütung fällig und die Mängelhaftung beginnt (bei Bauwerken 5 Jahre nach BGB, 4 Jahre bei vereinbarter VOB/B).",
    { f: "Der Klempnerbetrieb, in dem Lukas lernt, soll bei einem Einfamilienhaus die komplette Dachentwässerung aus Kupfer erneuern. Nach Fertigstellung kommt die Kundin zur Abnahme.",
      k: ["Werkvertrag", "Erfolg geschuldet", "Abnahme", "5 Jahre bei Bauwerken"], n: 3,
      mc: ["Werkvertrag – Mängelhaftung beginnt mit der Abnahme", "Kaufvertrag – Gewährleistung beginnt mit dem Materialkauf", "Arbeitsvertrag mit der Kundin", "Mietvertrag über die Dachrinne"] });
  K("fa14", "recht", "hwk", 2, "Was muss Lukas' Betrieb jetzt tun?",
    "Den Kunden unverzüglich informieren. Bei einer wesentlichen Überschreitung des Kostenvoranschlags (Faustregel ca. 15–20 %) darf der Kunde kündigen und zahlt nur die bisher erbrachte Leistung.",
    { f: "Beim Austausch einer Fassadenverkleidung stellt sich heraus, dass die Unterkonstruktion morsch ist. Die Kosten werden 30 % über dem Kostenvoranschlag liegen.",
      mc: ["Den Kunden sofort informieren", "Weiterarbeiten und später mehr berechnen", "Die Baustelle ohne Info verlassen", "Die Handwerkskammer um Erlaubnis fragen"] });
  K("fa15", "mitbest", "ihk", 2, "Darf der Betrieb das ohne den Betriebsrat entscheiden?",
    "Nein. Bei technischen Einrichtungen, die Verhalten oder Leistung überwachen können (z. B. Kameras), hat der Betriebsrat ein echtes Mitbestimmungsrecht. Ohne seine Zustimmung darf die Anlage nicht eingeführt werden.",
    { f: "Mia ist Mechatronik-Azubi in einem Industriebetrieb mit Betriebsrat. Die Geschäftsleitung will in der Montagehalle Kameras installieren, die auch die Mitarbeitenden filmen.",
      mc: ["Nein, der Betriebsrat muss zustimmen", "Ja, der Betriebsrat wird nur informiert", "Ja, die IHK muss zustimmen", "Ja, Kameras sind immer erlaubt"] });
  K("fa16", "ausbildung", "ihk", 2, "Zählt Teil 1 der Abschlussprüfung für Mias Endnote?",
    "Ja. Bei der gestreckten Abschlussprüfung fließen Teil 1 (etwa zur Mitte der Ausbildung) und Teil 2 (am Ende) gewichtet in das Gesamtergebnis ein. Teil 1 ist keine bloße Zwischenprüfung.",
    { f: "Mia hat bald Teil 1 ihrer Abschlussprüfung. Ein Mitschüler meint: „Das ist nur eine Zwischenprüfung, die ist egal.“",
      mc: ["Ja, beide Teile zählen gewichtet zur Endnote", "Nein, nur Teil 2 zählt", "Nur, wenn sie Teil 2 nicht besteht", "Nein, Teil 1 ist freiwillig"] });
  K("fa17", "politik", "all", 2, "Welche Möglichkeiten hat die Gruppe, ihr Anliegen durchzusetzen? Nennen Sie 2.",
    "Z. B. Petition an Gemeinderat oder Landtag, Bürgerbegehren und Bürgerentscheid in der Gemeinde, Bürgerinitiative gründen, Demonstration anmelden, Kontakt zu Gemeinderäten/Bürgermeister, Presse einschalten.",
    { f: "In Lenas Gemeinde soll der einzige Jugendtreff geschlossen werden. Sie und ihre Freunde wollen das verhindern.",
      k: ["Petition", "Bürgerbegehren", "Bürgerinitiative", "Demonstration", "Kontakt zu Gemeinderat/Bürgermeister"], n: 2 });
  K("fa18", "wirtschaft", "all", 2, "Welche Konjunkturphase beschreibt die Situation?",
    "Hochkonjunktur (Boom): Kapazitäten sind ausgelastet, kaum Arbeitslosigkeit, steigende Preise und Löhne.",
    { f: "Viele Handwerksbetriebe haben Wartezeiten von Monaten, finden kaum Fachkräfte, Materialpreise und Löhne steigen deutlich.",
      mc: ["Hochkonjunktur (Boom)", "Rezession", "Depression", "Aufschwung nach der Krise"] });

  /* ───────────── Merkhilfen ───────────── */
  const M = [
    { t: "Wahlrechtsgrundsätze", m: "„A U F G G“ – Alle Urnen Funktionieren Ganz Geheim", a: "Allgemein · Unmittelbar · Frei · Gleich · Geheim" },
    { t: "5 Sozialversicherungen", m: "„KRAPU“", a: "Kranken · Renten · Arbeitslosen · Pflege · Unfall" },
    { t: "EU-Grundfreiheiten", m: "„Wer Pendelt, Darf Kommen“", a: "Waren · Personen · Dienstleistungen · Kapital" },
    { t: "Art. 20 GG", m: "„Die Republik Steht Bundesweit Recht“", a: "Demokratie · Republik · Sozialstaat · Bundesstaat · Rechtsstaat" },
    { t: "Magisches Viereck", m: "„Preis, Job, Export, Wachstum“ – vier Ecken eines Hauses", a: "Preisstabilität · Beschäftigung · Außenwirtschaft · Wachstum" },
    { t: "Konjunkturphasen", m: "„Auf – Hoch – Ab – Tief“", a: "Aufschwung · Hochkonjunktur · Abschwung · Tiefstand" },
    { t: "Sicherheitszeichen", m: "Ampel + Himmel: Rot stopp, Gelb Achtung, Grün raus, Blau muss", a: "Rot Verbot · Gelb Warnung · Grün Rettung · Blau Gebot" },
    { t: "Tarifkonflikt", m: "„Kein Vernünftiger Schlichter Unterstützt Streik Endlos“", a: "Kündigung · Verhandlung · Schlichtung · Urabstimmung (75 %) · Streik · Einigung" },
    { t: "Geschäftsfähigkeit", m: "„0 – 7 – 18“", a: "unfähig bis 7 · beschränkt 7–17 · voll ab 18" },
  ];

  window.PUG = {
    version: "2026-10",
    stand: F.stand,
    rates: R,
    topics: T,
    cards: C,
    mnemonics: M,
    tracks: {
      hwk: {
        label: "Handwerk (HWK)", exam: "Gesellenprüfung Teil 2 – Wirtschafts- und Sozialkunde", short: "Gesellenprüfung · WiSo", minutes: 60,
        jobs: ["Klempner/in", "Anlagenmechaniker/in SHK", "Elektroniker/in (Handwerk)", "Metallbauer/in", "Kfz-Mechatroniker/in", "Anderer Handwerksberuf"],
      },
      ihk: {
        label: "Industrie & Handel (IHK)", exam: "Abschlussprüfung Teil 2 – Wirtschafts- und Sozialkunde", short: "Abschlussprüfung · WiSo", minutes: 60,
        jobs: ["Mechatroniker/in", "Industriemechaniker/in", "Elektroniker/in für Betriebstechnik", "Zerspanungsmechaniker/in", "Anderer IHK-Beruf"],
      },
    },
    links: {
      coach: "https://app.fobizz.com/ai/chats/public_assistants/736cf24b-7eeb-4bfe-8b03-ad7819499855?token=ac101b3dc7072c6c1cf6abaece92c7e9",
      extra: [
        { title: "Gesetzgebung – interaktive Übung", url: "https://learningapps.org/watch?app=11838531", src: "LearningApps" },
        { title: "Politisches System – Arbeitsblatt", url: "https://to-teach.ai/worksheets/3ECtKjFTcYaUVhISZCr8/hBgFOEsubMXTtO15Y9QC", src: "to-teach.ai" },
      ],
    },
  };
})();
