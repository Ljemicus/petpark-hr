#!/usr/bin/env node
/**
 * PetPark build-guard: fail build ako se u korisniku vidljivim datotekama nađe interni
 * draft copy ili zabranjeni brand. Podesivo listama dolje.
 * Iznimka po liniji: dodaj komentar  // draft-guard-allow  na istu liniju.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SCAN_DIRS = ["app", "components", "content"];
const EXTS = new Set([".tsx", ".ts", ".mdx", ".md", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "docs"]);

// Fraze koje NIKAD ne smiju u produkcijski copy. "TODO" je namjerno IZOSTAVLJEN
// (interna konvencija stubova). Dodaj/ukloni po potrebi.
const FORBIDDEN = [
  "Šapica", "Sapica",
  "bez glupiranja",
  "lorem ipsum", "Lorem ipsum",
  "[PLACEHOLDER]", "PLACEHOLDER_",
  "ovdje ide tekst",
  "Call to action bez",
];

const hits = [];
function walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXTS.has(extname(name))) {
      const lines = readFileSync(p, "utf8").split("\n");
      lines.forEach((line, i) => {
        if (line.includes("draft-guard-allow")) return;
        for (const phrase of FORBIDDEN) {
          if (line.includes(phrase)) hits.push(`${p}:${i + 1}  →  "${phrase}"`);
        }
      });
    }
  }
}

for (const d of SCAN_DIRS) walk(d);

if (hits.length) {
  console.error("\n✖ DRAFT-COPY GUARD: pronađen zabranjeni sadržaj u produkcijskim datotekama:\n");
  for (const h of hits) console.error("  " + h);
  console.error(`\nUkupno: ${hits.length}. Prepiši u pravi hrvatski copy ili (opravdano) označi s // draft-guard-allow\n`);
  process.exit(1);
}
console.log("✔ draft-copy guard: čisto");
