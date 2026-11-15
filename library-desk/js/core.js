/* Regional Library Desk — core: utilities, storage, router, modals, forms. */
(function () {
'use strict';

const R = window.RLD = { views: {}, actions: {}, caps: {}, ui: { route: 'today' } };

/* ---------- utilities ---------- */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = R.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]);
R.uid = p => (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
R.clone = o => JSON.parse(JSON.stringify(o));
const pad = n => String(n).padStart(2, '0');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
R.MONTHS = MONTHS; R.MON = MON; R.DOW = DOW;
const iso = R.iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = R.parse = s => { const a = String(s).split('-').map(Number); return new Date(a[0], (a[1] || 1) - 1, a[2] || 1); };
R.today = () => iso(new Date());
R.addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
R.addMonths = (ym, n) => { const d = parse(ym + '-01'); d.setMonth(d.getMonth() + n); return iso(d).slice(0, 7); };
R.diffDays = (a, b) => Math.round((parse(a) - parse(b)) / 864e5);
R.fmtDate = (s, year) => { if (!s) return ''; const d = parse(s); return d.getDate() + ' ' + MON[d.getMonth()] + (year || d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : ''); };
R.fmtLong = s => { const d = parse(s); return DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); };
R.fmtMonth = ym => { if (!ym) return ''; const d = parse(ym + '-01'); return MON[d.getMonth()] + ' ' + d.getFullYear(); };
R.rel = s => {
  const n = R.diffDays(s, R.today());
  if (n === 0) return 'today'; if (n === 1) return 'tomorrow'; if (n === -1) return 'yesterday';
  return n > 0 ? 'in ' + n + ' days' : (-n) + ' days ago';
};
R.num = (v, unit) => {
  if (v == null || v === '' || isNaN(v)) return '–';
  v = Number(v);
  if (unit === '%') return (Math.round(v * 10) / 10).toLocaleString() + '%';
  if (unit === 'x') return v.toFixed(2);
  if (unit === '$') return (R.store.settings.currency || '$') + Math.round(v).toLocaleString();
  return (Math.abs(v) < 100 && v % 1 ? Math.round(v * 10) / 10 : Math.round(v)).toLocaleString();
};
R.sum = (arr, f) => arr.reduce((t, x) => t + (Number(f ? f(x) : x) || 0), 0);
R.initials = name => String(name || '?').replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';

/* ---------- icons ---------- */
const IC = {
  today: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  growth: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  projects: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/>',
  tasks: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.6c2.4.2 4 1.7 4.5 4.4"/>',
  stakeholders: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4M12 11.5l-5.5 4.5M12 11.5l5.5 4.5"/>',
  collections: '<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="M15.4 6.6l3.7-1 3 13.4-3.7 1z"/>',
  resources: '<path d="M4 6h8M18 6h2M4 12h3M11 12h9M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  reports: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  spark: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M19 15v4M17 17h4"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5"/>',
  diamond: '<path d="M12 3l9 9-9 9-9-9z"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  book: '<path d="M5 4h13v16H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/>'
};
const icon = R.icon = (n, cls) => '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || '') + '</svg>';

/* ---------- storage ---------- */
const COLLS = R.COLLS = ['staff', 'stakeholders', 'projects', 'tasks', 'events', 'kpis', 'segments'];
const DEFAULT_SETTINGS = { orgName: '', regionName: '', branches: [], currency: '$', weekStart: 1 };
const LS_KEY = 'regional-library-desk.v1';
const store = R.store = {
  mode: 'pending', ready: false, slow: false, error: null, notOwner: false,
  data: Object.fromEntries(COLLS.map(c => [c, []])),
  settings: Object.assign({}, DEFAULT_SETTINGS)
};
let db = null;
const chains = {};
const cloneCache = new WeakMap();

function startLocal() {
  let raw = null;
  try { raw = window.localStorage.getItem(LS_KEY); store.mode = 'local'; } catch (e) { store.mode = 'memory'; }
  if (raw) {
    try {
      const o = JSON.parse(raw);
      COLLS.forEach(c => { if (Array.isArray(o.data && o.data[c])) store.data[c] = o.data[c]; });
      store.settings = Object.assign({}, DEFAULT_SETTINGS, o.settings || {});
    } catch (e) { /* unreadable copy: start empty */ }
  }
  store.ready = true;
  R.render();
}
let lsTimer = 0;
function persistLocal() {
  if (store.mode !== 'local') return;
  clearTimeout(lsTimer);
  lsTimer = setTimeout(() => {
    try { window.localStorage.setItem(LS_KEY, JSON.stringify({ data: store.data, settings: store.settings })); }
    catch (e) { store.mode = 'memory'; R.render(); }
  }, 150);
}

function startCloud(d) {
  db = d; store.mode = 'cloud';
  const seen = new Set(), confirmed = new Set(), total = COLLS.length + 1;
  const timer = setTimeout(() => { if (confirmed.size < total) { store.slow = true; store.ready = true; R.render(); } }, 10000);
  const mark = (name, snap) => {
    seen.add(name);
    if (!snap.metadata || !snap.metadata.fromCache) confirmed.add(name);
    if (seen.size >= total) store.ready = true;
    if (confirmed.size >= total) { store.slow = false; clearTimeout(timer); }
    R.render();
  };
  const fail = e => { store.error = (e && e.code) || 'unavailable'; store.ready = true; clearTimeout(timer); R.render(); };
  COLLS.forEach(c => {
    try {
      db.collection(c).onSnapshot(snap => {
        store.data[c] = snap.docs.map(doc => {
          const src = doc.data();
          let copy = cloneCache.get(src);
          if (!copy) { copy = R.clone(src); copy.id = doc.id; cloneCache.set(src, copy); }
          return copy;
        });
        mark(c, snap);
      }, fail);
    } catch (e) { fail(e); }
  });
  try {
    db.doc('meta/settings').onSnapshot(snap => {
      store.settings = Object.assign({}, DEFAULT_SETTINGS, snap.exists ? R.clone(snap.data()) : {});
      mark('settings', snap);
    }, fail);
  } catch (e) { fail(e); }
}

const wait = ms => new Promise(r => setTimeout(r, ms));
function cloudWrite(key, fn) {
  const run = async () => {
    for (let attempt = 0; attempt < 4; attempt++) {
      try { await fn(); return; }
      catch (e) {
        const code = e && e.code;
        if (code === 'unavailable' && attempt < 1) { await wait(500 + Math.random() * 900); continue; }
        if (code === 'resource_exhausted' && attempt < 3) { await wait(1500 * (attempt + 1)); continue; }
        saveFailed(code); return;
      }
    }
  };
  const p = (chains[key] || Promise.resolve()).then(run, run);
  chains[key] = p;
  p.then(() => { if (chains[key] === p) delete chains[key]; });
  return p;
}
let lastFail = 0;
function saveFailed(code) {
  if (Date.now() - lastFail < 4000) return;
  lastFail = Date.now();
  const why = code === 'quota_exceeded' ? 'The desk is full. Delete old items you no longer need, then try again.'
    : code === 'invalid_argument' ? 'This desk belongs to someone else, so your changes are not saved.'
    : code === 'revoked' ? 'Access to the saved data was withdrawn. Reopen the page to continue.'
    : 'Your last change could not be saved. Check your connection and try again.';
  R.toast(why, 'bad');
}
const body = doc => { const o = Object.assign({}, doc); delete o.id; return o; };

R.all = c => store.data[c] || [];
R.get = (c, id) => (id ? (store.data[c] || []).find(x => x.id === id) : null) || null;
R.save = (c, doc) => {
  if (!doc.id) doc.id = R.uid(c[0]);
  const arr = store.data[c].slice();
  const i = arr.findIndex(x => x.id === doc.id);
  if (i >= 0) arr[i] = doc; else arr.push(doc);
  store.data[c] = arr;
  if (store.mode === 'cloud' && !store.notOwner) cloudWrite(c + '/' + doc.id, () => db.collection(c).doc(doc.id).set(body(doc)));
  else persistLocal();
  R.render();
  return doc;
};
/* Clone a stored record, change it, save it. Stored records are never edited in place. */
R.edit = (c, id, fn) => { const cur = R.get(c, id); if (!cur) return null; const d = R.clone(cur); fn(d); return R.save(c, d); };
R.remove = (c, id) => {
  store.data[c] = store.data[c].filter(x => x.id !== id);
  if (store.mode === 'cloud' && !store.notOwner) cloudWrite(c + '/' + id, () => db.collection(c).doc(id).delete());
  else persistLocal();
  R.render();
};
R.saveSettings = patch => {
  store.settings = Object.assign({}, store.settings, patch);
  if (store.mode === 'cloud' && !store.notOwner) cloudWrite('meta/settings', () => db.doc('meta/settings').set(R.clone(store.settings)));
  else persistLocal();
  R.render();
};
/* Many writes at once (examples, restore, erase). ops: [{c, doc}] to save or [{c, id, del:true}] to delete. */
R.bulk = async ops => {
  ops.forEach(o => {
    if (o.del) store.data[o.c] = store.data[o.c].filter(x => x.id !== o.id);
    else { const arr = store.data[o.c].slice(); const i = arr.findIndex(x => x.id === o.doc.id); if (i >= 0) arr[i] = o.doc; else arr.push(o.doc); store.data[o.c] = arr; }
  });
  R.render();
  if (store.mode !== 'cloud' || store.notOwner) { persistLocal(); return; }
  const queue = ops.slice();
  const worker = async () => {
    while (queue.length) {
      const o = queue.shift();
      const id = o.del ? o.id : o.doc.id;
      await cloudWrite(o.c + '/' + id, () => o.del ? db.collection(o.c).doc(id).delete() : db.collection(o.c).doc(id).set(body(o.doc)));
    }
  };
  await Promise.all([worker(), worker(), worker()]);
};

R.initStore = async () => {
  const c = window.claude;
  if (!c || typeof c.use !== 'function') { startLocal(); return; }
  let d = null;
  try { d = await c.use('db'); } catch (e) { d = null; }
  if (!d) { startLocal(); return; }
  startCloud(d);
  c.use('user').then(u => (u && typeof u.isOwner === 'function') ? u.isOwner() : null)
    .then(own => { if (own === false) { store.notOwner = true; R.render(); } }).catch(() => {});
  ['sample', 'downloads'].forEach(n => c.use(n).then(ns => { R.caps[n] = ns || null; if (ns) R.render(); }).catch(() => {}));
};

/* ---------- lookups shared by every view ---------- */
R.me = () => R.all('staff').find(s => s.isMe) || null;
R.staffName = id => { const s = R.get('staff', id); return s ? s.name : ''; };
R.firstName = id => R.staffName(id).split(' ')[0] || '';
R.isEmpty = () => COLLS.every(c => !R.all(c).length);
R.hasExamples = () => COLLS.some(c => R.all(c).some(x => x.example));
R.isMine = t => { const m = R.me(); return !t.assigneeId || (m && t.assigneeId === m.id); };
R.isOverdue = t => t.status !== 'done' && !!t.due && t.due < R.today();

/* ---------- rendering ---------- */
let raf = 0;
R.render = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; R.renderApp && R.renderApp(); }); };

/* ---------- toasts ---------- */
R.toast = (msg, kind) => {
  const box = document.getElementById('toasts'); if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' t-' + kind : '');
  el.innerHTML = icon(kind === 'bad' ? 'alert' : 'check') + '<span>' + esc(msg) + '</span>';
  box.appendChild(el);
  setTimeout(() => el.remove(), kind === 'bad' ? 7000 : 3200);
};

/* ---------- modals ---------- */
const modals = [];
let modalSeq = 0;
R.modal = cfg => {
  const root = document.getElementById('modal-root');
  const layer = document.createElement('div');
  const n = ++modalSeq;
  layer.className = 'modal-layer';
  layer.innerHTML = '<div class="modal-backdrop" data-act="modal-close"></div>' +
    '<form class="modal' + (cfg.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="mt-' + n + '" novalidate>' +
    '<header><h2 id="mt-' + n + '">' + esc(cfg.title) + '</h2><button type="button" class="icon-btn" data-act="modal-close" aria-label="Close">' + icon('x') + '</button></header>' +
    '<div class="modal-body">' + cfg.body + '</div>' +
    (cfg.foot ? '<footer>' + cfg.foot + '</footer>' : '') + '</form>';
  const m = Object.assign({ layer, prev: document.activeElement }, cfg);
  layer.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    if (m.onSubmit && m.onSubmit(e.target) !== false) R.closeModal(m);
  });
  root.appendChild(layer);
  modals.push(m);
  const first = layer.querySelector('.modal-body input:not([type=hidden]), .modal-body select, .modal-body textarea, .modal-body button, footer .btn.primary');
  if (first && !cfg.noFocus) setTimeout(() => { try { first.focus(); } catch (e) {} }, 30);
  return m;
};
R.closeModal = m => {
  m = m || modals[modals.length - 1]; if (!m) return;
  const i = modals.indexOf(m); if (i >= 0) modals.splice(i, 1);
  m.layer.remove();
  if (m.onClose) m.onClose();
  if (m.prev && document.contains(m.prev)) { try { m.prev.focus(); } catch (e) {} }
};
R.topModal = () => modals[modals.length - 1] || null;
R.actions['modal-close'] = () => R.closeModal();
R.confirm = (cfg, onYes) => {
  R.modal({
    title: cfg.title, noFocus: false,
    body: '<p class="modal-intro">' + esc(cfg.body || '') + '</p>',
    foot: '<span class="spacer"></span><button type="button" class="btn" data-act="modal-close">Cancel</button><button type="submit" class="btn ' + (cfg.danger ? 'danger' : 'primary') + '">' + esc(cfg.yes || 'Confirm') + '</button>',
    onSubmit: () => { setTimeout(onYes, 0); return true; }
  });
};

/* ---------- forms ---------- */
const optList = opts => (opts || []).map(o => Array.isArray(o) ? o : [o, o]);
function fieldHtml(f, v) {
  const id = 'f-' + f.k;
  const cls = 'fld' + (f.half ? ' half' : '') + (f.third ? ' third' : '');
  const help = f.help ? '<small>' + esc(f.help) + '</small>' : '';
  const req = f.req ? ' required' : '';
  const lab = '<span class="fld-l">' + esc(f.label) + (f.req ? ' <em>required</em>' : '') + '</span>';
  if (f.type === 'h') return '<h3 class="form-h">' + esc(f.label) + '</h3>' + (f.help ? '<p class="form-p">' + esc(f.help) + '</p>' : '');
  if (f.type === 'textarea') return '<label class="' + cls + '" for="' + id + '">' + lab + '<textarea id="' + id + '" name="' + f.k + '" rows="' + (f.rows || 3) + '" placeholder="' + esc(f.ph || '') + '"' + req + '>' + esc(v == null ? '' : v) + '</textarea>' + help + '</label>';
  if (f.type === 'select') {
    const opts = optList(f.opts);
    return '<label class="' + cls + '" for="' + id + '">' + lab + '<select id="' + id + '" name="' + f.k + '"' + req + '>' +
      (f.blank != null ? '<option value="">' + esc(f.blank) + '</option>' : '') +
      opts.map(o => '<option value="' + esc(o[0]) + '"' + (String(v == null ? '' : v) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') +
      '</select>' + help + '</label>';
  }
  if (f.type === 'multi') {
    const cur = Array.isArray(v) ? v.map(String) : [];
    const opts = optList(f.opts);
    return '<fieldset class="' + cls + '"><legend class="fld-l">' + esc(f.label) + '</legend><div class="checks">' +
      (opts.length ? opts.map((o, i) => '<label class="check" for="' + id + '-' + i + '"><input type="checkbox" id="' + id + '-' + i + '" name="' + f.k + '" value="' + esc(o[0]) + '"' + (cur.includes(String(o[0])) ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>').join('') : '<span class="muted">' + esc(f.none || 'Nothing to choose from yet.') + '</span>') +
      '</div>' + help + '</fieldset>';
  }
  if (f.type === 'bool') return '<label class="' + cls + ' check solo" for="' + id + '"><input type="checkbox" id="' + id + '" name="' + f.k + '"' + (v ? ' checked' : '') + '><span>' + esc(f.label) + '</span>' + help + '</label>';
  if (f.type === 'scale') {
    const n = f.max || 5, cur = Number(v) || 0;
    let h = '<fieldset class="' + cls + '"><legend class="fld-l">' + esc(f.label) + '</legend><div class="scale">';
    for (let i = 1; i <= n; i++) h += '<label for="' + id + '-' + i + '"><input type="radio" id="' + id + '-' + i + '" name="' + f.k + '" value="' + i + '"' + (cur === i ? ' checked' : '') + '><span>' + i + '</span></label>';
    return h + '</div><small>' + esc(f.help || '1 = low, ' + n + ' = high') + '</small></fieldset>';
  }
  const extra = (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') + (f.step != null ? ' step="' + f.step + '"' : (f.type === 'number' ? ' step="any"' : ''));
  return '<label class="' + cls + '" for="' + id + '">' + lab + '<input id="' + id + '" name="' + f.k + '" type="' + (f.type || 'text') + '" value="' + esc(v == null ? '' : v) + '" placeholder="' + esc(f.ph || '') + '"' + req + extra + (f.type === 'number' ? ' inputmode="decimal"' : '') + '>' + help + '</label>';
}
function readForm(fields, formEl) {
  const out = {}; let bad = null;
  fields.forEach(f => {
    if (f.type === 'h') return;
    if (f.type === 'multi') { out[f.k] = Array.from(formEl.querySelectorAll('input[name="' + f.k + '"]:checked')).map(i => i.value); return; }
    if (f.type === 'bool') { const i = formEl.querySelector('input[name="' + f.k + '"]'); out[f.k] = !!(i && i.checked); return; }
    if (f.type === 'scale') { const i = formEl.querySelector('input[name="' + f.k + '"]:checked'); out[f.k] = i ? Number(i.value) : null; return; }
    const el = formEl.elements[f.k]; if (!el) return;
    let val = String(el.value || '').trim();
    el.classList.remove('invalid');
    if (f.req && !val) { el.classList.add('invalid'); bad = bad || el; }
    if (f.type === 'number') val = val === '' || isNaN(Number(val)) ? null : Number(val);
    out[f.k] = val;
  });
  if (bad) { bad.focus(); R.toast('Fill in the highlighted field to save.', 'bad'); return null; }
  return out;
}
R.fieldHtml = fieldHtml;
R.form = cfg => {
  const fields = cfg.fields.filter(Boolean);
  const v = cfg.values || {};
  return R.modal({
    title: cfg.title, wide: cfg.wide,
    body: (cfg.intro ? '<p class="modal-intro">' + esc(cfg.intro) + '</p>' : '') + '<div class="form-grid">' + fields.map(f => fieldHtml(f, v[f.k])).join('') + '</div>',
    foot: (cfg.onDelete ? '<button type="button" class="btn danger ghost" data-act="form-delete">' + icon('trash') + 'Delete</button>' : '') + '<span class="spacer"></span><button type="button" class="btn" data-act="modal-close">Cancel</button><button type="submit" class="btn primary">' + esc(cfg.submit || 'Save') + '</button>',
    onSubmit: formEl => { const out = readForm(fields, formEl); if (!out) return false; cfg.onSubmit(out); return true; },
    onDelete: cfg.onDelete, deleteLabel: cfg.deleteLabel
  });
};
R.actions['form-delete'] = () => {
  const m = R.topModal(); if (!m || !m.onDelete) return;
  R.confirm({ title: 'Delete this?', body: m.deleteLabel || 'This removes it for good. It cannot be undone.', yes: 'Delete', danger: true }, () => { R.closeModal(m); m.onDelete(); });
};

/* ---------- files and clipboard ---------- */
R.saveFile = async (filename, data) => {
  const dl = R.caps.downloads;
  if (dl) {
    try { await dl.save({ filename, data }); R.toast('Saved ' + filename); }
    catch (e) { if (!e || e.code !== 'declined') R.toast('The file could not be saved here. Use Copy instead.', 'bad'); }
    return;
  }
  if (window.claude) { R.showText('Copy this ' + filename.split('.').pop().toUpperCase() + ' and save it', data); return; }
  try {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }));
    a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } catch (e) { R.showText('Copy this and save it', data); }
};
R.copy = async text => {
  try { await navigator.clipboard.writeText(text); R.toast('Copied'); }
  catch (e) { R.showText('Select and copy', text); }
};
R.showText = (title, text) => {
  const m = R.modal({ title, wide: true, body: '<textarea class="copybox" id="copybox" rows="16" readonly>' + esc(text) + '</textarea>', foot: '<span class="spacer"></span><button type="button" class="btn primary" data-act="modal-close">Done</button>' });
  setTimeout(() => { const t = m.layer.querySelector('textarea'); if (t) { t.focus(); t.select(); } }, 50);
};

/* ---------- event delegation ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = R.actions[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'A') e.preventDefault();
  fn(el.dataset, el, e);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-chg]');
  if (el && R.actions[el.dataset.chg]) R.actions[el.dataset.chg](el.dataset, el, e);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-inp]');
  if (el && R.actions[el.dataset.inp]) R.actions[el.dataset.inp](el.dataset, el, e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (R.topModal()) R.closeModal(); else R.actions['nav-close'] && R.actions['nav-close'](); }
  if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-enter]')) {
    e.preventDefault();
    const fn = R.actions[e.target.dataset.enter]; if (fn) fn(e.target.dataset, e.target, e);
  }
});
})();
