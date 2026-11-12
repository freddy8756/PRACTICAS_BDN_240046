import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractDumpRows } from './sql-parser.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sql = await readFile(new URL('../backups/respaldo_1410.sql', import.meta.url), 'utf8');
const schema = JSON.parse(await readFile(path.join(directory, 'schema.json'), 'utf8'));
const records = extractDumpRows(sql, schema);
const outputDirectories = [path.join(directory, 'rows')];
if (process.argv.includes('--github-pages')) outputDirectories.push(path.resolve(directory, '..', '..', 'docs', 'rows'));
for (const output of outputDirectories) await mkdir(output, { recursive: true });

let total = 0;
for (const table of schema.tables) {
  const columns = table.columns.map(column => column.name);
  const rows = (records[table.name] ?? []).map(record => columns.map(column => {
    if (/(password|passwd|token|secret|api.?key|authorization|credential)/i.test(column)) return '[OCULTO]';
    return Object.hasOwn(record, column) ? record[column] : '[NO INCLUIDO EN INSERT]';
  }));
  total += rows.length;
  const json = JSON.stringify({ table: table.name, columns, rows });
  for (const output of outputDirectories) await writeFile(path.join(output, `${table.name}.json`), json, 'utf8');
}
console.log(`Datos de respaldo generados: ${schema.tables.length} tablas, ${total} filas. Campos de credenciales ocultos.${outputDirectories.length > 1 ? ' Copiados a docs para GitHub Pages.' : ''}`);
