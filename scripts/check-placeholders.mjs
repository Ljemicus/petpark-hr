#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const scanSource = process.argv.includes('--source');
const targets = scanSource
  ? ['app', 'components']
  : ['.next/server', '.next/static'];

const allowedFiles = new Set([
  'app/(site)/uvjeti/page.tsx',
  'app/(site)/privatnost/page.tsx',
  'components/shared/footer.tsx',
]);

const hits = [];
const ignoredDirs = new Set(['node_modules', '.git', '.next/cache']);

function walk(path) {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    const base = relative(root, path);
    if (ignoredDirs.has(base)) return;
    for (const entry of readdirSync(path)) walk(join(path, entry));
    return;
  }

  if (!/\.(js|mjs|cjs|ts|tsx|html|json|txt|rsc)$/i.test(path)) return;
  const rel = relative(root, path);
  const text = readFileSync(path, 'utf8');
  const matches = text.match(/\{\{[A-Z0-9_]+\}\}/g);
  if (!matches) return;

  if (scanSource && allowedFiles.has(rel)) return;
  hits.push(`${rel}: ${[...new Set(matches)].join(', ')}`);
}

for (const target of targets) walk(join(root, target));

if (hits.length) {
  console.error('Placeholder tokeni {{...}} pronađeni izvan dopuštenog T2 impressum izvora:');
  for (const hit of hits) console.error(`- ${hit}`);
  process.exit(1);
}

console.log('Placeholder guard OK');
