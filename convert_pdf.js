#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const inputPdf = process.argv[2] || path.join(root, "Fragenkatalog PuG Lerncoach.pdf");
const outputJson = process.argv[3] || path.join(root, "data", "fragen.json");

if (!fs.existsSync(inputPdf)) {
  console.error("PDF nicht gefunden:", inputPdf);
  process.exit(1);
}

const pyCode = [
  "from pypdf import PdfReader",
  "import sys",
  "pdf=sys.argv[1]",
  "txt='\\n'.join((p.extract_text() or '') for p in PdfReader(pdf).pages)",
  "print(txt)",
].join("; ");

const py = spawnSync("python3", ["-c", pyCode, inputPdf], { encoding: "utf-8" });
if (py.status !== 0) {
  console.error("PDF-Auslesen fehlgeschlagen. Bitte prüfen, ob python3 und pypdf vorhanden sind.");
  if (py.stderr) console.error(py.stderr.trim());
  process.exit(1);
}

const text = py.stdout
  .replace(/\u2029/g, "\n")
  .replace(/\ufb01/g, "fi")
  .replace(/Loesungsvorschlag/g, "Lösungsvorschlag");

const categoryRegex = /^([A-F])\s+([^\n]+)$/gm;
const questionRegex = /\[(G|O)\]\s*(\d+)\.\s*(.*?)\s*\/\s*(\d+)\s*Punkte\s*\n([\s\S]*?)(?=\n\[(?:G|O)\]\s*\d+\.|\n[A-F]\s+[^\n]+\n\[|$)/g;

const categories = [];
for (const match of text.matchAll(categoryRegex)) {
  categories.push({ index: match.index, name: match[2].trim() });
}

function categoryFor(index) {
  let active = "Allgemein";
  for (const c of categories) {
    if (c.index <= index) active = c.name;
    else break;
  }
  return active;
}

const items = [];
for (const m of text.matchAll(questionRegex)) {
  const type = m[1] === "G" ? "closed" : "open";
  const id = Number(m[2]);
  const question = m[3].replace(/\s+/g, " ").trim();
  const points = Number(m[4]);
  const block = m[5].trim();

  let answer = "";
  const a = block.match(/Lösungsvorschlag:\s*([\s\S]*?)(?=\nWikipedia Hinweis:|$)/);
  if (a) answer = a[1].replace(/\s+/g, " ").trim();

  const w = block.match(/Wikipedia Hinweis:\s*([\s\S]*)$/);
  if (w) {
    const hint = w[1].replace(/\s+/g, " ").trim();
    answer = `${answer} Hinweis: ${hint}`.trim();
  }

  items.push({ id, category: categoryFor(m.index), type, question, points, answer });
}

items.sort((a, b) => a.id - b.id);
fs.mkdirSync(path.dirname(outputJson), { recursive: true });
fs.writeFileSync(outputJson, JSON.stringify(items, null, 2), "utf-8");

console.log(`Fertig: ${items.length} Fragen gespeichert in ${outputJson}`);
