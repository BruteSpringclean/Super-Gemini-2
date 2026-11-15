/* Regional Library Desk — views: Today, Growth plan, Projects. */
(function () {
'use strict';
const R = window.RLD, esc = R.esc, icon = R.icon, A = R.actions;

R.staffOpts = () => R.all('staff').slice().sort((a, b) => a.name.localeCompare(b.name)).map(s => [s.id, s.name + (s.isMe ? ' (me)' : '')]);
R.agendaHtml = (items, empty) => {
  if (!items.length) return '<p class="muted pad">' + esc(empty) + '</p>';
  let h = '', cur = '';
  items.forEach(it => {
    if (it.date !== cur) {
      if (cur) h += '</ul></div>';
      cur = it.date; const d = R.parse(cur);
      h += '<div class="ag-day"><div class="ag-date' + (cur === R.today() ? ' is-today' : '') + '"><span>' + R.DOW[d.getDay()].slice(0, 3) + '</span><b>' + d.getDate() + '</b><span>' + R.MON[d.getMonth()] + '</span></div><ul class="ag-list">';
    }
    const k = R.KINDS[it.kind];
    h += '<li><span class="ag-ic" title="' + esc(k[1]) + '">' + icon(k[0]) + '</span><div class="li-main">' + R.link(it.act, it.id, it.title, it.done ? 'done' : '') + '<span class="li-meta">' + esc(k[1]) + (it.sub ? ' · ' + esc(it.sub) : '') + '</span></div></li>';
  });
  return h + '</ul></div>';
};
const projectRow = p => {
  const nm = R.nextMilestone(p), owner = R.staffName(p.ownerId);
  return '<li class="li">' + R.spine(p.code) + '<div class="li-main">' + R.link('project-open', p.id, p.name, 'li-title') + R.exTag(p) +
    '<span class="li-meta">' + R.pillarChip(p.pillar) + (owner ? '<span>Owner: ' + esc(owner) + '</span>' : '<span class="warn-text">No owner</span>') + (nm ? '<span>Next: ' + esc(nm.title) + ' ' + R.due(nm.date) + '</span>' : '') + '</span></div>' +
    '<div class="li-end">' + R.meter(R.projectProgress(p), '', 'Milestones complete') + R.healthPill(p) + '</div></li>';
};

/* ================= Today ================= */
R.views.today = {
  title: 'Today',
  render() {
    const me = R.me(), t0 = R.today(), d = R.parse(t0), hr = new Date().getHours();
    const first = me ? me.name.split(' ')[0] : '';
    const s = R.store.settings;
    let h = '<header class="vh"><div class="vh-text"><span class="stamp">' + R.DOW[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + R.MON[d.getMonth()] + ' ' + d.getFullYear() + '</span>' +
      '<h1>' + (hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + (first && !/^(you|regional)/i.test(first) ? ', ' + esc(first) : '') + '</h1>' +
      '<p>' + esc([s.regionName, s.orgName].filter(Boolean).join(' · ') || 'Your region at a glance: what needs you, what is coming, and how growth is tracking.') + '</p></div>' +
      '<div class="vh-actions">' + R.btn('task-new', 'Task', { icon: 'plus' }) + R.btn('project-new', 'Project', { icon: 'plus', cls: 'primary' }) + '</div></header>';
    if (!R.store.ready) return h + '<div class="panel pad"><p class="muted">Opening your desk…</p></div>';
    if (R.isEmpty()) return h + welcome();

    const want = ['members', 'regular', 'reactivated', 'attendance', 'turnover', 'new'];
    const kpis = R.all('kpis'), picks = [];
    want.forEach(st => { const k = kpis.find(x => x.stage === st); if (k && picks.length < 4) picks.push(k); });
    kpis.forEach(k => { if (picks.length < 4 && !picks.includes(k)) picks.push(k); });
    if (picks.length) h += '<section class="sec"><div class="tiles">' + picks.map(R.kpiTile).join('') + '</div></section>';

    const att = R.attention();
    const week = R.calItems(t0, R.addDays(t0, 7), true);
    h += '<div class="split"><section class="sec">' + R.sec('Needs your attention', '', att.length ? att.length + (att.length === 1 ? ' item' : ' items') : '') +
      '<div class="panel">' + (att.length ? '<ul class="list">' + att.slice(0, 12).map(a =>
        '<li class="li"><span class="li-ic l' + a.level + '">' + icon(a.ic) + '</span><div class="li-main">' + R.link(a.act, a.id, a.text, 'li-title') + '<span class="li-meta">' + esc(a.sub) + '</span></div></li>').join('') + '</ul>' +
        (att.length > 12 ? '<p class="muted pad">And ' + (att.length - 12) + ' more. Clear the top of the list first.</p>' : '')
        : '<p class="muted pad">Nothing is overdue or off track. A good day to work on what matters next.</p>') + '</div></section>' +
      '<section class="sec">' + R.sec('Next 7 days', R.btn('go-calendar', 'Calendar', { cls: 'sm ghost', icon: 'calendar' })) + '<div class="panel">' + R.agendaHtml(week, 'Nothing scheduled in the next week.') + '</div></section></div>';

    const live = R.all('projects').filter(R.isLive).sort((a, b) => (a.end || '9') < (b.end || '9') ? -1 : 1);
    h += '<section class="sec">' + R.sec('Projects in flight', R.btn('go-projects', 'All projects', { cls: 'sm ghost', icon: 'arrow' })) + '<div class="panel">' +
      (live.length ? '<ul class="list">' + live.map(projectRow).join('') + '</ul>' : '<p class="muted pad">No projects are planned or active. Start one from a playbook to drive growth.</p>') + '</div></section>';

    const waiting = R.all('tasks').filter(t => t.status !== 'done' && !R.isMine(t)).sort((a, b) => (a.followUp || a.due || '9') < (b.followUp || b.due || '9') ? -1 : 1).slice(0, 6);
    if (waiting.length) h += '<section class="sec">' + R.sec('Waiting on others', R.btn('go-delegated', 'All delegated tasks', { cls: 'sm ghost', icon: 'arrow' })) + '<div class="panel"><ul class="list">' + waiting.map(t =>
      '<li class="li">' + R.avatar(R.staffName(t.assigneeId)) + '<div class="li-main">' + R.link('task-edit', t.id, t.title, 'li-title') + '<span class="li-meta"><span>' + esc(R.staffName(t.assigneeId) || 'Unassigned') + '</span>' + (t.followUp ? '<span>Follow up ' + R.due(t.followUp) + '</span>' : '') + '</span></div><div class="li-end">' + (t.due ? R.due(t.due) : '') + '</div></li>').join('') + '</ul></div></section>';
    return h;
  }
};
function welcome() {
  const step = (n, title, text, btn) => '<li class="step"><span class="step-n">' + n + '</span><div class="li-main"><span class="li-title">' + esc(title) + '</span><span class="li-meta">' + esc(text) + '</span></div><div class="li-end">' + btn + '</div></li>';
  return '<section class="sec"><div class="panel"><div class="pad"><h2>Set up your desk</h2><p class="sec-sub">Four steps, about ten minutes. Everything you add can be changed later.</p></div><ol class="list">' +
    step(1, 'Add yourself and your direct reports', 'Profiles feed the org chart, workloads and one-to-one notes.', R.btn('staff-new', 'Add a person', { icon: 'plus', data: { me: '1' } })) +
    step(2, 'Add the stakeholders you work with', 'Council, schools, community groups, funders and suppliers.', R.btn('sh-new', 'Add a stakeholder', { icon: 'plus' })) +
    step(3, 'Record your starting numbers', 'Members, borrowers by frequency, program attendance and collection turnover.', R.btn('kpi-standard', 'Add the standard measures', { icon: 'plus' })) +
    step(4, 'Start your first growth project', 'Pick a playbook such as lapsed member win-back, then make it yours.', R.btn('project-new', 'Start a project', { icon: 'plus', cls: 'primary' })) +
    '</ol></div><p class="aside">Want to look around first? ' + R.btn('examples-load', 'Load example data', { cls: 'sm' }) + ' fills the desk with a made-up region that you can remove in one click.</p></section>';
}
A['go-calendar'] = () => R.go('calendar');
A['go-projects'] = () => R.go('projects');
A['go-growth'] = () => R.go('growth');
A['go-delegated'] = () => { R.ui.taskTab = 'delegated'; R.go('tasks'); };

/* ================= Growth plan ================= */
R.views.growth = {
  title: 'Growth plan',
  render() {
    const kpis = R.all('kpis'), projects = R.all('projects');
    let h = R.head('Growth plan', 'How membership, borrowing, programs and collections work add up to engagement, relevancy and literacy.',
      (kpis.length ? R.btn('kpi-record', 'Record this month\'s numbers', { icon: 'edit', cls: 'primary' }) : '') + R.btn('kpi-new', 'Measure', { icon: 'plus' }));
    if (!kpis.length && !projects.length) return h + R.empty('Start with what you will measure', 'Add the standard library growth measures, then record your starting numbers. Projects link to these measures so you can see what is working.', R.btn('kpi-standard', 'Add the standard measures', { cls: 'primary', icon: 'plus' }) + R.btn('project-new', 'Start a project', { icon: 'plus' }));

    /* outcome coverage */
    const active = projects.filter(p => p.status === 'Active');
    h += '<section class="sec">' + R.sec('Outcomes this work is aiming at', '', 'Every project names the outcomes it serves. Gaps show here.') + '<div class="cols-3">' + Object.keys(R.OUTCOMES).map(o => {
      const ps = active.filter(p => (p.outcomes || []).includes(o));
      return '<div class="panel pad outcome"><div class="row between"><h3>' + esc(R.OUTCOMES[o].name) + '</h3>' + (ps.length ? R.pill('good', ps.length + ' active', 'check') : R.pill('warn', 'No active project', 'alert')) + '</div><p class="muted">' + esc(R.OUTCOMES[o].q) + '</p>' +
        (ps.length ? '<ul class="mini">' + ps.map(p => '<li>' + R.link('project-open', p.id, p.name) + '</li>').join('') + '</ul>' : '') + '</div>';
    }).join('') + '</div></section>';

    h += ladder();

    Object.keys(R.PILLARS).forEach(pk => {
      const P = R.PILLARS[pk], ks = kpis.filter(k => k.pillar === pk), ps = projects.filter(p => p.pillar === pk && p.status !== 'Complete');
      h += '<section class="sec pillar">' + '<div class="sec-h"><div><h2><i class="sw lg" style="background:' + P.color + '"></i>' + esc(P.name) + '</h2><p class="sec-sub">' + esc(P.outcome) + '</p></div><div class="row">' + R.btn('project-new', 'Project', { icon: 'plus', cls: 'sm', data: { pillar: pk } }) + R.btn('kpi-new', 'Measure', { icon: 'plus', cls: 'sm', data: { pillar: pk } }) + '</div></div>' +
        (ks.length ? '<div class="tiles">' + ks.map(R.kpiTile).join('') + '</div>' : '<p class="muted">No measures for this pillar yet.</p>') +
        (ps.length ? '<div class="panel"><ul class="list">' + ps.map(projectRow).join('') + '</ul></div>' : '<p class="muted">No projects here yet. Add one to move these numbers.</p>') + '</section>';
    });
    return h;
  }
};
function ladder() {
  const parts = [['lapsed', 'Lapsed', 'No loan in 12 months', 'var(--ramp-1)'], ['casual', 'Casual', 'Borrow a few times a year', 'var(--ramp-2)'], ['regular', 'Multi-monthly', 'Borrow in most months', 'var(--ramp-3)']];
  const vals = parts.map(p => R.stageVal(p[0]));
  if (vals.every(v => v == null)) return '';
  const total = R.sum(vals);
  const prevOf = st => { const k = R.stage(st), s = k ? R.kpiSeries(k) : []; return s.length > 1 ? s[s.length - 2].value : null; };
  const reg = vals[2] || 0, cas = vals[1] || 0, react = R.stageVal('reactivated');
  let h = '<section class="sec">' + R.sec('The borrower ladder', R.btn('project-pick', 'Win back lapsed members', { cls: 'sm', icon: 'plus', data: { pb: 'winback' } }) + R.btn('project-pick', 'Build the borrowing habit', { cls: 'sm', icon: 'plus', data: { pb: 'ladder' } }), 'Growth means moving members up a rung: from lapsed to casual, from casual to borrowing in most months.') + '<div class="panel pad">';
  h += '<div class="segbar" role="img" aria-label="Members by borrowing frequency">' + parts.map((p, i) => vals[i] ? '<i style="flex:' + vals[i] + ' 1 0;background:' + p[3] + '"></i>' : '').join('') + '</div><div class="cols-3 legend">' + parts.map((p, i) => {
    const pv = prevOf(p[0]), d = vals[i] != null && pv != null ? vals[i] - pv : null, good = p[0] === 'regular' ? d > 0 : d < 0;
    return '<div><span class="chip"><i class="sw" style="background:' + p[3] + '"></i>' + esc(p[1]) + '</span><div class="big">' + esc(R.num(vals[i])) + (total && vals[i] != null ? ' <small>' + Math.round(vals[i] / total * 100) + '%</small>' : '') + '</div><span class="muted">' + esc(p[2]) + '</span>' +
      (d ? '<span class="delta ' + (good ? 'd-good' : 'd-bad') + '">' + icon(d > 0 ? 'up' : 'down') + esc(R.num(Math.abs(d))) + ' on last month</span>' : '') + '</div>';
  }).join('') + '</div>';
  const facts = [];
  if (reg + cas > 0) facts.push('<b>' + Math.round(reg / (reg + cas) * 100) + '%</b> of people who borrowed this year do so in most months.');
  if (react != null && vals[0]) facts.push('<b>' + esc(R.num(react)) + '</b> lapsed members came back last month, ' + (Math.round(react / vals[0] * 1000) / 10) + '% of the lapsed group.');
  const rk = R.stage('regular');
  if (rk && rk.target != null && rk.target !== '') facts.push('Target: <b>' + esc(R.num(rk.target)) + '</b> multi-monthly borrowers' + (rk.targetDate ? ' by ' + esc(R.fmtDate(rk.targetDate, true)) : '') + '.');
  if (facts.length) h += '<ul class="facts">' + facts.map(f => '<li>' + f + '</li>').join('') + '</ul>';
  return h + '</div></section>';
}

/* ----- measures ----- */
const kpiFields = () => [
  { k: 'name', label: 'Measure', req: true, ph: 'Multi-monthly borrowers' },
  { k: 'pillar', label: 'Growth pillar', type: 'select', half: true, opts: Object.keys(R.PILLARS).map(k => [k, R.PILLARS[k].name]) },
  { k: 'stage', label: 'What it counts', type: 'select', half: true, blank: 'Something else', opts: Object.keys(R.STAGES).map(k => [k, R.STAGES[k]]), help: 'Lets the desk use it in the borrower ladder and playbooks.' },
  { k: 'unit', label: 'Unit', type: 'select', half: true, opts: R.UNITS },
  { k: 'dir', label: 'Good news is', type: 'select', half: true, opts: [['up', 'The number going up'], ['down', 'The number going down']] },
  { k: 'baseline', label: 'Starting value', type: 'number', half: true, help: 'Leave blank to use the first recorded month.' },
  { k: 'target', label: 'Target', type: 'number', half: true },
  { k: 'targetDate', label: 'Target date', type: 'date', half: true },
  { k: 'scope', label: 'Covers', type: 'select', half: true, blank: 'Whole region', opts: R.store.settings.branches || [] },
  { k: 'note', label: 'How it is counted', type: 'textarea', rows: 2, ph: 'Source report and definition, so the number is counted the same way each month.' }
];
A['kpi-new'] = d => R.form({ title: 'New measure', fields: kpiFields(), values: { pillar: d.pillar || 'members', dir: 'up', unit: '' }, onSubmit: v => { R.save('kpis', Object.assign({ entries: [] }, v)); R.toast('Measure added'); } });
A['kpi-edit'] = d => {
  const k = R.get('kpis', d.id); if (!k) return;
  R.closeModal();
  R.form({ title: 'Edit measure', fields: kpiFields(), values: k, onSubmit: v => R.edit('kpis', k.id, x => Object.assign(x, v)), onDelete: () => R.remove('kpis', k.id), deleteLabel: 'This removes the measure and every number recorded for it.' });
};
A['kpi-standard'] = () => {
  const have = R.all('kpis').map(k => k.stage);
  const add = R.STANDARD_KPIS.filter(k => !have.includes(k.stage));
  if (!add.length) { R.toast('The standard measures are already here'); R.go('growth'); return; }
  R.bulk(add.map(k => ({ c: 'kpis', doc: Object.assign({ id: R.uid('k'), entries: [] }, k) })));
  R.toast(add.length + ' measures added. Record your starting numbers next.');
  R.go('growth');
};
const monthOpts = () => { const cur = R.today().slice(0, 7), o = []; for (let i = 1; i >= -24; i--) { const m = R.addMonths(cur, i); o.push([m, R.fmtMonth(m)]); } return o; };
function recordForm(month) {
  const kpis = R.all('kpis');
  if (!kpis.length) { R.toast('Add a measure first', 'bad'); return; }
  const vals = { month };
  kpis.forEach(k => { const e = (k.entries || []).find(x => x.month === month); if (e) vals['k_' + k.id] = e.value; });
  R.form({
    title: 'Record numbers', wide: true, submit: 'Save numbers',
    intro: 'Enter what you have for the month. Blank fields are left as they are.',
    fields: [{ k: 'month', label: 'Month', type: 'select', opts: monthOpts() }].concat(kpis.map(k => ({ k: 'k_' + k.id, label: k.name + (k.unit === '%' ? ' (%)' : ''), type: 'number', half: true }))),
    values: vals,
    onSubmit: v => {
      let n = 0;
      kpis.forEach(k => {
        const val = v['k_' + k.id]; if (val == null) return;
        const cur = (k.entries || []).find(x => x.month === v.month);
        if (cur && cur.value === val) return;
        n++;
        R.edit('kpis', k.id, x => { x.entries = (x.entries || []).filter(e => e.month !== v.month).concat([{ month: v.month, value: val }]); });
      });
      R.toast(n ? n + (n === 1 ? ' number' : ' numbers') + ' saved for ' + R.fmtMonth(v.month) : 'Nothing changed');
    }
  });
  const sel = document.getElementById('f-month');
  if (sel) sel.addEventListener('change', () => { R.closeModal(); recordForm(sel.value); });
}
A['kpi-record'] = () => recordForm(R.addMonths(R.today().slice(0, 7), -1));
function openKpi(id) {
  const k = R.get('kpis', id); if (!k) return;
  const s = R.kpiSeries(k), P = R.PILLARS[k.pillar];
  const prog = R.kpiProgress(k);
  const body = '<div class="row wrap gap-s">' + R.pillarChip(k.pillar) + (k.scope ? '<span class="tag">' + esc(k.scope) + '</span>' : '') + R.exTag(k) + '</div>' +
    (k.note ? '<p class="muted">' + esc(k.note) + '</p>' : '') +
    (prog != null ? '<p><b>' + Math.round(prog * 100) + '%</b> of the way from ' + esc(R.num(R.kpiBase(k), k.unit)) + ' to the target of ' + esc(R.num(k.target, k.unit)) + (k.targetDate ? ' by ' + esc(R.fmtDate(k.targetDate, true)) : '') + '.' + (R.kpiBehind(k) ? ' ' + R.pill('warn', 'Behind the path to target', 'alert') : '') + '</p>' : '') +
    (s.length > 1 ? '<div class="chart-wrap">' + R.lineChart(k) + '</div>' : '<p class="muted">Record at least two months to see the trend.</p>') +
    '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Month</th><th class="num">' + esc(P ? k.name : 'Value') + '</th><th class="num">Change</th><th></th></tr></thead><tbody>' +
    (s.length ? s.slice().reverse().map((e, i, arr) => { const pv = arr[i + 1]; return '<tr><td>' + esc(R.fmtMonth(e.month)) + '</td><td class="num">' + esc(R.num(e.value, k.unit)) + '</td><td class="num">' + (pv ? (e.value - pv.value > 0 ? '+' : '') + esc(R.num(e.value - pv.value, k.unit)) : '') + '</td><td class="num">' + R.iconBtn('kpi-entry-del', 'trash', 'Remove ' + R.fmtMonth(e.month), { id: k.id, month: e.month }) + '</td></tr>'; }).join('') : '<tr><td colspan="4" class="muted">No numbers yet.</td></tr>') +
    '</tbody></table></div>';
  R.modal({ title: k.name, wide: true, body, noFocus: true, foot: R.btn('kpi-edit', 'Edit measure', { icon: 'edit', data: { id: k.id } }) + '<span class="spacer"></span>' + R.btn('kpi-entry', 'Add a number', { icon: 'plus', cls: 'primary', data: { id: k.id } }) });
}
A['kpi-open'] = d => openKpi(d.id);
A['kpi-entry'] = d => {
  const k = R.get('kpis', d.id); if (!k) return;
  R.closeModal();
  R.form({
    title: 'Add a number: ' + k.name, fields: [{ k: 'month', label: 'Month', type: 'select', half: true, opts: monthOpts() }, { k: 'value', label: 'Value', type: 'number', half: true, req: true }],
    values: { month: R.addMonths(R.today().slice(0, 7), -1) },
    onSubmit: v => { R.edit('kpis', k.id, x => { x.entries = (x.entries || []).filter(e => e.month !== v.month).concat([{ month: v.month, value: v.value }]); }); setTimeout(() => openKpi(k.id), 0); }
  });
};
A['kpi-entry-del'] = d => { R.edit('kpis', d.id, x => { x.entries = (x.entries || []).filter(e => e.month !== d.month); }); R.closeModal(); openKpi(d.id); };

/* ================= Projects ================= */
R.views.projects = {
  title: 'Projects',
  render() {
    if (R.ui.projectId) { const p = R.get('projects', R.ui.projectId); if (p) return detail(p); R.ui.projectId = null; }
    const all = R.all('projects'), tab = R.ui.projTab || 'live';
    const sets = { live: all.filter(R.isLive), idea: all.filter(p => p.status === 'Idea'), hold: all.filter(p => p.status === 'On hold'), done: all.filter(p => p.status === 'Complete') };
    let h = R.head('Projects', 'Growth projects, community programs and collection initiatives, each run against the same management checks.', R.btn('project-new', 'New project', { icon: 'plus', cls: 'primary' }));
    if (!all.length) return h + R.empty('No projects yet', 'Start from a playbook. Each one comes with an objective, a logic model, milestones, roles and risks that you adjust to your region.', R.btn('project-new', 'Choose a playbook', { cls: 'primary', icon: 'plus' }));
    h += R.tabs('proj-tab', tab, [['live', 'Planned and active', sets.live.length], ['idea', 'Ideas', sets.idea.length], ['hold', 'On hold', sets.hold.length], ['done', 'Complete', sets.done.length]]);
    const list = sets[tab].slice().sort((a, b) => (a.end || '9') < (b.end || '9') ? -1 : 1);
    if (!list.length) return h + '<p class="muted pad">Nothing in this group.</p>';
    h += '<div class="cols-2">' + list.map(p => {
      const hc = R.healthCheck(p), ok = hc.filter(c => c.ok).length, ms = p.milestones || [], nm = R.nextMilestone(p), owner = R.staffName(p.ownerId);
      return '<article class="panel pad card"><div class="card-top">' + R.spine(p.code) + '<div class="li-main">' + R.link('project-open', p.id, p.name, 'card-title') + '<span class="li-meta">' + R.pillarChip(p.pillar) + '<span>' + esc(p.type || '') + '</span>' + R.exTag(p) + '</span></div>' + R.healthPill(p) + '</div>' +
        (p.objective ? '<p class="clamp">' + esc(p.objective) + '</p>' : '<p class="warn-text">No objective written yet.</p>') +
        '<div class="row wrap gap-s">' + R.outcomeTags(p.outcomes) + '</div>' +
        '<dl class="kv"><div><dt>Owner</dt><dd>' + (owner ? esc(owner) : '<span class="warn-text">None</span>') + '</dd></div><div><dt>Dates</dt><dd>' + (p.start ? esc(R.fmtDate(p.start)) : '?') + ' to ' + (p.end ? esc(R.fmtDate(p.end, true)) : '?') + '</dd></div>' +
        '<div><dt>Milestones</dt><dd>' + R.meter(R.projectProgress(p), '', 'Milestones complete') + ' ' + ms.filter(m => m.done).length + ' of ' + ms.length + '</dd></div><div><dt>Management checks</dt><dd>' + R.meter(ok / hc.length, ok < 6 ? 'warn' : 'good', 'Management checks met') + ' ' + ok + ' of ' + hc.length + '</dd></div></dl>' +
        (nm ? '<p class="muted">Next: ' + esc(nm.title) + ' ' + R.due(nm.date) + '</p>' : '') + '</article>';
    }).join('') + '</div>';
    return h;
  }
};
A['proj-tab'] = d => { R.ui.projTab = d.v; R.render(); };
A['project-open'] = d => { R.closeModal(); R.go('projects', { projectId: d.id }); };
A['project-back'] = () => R.go('projects');

const pid = d => d.id || R.ui.projectId;
function detail(p) {
  const hc = R.healthCheck(p), ok = hc.filter(c => c.ok).length, owner = R.get('staff', p.ownerId), lm = p.logic || {};
  const tasks = R.all('tasks').filter(t => t.projectId === p.id).sort((a, b) => (a.status === 'done') - (b.status === 'done') || ((a.due || '9') < (b.due || '9') ? -1 : 1));
  const kpis = (p.kpiIds || []).map(id => R.get('kpis', id)).filter(Boolean);
  const shs = (p.stakeholderIds || []).map(id => R.get('stakeholders', id)).filter(Boolean);
  const ms = (p.milestones || []).slice().sort((a, b) => (a.date || '9') < (b.date || '9') ? -1 : 1);
  const cur = R.store.settings.currency || '$';
  let h = '<p class="crumb">' + R.btn('project-back', 'All projects', { icon: 'left', cls: 'sm ghost' }) + '</p>' +
    '<header class="vh"><div class="vh-text"><div class="row gap-s">' + R.spine(p.code) + '<h1>' + esc(p.name) + '</h1></div><div class="row wrap gap-s meta-row">' + R.healthPill(p) + R.pillarChip(p.pillar) + '<span class="tag">' + esc(p.type || 'Project') + '</span>' + R.outcomeTags(p.outcomes) + R.exTag(p) + '</div></div>' +
    '<div class="vh-actions">' + R.btn('project-report', 'Status report', { icon: 'reports', data: { id: p.id } }) + R.btn('project-edit', 'Edit', { icon: 'edit', cls: 'primary', data: { id: p.id } }) + '</div></header>';

  /* left column */
  const top = '<section class="sec"><div class="panel pad stack">' +
    '<div><h3 class="label">Objective</h3><p class="lead">' + (p.objective ? esc(p.objective) : '<span class="warn-text">Not written yet. A project without an objective cannot be judged.</span>') + '</p></div>' +
    '<div class="cols-2 tight"><div><h3 class="label">Community need</h3><p>' + (esc(p.need) || '<span class="muted">Not described.</span>') + '</p></div><div><h3 class="label">Who it is for</h3><p>' + (esc(p.audience) || '<span class="muted">Not described.</span>') + '</p></div></div>' +
    ((p.collectionTie || p.literacy) ? '<div class="cols-2 tight">' + (p.collectionTie ? '<div><h3 class="label">Collections put to work</h3><p>' + esc(p.collectionTie) + '</p></div>' : '') + (p.literacy ? '<div><h3 class="label">Literacy focus</h3><p>' + esc(p.literacy) + '</p></div>' : '') + '</div>' : '') +
    '<dl class="kv"><div><dt>Owner</dt><dd>' + (owner ? R.link('staff-open', owner.id, owner.name) : '<span class="warn-text">None</span>') + '</dd></div><div><dt>Dates</dt><dd>' + (p.start ? esc(R.fmtDate(p.start, true)) : '?') + ' to ' + (p.end ? esc(R.fmtDate(p.end, true)) : '?') + '</dd></div>' +
    ((p.branches || []).length ? '<div><dt>Branches</dt><dd>' + esc(p.branches.join(', ')) + '</dd></div>' : '') + '<div><dt>Next review</dt><dd>' + (p.nextReview ? R.due(p.nextReview) : '<span class="warn-text">Not set</span>') + '</dd></div></dl></div></section>';

  const box = (k, t, q) => '<div class="lm-box"><h4>' + t + '</h4><p>' + (lm[k] ? esc(lm[k]) : '<span class="muted">' + q + '</span>') + '</p></div>';
  const logic = '<section class="sec">' + R.sec('Logic model', R.btn('logic-edit', 'Edit', { icon: 'edit', cls: 'sm' }), 'Read it left to right: if we have these inputs and do these activities, we get these outputs, which lead to these changes for people.') +
    '<div class="logic">' + box('inputs', 'Inputs', 'What we put in') + box('activities', 'Activities', 'What we do') + box('outputs', 'Outputs', 'What we can count') + box('short', 'Short-term outcome', 'What changes soon') + box('long', 'Long-term outcome', 'What changes for good') + '</div></section>';

  let L = '<section class="sec">' + R.sec('Milestones', R.btn('ms-add', 'Milestone', { icon: 'plus', cls: 'sm' })) + '<div class="panel">' + (ms.length ? '<ul class="list">' + ms.map(m =>
    '<li class="li"><input type="checkbox" class="cb" id="ms-' + m.id + '" data-act="ms-toggle" data-mid="' + m.id + '"' + (m.done ? ' checked' : '') + ' aria-label="Mark done: ' + esc(m.title) + '"><div class="li-main"><button type="button" class="linkish li-title' + (m.done ? ' done' : '') + '" data-act="ms-edit" data-mid="' + m.id + '">' + esc(m.title) + '</button></div><div class="li-end">' + R.due(m.date, m.done) + '</div></li>').join('') + '</ul>' : '<p class="muted pad">No milestones yet. Add the three to five dates that tell you the project is moving.</p>') + '</div></section>';

  L += '<section class="sec">' + R.sec('Tasks', R.btn('task-new', 'Task', { icon: 'plus', cls: 'sm', data: { project: p.id } })) + '<div class="panel">' + (tasks.length ? '<ul class="list">' + tasks.map(R.taskRow).join('') + '</ul>' : '<p class="muted pad">No tasks linked to this project.</p>') + '</div></section>';

  const sn = id => esc(R.firstName(id) || '') || '<span class="warn-text">?</span>';
  L += '<section class="sec">' + R.sec('Roles (RACI)', R.btn('raci-open', 'Activity', { icon: 'plus', cls: 'sm' }), 'For each activity: who does it, who answers for it, who is consulted, who is kept informed.') +
    ((p.raci || []).length ? '<div class="tbl-wrap panel"><table class="tbl"><thead><tr><th>Activity</th><th>Responsible</th><th>Accountable</th><th>Consulted</th><th>Informed</th></tr></thead><tbody>' + p.raci.map(r =>
      '<tr><td><button type="button" class="linkish" data-act="raci-edit" data-rid="' + r.id + '">' + esc(r.activity) + '</button></td><td>' + sn(r.r) + '</td><td>' + sn(r.a) + '</td><td>' + esc(r.c || '') + '</td><td>' + esc(r.i || '') + '</td></tr>').join('') + '</tbody></table></div>' : '<p class="muted">No activities listed.</p>') + '</section>';

  const score = r => (Number(r.likelihood) || 1) * (Number(r.impact) || 1);
  L += '<section class="sec">' + R.sec('Risks', R.btn('risk-add', 'Risk', { icon: 'plus', cls: 'sm' })) + '<div class="panel">' + ((p.risks || []).length ? '<ul class="list">' + p.risks.slice().sort((a, b) => score(b) - score(a)).map(r => {
    const sc = score(r);
    return '<li class="li"><div class="li-main"><button type="button" class="linkish li-title" data-act="risk-edit" data-kid="' + r.id + '">' + esc(r.risk) + '</button><span class="li-meta">' + (r.mitigation ? 'Response: ' + esc(r.mitigation) : '<span class="warn-text">No response planned</span>') + '</span></div><div class="li-end">' + R.pill(sc >= 6 ? 'crit' : sc >= 3 ? 'warn' : 'good', sc >= 6 ? 'High' : sc >= 3 ? 'Medium' : 'Low', sc >= 3 ? 'alert' : 'check') + '</div></li>';
  }).join('') + '</ul>' : '<p class="muted pad">No risks listed.</p>') + '</div></section>';

  L += '<section class="sec">' + R.sec('Reviews', R.btn('review-add', 'Log a review', { icon: 'plus', cls: 'sm' }), 'Plan, do, check, act: what happened, what the numbers say, what you will change.') + '<div class="panel">' + ((p.reviews || []).length ? '<ul class="list">' + p.reviews.slice().sort((a, b) => a.date < b.date ? 1 : -1).map(r =>
    '<li class="li top"><span class="due">' + esc(R.fmtDate(r.date, true)) + '</span><div class="li-main stack-s">' + (r.did ? '<p><b>Happened:</b> ' + esc(r.did) + '</p>' : '') + (r.learned ? '<p><b>Learned:</b> ' + esc(r.learned) + '</p>' : '') + (r.next ? '<p><b>Changing:</b> ' + esc(r.next) + '</p>' : '') + '</div></li>').join('') + '</ul>' : '<p class="muted pad">No reviews logged yet.</p>') + '</div></section>';

  /* right column */
  const check = '<section class="sec">' + R.sec('Management check', '', ok + ' of ' + hc.length + ' principles in place') + '<div class="panel"><ul class="list hc">' + hc.map(c =>
    '<li class="li ' + (c.ok ? 'ok' : 'no') + '"><span class="li-ic ' + (c.ok ? 'l-ok' : 'l1') + '">' + icon(c.ok ? 'check' : 'alert') + '</span><div class="li-main"><span class="li-title">' + esc(c.principle) + '</span>' + (c.ok ? '' : '<span class="li-meta">' + esc(c.fix) + '</span>') + '</div>' + (c.ok ? '' : '<div class="li-end">' + R.btn(c.act, 'Fix', { cls: 'sm', data: c.act === 'task-new' ? { project: p.id, delegate: '1' } : { id: p.id } }) + '</div>') + '</li>').join('') + '</ul></div></section>';

  let S = '<section class="sec">' + R.sec('Measures') + (kpis.length ? '<div class="tiles one">' + kpis.map(R.kpiTile).join('') + '</div>' : '<p class="muted">No measure linked. Edit the project to choose how success is counted.</p>') + '</section>';

  S += '<section class="sec">' + R.sec('People and hours', R.btn('alloc-add', 'Person', { icon: 'plus', cls: 'sm' })) + '<div class="panel">' + ((p.allocations || []).length ? '<ul class="list">' + p.allocations.map(a => {
    const s = R.get('staff', a.staffId), l = R.staffLoad(a.staffId);
    return '<li class="li">' + R.avatar(s ? s.name : '?') + '<div class="li-main"><button type="button" class="linkish li-title" data-act="alloc-edit" data-sid="' + esc(a.staffId) + '">' + esc(s ? s.name : 'Someone who has left') + '</button><span class="li-meta">' + esc(a.role || '') + (l.over ? '<span class="warn-text">Over-committed: ' + l.hrs + ' of ' + l.cap + ' h</span>' : '') + '</span></div><div class="li-end"><span class="mono">' + esc(a.hours || 0) + ' h/wk</span></div></li>';
  }).join('') + '</ul>' : '<p class="muted pad">Nobody is allocated yet.</p>') + '</div></section>';

  if (shs.length) S += '<section class="sec">' + R.sec('Stakeholders') + '<div class="panel"><ul class="list">' + shs.map(s => '<li class="li"><div class="li-main">' + R.link('sh-open', s.id, s.name, 'li-title') + '<span class="li-meta">' + esc([s.role, s.org].filter(Boolean).join(', ')) + '</span></div><div class="li-end"><span class="tag">' + esc(R.QUADS[R.quadOf(s)].name) + '</span></div></li>').join('') + '</ul></div></section>';

  if (p.budget) S += '<section class="sec">' + R.sec('Budget') + '<div class="panel pad stack-s"><div class="row between"><span>Spent ' + esc(cur + Math.round(p.spent || 0).toLocaleString()) + '</span><span class="muted">of ' + esc(cur + Math.round(p.budget).toLocaleString()) + '</span></div>' + R.meter((p.spent || 0) / p.budget, (p.spent || 0) > p.budget ? 'crit' : '', 'Budget spent') + '</div></section>';

  return h + '<div class="split wide-left"><div>' + top + '</div><div>' + check + '</div></div>' + logic + '<div class="split wide-left"><div>' + L + '</div><div>' + S + '</div></div>';
}

/* ----- create and edit ----- */
A['project-new'] = d => {
  const pbs = R.PLAYBOOKS.slice().sort((a, b) => (b.pillar === d.pillar) - (a.pillar === d.pillar));
  const ai = R.caps.sample ? '<div class="ai-box"><label class="fld" for="idea"><span class="fld-l">Or describe your own idea</span><textarea id="idea" rows="2" placeholder="For example: a summer reading challenge for teenagers run with the two high schools"></textarea></label><div class="row">' + R.btn('project-draft', 'Draft a plan with Claude', { icon: 'spark' }) + '<span class="muted" id="idea-state"></span></div></div>' : '';
  R.modal({ title: 'Start a project', wide: true, noFocus: true, body: '<p class="modal-intro">Pick a playbook. You get an objective, logic model, milestones, roles and risks to adapt.</p><div class="pb-list">' + pbs.map(pb =>
    '<button type="button" class="pb" data-act="project-pick" data-pb="' + pb.id + '"><span class="pb-name">' + esc(pb.name) + '</span><span class="pb-blurb">' + esc(pb.blurb) + '</span><span class="row wrap gap-s">' + (pb.id === 'blank' ? '' : R.pillarChip(pb.pillar) + R.outcomeTags(pb.outcomes)) + '</span></button>').join('') + '</div>' + ai });
};
A['project-pick'] = d => {
  const pb = R.PLAYBOOKS.find(x => x.id === d.pb); if (!pb) return;
  if (R.topModal()) R.closeModal();
  projectForm(R.newProject(pb), pb.tasks || []);
};
A['project-draft'] = async () => {
  const el = document.getElementById('idea'), st = document.getElementById('idea-state'), idea = el ? el.value.trim() : '';
  if (!idea) { if (el) el.focus(); return; }
  if (st) st.textContent = 'Thinking… this can take a minute.';
  try {
    const out = await R.caps.sample.json('You are helping a public library regional manager plan a project that grows membership, borrowing and community outcomes.\n\nThe idea: ' + idea.slice(0, 1500) +
      '\n\nReply with only one JSON object with these keys:\nname (short title)\npillar (one of: members, borrowers, programs, collections)\ntype (one of: ' + R.TYPES.join(', ') + ')\nobjective (one SMART sentence with a number and a timeframe)\nneed (one or two sentences on the community need)\naudience (one sentence)\noutcomes (array chosen from: engagement, relevancy, literacy)\nlogic (object with inputs, activities, outputs, short, long; one or two sentences each; short and long are outcomes for people)\nmilestones (array of 4 to 6 [daysFromStart, title])\nraci (array of 4 or 5 activity names)\nrisks (array of 2 or 3 [risk, likelihood 1-3, impact 1-3, response])\ntasks (array of 2 or 3 [daysFromStart, title])\nUse plain language a library team would use. Do not invent statistics.');
    const o = out && typeof out === 'object' ? out : {};
    const arr = (x, f) => Array.isArray(x) ? x.filter(f) : [];
    const pb = {
      id: 'ai', name: String(o.name || 'New project').slice(0, 120), pillar: R.PILLARS[o.pillar] ? o.pillar : 'members', type: R.TYPES.includes(o.type) ? o.type : 'Growth project',
      outcomes: arr(o.outcomes, x => R.OUTCOMES[x]), stages: [], objective: String(o.objective || ''), need: String(o.need || ''), audience: String(o.audience || ''),
      logic: ['inputs', 'activities', 'outputs', 'short', 'long'].reduce((m, k) => { m[k] = String((o.logic || {})[k] || ''); return m; }, {}),
      milestones: arr(o.milestones, m => Array.isArray(m) && m.length > 1).map(m => [Math.max(0, Number(m[0]) || 0), String(m[1])]).sort((a, b) => a[0] - b[0]),
      raci: arr(o.raci, x => typeof x === 'string'),
      risks: arr(o.risks, k => Array.isArray(k) && k.length > 3).map(k => [String(k[0]), Math.min(3, Math.max(1, Number(k[1]) || 2)), Math.min(3, Math.max(1, Number(k[2]) || 2)), String(k[3])]),
      tasks: arr(o.tasks, t => Array.isArray(t) && t.length > 1).map(t => [Math.max(0, Number(t[0]) || 0), String(t[1])])
    };
    R.closeModal();
    projectForm(R.newProject(pb), pb.tasks);
    R.toast('Draft ready. Check every line before you save.');
  } catch (e) {
    const code = e && e.code;
    if (st) st.textContent = code === 'not_granted' ? 'Claude is not allowed on this page, so pick a playbook instead.' : code === 'rate_limited' ? 'Claude is busy. Try again in a few minutes.' : 'The draft did not come back. Try again or pick a playbook.';
  }
};
const projectFields = () => [
  { k: 'name', label: 'Project name', req: true, ph: 'Welcome Back: lapsed member win-back' },
  { k: 'type', label: 'Kind of work', type: 'select', half: true, opts: R.TYPES },
  { k: 'pillar', label: 'Growth pillar', type: 'select', half: true, opts: Object.keys(R.PILLARS).map(k => [k, R.PILLARS[k].name]) },
  { k: 'status', label: 'Status', type: 'select', third: true, opts: R.STATUSES },
  { k: 'health', label: 'Health', type: 'select', third: true, opts: Object.keys(R.HEALTH).map(k => [k, R.HEALTH[k]]) },
  { k: 'ownerId', label: 'Owner', type: 'select', third: true, blank: 'No owner yet', opts: R.staffOpts() },
  { k: 'start', label: 'Start', type: 'date', third: true },
  { k: 'end', label: 'End', type: 'date', third: true },
  { k: 'nextReview', label: 'Next review', type: 'date', third: true },
  { type: 'h', label: 'Why and for whom' },
  { k: 'objective', label: 'Objective', type: 'textarea', rows: 3, help: 'Specific, measurable, achievable, relevant and time-bound. Include a number and a date.' },
  { k: 'need', label: 'Community need', type: 'textarea', rows: 2, half: true },
  { k: 'audience', label: 'Who it is for', type: 'textarea', rows: 2, half: true },
  { k: 'outcomes', label: 'Outcomes it serves', type: 'multi', opts: Object.keys(R.OUTCOMES).map(k => [k, R.OUTCOMES[k].name]) },
  { k: 'collectionTie', label: 'Collections put to work', type: 'textarea', rows: 2, half: true, ph: 'Which collections this project gets borrowed, and how.' },
  { k: 'literacy', label: 'Literacy focus', type: 'select', half: true, blank: 'None', opts: R.LITERACY },
  { type: 'h', label: 'Measures, people and money' },
  { k: 'kpiIds', label: 'Measures of success', type: 'multi', opts: R.all('kpis').map(k => [k.id, k.name]), none: 'No measures yet. Add them in the Growth plan.' },
  { k: 'stakeholderIds', label: 'Stakeholders', type: 'multi', opts: R.all('stakeholders').map(s => [s.id, s.name]), none: 'No stakeholders yet. Add them in Stakeholders.' },
  (R.store.settings.branches || []).length ? { k: 'branches', label: 'Branches involved', type: 'multi', opts: R.store.settings.branches } : null,
  { k: 'budget', label: 'Budget', type: 'number', half: true },
  { k: 'spent', label: 'Spent so far', type: 'number', half: true }
];
function projectForm(p, tplTasks) {
  const isNew = !p.id;
  R.form({
    title: isNew ? 'New project' : 'Edit project', wide: true, fields: projectFields(), values: p, submit: isNew ? 'Create project' : 'Save',
    onSubmit: v => {
      const doc = Object.assign(R.clone(p), v);
      if (isNew) {
        doc.id = R.uid('p'); doc.code = R.projectCode(doc.pillar);
        R.save('projects', doc);
        const me = R.me();
        if (tplTasks && tplTasks.length) R.bulk(tplTasks.map(t => ({ c: 'tasks', doc: { id: R.uid('t'), title: t[1], due: R.addDays(doc.start || R.today(), t[0]), status: 'todo', important: true, projectId: doc.id, assigneeId: me ? me.id : '', createdAt: R.today() } })));
        R.go('projects', { projectId: doc.id });
        R.toast('Project created. Work through the management check next.');
      } else R.save('projects', doc);
    },
    onDelete: isNew ? null : () => { R.remove('projects', p.id); R.go('projects'); },
    deleteLabel: 'This removes the project plan. Its tasks stay in your task list.'
  });
}
R.projectFormOpen = projectForm;
A['project-edit'] = d => { const p = R.get('projects', pid(d)); if (p) projectForm(p); };
A['project-report'] = d => { R.ui.report = { type: 'project', projectId: pid(d) }; R.go('reports'); };

/* Edit one entry of a list kept inside a project (milestones, roles, risks, people, reviews). */
function subForm(d, key, idKey, itemId, cfg) {
  const p = R.get('projects', pid(d)); if (!p) return;
  const cur = itemId ? (p[key] || []).find(x => x[idKey] === itemId) : null;
  R.form({
    title: cfg.title(cur), fields: cfg.fields, values: cur || cfg.defaults || {}, intro: cfg.intro,
    onSubmit: v => R.edit('projects', p.id, x => {
      const arr = x[key] = x[key] || [];
      const i = cur ? arr.findIndex(y => y[idKey] === itemId) : (idKey === 'id' ? -1 : arr.findIndex(y => y[idKey] === v[idKey]));
      if (i >= 0) arr[i] = Object.assign(arr[i], v); else arr.push(idKey === 'id' ? Object.assign({ id: R.uid('i') }, v) : v);
      if (cfg.after) cfg.after(x, v);
    }),
    onDelete: cur ? () => R.edit('projects', p.id, x => { x[key] = (x[key] || []).filter(y => y[idKey] !== itemId); }) : null
  });
}
const msCfg = { title: c => c ? 'Edit milestone' : 'New milestone', fields: [{ k: 'title', label: 'Milestone', req: true, ph: 'First wave of messages sent' }, { k: 'date', label: 'Date', type: 'date', half: true, req: true }, { k: 'done', label: 'Done', type: 'bool', half: true }], defaults: { date: R.today() } };
A['ms-add'] = d => subForm(d, 'milestones', 'id', null, msCfg);
A['ms-edit'] = d => subForm(d, 'milestones', 'id', d.mid, msCfg);
A['ms-toggle'] = d => R.edit('projects', pid(d), x => { const m = (x.milestones || []).find(y => y.id === d.mid); if (m) m.done = !m.done; });
const raciCfg = () => ({ title: c => c ? 'Edit activity' : 'New activity', intro: 'One person is accountable. Keep the consulted list short.', fields: [{ k: 'activity', label: 'Activity', req: true }, { k: 'r', label: 'Responsible (does the work)', type: 'select', half: true, blank: 'Choose', opts: R.staffOpts() }, { k: 'a', label: 'Accountable (answers for it)', type: 'select', half: true, blank: 'Choose', opts: R.staffOpts() }, { k: 'c', label: 'Consulted', half: true, ph: 'Names or roles' }, { k: 'i', label: 'Informed', half: true, ph: 'Names or roles' }] });
A['raci-open'] = d => subForm(d, 'raci', 'id', null, raciCfg());
A['raci-edit'] = d => subForm(d, 'raci', 'id', d.rid, raciCfg());
const lvl = [[1, 'Low'], [2, 'Medium'], [3, 'High']];
const riskCfg = { title: c => c ? 'Edit risk' : 'New risk', fields: [{ k: 'risk', label: 'What could go wrong', req: true }, { k: 'likelihood', label: 'How likely', type: 'select', half: true, opts: lvl }, { k: 'impact', label: 'How damaging', type: 'select', half: true, opts: lvl }, { k: 'mitigation', label: 'What you will do about it', type: 'textarea', rows: 2 }], defaults: { likelihood: 2, impact: 2 } };
A['risk-add'] = d => subForm(d, 'risks', 'id', null, riskCfg);
A['risk-edit'] = d => subForm(d, 'risks', 'id', d.kid, riskCfg);
const allocCfg = () => ({ title: c => c ? 'Edit allocation' : 'Add a person', fields: [{ k: 'staffId', label: 'Person', type: 'select', req: true, blank: 'Choose', opts: R.staffOpts() }, { k: 'hours', label: 'Hours a week', type: 'number', half: true, min: 0 }, { k: 'role', label: 'Role on the project', half: true, ph: 'Lead, data, delivery' }] });
A['alloc-add'] = d => { if (!R.all('staff').length) { R.toast('Add people first, in People.', 'bad'); return; } subForm(d, 'allocations', 'staffId', null, allocCfg()); };
A['alloc-edit'] = d => subForm(d, 'allocations', 'staffId', d.sid, allocCfg());
A['logic-edit'] = d => {
  const p = R.get('projects', pid(d)); if (!p) return;
  R.form({ title: 'Logic model', wide: true, intro: 'Work backwards: start with the long-term outcome, then ask what has to be true before it.', values: p.logic || {},
    fields: [{ k: 'inputs', label: 'Inputs: what we put in', type: 'textarea', rows: 2 }, { k: 'activities', label: 'Activities: what we do', type: 'textarea', rows: 3 }, { k: 'outputs', label: 'Outputs: what we can count', type: 'textarea', rows: 2 }, { k: 'short', label: 'Short-term outcome: what changes for people soon', type: 'textarea', rows: 2 }, { k: 'long', label: 'Long-term outcome: what changes for good', type: 'textarea', rows: 2 }],
    onSubmit: v => R.edit('projects', p.id, x => { x.logic = v; }) });
};
A['review-add'] = d => {
  const p = R.get('projects', pid(d)); if (!p) return;
  R.form({ title: 'Log a review', wide: true, values: { date: R.today(), health: p.health || 'on', nextReview: R.addDays(R.today(), 28) },
    fields: [{ k: 'date', label: 'Review date', type: 'date', half: true, req: true }, { k: 'health', label: 'Health after this review', type: 'select', half: true, opts: Object.keys(R.HEALTH).map(k => [k, R.HEALTH[k]]) }, { k: 'did', label: 'What happened since the last review', type: 'textarea', rows: 2 }, { k: 'learned', label: 'What the numbers and the team say', type: 'textarea', rows: 2 }, { k: 'next', label: 'What you will change', type: 'textarea', rows: 2 }, { k: 'nextReview', label: 'Next review', type: 'date', half: true }],
    onSubmit: v => R.edit('projects', p.id, x => { x.reviews = (x.reviews || []).concat([{ id: R.uid('v'), date: v.date, did: v.did, learned: v.learned, next: v.next }]); x.health = v.health; x.nextReview = v.nextReview; }) });
};
})();
