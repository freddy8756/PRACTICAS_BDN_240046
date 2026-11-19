import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(directory, 'schema.json');
const outputPath = path.join(directory, 'README_DICCIONARIO.md');
// GitHub Pages publishes from /docs at the repository root. This project lives
// in Practica03/eer, so move two levels up before choosing the output folder.
const htmlDirectory = path.resolve(directory, '..', '..', 'docs');
const localHtml = process.argv.includes('--local-html');
const htmlOutputDirectory = localHtml ? directory : htmlDirectory;
const htmlPath = path.join(htmlOutputDirectory, localHtml ? 'diccionario.html' : 'index.html');
const markdownOnly = process.argv.includes('--markdown-only');

const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
const tables = schema.tables ?? [];
const relations = schema.relations ?? [];
const objects = schema.objects ?? {};
const tableDescriptions = {
  tb_buyer_orders: 'Registra las órdenes de compra realizadas por los compradores, con sus importes y estados.',
  tb_carts: 'Representa el carrito de compra asociado a un usuario.',
  tb_logs: 'Almacena el historial de operaciones registradas sobre las tablas de la base de datos.',
  tb_order_cancellations: 'Registra solicitudes de cancelación asociadas a una orden y al usuario que la solicita.',
  tb_payment_transactions: 'Guarda las transacciones y respuestas del proveedor de pago para cada pago.',
  tb_payments: 'Registra los pagos de órdenes, el método usado, el importe y su estado.',
  tb_people: 'Almacena datos personales y de contacto complementarios al perfil de usuario.',
  tb_product_categorias: 'Asocia productos con categorías.',
  tb_product_reviews: 'Guarda las calificaciones y reseñas que los usuarios publican sobre productos.',
  tb_products: 'Contiene el catálogo de productos, precios, existencias y estado de publicación.',
  tb_returns: 'Registra solicitudes de devolución de órdenes y su estado.',
  tb_shipments: 'Contiene información de envío, seguimiento y entrega de las órdenes.',
  tb_user_addresses: 'Almacena las direcciones de entrega de cada usuario.',
  tb_users: 'Contiene las cuentas de acceso de los usuarios.',
  tbc_categorias: 'Catálogo jerárquico de categorías para clasificar productos.',
  tbc_payment_methods: 'Catálogo de métodos o proveedores de pago disponibles.',
  tbc_payment_methods_types: 'Catálogo de tipos de método de pago que un usuario puede registrar.',
  tbd_address_components: 'Desglosa una dirección en componentes, como calle, ciudad o código postal, y permite jerarquizarlos.',
  tbd_cancellation_items: 'Detalla los artículos y cantidades incluidos en una cancelación.',
  tbd_carts_items: 'Detalla los productos y proveedores incluidos en cada carrito.',
  tbd_order_items: 'Detalla los productos, cantidades y precios que componen una orden.',
  tbd_products_users_providers: 'Relaciona productos con usuarios proveedores y registra el tipo de propiedad y disponibilidad.',
  tbd_return_items: 'Detalla los artículos y cantidades incluidos en una devolución.',
  tbd_user_payment_methods: 'Almacena los métodos de pago registrados por cada usuario y sus referencias seguras.',
  tbd_users_wishlist_products: 'Relaciona usuarios con productos guardados en su lista de deseos.'
};
const fieldDescriptions = {
  subtotal: 'Importe de los artículos de la orden antes de agregar el costo de envío.',
  shipping_cost: 'Importe cobrado por el envío de la orden.',
  fulfillment_status: 'Estado del proceso de preparación y cumplimiento de la orden.',
  table_name: 'Nombre de la tabla sobre la que se realizó la operación registrada.',
  table_operation: 'Tipo de operación realizada sobre la tabla, por ejemplo INSERT, UPDATE o DELETE.',
  db_user: 'Usuario de base de datos que ejecutó la operación.',
  table_description: 'Descripción del registro o de la operación guardada en la bitácora.',
  operation_date: 'Fecha y hora en que ocurrió la operación registrada.',
  operation_status: 'Resultado o estado de la operación registrada.',
  product_id: 'Identificador del producto relacionado con el evento de bitácora.',
  cancellation_reason: 'Motivo indicado para solicitar la cancelación.',
  approval_status: 'Estado de aprobación o rechazo de la solicitud de cancelación.',
  transaction_code: 'Código de referencia de la transacción asignado por el procesador de pago.',
  payment_status: 'Estado del ciclo de pago, como pendiente, aprobado, rechazado o reembolsado.',
  transaction_status: 'Resultado o estado devuelto para la transacción de pago.',
  response_message: 'Mensaje de respuesta recibido del procesador de pago.',
  amount: 'Importe del pago registrado.',
  courtesy_title: 'Tratamiento o título de cortesía de la persona.',
  given_names: 'Nombre o nombres de la persona.',
  family_names: 'Apellidos de la persona.',
  birth_date: 'Fecha de nacimiento de la persona.',
  gender: 'Género registrado para la persona.',
  country_code: 'Código del país asociado a la persona o a su teléfono.',
  phone: 'Número telefónico de contacto de la persona.',
  rating: 'Calificación numérica asignada al producto.',
  review: 'Texto de la reseña del producto.',
  SKU: 'Código de referencia del producto en el catálogo o inventario.',
  name: 'Nombre visible del elemento del catálogo.',
  description: 'Descripción textual del elemento del catálogo.',
  current_price: 'Precio vigente del producto.',
  current_stock: 'Cantidad disponible actualmente en inventario.',
  reason: 'Motivo indicado para solicitar la devolución.',
  return_status: 'Estado del proceso de devolución.',
  tracking_number: 'Número de guía o referencia para rastrear el envío.',
  carrier: 'Empresa transportista encargada del envío.',
  shipment_status: 'Estado actual del envío.',
  shipped_date: 'Fecha en que el paquete fue enviado.',
  delivered_date: 'Fecha en que el paquete fue entregado.',
  address_label: 'Etiqueta que permite identificar la dirección, por ejemplo casa o trabajo.',
  recipient_name: 'Nombre de la persona que recibirá el envío en esta dirección.',
  recipient_phone: 'Teléfono de contacto de la persona que recibirá el envío.',
  delivery_instructions: 'Indicaciones adicionales para realizar la entrega.',
  latitude: 'Coordenada de latitud de la ubicación de la dirección.',
  longitude: 'Coordenada de longitud de la ubicación de la dirección.',
  is_default: 'Indica si este registro está marcado como preferido o predeterminado.',
  email: 'Dirección de correo electrónico de acceso o contacto de la cuenta.',
  nick: 'Nombre de usuario o alias público de la cuenta.',
  password: 'Contraseña o valor de credencial almacenado para la autenticación.',
  last_login: 'Fecha y hora del último inicio de sesión registrado.',
  sup_id_category: 'Categoría superior de la que depende esta categoría; permite formar jerarquías.',
  code: 'Código corto que identifica el método de pago en el catálogo.',
  value: 'Valor textual de este componente de la dirección.',
  component_type: 'Tipo de dato de dirección que representa el componente, como ciudad o calle.',
  address_sup_ID: 'Componente de dirección superior al que pertenece este componente.',
  quantity: 'Cantidad de unidades del artículo en el carrito, orden, cancelación o devolución.',
  product_name: 'Nombre del producto conservado como referencia al momento de crear la orden.',
  unit_price: 'Precio por unidad del producto registrado en el artículo de la orden.',
  type_ownership: 'Tipo de relación de propiedad o titularidad entre el usuario y el producto.',
  available_date: 'Fecha a partir de la cual el producto se encuentra disponible.',
  observation: 'Nota adicional sobre el artículo devuelto.',
  provider: 'Nombre del proveedor o procesador externo asociado al m?todo de pago o a la transacci?n.',
  provider_method_ref: 'Referencia del método de pago guardada por el proveedor; permite identificarlo sin almacenar todos sus datos sensibles.',
  label: 'Nombre descriptivo que el usuario asignó al método de pago.',
  last_four: 'Últimos cuatro dígitos visibles del medio de pago, usados para reconocerlo.'
};
const describeColumn = (table, column) => {
  if (column.comment) return column.comment;
  const fk = (table.foreignKeys ?? []).find((item) => item.columns?.includes(column.name));
  if (fk) return `Identificador del registro relacionado en ${fk.referencedTable}${fk.referencedColumns?.length ? ` (${fk.referencedColumns.join(', ')})` : ''}.`;
  if (table.primaryKey?.includes(column.name) || column.primaryKey) return `Identificador unico que distingue cada registro de ${table.name}.`;
  if (column.name === 'status') return 'Estado lógico o de actividad del registro dentro del proceso correspondiente.';
  if (column.name === 'creation_date') return 'Fecha y hora en que se creó el registro.';
  if (column.name === 'last_update') return 'Fecha y hora de la última modificación del registro.';
  if (fieldDescriptions[column.name]) return fieldDescriptions[column.name];
  const label = column.name.replaceAll('_', ' ');
  return `Dato de ${label} asociado a ${tableDescriptions[table.name]?.replace(/\.$/, '') ?? `la tabla ${table.name}`}.`;
};
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
  lines.push(tableDescriptions[table.name] ?? `Almacena los registros de ${table.name}.`, '');
  lines.push(`- **Motor:** ${cell(table.engine)}`);
  lines.push(`- **Filas reportadas:** ${Number(table.rowCount) || 0}`);
  lines.push(`- **Clave primaria:** ${list(table.primaryKey)}`);
  lines.push('', '| # | Columna | Tipo | Nula | Predeterminado | Atributos | Descripción |', '| ---: | --- | --- | :---: | --- | --- | --- |');
  for (const column of table.columns ?? []) {
    const markers = [];
    if (column.primaryKey || table.primaryKey?.includes(column.name)) markers.push('PK');
    if (column.autoIncrement) markers.push('AUTO_INCREMENT');
    if (column.unique) markers.push('UNIQUE');
    const foreignKeys = (table.foreignKeys ?? []).filter((fk) => fk.columns?.includes(column.name));
    for (const fk of foreignKeys) markers.push(`FK → ${fk.referencedTable}(${(fk.referencedColumns ?? []).join(', ')})`);
    const attributeText = [...(column.attributes ?? []), ...markers].join(', ') || '—';
    lines.push(`| ${column.ordinal ?? '—'} | ${inline(column.name)} | ${inline(column.type)} | ${column.nullable ? 'Sí' : 'No'} | ${inline(column.default)} | ${cell(attributeText)} | ${cell(describeColumn(table, column))} |`);
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

const escapeHtml = (value) => String(value ?? '—')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const htmlValue = (value) => escapeHtml(value == null || value === '' ? '—' : value);
const htmlList = (values) => values?.length
  ? values.map((value) => `<code>${escapeHtml(value)}</code>`).join(', ')
  : '—';
const htmlSectionList = (title, entries, id) => `
  <section class="panel" id="${id}">
    <div class="section-heading"><div><p class="eyebrow">Objetos de la base</p><h2>${title}</h2></div><span class="count">${entries?.length ?? 0}</span></div>
    ${entries?.length
      ? `<ul class="object-list">${entries.map((entry) => `<li><code>${escapeHtml(entry)}</code></li>`).join('')}</ul>`
      : '<p class="empty">No se encontraron objetos.</p>'}
  </section>`;

const stats = [
  ['Tablas', tables.length], ['Columnas', columnCount], ['Claves foráneas', fkCount],
  ['Relaciones', relations.length], ['Vistas', (objects.views ?? []).length],
  ['Triggers', (objects.triggers ?? []).length], ['Procedimientos', (objects.procedures ?? []).length],
  ['Filas reportadas', rowCount],
];
const tableCards = tables.map((table) => {
  const columns = table.columns ?? [];
  const columnRows = columns.map((column) => {
    const markers = [];
    if (column.primaryKey || table.primaryKey?.includes(column.name)) markers.push('<span class="badge pk">PK</span>');
    if (column.autoIncrement) markers.push('<span class="badge">AUTO_INCREMENT</span>');
    if (column.unique) markers.push('<span class="badge">UNIQUE</span>');
    for (const fk of (table.foreignKeys ?? []).filter((item) => item.columns?.includes(column.name))) {
      markers.push(`<span class="badge fk">FK → ${escapeHtml(fk.referencedTable)} (${escapeHtml((fk.referencedColumns ?? []).join(', '))})</span>`);
    }
    if (column.attributes?.length) markers.push(`<span class="muted">${escapeHtml(column.attributes.join(', '))}</span>`);
    return `<tr><td>${escapeHtml(column.ordinal ?? '—')}</td><th scope="row"><code>${escapeHtml(column.name)}</code></th><td><code>${escapeHtml(column.type)}</code></td><td>${column.nullable ? 'Sí' : 'No'}</td><td><code>${escapeHtml(column.default ?? '—')}</code></td><td>${markers.join(' ') || '—'}</td><td>${escapeHtml(describeColumn(table, column))}</td></tr>`;
  }).join('');
  const fks = table.foreignKeys?.length
    ? `<ul class="compact-list">${table.foreignKeys.map((fk) => `<li><code>${escapeHtml(fk.name)}</code>: ${htmlList(fk.columns)} → <code>${escapeHtml(fk.referencedTable)}</code> (${htmlList(fk.referencedColumns)})</li>`).join('')}</ul>`
    : '<p class="muted">Sin claves foráneas.</p>';
  return `<details class="table-card" id="tabla-${encodeURIComponent(table.name)}" ${tables.length <= 5 ? 'open' : ''}>
    <summary><span><code>${escapeHtml(table.name)}</code><small>${columns.length} columnas · PK: ${escapeHtml((table.primaryKey ?? []).join(', ') || '—')}</small></span><span class="table-meta">${Number(table.rowCount) || 0} filas reportadas · ${escapeHtml(table.engine ?? 'Motor no indicado')}</span></summary>
    <div class="table-content"><p class="table-description">${escapeHtml(tableDescriptions[table.name] ?? `Almacena los registros de ${table.name}.`)}</p><div class="table-wrap"><table><thead><tr><th>#</th><th>Columna</th><th>Tipo</th><th>Nula</th><th>Predeterminado</th><th>Claves y atributos</th><th>Descripci&#243;n</th></tr></thead><tbody>${columnRows || '<tr><td colspan="7">Sin columnas registradas.</td></tr>'}</tbody></table></div>${fks}</div>
  </details>`;
}).join('\n');
const relationRows = relations.map((relation) => `<tr><td><code>${escapeHtml(relation.source)}</code><small>${htmlList(relation.sourceColumns)}</small></td><td><span class="relation-arrow">→</span></td><td><code>${escapeHtml(relation.target)}</code><small>${htmlList(relation.targetColumns)}</small></td><td><span class="badge">${escapeHtml(relation.cardinality ?? '—')}</span></td><td>${escapeHtml(relation.kind ?? '—')}</td><td>${escapeHtml(relation.name ?? '—')}${relation.warning ? `<small class="warning">${escapeHtml(relation.warning)}</small>` : ''}</td></tr>`).join('');
const generatedAt = schema.analysis?.parsedAt ? new Date(schema.analysis.parsedAt).toLocaleString('es-MX') : 'No indicado';
const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Diccionario de datos de ${escapeHtml(schema.database?.target ?? 'la base de datos')}: tablas, columnas, relaciones y objetos.">
  <meta name="theme-color" content="#101827">
  <title>${escapeHtml(schema.database?.target ?? 'Base de datos')} · Diccionario de datos</title>
  <style>
    :root{color-scheme:dark;--bg:#0b1120;--panel:#121c2e;--panel-2:#17243a;--line:#263650;--text:#e8eef8;--muted:#9aabc2;--accent:#70e1c1;--blue:#8eb9ff;--warning:#ffd17a;--radius:18px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(ellipse at 18% 0%,#183453 0,transparent 34rem),var(--bg);color:var(--text);font:15px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}a{color:var(--accent)}code{font: .92em ui-monospace,SFMono-Regular,Consolas,monospace;color:#b9d2ff;overflow-wrap:anywhere}.shell{width:min(1180px,calc(100% - 36px));margin:auto}.hero{padding:68px 0 42px}.eyebrow{margin:0 0 10px;color:var(--accent);font-size:.76rem;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.hero h1{max-width:850px;margin:0;font-size:clamp(2.3rem,6vw,4.4rem);line-height:1.04;letter-spacing:-.045em}.hero p.lead{max-width:720px;color:var(--muted);font-size:1.08rem}.hero-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.pill,.badge,.count{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:999px;background:#17243a;padding:5px 11px;color:#c8d6e9;font-size:.78rem}.download-button{display:inline-flex;align-items:center;gap:9px;padding:10px 15px;border:1px solid #55c5a7;border-radius:11px;background:linear-gradient(135deg,#70e1c1,#7bb9ff);color:#071522;font-weight:750;text-decoration:none;box-shadow:0 8px 24px #70e1c122;transition:transform .18s,filter .18s}.download-button:hover{transform:translateY(-2px);filter:brightness(1.08)}.layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:24px;align-items:start;padding-bottom:64px}.nav{position:sticky;top:18px;display:grid;gap:5px;padding:14px;border:1px solid var(--line);border-radius:var(--radius);background:#101a2bea}.nav a{padding:8px 10px;border-radius:9px;color:var(--muted);text-decoration:none}.nav a:hover{background:var(--panel-2);color:var(--text)}main{min-width:0;display:grid;gap:20px}.panel,.table-card{border:1px solid var(--line);border-radius:var(--radius);background:linear-gradient(145deg,#142137,#101827 72%);box-shadow:0 12px 34px #0002}.panel{padding:24px}.section-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px}.section-heading h2{margin:0;font-size:1.45rem;letter-spacing:-.02em}.section-heading .eyebrow{margin-bottom:3px}.count{color:var(--accent)}.summary-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.summary-item{padding:13px;border-radius:12px;background:#0c1524;border:1px solid #1f3049}.summary-item span{display:block;color:var(--muted);font-size:.8rem}.summary-item strong{display:block;margin-top:4px;overflow-wrap:anywhere}.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.stat{padding:15px;border:1px solid var(--line);border-radius:13px;background:#0d1727}.stat strong{display:block;font-size:1.55rem;line-height:1.2}.stat span{color:var(--muted);font-size:.82rem}.note,.muted,small{color:var(--muted)}.note{font-size:.84rem}.relation-wrap,.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:12px}table{width:100%;border-collapse:collapse;font-size:.88rem}th,td{padding:11px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #22324a}thead th{background:#17243a;color:#c4d3e7;font-size:.76rem;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}tbody tr:hover{background:#ffffff05}td small{display:block;margin-top:3px}.relation-arrow{color:var(--accent);font-size:1.2rem}.badge{padding:2px 8px;margin:1px 2px 1px 0;font-size:.72rem;white-space:normal}.badge.pk{color:#a6eacb;border-color:#34765f;background:#123127}.badge.fk{color:#a9c9ff;border-color:#365a91;background:#152743}.table-list{display:grid;gap:11px}.table-card{overflow:hidden}.table-card summary{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:16px 18px;cursor:pointer;list-style:none}.table-card summary::-webkit-details-marker{display:none}.table-card summary:after{content:'＋';color:var(--accent);font-size:1.1rem}.table-card[open] summary:after{content:'−'}.table-card summary small{display:block;margin-top:4px}.table-meta{color:var(--muted);font-size:.8rem;text-align:right}.table-description{margin:0 0 12px;color:var(--muted)}.table-content{padding:0 16px 18px}.table-content .compact-list{padding-left:20px}.compact-list li{margin:6px 0}.empty{color:var(--muted)}.object-list{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.object-list li{padding:8px 11px;border:1px solid var(--line);border-radius:10px;background:#0d1727}.warning{color:var(--warning)}footer{padding:20px 0 34px;color:var(--muted);font-size:.82rem;border-top:1px solid var(--line)}@media(max-width:850px){.layout{grid-template-columns:1fr}.nav{position:static;display:flex;overflow:auto}.nav a{white-space:nowrap}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.shell{width:min(100% - 22px,1180px)}.hero{padding:44px 0 28px}.panel{padding:17px}.summary-grid{grid-template-columns:1fr}.table-card summary{align-items:flex-start;flex-direction:column}.table-meta{text-align:left}.table-card summary:after{position:absolute;right:30px}.table-card summary{position:relative;padding-right:45px}th,td{padding:9px}.stats{gap:7px}.stat{padding:12px}}
  </style>
</head>
<body>
  <header class="shell hero">
    <p class="eyebrow">Diccionario de datos</p>
    <h1>${escapeHtml(schema.database?.target ?? 'Base de datos')}</h1>
    <p class="lead">Referencia navegable del esquema: estructura, claves y relaciones de la base de datos.</p>
    <div class="hero-meta"><span class="pill">${tables.length} tablas</span><span class="pill">${columnCount} columnas</span><span class="pill">Generado desde schema.json</span><a class="download-button" href="./DiccionarioDatos.pdf" download="DiccionarioDatos.pdf" aria-label="Descargar DiccionarioDatos.pdf">↓ Descargar DiccionarioDatos.pdf</a></div>
  </header>
  <div class="shell layout">
    <nav class="nav" aria-label="Secciones"><a href="#resumen">Resumen</a><a href="#estadisticas">Estadísticas</a><a href="#relaciones">Relaciones</a><a href="#tablas">Tablas</a><a href="#vistas">Vistas</a><a href="#triggers">Triggers</a><a href="#procedimientos">Procedimientos</a></nav>
    <main>
      <section class="panel" id="resumen"><div class="section-heading"><div><p class="eyebrow">Contexto</p><h2>Resumen general</h2></div></div><div class="summary-grid"><div class="summary-item"><span>Base de datos</span><strong>${htmlValue(schema.database?.target)}</strong></div><div class="summary-item"><span>Bases declaradas</span><strong>${htmlValue(schema.database?.declared?.join(', '))}</strong></div><div class="summary-item"><span>Archivo fuente</span><strong>${htmlValue(schema.source)}</strong></div><div class="summary-item"><span>Estado del análisis</span><strong>${htmlValue(schema.analysis?.status)}</strong></div><div class="summary-item"><span>Fecha del análisis</span><strong>${escapeHtml(generatedAt)}</strong></div><div class="summary-item"><span>Motor(es)</span><strong>${htmlValue([...new Set(tables.map((table) => table.engine).filter(Boolean))].join(', '))}</strong></div></div>${schema.analysis?.limitation ? `<p class="note">${escapeHtml(schema.analysis.limitation)}</p>` : ''}</section>
      <section class="panel" id="estadisticas"><div class="section-heading"><div><p class="eyebrow">En cifras</p><h2>Estadísticas</h2></div></div><div class="stats">${stats.map(([label, value]) => `<div class="stat"><strong>${Number(value).toLocaleString('es-MX')}</strong><span>${label}</span></div>`).join('')}</div><p class="note">Las filas son las indicadas por el esquema analizado; no necesariamente representan el estado actual de la base.</p></section>
      <section class="panel" id="relaciones"><div class="section-heading"><div><p class="eyebrow">Integridad referencial</p><h2>Relaciones</h2></div><span class="count">${relations.length}</span></div>${relations.length ? `<div class="relation-wrap"><table><thead><tr><th>Origen</th><th></th><th>Destino</th><th>Cardinalidad</th><th>Tipo</th><th>Restricción / nota</th></tr></thead><tbody>${relationRows}</tbody></table></div>` : '<p class="empty">No se encontraron relaciones.</p>'}${schema.manyToMany?.length ? `<h3>Relaciones muchos a muchos</h3><ul class="compact-list">${schema.manyToMany.map((item) => `<li><code>${escapeHtml(item.table)}</code>: ${htmlList(item.leftTable ? [item.leftTable] : [])} ↔ ${htmlList(item.rightTable ? [item.rightTable] : [])}</li>`).join('')}</ul>` : ''}</section>
      <section id="tablas"><div class="section-heading"><div><p class="eyebrow">Estructura física</p><h2>Todas las tablas</h2></div><span class="count">${tables.length}</span></div><div class="table-list">${tableCards || '<p class="empty">No se encontraron tablas.</p>'}</div></section>
      ${htmlSectionList('Vistas', objects.views, 'vistas')}
      ${htmlSectionList('Triggers', objects.triggers, 'triggers')}
      ${htmlSectionList('Procedimientos almacenados', objects.procedures, 'procedimientos')}
    </main>
  </div>
  <footer class="shell">Generado automáticamente desde <code>schema.json</code> · ${escapeHtml(generatedAt)} · Compatible con GitHub Pages.</footer>
</body>
</html>
`;
if (!markdownOnly) {
  await mkdir(htmlOutputDirectory, { recursive: true });
  await writeFile(htmlPath, html, 'utf8');
}
console.log(`Diccionario generado: ${path.basename(outputPath)}${markdownOnly ? '' : ` y ${localHtml ? 'diccionario.html' : 'docs/index.html'}`} (${tables.length} tablas, ${columnCount} columnas).`);
