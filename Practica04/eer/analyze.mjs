import { readFile, writeFile } from 'node:fs/promises';
import { analyzeDump } from './sql-parser.js';
const input = new URL('../backups/respaldo_1410.sql', import.meta.url);
const output = new URL('./schema.json', import.meta.url);
const sql = await readFile(input, 'utf8');
const model = analyzeDump(sql);
model.analysis = {status:'complete', parsedAt:new Date().toISOString(), bytes:Buffer.byteLength(sql), limitation:'Lectura estática del respaldo; no se ejecutó SQL.'};
await writeFile(output, JSON.stringify(model, null, 2), 'utf8');
console.log(JSON.stringify({database:model.database, tables:model.tables.map(t=>({name:t.name,columns:t.columns.length,pk:t.primaryKey,fks:t.foreignKeys.length,rows:t.rowCount})),relations:model.relations.length,objects:model.objects,unsupported:model.unsupportedStatements},null,2));
