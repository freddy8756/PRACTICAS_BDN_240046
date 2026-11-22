const details = document.querySelector('#details');
const cache = new Map();
const states = new Map();
let activeTable = null;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const pageSize = 25;

function stateFor(table) {
  if (!states.has(table)) states.set(table, { page: 0, query: '' });
  return states.get(table);
}

function addSection(table) {
  const scroll = details.querySelector('.detail-scroll');
  if (!scroll) return;
  scroll.insertAdjacentHTML('beforeend', `<section class="record-section" data-record-section="${esc(table)}"><div class="detail-section-title">DATOS EN EL RESPALDO <span class="record-count">Cargando…</span></div><p class="record-note">Filas incluidas en INSERT del respaldo; no representan necesariamente el estado actual. Los campos de credenciales se ocultan.</p><input class="record-search" type="search" placeholder="Buscar en los datos de esta tabla…" aria-label="Buscar registros"><div class="record-table-wrap"><div class="record-loading">Cargando filas de ${esc(table)}…</div></div><div class="record-pagination"></div></section>`);
}

function renderRows(table, dataset) {
  if (activeTable !== table) return;
  const section = details.querySelector(`[data-record-section="${CSS.escape(table)}"]`);
  if (!section) return;
  const state = stateFor(table);
  const query = state.query.trim().toLocaleLowerCase();
  const matches = query ? dataset.rows.filter(row => row.some(value => String(value ?? 'NULL').toLocaleLowerCase().includes(query))) : dataset.rows;
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  state.page = Math.max(0, Math.min(state.page, pageCount - 1));
  const start = state.page * pageSize;
  const rows = matches.slice(start, start + pageSize);
  section.querySelector('.record-count').textContent = `${dataset.rows.length.toLocaleString('es-MX')} filas`;
  section.querySelector('.record-table-wrap').innerHTML = matches.length ? `<table class="record-table"><thead><tr><th>#</th>${dataset.columns.map(column => `<th>${esc(column)}</th>`).join('')}</tr></thead><tbody>${rows.map((row, index) => `<tr><td>${(start + index + 1).toLocaleString('es-MX')}</td>${dataset.columns.map((_, columnIndex) => `<td>${esc(row[columnIndex] === null ? 'NULL' : row[columnIndex] ?? '—')}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '<div class="record-loading">No hay filas que coincidan con la búsqueda.</div>';
  section.querySelector('.record-pagination').innerHTML = `<button type="button" class="button secondary record-page" data-direction="-1" ${state.page === 0 ? 'disabled' : ''}>Anterior</button><span>Página ${state.page + 1} de ${pageCount} · ${matches.length.toLocaleString('es-MX')} resultados</span><button type="button" class="button secondary record-page" data-direction="1" ${state.page >= pageCount - 1 ? 'disabled' : ''}>Siguiente</button>`;
}

async function loadRows(table) {
  if (cache.has(table)) return renderRows(table, cache.get(table));
  const section = details.querySelector(`[data-record-section="${CSS.escape(table)}"]`);
  if (!section) return;
  try {
    const response = await fetch(`./rows/${encodeURIComponent(table)}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const dataset = await response.json();
    cache.set(table, dataset);
    renderRows(table, dataset);
  } catch (error) {
    section.querySelector('.record-count').textContent = 'No disponible';
    section.querySelector('.record-table-wrap').innerHTML = `<div class="record-loading">No se pudieron cargar los datos de esta tabla (${esc(error.message)}).</div>`;
  }
}

function syncSelection() {
  const heading = details.querySelector('.detail-table-title');
  const table = heading?.textContent?.trim() ?? null;
  if (table === activeTable && (!table || details.querySelector('.record-section'))) return;
  activeTable = table;
  if (table) {
    addSection(table);
    loadRows(table);
  }
}

new MutationObserver(syncSelection).observe(details, { childList: true, subtree: true });
document.addEventListener('input', event => {
  if (!event.target.matches('.record-search') || !activeTable) return;
  const state = stateFor(activeTable);
  state.query = event.target.value;
  state.page = 0;
  if (cache.has(activeTable)) renderRows(activeTable, cache.get(activeTable));
});
document.addEventListener('click', event => {
  const button = event.target.closest('.record-page');
  if (!button || !activeTable || !cache.has(activeTable)) return;
  stateFor(activeTable).page += Number(button.dataset.direction);
  renderRows(activeTable, cache.get(activeTable));
});
