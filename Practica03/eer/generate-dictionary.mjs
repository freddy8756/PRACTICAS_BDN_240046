import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(directory, 'schema.json');
const outputPath = path.join(directory, 'README_DICCIONARIO.md');

const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
const tables = schema.tables ?? [];
const relations = schema.relations ?? [];
const objects = schema.objects ?? {};
const sum = (values) => values.reduce((total, value) => total + value, 0);
const inline = (value) => {
  const text = value == null || value === '' ? '—' : String(value);
  return `\`${text.replaceAll('`', '\\`').replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ')}\``;
};
const cell = (value) => String(value ?? '—').replaceAll('|', '\\|').replace(/[\r\n]+/g, ' ');
const list = (values) => values?.length ? values.map(inline).join(', ') : '—';
const sectionList = (title, entries) => {
  const lines = [`## ${title}`, ''];
  if (entries?.length) lines.push(...entries.map((entry) => `- ${inline(entry)}`));
  else lines.push('_No se encontraron objetos._');
  lines.push('');
  return lines;
};

const columnCount = sum(tables.map((table) => table.columns?.length ?? 0));
const pkCount = tables.reduce((total, table) => total + (table.primaryKey?.length ? 1 : 0), 0);
const fkCount = sum(tables.map((table) => table.foreignKeys?.length ?? 0));
const indexCount = sum(tables.map((table) => table.indexes?.length ?? 0));
const checkCount = sum(tables.map((table) => table.checks?.length ?? 0));
const rowCount = sum(tables.map((table) => Number(table.rowCount) || 0));
const lines = [
  '# Diccionario de datos',
  '',
  '> Documento generado automáticamente desde `schema.json`. Para actualizarlo, ejecuta `node generate-dictionary.mjs`.',
  '',
  '## Información general',
  '',
  '| Propiedad | Valor |',
  '| --- | --- |',
  `| Base de datos objetivo | ${cell(schema.database?.target)} |`,
  `| Bases declaradas | ${cell(schema.database?.declared?.join(', '))} |`,
  `| Archivo fuente | ${cell(schema.source)} |`,
  `| Estado del análisis | ${cell(schema.analysis?.status)} |`,
  `| Analizado en | ${cell(schema.analysis?.parsedAt)} |`,
  `| Limitación | ${cell(schema.analysis?.limitation)} |`,
  '',
  '## Estadísticas',
  '',
  '| Métrica | Cantidad |',
  '| --- | ---: |',
  `| Tablas | ${tables.length} |`,
  `| Columnas | ${columnCount} |`,
  `| Tablas con clave primaria | ${pkCount} |`,
  `| Claves foráneas | ${fkCount} |`,
  `| Índices | ${indexCount} |`,
  `| Restricciones CHECK | ${checkCount} |`,
  `| Relaciones | ${relations.length} |`,
  `| Vistas | ${(objects.views ?? []).length} |`,
  `| Triggers | ${(objects.triggers ?? []).length} |`,
  `| Procedimientos almacenados | ${(objects.procedures ?? []).length} |`,
  `| Filas indicadas por el esquema | ${rowCount} |`,
  `| Sentencias analizadas | ${schema.statementCount ?? 0} |`,
  '',
  '> Los conteos de filas corresponden a los valores registrados en el esquema; consulta las advertencias para conocer su alcance.',
  '',
];

lines.push('## Tablas y columnas', '');
if (!tables.length) lines.push('_No se encontraron tablas._', '');
for (const table of tables) {
  lines.push(`### ${inline(table.name)}`, '');
  lines.push(`- **Motor:** ${cell(table.engine)}`);
  lines.push(`- **Filas reportadas:** ${Number(table.rowCount) || 0}`);
  lines.push(`- **Clave primaria:** ${list(table.primaryKey)}`);
  lines.push('', '| # | Columna | Tipo | Nula | Predeterminado | Atributos |', '| ---: | --- | --- | :---: | --- | --- |');
  for (const column of table.columns ?? []) {
    const markers = [];
    if (column.primaryKey || table.primaryKey?.includes(column.name)) markers.push('PK');
    if (column.autoIncrement) markers.push('AUTO_INCREMENT');
    if (column.unique) markers.push('UNIQUE');
    const foreignKeys = (table.foreignKeys ?? []).filter((fk) => fk.columns?.includes(column.name));
    for (const fk of foreignKeys) markers.push(`FK → ${fk.referencedTable}(${(fk.referencedColumns ?? []).join(', ')})`);
    const attributeText = [...(column.attributes ?? []), ...markers].join(', ') || '—';
    lines.push(`| ${column.ordinal ?? '—'} | ${inline(column.name)} | ${inline(column.type)} | ${column.nullable ? 'Sí' : 'No'} | ${inline(column.default)} | ${cell(attributeText)} |`);
  }
  lines.push('');
  lines.push('**Claves foráneas**', '');
  if (table.foreignKeys?.length) {
    lines.push('| Nombre | Columnas locales | Tabla referenciada | Columnas referenciadas | ON DELETE | ON UPDATE |', '| --- | --- | --- | --- | --- | --- |');
    for (const fk of table.foreignKeys) lines.push(`| ${inline(fk.name)} | ${list(fk.columns)} | ${inline(fk.referencedTable)} | ${list(fk.referencedColumns)} | ${cell(fk.onDelete ?? '—')} | ${cell(fk.onUpdate ?? '—')} |`);
  } else lines.push('_Sin claves foráneas._');
  lines.push('', '**Índices**', '');
  if (table.indexes?.length) {
    lines.push('| Nombre | Tipo | Columnas |', '| --- | --- | --- |');
    for (const index of table.indexes) lines.push(`| ${inline(index.name)} | ${cell(index.type)} | ${list(index.columns)} |`);
  } else lines.push('_Sin índices adicionales._');
  if (table.checks?.length) {
    lines.push('', '**Restricciones CHECK**', '', '| Nombre | Expresión |', '| --- | --- |');
    for (const check of table.checks) lines.push(`| ${inline(check.name)} | ${inline(check.expression)} |`);
  }
  lines.push('');
}

lines.push('## Relaciones', '');
if (relations.length) {
  lines.push('| Tabla origen | Columnas origen | Tabla destino | Columnas destino | Cardinalidad | Tipo | Nombre | Nota |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const relation of relations) lines.push(`| ${inline(relation.source)} | ${list(relation.sourceColumns)} | ${inline(relation.target)} | ${list(relation.targetColumns)} | ${cell(relation.cardinality)} | ${cell(relation.kind)} | ${inline(relation.name)} | ${cell(relation.warning)} |`);
} else lines.push('_No se encontraron relaciones._');
lines.push('');
if (schema.manyToMany?.length) {
  lines.push('### Relaciones muchos a muchos', '', '| Tabla de asociación | Lado izquierdo | Lado derecho |', '| --- | --- | --- |');
  for (const relation of schema.manyToMany) lines.push(`| ${inline(relation.table)} | ${inline(relation.leftTable)} (${list(relation.leftColumns)}) | ${inline(relation.rightTable)} (${list(relation.rightColumns)}) |`);
  lines.push('');
}

lines.push(...sectionList('Vistas', objects.views));
lines.push(...sectionList('Triggers', objects.triggers));
lines.push(...sectionList('Procedimientos almacenados', objects.procedures));
if (schema.warnings?.length) {
  lines.push('## Advertencias del análisis', '', ...schema.warnings.map((warning) => `- ${cell(warning)}`), '');
}
await writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Diccionario generado: ${path.basename(outputPath)} (${tables.length} tablas, ${columnCount} columnas).`);
