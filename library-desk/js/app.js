/* Regional Library Desk — shell, navigation, settings, backup, example data, start-up. */
(function () {
'use strict';
const R = window.RLD, esc = R.esc, icon = R.icon, A = R.actions;

const NAV = [['today', 'Today'], ['growth', 'Growth plan'], ['projects', 'Projects'], ['tasks', 'Tasks'], ['calendar', 'Calendar'], ['people', 'People'], ['stakeholders', 'Stakeholders'], ['collections', 'Collections'], ['resources', 'Resources'], ['reports', 'Reports']];
const ROUTES = NAV.map(n => n[0]);
const readHash = () => { let h = ''; try { h = (window.location.hash || '').replace(/^#/, ''); } catch (e) {} return ROUTES.includes(h) ? h : 'today'; };

R.go = (route, patch) => {
  Object.assign(R.ui, { projectId: null, staffId: null, stakeholderId: null }, patch || {});
  R.ui.route = route;
  try { if (readHash() !== route) window.location.hash = route; } catch (e) {}
  A['nav-close']();
  R.render();
  try { window.scrollTo(0, 0); } catch (e) {}
};
window.addEventListener('hashchange', () => {
  const r = readHash();
  if (r !== R.ui.route) { Object.assign(R.ui, { route: r, projectId: null, staffId: null, stakeholderId: null }); R.render(); }
});
A.nav = d => R.go(d.route);
A['nav-open'] = () => { const s = document.querySelector('.shell'); if (s) s.classList.add('nav-open'); };
A['nav-close'] = () => { const s = document.querySelector('.shell'); if (s) s.classList.remove('nav-open'); };

function shell() {
  return '<div class="shell"><aside class="rail" id="rail"><div class="brand"><span class="brand-mark">' + icon('collections') + '</span><div><strong>Regional Library Desk</strong><span id="brand-sub"></span></div></div>' +
    '<nav class="nav" aria-label="Sections">' + NAV.map(n => '<a class="nav-item" href="#' + n[0] + '" data-act="nav" data-route="' + n[0] + '">' + icon(n[0]) + '<span>' + n[1] + '</span><span class="nav-badge" data-badge="' + n[0] + '" hidden></span></a>').join('') + '</nav>' +
    '<div class="rail-foot"><button type="button" class="nav-item" data-act="settings">' + icon('settings') + '<span>Settings and data</span></button><p class="save-state" id="save-state"></p></div></aside>' +
    '<div class="scrim" data-act="nav-close"></div>' +
    '<div class="main"><header class="topbar"><button type="button" class="icon-btn" data-act="nav-open" aria-label="Open menu">' + icon('menu') + '</button><strong id="topbar-title"></strong></header>' +
    '<div id="banners"></div><main id="view" tabindex="-1"></main></div></div>';
}
const banner = (kind, ic, text, action) => '<div class="banner b-' + kind + '">' + icon(ic) + '<span>' + esc(text) + '</span>' + (action || '') + '</div>';
function banners() {
  const s = R.store; let h = '';
  if (s.error) h += banner('bad', 'alert', 'Your saved data cannot be reached right now, so changes may not be kept. Check your connection, then reopen the page.');
  else if (s.slow) h += banner('warn', 'clock', 'Still connecting to your saved data. What you see may be out of date.');
  if (s.notOwner) h += banner('warn', 'alert', 'This desk belongs to someone else. You can look around, but nothing you enter is saved.');
  if (s.mode === 'memory') h += banner('warn', 'alert', 'This browser is blocking storage, so changes are lost when you close the page. Save a backup file from Settings and data.');
  if (s.mode === 'local' && window.claude) h += banner('info', 'alert', 'You are not signed in to Claude here, so this copy saves in this browser only.');
  if (R.hasExamples()) h += banner('info', 'book', 'You are looking at example data, marked with an Example tag, so you can see how the desk works.', R.btn('examples-remove', 'Remove example data', { cls: 'sm' }));
  return h;
}
R.renderApp = () => {
  const root = document.getElementById('app'); if (!root) return;
  if (!root.dataset.ready) { root.innerHTML = shell(); root.dataset.ready = '1'; }
  const s = R.store, route = R.views[R.ui.route] ? R.ui.route : 'today';
  root.querySelectorAll('.nav-item[data-route]').forEach(a => { const on = a.dataset.route === route; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const badge = (k, n) => { const b = root.querySelector('[data-badge="' + k + '"]'); if (b) { b.hidden = !n; b.textContent = n || ''; } };
  badge('today', s.ready ? R.attention().filter(a => a.level === 2).length : 0);
  badge('tasks', s.ready ? R.all('tasks').filter(t => R.isMine(t) && R.isOverdue(t)).length : 0);
  document.getElementById('brand-sub').textContent = s.settings.regionName || s.settings.orgName || 'Your region';
  document.getElementById('topbar-title').textContent = R.views[route].title;
  document.getElementById('save-state').textContent = !s.ready ? 'Opening your desk…' : s.mode === 'cloud' ? (s.notOwner ? 'Not saving' : 'Saved to your Claude account. Private to you.') : s.mode === 'local' ? 'Saved in this browser only.' : 'Not saving: storage is blocked.';
  document.getElementById('banners').innerHTML = banners();

  const view = document.getElementById('view'), act = document.activeElement;
  const fid = act && act.id && view.contains(act) ? act.id : null;
  const isText = fid && (act.tagName === 'TEXTAREA' || (act.tagName === 'INPUT' && act.type !== 'checkbox'));
  const val = isText ? act.value : null;
  let sel = null; if (isText) { try { sel = [act.selectionStart, act.selectionEnd]; } catch (e) {} }
  let html;
  try { html = R.views[route].render(); }
  catch (e) { if (window.console) console.error(e); html = '<div class="banner b-bad">' + icon('alert') + '<span>This page could not be drawn. Your data is safe. Try another section, or save a backup from Settings and data.</span></div>'; }
  view.innerHTML = html;
  if (fid) {
    const el = document.getElementById(fid);
    if (el) { if (val != null) el.value = val; try { el.focus({ preventScroll: true }); if (sel && sel[0] != null) el.setSelectionRange(sel[0], sel[1]); } catch (e) {} }
  }
};

/* ---------- settings and data ---------- */
A.settings = () => {
  const s = R.store.settings;
  const where = R.store.mode === 'cloud' ? 'Your desk is saved to your Claude account and is private to you. It follows you to any device where you open this page.' : R.store.mode === 'local' ? 'Your desk is saved in this browser on this device. Save a backup file to move it or keep it safe.' : 'This browser is blocking storage, so nothing is being saved. Save a backup file before you close the page.';
  const fields = [
    { k: 'regionName', label: 'Region name', half: true, ph: 'Northern Region' }, { k: 'orgName', label: 'Library service', half: true, ph: 'City Libraries' },
    { k: 'branches', label: 'Branches and teams, one per line', type: 'textarea', rows: 4, ph: 'Central\nNorthside\nRiverside' },
    { k: 'currency', label: 'Currency symbol', half: true }, { k: 'weekStart', label: 'Week starts on', type: 'select', half: true, opts: [[1, 'Monday'], [0, 'Sunday']] }
  ];
  R.modal({
    title: 'Settings and data', wide: true, noFocus: true,
    body: '<div class="form-grid">' + fields.map(f => R.fieldHtml(f, f.k === 'branches' ? (s.branches || []).join('\n') : s[f.k])).join('') + '</div>' +
      '<h3 class="form-h">Your data</h3><p class="form-p">' + esc(where) + '</p><div class="row wrap gap-s">' + R.btn('backup-save', 'Save a backup file', { icon: 'download' }) +
      '<label class="btn" for="backup-file">' + icon('upload') + 'Restore from a backup</label><input class="sr" type="file" id="backup-file" accept=".json,application/json" data-chg="backup-load">' +
      (R.hasExamples() ? R.btn('examples-remove', 'Remove example data') : R.btn('examples-load', 'Load example data')) + R.btn('erase-all', 'Erase everything', { cls: 'danger ghost', icon: 'trash' }) + '</div>',
    foot: '<span class="spacer"></span><button type="button" class="btn" data-act="modal-close">Close</button><button type="submit" class="btn primary">Save settings</button>',
    onSubmit: f => {
      R.saveSettings({ regionName: f.elements.regionName.value.trim(), orgName: f.elements.orgName.value.trim(), currency: f.elements.currency.value.trim() || '$', weekStart: Number(f.elements.weekStart.value), branches: f.elements.branches.value.split('\n').map(x => x.trim()).filter(Boolean) });
      R.toast('Settings saved'); return true;
    }
  });
};
A['backup-save'] = () => R.saveFile('library-desk-backup-' + R.today() + '.json', JSON.stringify({ app: 'regional-library-desk', version: 1, exported: R.today(), settings: R.store.settings, data: R.store.data }, null, 1));
A['backup-load'] = (d, el) => {
  const file = el.files && el.files[0]; if (!file) return;
  const rd = new FileReader();
  rd.onerror = () => R.toast('That file could not be read.', 'bad');
  rd.onload = () => {
    let o = null; try { o = JSON.parse(rd.result); } catch (e) {}
    if (!o || o.app !== 'regional-library-desk' || !o.data) { R.toast('That is not a Regional Library Desk backup file.', 'bad'); return; }
    const n = R.sum(R.COLLS, c => (o.data[c] || []).length);
    R.confirm({ title: 'Restore this backup?', body: 'This replaces everything on the desk with the ' + n + ' items in the backup from ' + (o.exported || 'an unknown date') + '.', yes: 'Replace my desk', danger: true }, () => {
      const ops = [];
      R.COLLS.forEach(c => {
        const keep = new Set((o.data[c] || []).map(x => x.id));
        R.all(c).forEach(x => { if (!keep.has(x.id)) ops.push({ c, id: x.id, del: true }); });
        (o.data[c] || []).forEach(x => { if (x && x.id) ops.push({ c, doc: x }); });
      });
      while (R.topModal()) R.closeModal();
      R.saveSettings(Object.assign({}, o.settings || {}));
      R.bulk(ops).then(() => R.toast('Backup restored'));
    });
  };
  rd.readAsText(file);
  el.value = '';
};
A['erase-all'] = () => R.confirm({ title: 'Erase everything?', body: 'This deletes every person, stakeholder, project, task, event, measure and collection on the desk. Save a backup file first if you might want it back.', yes: 'Erase everything', danger: true }, () => {
  const ops = []; R.COLLS.forEach(c => R.all(c).forEach(x => ops.push({ c, id: x.id, del: true })));
  while (R.topModal()) R.closeModal();
  R.bulk(ops).then(() => R.toast('The desk is empty'));
  R.go('today');
});
A['examples-remove'] = () => R.confirm({ title: 'Remove example data?', body: 'This deletes every item tagged Example. Anything you added yourself stays.', yes: 'Remove examples', danger: true }, () => {
  const ops = []; R.COLLS.forEach(c => R.all(c).forEach(x => { if (x.example) ops.push({ c, id: x.id, del: true }); }));
  while (R.topModal()) R.closeModal();
  Object.assign(R.ui, { projectId: null, staffId: null, stakeholderId: null });
  R.bulk(ops).then(() => R.toast('Example data removed'));
});
A['examples-load'] = () => {
  const run = () => {
    const ex = window.RLD_EXAMPLES(R.today()), ops = [];
    R.COLLS.forEach(c => (ex[c] || []).forEach(doc => ops.push({ c, doc })));
    while (R.topModal()) R.closeModal();
    if (!(R.store.settings.branches || []).length) R.saveSettings({ branches: ex.branches });
    R.bulk(ops).then(() => R.toast('Example data loaded'));
    R.go('today');
  };
  if (window.RLD_EXAMPLES) { run(); return; }
  const sc = document.createElement('script');
  sc.src = 'examples.js';
  sc.onload = run;
  sc.onerror = () => R.toast('The example data could not be loaded.', 'bad');
  document.head.appendChild(sc);
};

/* ---------- start ---------- */
R.ui.route = readHash();
R.renderApp();
R.initStore();
})();
