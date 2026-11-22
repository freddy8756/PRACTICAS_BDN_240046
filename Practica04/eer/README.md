# Modelo EER de `db_test_8b`

Modelo entidad-relación y diccionario de datos actualizados con `../backups/respaldo_1410.sql`. El análisis estático reconoce 25 tablas, 36 relaciones y los objetos programables declarados en el respaldo. El modelo se visualiza en `index.html`; el diccionario está disponible en `README_DICCIONARIO.md` y `diccionario.html`.

## Paso añadido al flujo

Se añadió la **reclamación/devolución de una orden, con seguimiento de sus artículos y posible reenvío**. El respaldo refleja esta etapa en `tb_returns` y `tbd_return_items`, relacionadas con la orden y el usuario. La vista `vw_auditoria_casos_prueba` la clasifica como **“Reclamación / Devolución”** y contempla el caso de compra con fallo en el último pago, reclamación y reenvío. También se documentan las tablas de cancelación (`tb_order_cancellations` y `tbd_cancellation_items`) que aparecen en el flujo de auditoría.

## Iniciar

Con Node.js 18 o posterior, desde esta carpeta:

```powershell
node server.mjs
```

Abre `http://127.0.0.1:4173`. El servidor solo escucha en la interfaz local.

## Actualizar el análisis

Si cambia el respaldo, ejecuta:

```powershell
node analyze.mjs
node generate-dictionary.mjs --local-html
```

El primer comando actualiza `schema.json` (tablas, columnas, claves, relaciones y objetos detectados). El segundo regenera el diccionario Markdown y `diccionario.html` desde ese esquema.

Para regenerar los registros de `INSERT` por tabla:

```powershell
npm run generate:rows
```

La aplicación también permite cargar otro `.sql` desde **Exportar → Analizar otro respaldo…**. Se procesa en memoria del navegador; no se envía ni ejecuta.

## Alcance

Los conteos de filas corresponden a tuplas incluidas en instrucciones `INSERT` del respaldo; no representan necesariamente el estado actual de MySQL. El respaldo contiene procedimientos, triggers y vistas, pero el análisis es estático: no ejecuta SQL. Las tablas asociativas se identifican por sus claves y relaciones declaradas.

## Archivos principales

- `schema.json`: esquema normalizado que usa la visualización.
- `README_DICCIONARIO.md`, `diccionario.html`: diccionario de datos generado.
- `analyze.mjs`, `sql-parser.js`: análisis estático del respaldo.
- `app.js`, `index.html`, `styles.css`: lienzo del modelo entidad-relación y controles.
- `server.mjs`: servidor local para abrir la aplicación.
