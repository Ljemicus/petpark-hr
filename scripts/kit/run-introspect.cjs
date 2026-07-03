const fs = require('fs');
const { Client } = require('pg');
const raw = fs.readFileSync('scripts/kit/introspect-remote.sql','utf8');
const sql = raw.split(/;\s*(?:\n|$)/).map(s => s.trim()).filter(Boolean).filter(s => /select\s/i.test(s));
const client = new Client({
  host: 'aws-1-eu-west-1.pooler.supabase.com', port: 5432, database: 'postgres', user: 'postgres.hmtlcgjcxhjecsbmmxol',
  password: process.env.PGPASSWORD, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000,
});
function mdTable(rows){
  if (!rows.length) return '_nema redaka_\n';
  const cols = Object.keys(rows[0]);
  const esc = v => String(v ?? '').replace(/\|/g,'\\|').replace(/\n/g,' ');
  let out = `| ${cols.join(' | ')} |\n| ${cols.map(()=> '---').join(' | ')} |\n`;
  for (const r of rows) out += `| ${cols.map(c=>esc(r[c])).join(' | ')} |\n`;
  return out;
}
(async()=>{
  await client.connect();
  console.log(`# Live schema dump — ${new Date().toISOString().slice(0,10)}\n`);
  console.log('READ-ONLY introspekcija preko Node pg; izvorni SQL sadrži samo SELECT upite.\n');
  let i=0;
  for (const q of sql) {
    i++;
    console.log(`\n## Query ${i}\n`);
    const res = await client.query(q);
    console.log(mdTable(res.rows));
  }
  await client.end();
})().catch(e=>{ console.error(`FATAL: ${e.message}`); process.exit(1); });
