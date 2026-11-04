# Modelo EER de `db_test_8b`

Aplicación web estática, sin dependencias externas. Lee `../backups/respaldo_1410.sql` como texto y mantiene el esquema normalizado en `schema.json`. No ejecuta sentencias ni muestra valores de filas.

## Iniciar

Con Node.js 18 o posterior, desde esta carpeta:

```powershell
node server.mjs
```

Abre `http://127.0.0.1:4173`. El servidor solo escucha en la interfaz local.

## Actualizar el análisis

Si cambia el archivo de respaldo, ejecuta:

```powershell
node analyze.mjs
```

La aplicación también permite cargar otro `.sql` desde **Exportar → Analizar otro respaldo…**. Ese archivo se procesa en memoria del navegador; no se envía ni se ejecuta.

## Alcance del conteo

Los números se etiquetan como **Filas incluidas en el respaldo** y cuentan tuplas de instrucciones `INSERT ... VALUES`. Un cero indica que el respaldo no contiene filas INSERT para esa tabla; no describe la cantidad actual de MySQL. Los conteos actuales requieren un backend protegido y una conexión autorizada de solo lectura, que este proyecto no configura.

El respaldo contiene procedimientos almacenados y triggers. No se ejecutaron, por lo que las cifras no se presentan como reconstrucción del estado final. Las tablas asociativas se confirman por PK compuesta con FK; otras tablas con varias FK se muestran como candidatas cuando no existe unicidad conjunta declarada.

## Archivos

- `sql-parser.js`: lexer y analizador estático de instrucciones MySQL, comentarios ejecutables versionados, DDL, claves, índices, vistas, triggers, procedimientos e INSERTs.
- `analyze.mjs`: genera `schema.json` desde el respaldo original sin alterarlo.
- `app.js`, `index.html`, `styles.css`: lienzo, búsqueda, filtros, panel de detalle, conteos y exportaciones.
- `server.mjs`: servidor estático local para permitir cargar el JSON en el navegador.
