/*
  PuG Compass – Trainingsaufgaben & Begriffe des Tages
  ----------------------------------------------------
  type "match":  Paare zuordnen        pairs: [[links, rechts], …]
  type "order":  Reihenfolge legen     items: [Schritt 1, Schritt 2, …]  (in richtiger Reihenfolge eintragen)
  type "cloze":  Lückentext            text mit Lücken {richtig|falsch|falsch}
  g: "all" | "hwk" | "ihk"
*/
(function () {
  const tasks = [
    // ── Zuordnen ──
    { id: "m1", type: "match", t: "sozial", g: "all", title: "Versicherung und Träger",
      pairs: [["Krankenversicherung", "Krankenkasse"], ["Rentenversicherung", "Deutsche Rentenversicherung"], ["Arbeitslosenversicherung", "Bundesagentur für Arbeit"], ["Unfallversicherung", "Berufsgenossenschaft"], ["Pflegeversicherung", "Pflegekasse"]] },
    { id: "m2", type: "match", t: "sozial", g: "all", title: "Wer zahlt was?",
      pairs: [["Wegeunfall", "Berufsgenossenschaft"], ["Lohn in den ersten 6 Krankheitswochen", "Arbeitgeber"], ["Krankengeld ab Woche 7", "Krankenkasse"], ["Kurzarbeitergeld", "Agentur für Arbeit"], ["Grundsicherungsgeld", "Jobcenter"]] },
    { id: "m3", type: "match", t: "politik", g: "all", title: "Gewaltenteilung",
      pairs: [["Bundestag beschließt ein Gesetz", "Legislative"], ["Polizei kontrolliert den Verkehr", "Exekutive"], ["Arbeitsgericht entscheidet über eine Kündigung", "Judikative"]] },
    { id: "m4", type: "match", t: "tarif", g: "all", title: "Tarifverträge",
      pairs: [["Höhe der Löhne", "Lohn-/Entgelttarifvertrag"], ["Einteilung in Lohngruppen", "Rahmentarifvertrag"], ["Urlaub, Arbeitszeit, Zuschläge", "Manteltarifvertrag"]] },
    { id: "m5", type: "match", t: "wirtschaft", g: "all", title: "Arten der Arbeitslosigkeit",
      pairs: [["Dachdecker ohne Aufträge im Januar", "Saisonal"], ["Roboter ersetzt Montagearbeitsplätze", "Strukturell"], ["Wirtschaftskrise, Aufträge brechen ein", "Konjunkturell"], ["Zwei Wochen ohne Job beim Wechsel", "Friktionell"]] },
    { id: "m6", type: "match", t: "recht", g: "all", title: "Geschäftsfähigkeit",
      pairs: [["5 Jahre", "geschäftsunfähig"], ["15 Jahre", "beschränkt geschäftsfähig"], ["18 Jahre", "voll geschäftsfähig"]] },
    { id: "m7", type: "match", t: "politik", g: "all", title: "EU-Organe",
      pairs: [["Wird direkt von den Bürgern gewählt", "Europäisches Parlament"], ["Schlägt Gesetze vor", "Europäische Kommission"], ["Staats- und Regierungschefs", "Europäischer Rat"], ["Sorgt für stabile Preise im Euroraum", "Europäische Zentralbank"]] },
    { id: "m8", type: "match", t: "recht", g: "hwk", title: "Organisationen im Handwerk",
      pairs: [["Pflichtmitgliedschaft, führt die Handwerksrolle", "Handwerkskammer"], ["Freiwilliger Zusammenschluss eines Gewerks", "Innung"], ["Zusammenschluss der Innungen eines Kreises", "Kreishandwerkerschaft"], ["Vertritt die Gesellen in Tariffragen", "IG Metall"]] },
    { id: "m9", type: "match", t: "mitbest", g: "ihk", title: "Organe der AG",
      pairs: [["Leitet das Unternehmen", "Vorstand"], ["Überwacht den Vorstand", "Aufsichtsrat"], ["Versammlung der Aktionäre", "Hauptversammlung"]] },

    // ── Reihenfolge ──
    { id: "o1", type: "order", t: "tarif", g: "all", title: "Ablauf eines Tarifkonflikts",
      items: ["Tarifvertrag wird gekündigt", "Verhandlungen (ggf. Warnstreiks)", "Schlichtung scheitert", "Urabstimmung (mind. 75 %)", "Streik", "Einigung und 2. Urabstimmung", "Neuer Tarifvertrag mit Friedenspflicht"] },
    { id: "o2", type: "order", t: "politik", g: "all", title: "Weg eines Bundesgesetzes",
      items: ["Gesetzesinitiative", "Drei Lesungen im Bundestag", "Beschluss im Bundestag", "Beratung im Bundesrat", "Unterschrift des Bundespräsidenten", "Verkündung im Bundesgesetzblatt"] },
    { id: "o3", type: "order", t: "wirtschaft", g: "all", title: "Konjunkturzyklus (ab dem Tiefpunkt)",
      items: ["Tiefstand", "Aufschwung", "Hochkonjunktur", "Abschwung"] },
    { id: "o4", type: "order", t: "ausbildung", g: "all", title: "Ausbildung von Anfang bis Ende",
      items: ["Ausbildungsvertrag unterschreiben", "Eintrag bei der Kammer", "Probezeit", "Teil 1 der Prüfung", "Teil 2 der Prüfung", "Ende der Ausbildung mit Bekanntgabe des Ergebnisses"] },
    { id: "o5", type: "order", t: "arbeit", g: "all", title: "Vom Fehlverhalten zur Kündigung",
      items: ["Wiederholtes Zuspätkommen", "Abmahnung", "Erneutes Zuspätkommen", "Anhörung des Betriebsrats", "Schriftliche Kündigung", "Ggf. Klage innerhalb von 3 Wochen"] },
    { id: "o6", type: "order", t: "sozial", g: "all", title: "Vom Brutto zum Netto",
      items: ["Bruttolohn", "Minus Lohnsteuer (ggf. Soli, Kirchensteuer)", "Minus Sozialversicherungsanteile", "Nettolohn wird ausgezahlt"] },

    // ── Lückentext ──
    { id: "c1", type: "cloze", t: "sozial", g: "all", title: "Solidaritätsprinzip",
      text: "In der gesetzlichen Krankenversicherung richten sich die Beiträge nach dem {Einkommen|Alter|Gesundheitszustand}, die Leistungen nach dem {Bedarf|Beitrag|Einkommen}. Die Beiträge zahlen Arbeitgeber und Arbeitnehmer {je zur Hälfte|der Arbeitgeber allein|der Arbeitnehmer allein}." },
    { id: "c2", type: "cloze", t: "ausbildung", g: "all", title: "Probezeit und Kündigung",
      text: "Die Probezeit in der Ausbildung dauert mindestens {einen|drei|sechs} Monat und höchstens {vier|sechs|zwölf} Monate. Danach kann der Betrieb nur noch {aus wichtigem Grund|mit 4 Wochen Frist|ohne Grund} kündigen. Eine Kündigung muss immer {schriftlich|mündlich|per E-Mail} erfolgen." },
    { id: "c3", type: "cloze", t: "arbeit", g: "all", title: "Jugendarbeitsschutz",
      text: "Jugendliche dürfen höchstens {8|10|6} Stunden am Tag und {40|48|35} Stunden in der Woche arbeiten. Zwischen {20 und 6 Uhr|22 und 5 Uhr|18 und 8 Uhr} gilt Nachtruhe. Eine 16-Jährige hat Anspruch auf mindestens {27|24|30} Werktage Urlaub." },
    { id: "c4", type: "cloze", t: "mitbest", g: "all", title: "Betriebsrat und JAV",
      text: "Ein Betriebsrat kann ab {5|20|50} wahlberechtigten Arbeitnehmern gewählt werden, und zwar alle {4|2|5} Jahre. Wählen dürfen Beschäftigte ab {16|18|21} Jahren. Die JAV wird für {2|4|1} Jahre gewählt." },
    { id: "c5", type: "cloze", t: "wirtschaft", g: "all", title: "Magisches Viereck",
      text: "Die vier Ziele sind stabiles {Preisniveau|Wetter|Steuersystem}, hoher {Beschäftigungsstand|Leitzins|Exportüberschuss}, außenwirtschaftliches {Gleichgewicht|Wachstum|Defizit} und angemessenes {Wirtschaftswachstum|Lohnniveau|Zinsniveau}. „Magisch“ heißt es, weil sich die Ziele {teilweise widersprechen|immer gleichzeitig erreichen lassen|nur in Europa gelten}." },
    { id: "c6", type: "cloze", t: "politik", g: "all", title: "Bundestagswahl",
      text: "Mit der {Erststimme|Zweitstimme} wählt man eine Person im Wahlkreis, mit der {Zweitstimme|Erststimme} eine Partei. Für die Sitzverteilung entscheidend ist die {Zweitstimme|Erststimme}. Parteien brauchen mindestens {5 %|3 %|10 %} der Zweitstimmen." },
    { id: "c7", type: "cloze", t: "tarif", g: "all", title: "Arbeitskampf",
      text: "Während der Laufzeit eines Tarifvertrags gilt die {Friedenspflicht|Streikpflicht|Schweigepflicht}. Vor einem Streik stimmen die Mitglieder in einer {Urabstimmung|Betriebsversammlung|Bundestagswahl} ab. Streikgeld zahlt {die Gewerkschaft|der Arbeitgeber|die Arbeitsagentur} – aber nur an {Mitglieder|alle Beschäftigten|Beamte}." },
    { id: "c8", type: "cloze", t: "recht", g: "hwk", title: "Werkvertrag im Handwerk",
      text: "Beim Werkvertrag schuldet der Betrieb einen {Erfolg|Zeitaufwand|Materialpreis}. Mit der {Abnahme|Rechnung|Bestellung} wird die Vergütung fällig. Bei Bauwerken beträgt die Mängelhaftung nach BGB {5 Jahre|2 Jahre|6 Monate}." },
  ];

  const terms = [
    ["Duales System", "Ausbildung an zwei Lernorten: im Betrieb (Praxis) und in der Berufsschule (Theorie)."],
    ["Probezeit", "In der Ausbildung 1–4 Monate. Beide Seiten können jederzeit ohne Frist schriftlich kündigen."],
    ["Ausbildungsnachweis", "Das „Berichtsheft“ – dokumentiert die Ausbildung und ist Voraussetzung für die Prüfungszulassung."],
    ["Tarifautonomie", "Gewerkschaften und Arbeitgeber handeln Löhne ohne Einmischung des Staates aus (Art. 9 GG)."],
    ["Friedenspflicht", "Solange ein Tarifvertrag läuft, sind Streiks über die geregelten Punkte verboten."],
    ["Urabstimmung", "Abstimmung der Gewerkschaftsmitglieder über einen Streik – meist mindestens 75 % Zustimmung nötig."],
    ["Aussperrung", "Kampfmittel der Arbeitgeber: Beschäftigte werden von Arbeit und Lohn ausgeschlossen."],
    ["Günstigkeitsprinzip", "Vom Tarifvertrag darf nur zugunsten der Beschäftigten abgewichen werden."],
    ["Solidaritätsprinzip", "Beitrag nach Einkommen, Leistung nach Bedarf – die Starken tragen die Schwachen."],
    ["Generationenvertrag", "Die heute Arbeitenden finanzieren mit ihren Beiträgen die Renten der heutigen Rentner."],
    ["Subsidiaritätsprinzip", "Hilfe zur Selbsthilfe: Der Staat springt erst ein, wenn Einzelne und Familie nicht helfen können."],
    ["Entgeltfortzahlung", "Bei Krankheit zahlt der Arbeitgeber bis zu 6 Wochen den vollen Lohn weiter."],
    ["Krankengeld", "Ab der 7. Krankheitswoche: 70 % vom Brutto (max. 90 % vom Netto) von der Krankenkasse."],
    ["Wegeunfall", "Unfall auf dem direkten Weg zur Arbeit oder Berufsschule – zuständig ist die Berufsgenossenschaft."],
    ["Kurzarbeitergeld", "Lohnersatz der Arbeitsagentur bei vorübergehendem Arbeitsausfall: 60 % bzw. 67 % des Netto-Ausfalls."],
    ["Insolvenzgeld", "Ersetzt bis zu 3 Monatslöhne, wenn der Arbeitgeber zahlungsunfähig wird."],
    ["Betriebsvereinbarung", "Schriftlicher Vertrag zwischen Arbeitgeber und Betriebsrat, gilt für den ganzen Betrieb."],
    ["JAV", "Jugend- und Auszubildendenvertretung – vertritt Jugendliche und Azubis gegenüber dem Betriebsrat."],
    ["Abmahnung", "Rüge eines Fehlverhaltens mit Androhung der Kündigung im Wiederholungsfall."],
    ["Kündigungsschutzgesetz", "Gilt in Betrieben mit mehr als 10 Beschäftigten nach 6 Monaten: Kündigung braucht sozialen Grund."],
    ["Werkvertrag", "Vertrag, bei dem ein Erfolg geschuldet ist – z. B. eine fertig montierte Dachrinne."],
    ["Gewährleistung", "Gesetzlicher Anspruch bei Mängeln, beim Kauf neuer Ware 2 Jahre."],
    ["Taschengeldparagraf", "Minderjährige dürfen mit eigenem Taschengeld sofort bezahlte Käufe wirksam abschließen."],
    ["Handwerksrolle", "Verzeichnis der selbstständigen Handwerksbetriebe bei der Handwerkskammer."],
    ["Innung", "Freiwilliger Zusammenschluss der Handwerksbetriebe eines Gewerks, z. B. die SHK-Innung."],
    ["Soziale Marktwirtschaft", "Freier Wettbewerb plus sozialer Ausgleich durch den Staat – geprägt von Ludwig Erhard."],
    ["Bruttoinlandsprodukt", "Wert aller in einem Jahr im Inland produzierten Waren und Dienstleistungen."],
    ["Inflation", "Anhaltend steigende Preise – das Geld verliert an Kaufkraft. Gemessen mit dem Warenkorb."],
    ["Leitzins", "Zinssatz, zu dem sich Banken bei der Zentralbank Geld leihen. Steuert Kredite und Inflation."],
    ["Antizyklische Fiskalpolitik", "Der Staat gibt in der Krise mehr aus und spart im Boom."],
    ["Magisches Viereck", "Preisstabilität, hohe Beschäftigung, außenwirtschaftliches Gleichgewicht, angemessenes Wachstum."],
    ["Nachhaltigkeit", "Ökologisch, ökonomisch und sozial so handeln, dass auch künftige Generationen gut leben können."],
    ["Gewaltenteilung", "Gesetzgebung, Ausführung und Rechtsprechung sind getrennt und kontrollieren sich gegenseitig."],
    ["Föderalismus", "Deutschland ist ein Bundesstaat aus 16 Ländern – z. B. Schule ist Ländersache."],
    ["Konstruktives Misstrauensvotum", "Der Bundestag kann den Kanzler nur abwählen, indem er gleichzeitig einen neuen wählt."],
    ["Bundesrat", "Vertretung der 16 Länder auf Bundesebene, 69 Stimmen – Bayern hat 6."],
    ["Fünf-Prozent-Hürde", "Parteien brauchen mindestens 5 % der Zweitstimmen für den Einzug in den Bundestag."],
    ["Volksbegehren", "In Bayern können Bürger mit 10 % Unterschriften ein Gesetz auf den Weg bringen."],
    ["Petition", "Bitte oder Beschwerde an ein Parlament – jeder darf sie einreichen (Art. 17 GG)."],
    ["Freizügigkeit", "EU-Bürger dürfen in jedem EU-Land leben und arbeiten."],
    ["Grundrechte", "Art. 1–19 GG. Art. 1: Die Würde des Menschen ist unantastbar."],
    ["Mindestlohn", "Gesetzliche Lohnuntergrenze pro Stunde – gilt nicht für Auszubildende."],
  ];

  window.PUG.tasks = tasks;
  window.PUG.terms = terms.map(([w, d]) => ({ w, d }));
})();
