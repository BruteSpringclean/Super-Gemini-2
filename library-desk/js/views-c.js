/* Regional Library Desk — views: Collections, Resources, Reports. */
(function () {
'use strict';
const R = window.RLD, esc = R.esc, icon = R.icon, A = R.actions;
const stat = (label, value, note) => '<div class="tile flat"><span class="tile-label">' + esc(label) + '</span><span class="tile-value">' + esc(value) + '</span>' + (note ? '<span class="delta">' + esc(note) + '</span>' : '') + '</div>';

/* ================= Collections ================= */
R.views.collections = {
  title: 'Collections',
  render() {
    const stats = R.collectionStats();
    let h = R.head('Collections', 'Turn usage figures into decisions: what to buy, weed, move and promote, and which outcome each move serves.', R.btn('seg-new', 'Add a collection', { icon: 'plus', cls: 'primary' }));
    if (!stats.length) return h + R.empty('No collections entered', 'List your collections with items held and loans for the last 12 months. The desk works out turnover and relative use, then suggests what to do with each one.', R.btn('seg-standard', 'Add the standard collections', { cls: 'primary', icon: 'plus' }) + R.btn('seg-new', 'Add one', { icon: 'plus' }));
    const items = R.sum(stats, s => s.items), loans = R.sum(stats, s => s.loans), act = stats.filter(s => s.dx === 'under' || s.dx === 'tired' || s.dx === 'hidden');
    h += '<section class="sec"><div class="tiles">' + stat('Items held', R.num(items)) + stat('Loans, last 12 months', R.num(loans)) + stat('Turnover', items ? (loans / items).toFixed(2) : '–', 'loans per item') + stat('Collections to act on', String(act.length), 'of ' + stats.length) + '</div></section>';
    h += '<section class="sec">' + R.sec('How each collection is working', '', 'Relative use compares a collection\'s share of loans with its share of stock. 1.0 is in balance; above 1.25 demand outstrips stock; below 0.75 stock outstrips demand.') +
      '<div class="tbl-wrap panel"><table class="tbl"><thead><tr><th>Collection</th><th class="num">Items</th><th class="num">Loans</th><th class="num">Turnover</th><th>Relative use</th><th class="num">Under 5 years</th><th class="num">Dead stock</th><th>Reading</th></tr></thead><tbody>' + stats.map(s => {
        const g = s.seg, r = s.ruf, w = r == null ? 0 : Math.min(50, Math.abs(r - 1) * 50);
        return '<tr><td><button type="button" class="linkish li-title" data-act="seg-edit" data-id="' + g.id + '">' + esc(g.name) + '</button>' + R.exTag(g) + '<span class="li-meta">' + esc([g.audience, g.format].filter(Boolean).join(' · ')) + '</span></td><td class="num">' + esc(R.num(s.items)) + '</td><td class="num">' + esc(R.num(s.loans)) + '</td><td class="num">' + (s.turnover == null ? '–' : s.turnover.toFixed(2)) + '</td>' +
          '<td><span class="ruf" role="img" aria-label="Relative use ' + (r == null ? 'unknown' : r.toFixed(2)) + '"><span class="ruf-track"><i style="' + (r != null && r < 1 ? 'right:50%' : 'left:50%') + ';width:' + w.toFixed(1) + '%"></i></span><span class="mono">' + (r == null ? '–' : r.toFixed(2)) + '</span></span></td>' +
          '<td class="num">' + (g.fresh == null || g.fresh === '' ? '–' : esc(g.fresh) + '%') + '</td><td class="num">' + (g.dead == null || g.dead === '' ? '–' : esc(g.dead) + '%') + '</td><td>' + R.pill(s.play.kind, s.play.label, s.play.icon) + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';
    if (act.length) h += '<section class="sec">' + R.sec('What to do next', '', 'Each move is tagged with the outcome it serves, so collection work is planned as growth work.') + '<div class="stack">' + ['under', 'tired', 'hidden'].map(dx => {
      const list = act.filter(s => s.dx === dx), P = R.PLAYS[dx]; if (!list.length) return '';
      return '<article class="panel pad card"><div class="card-top"><div class="li-main"><span class="card-title">' + esc(P.verb) + '</span><span class="li-meta"><span>' + esc(list.map(s => s.seg.name + ' (' + s.ruf.toFixed(2) + ')').join(', ')) + '</span></span></div>' + R.pill(P.kind, P.label, P.icon) + '</div><ul class="plays">' + P.plays.map(p => '<li><span>' + esc(p[0]) + '</span><span class="tag">' + esc(R.OUTCOMES[p[1]].name) + '</span></li>').join('') + '</ul><div><h3 class="label">Start a project for</h3><div class="row">' + list.map(s => R.btn('seg-project', s.seg.name, { icon: 'plus', cls: 'sm', data: { id: s.seg.id } })).join('') + '</div></div></article>';
    }).join('') + '</div></section>';
    return h;
  }
};
const segFields = [
  { k: 'name', label: 'Collection', req: true, ph: 'Junior fiction' },
  { k: 'audience', label: 'Audience', type: 'select', half: true, opts: ['All ages', 'Children', 'Teens', 'Adults'] },
  { k: 'format', label: 'Format', type: 'select', half: true, opts: ['Print', 'Audio-visual', 'Digital', 'Mixed'] },
  { k: 'items', label: 'Items held', type: 'number', half: true, min: 0 },
  { k: 'loans', label: 'Loans in the last 12 months', type: 'number', half: true, min: 0 },
  { k: 'fresh', label: 'Stock under 5 years old (%)', type: 'number', half: true, min: 0, max: 100 },
  { k: 'dead', label: 'Dead stock (%)', type: 'number', half: true, min: 0, max: 100, help: 'Share of items not borrowed in two years.' },
  { k: 'notes', label: 'Notes', type: 'textarea', rows: 2, ph: 'Community requests, languages, where it is shelved.' }
];
function segForm(g) {
  const isNew = !g.id;
  R.form({ title: isNew ? 'Add a collection' : 'Edit collection', fields: segFields, values: g, onSubmit: v => R.save('segments', Object.assign(R.clone(g), v)), onDelete: isNew ? null : () => R.remove('segments', g.id) });
}
A['seg-new'] = () => segForm({ name: '', audience: 'All ages', format: 'Print' });
A['seg-edit'] = d => { const g = R.get('segments', d.id); if (g) segForm(g); };
A['seg-standard'] = () => {
  const have = R.all('segments').map(s => s.name);
  const aud = n => /Picture|Junior/.test(n) ? 'Children' : /Young/.test(n) ? 'Teens' : /Adult|Large/.test(n) ? 'Adults' : 'All ages';
  const add = R.STANDARD_SEGMENTS.filter(n => !have.includes(n));
  R.bulk(add.map(n => ({ c: 'segments', doc: { id: R.uid('g'), name: n, audience: aud(n), format: /eBooks/.test(n) ? 'Digital' : /DVD/.test(n) ? 'Audio-visual' : 'Print' } })));
  R.toast(add.length + ' collections added. Select each one to enter its figures.');
};
A['seg-project'] = d => {
  const s = R.collectionStats().find(x => x.seg.id === d.id); if (!s) return;
  const pb = R.clone(R.PLAYBOOKS.find(x => x.id === 'refresh')), t = s.turnover || 0;
  pb.name = s.seg.name + ': ' + s.play.verb.toLowerCase();
  pb.objective = s.dx === 'under' ? 'Meet demand for ' + s.seg.name + ': lift loans by 15% and keep the wait for holds under four weeks by the end date, by buying to demand.'
    : s.dx === 'hidden' ? 'Lift turnover of ' + s.seg.name + ' from ' + t.toFixed(2) + ' to ' + (t * 1.25).toFixed(2) + ' loans per item by the end date by moving and promoting the stock we already hold.'
    : 'Lift turnover of ' + s.seg.name + ' from ' + t.toFixed(2) + ' to ' + (t * 1.25).toFixed(2) + ' loans per item by the end date by weeding dead stock, buying to demand and displaying what remains.';
  pb.outcomes = Array.from(new Set(s.play.plays.map(p => p[1])));
  const p = R.newProject(pb);
  p.collectionTie = s.seg.name + ' (' + R.num(s.items) + ' items, ' + R.num(s.loans) + ' loans in 12 months, relative use ' + s.ruf.toFixed(2) + ').';
  R.projectFormOpen(p, pb.tasks);
};

/* ================= Resources ================= */
R.views.resources = {
  title: 'Resources',
  render() {
    const staff = R.all('staff').slice().sort((a, b) => a.name.localeCompare(b.name)), live = R.all('projects').filter(R.isLive), cur = R.store.settings.currency || '$';
    const money = v => cur + Math.round(v || 0).toLocaleString();
    let h = R.head('Resources', 'Where your people\'s time and your budget are going, set against the growth pillars.');
    if (!staff.length && !live.length) return h + R.empty('Nothing to allocate yet', 'Add people with their weekly project hours, then allocate them to projects. This page shows who is stretched and whether effort matches your priorities.', R.btn('staff-new', 'Add a person', { cls: 'primary', icon: 'plus', data: { me: '1' } }));
    const rows = Object.keys(R.PILLARS).map(k => { const ps = live.filter(p => p.pillar === k); return { k, P: R.PILLARS[k], n: ps.length, hrs: R.sum(ps, p => R.sum(p.allocations || [], a => a.hours)), budget: R.sum(ps, p => p.budget), spent: R.sum(ps, p => p.spent) }; });
    const tHrs = R.sum(rows, r => r.hrs), tBud = R.sum(rows, r => r.budget);
    h += '<section class="sec">' + R.sec('Effort by growth pillar', '', 'Planned and active projects only. Check that the split matches what you say matters most.') + '<div class="panel pad stack">' +
      (tHrs ? '<div><h3 class="label">Staff hours a week</h3><div class="segbar" role="img" aria-label="Staff hours by pillar">' + rows.filter(r => r.hrs).map(r => '<i style="flex:' + r.hrs + ' 1 0;background:' + r.P.color + '"></i>').join('') + '</div></div>' : '') +
      (tBud ? '<div><h3 class="label">Budget</h3><div class="segbar" role="img" aria-label="Budget by pillar">' + rows.filter(r => r.budget).map(r => '<i style="flex:' + r.budget + ' 1 0;background:' + r.P.color + '"></i>').join('') + '</div></div>' : '') +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Pillar</th><th class="num">Projects</th><th class="num">Hours a week</th><th class="num">Share of hours</th><th class="num">Budget</th><th class="num">Spent</th></tr></thead><tbody>' + rows.map(r =>
        '<tr><td>' + R.pillarChip(r.k) + '</td><td class="num">' + r.n + '</td><td class="num">' + r.hrs + '</td><td class="num">' + (tHrs ? Math.round(r.hrs / tHrs * 100) + '%' : '–') + '</td><td class="num">' + esc(money(r.budget)) + '</td><td class="num">' + esc(money(r.spent)) + '</td></tr>').join('') +
      '<tr class="total"><td>Total</td><td class="num">' + live.length + '</td><td class="num">' + tHrs + '</td><td class="num"></td><td class="num">' + esc(money(tBud)) + '</td><td class="num">' + esc(money(R.sum(rows, r => r.spent))) + '</td></tr></tbody></table></div></div></section>';

    if (staff.length) h += '<section class="sec">' + R.sec('People and capacity', '', 'Project hours are what each person has left after rostered and routine work.') + '<div class="tbl-wrap panel"><table class="tbl"><thead><tr><th>Person</th><th class="num">Available</th><th class="num">Allocated</th><th>Load</th><th>Projects</th><th class="num">Open tasks</th></tr></thead><tbody>' + staff.map(s => {
      const l = R.staffLoad(s.id), tasks = R.all('tasks').filter(t => t.assigneeId === s.id && t.status !== 'done').length;
      return '<tr><td>' + R.link('staff-open', s.id, s.name, 'li-title') + '<span class="li-meta">' + esc(s.title || '') + '</span></td><td class="num">' + (l.cap ? l.cap + ' h' : '<span class="muted">Not set</span>') + '</td><td class="num">' + l.hrs + ' h</td><td>' + (l.cap || l.hrs ? R.meter(l.frac, l.over ? 'crit' : l.frac > 0.85 ? 'warn' : '', 'Load') + ' ' + (l.over ? R.pill('crit', 'Over by ' + (l.hrs - l.cap) + ' h', 'alert') : l.cap ? '<span class="mono">' + Math.round(l.frac * 100) + '%</span>' : '') : '') + '</td><td>' + (l.list.map(x => R.link('project-open', x.p.id, x.p.name) + ' <span class="mono">' + x.hours + 'h</span>').join('<br>') || '<span class="muted">None</span>') + '</td><td class="num">' + tasks + '</td></tr>';
    }).join('') + '</tbody></table></div></section>';

    const withMoney = R.all('projects').filter(p => p.budget && p.status !== 'Idea');
    if (withMoney.length) h += '<section class="sec">' + R.sec('Budget by project') + '<div class="tbl-wrap panel"><table class="tbl"><thead><tr><th>Project</th><th>Pillar</th><th class="num">Budget</th><th class="num">Spent</th><th class="num">Left</th><th>Used</th></tr></thead><tbody>' + withMoney.map(p => {
      const sp = Number(p.spent) || 0, f = sp / p.budget;
      return '<tr><td>' + R.link('project-open', p.id, p.name, 'li-title') + '</td><td>' + R.pillarChip(p.pillar) + '</td><td class="num">' + esc(money(p.budget)) + '</td><td class="num">' + esc(money(sp)) + '</td><td class="num">' + esc(money(p.budget - sp)) + '</td><td>' + R.meter(f, f > 1 ? 'crit' : f > 0.9 ? 'warn' : '', 'Budget used') + ' <span class="mono">' + Math.round(f * 100) + '%</span></td></tr>';
    }).join('') + '</tbody></table></div></section>';
    else h += '<p class="aside">Give projects a budget in their edit form to track spending here.</p>';
    return h;
  }
};

/* ================= Reports ================= */
const RTYPES = { monthly: 'Monthly regional report', scorecard: 'Growth scorecard', project: 'Project status report', person: 'One-to-one brief', stakeholder: 'Stakeholder briefing' };
const tbl = (heads, rows) => rows.length ? '<table><thead><tr>' + heads.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c == null ? '' : c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>' : '';
const ul = items => items.length ? '<ul>' + items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>' : '';
const para = t => t ? '<p>' + esc(t) + '</p>' : '';
const H = t => '<h2>' + esc(t) + '</h2>';
const statusText = p => p.status === 'Active' || p.status === 'Planning' ? p.status + ', ' + R.HEALTH[p.health || 'on'].toLowerCase() : p.status;
const kpiRow = (k, month) => {
  const s = R.kpiSeries(k), e = month ? s.find(x => x.month === month) : s[s.length - 1], i = e ? s.indexOf(e) : -1, pv = i > 0 ? s[i - 1] : null, prog = R.kpiProgress(k);
  const d = e && pv ? e.value - pv.value : null;
  return [k.name, e ? R.num(e.value, k.unit) : 'Not recorded', d == null ? '' : (d > 0 ? '+' : '') + R.num(d, k.unit), k.target != null && k.target !== '' ? R.num(k.target, k.unit) + (k.targetDate ? ' by ' + R.fmtDate(k.targetDate, true) : '') : '', prog == null ? '' : Math.round(prog * 100) + '%' + (R.kpiBehind(k) ? ' (behind)' : '')];
};
function reportState() {
  const r = R.ui.report = R.ui.report || {};
  r.type = RTYPES[r.type] ? r.type : 'monthly';
  r.month = r.month || R.addMonths(R.today().slice(0, 7), -1);
  if (!R.get('projects', r.projectId)) r.projectId = (R.all('projects')[0] || {}).id || '';
  if (!R.get('staff', r.staffId)) r.staffId = (R.directReports()[0] || R.all('staff').find(s => !s.isMe) || {}).id || '';
  if (!R.get('stakeholders', r.stakeholderId)) r.stakeholderId = (R.all('stakeholders')[0] || {}).id || '';
  r.note = r.note || '';
  return r;
}
function build(r) {
  const s = R.store.settings, me = R.me(), region = s.regionName || 'Regional', by = (me ? me.name + ', ' : '') + R.fmtDate(R.today(), true);
  if (r.type === 'monthly') {
    const m = r.month, from = m + '-01', to = R.addDays(R.addMonths(m, 1) + '-01', -1), inM = d => !!d && d >= from && d <= to;
    const projects = R.all('projects').filter(p => p.status !== 'Idea' && p.status !== 'Complete');
    let b = H('Growth measures') + (tbl(['Measure', R.fmtMonth(m), 'Change on previous month', 'Target', 'Progress'], R.all('kpis').map(k => kpiRow(k, m))) || para('No measures set up.'));
    b += H('Projects') + (tbl(['Project', 'Pillar', 'Status', 'Milestones', 'Next milestone', 'Owner'], projects.map(p => { const ms = p.milestones || [], nm = R.nextMilestone(p); return [p.name, (R.PILLARS[p.pillar] || {}).name, statusText(p), ms.filter(x => x.done).length + ' of ' + ms.length, nm ? nm.title + ' (' + R.fmtDate(nm.date) + ')' : '', R.staffName(p.ownerId)]; })) || para('No projects under way.'));
    const reviews = []; R.all('projects').forEach(p => (p.reviews || []).forEach(v => { if (inM(v.date)) reviews.push(p.name + ': ' + [v.learned, v.next ? 'Changing: ' + v.next : ''].filter(Boolean).join(' ')); }));
    const done = R.all('tasks').filter(t => t.status === 'done' && inM(t.doneAt));
    if (reviews.length || done.length) b += H('Progress this month') + ul(reviews) + (done.length ? para(done.length + (done.length === 1 ? ' task' : ' tasks') + ' completed, including: ' + done.slice(0, 8).map(t => t.title).join('; ') + '.') : '');
    const risky = []; projects.forEach(p => { if (p.health === 'off' || p.health === 'risk') risky.push(p.name + ' is ' + R.HEALTH[p.health].toLowerCase() + '.'); (p.risks || []).forEach(k => { if ((Number(k.likelihood) || 1) * (Number(k.impact) || 1) >= 6) risky.push(p.name + ': ' + String(k.risk).replace(/[.\s]*$/, '.') + (k.mitigation ? ' Response: ' + k.mitigation : '')); }); });
    R.all('kpis').forEach(k => { if (R.kpiBehind(k)) risky.push(k.name + ' is behind its path to target.'); });
    b += H('Risks and issues') + (ul(risky) || para('None to report.'));
    const over = R.all('staff').filter(x => R.staffLoad(x.id).over).map(x => { const l = R.staffLoad(x.id); return x.name + ' is allocated ' + l.hrs + ' project hours a week against ' + l.cap + ' available.'; });
    const oo = R.all('staff').filter(x => (x.log || []).some(e => inM(e.date))).length;
    b += H('People') + para(oo ? 'One-to-ones were held with ' + oo + (oo === 1 ? ' person.' : ' people.') : 'No one-to-ones were logged this month.') + ul(over);
    const contacts = []; R.all('stakeholders').forEach(x => (x.log || []).forEach(e => { if (inM(e.date)) contacts.push([R.fmtDate(e.date), x.name + (x.org ? ', ' + x.org : ''), e.summary || '', e.next || '']); }));
    b += H('Stakeholder contact') + (tbl(['Date', 'Who', 'Summary', 'Next step'], contacts.sort()) || para('No contact was logged this month.'));
    const col = R.collectionStats().filter(x => x.dx === 'under' || x.dx === 'tired' || x.dx === 'hidden');
    if (col.length) b += H('Collections') + ul(col.map(x => x.seg.name + ': ' + x.play.label.toLowerCase() + ' (relative use ' + x.ruf.toFixed(2) + '). Recommended: ' + x.play.verb.toLowerCase() + '.'));
    const next = R.calItems(R.today(), R.addDays(R.today(), 30), true).filter(i => i.kind !== 'task' && i.kind !== 'follow' && i.kind !== 'oneonone').slice(0, 15);
    b += H('Coming up in the next 30 days') + (ul(next.map(i => R.fmtDate(i.date) + ': ' + i.title + (i.sub ? ' (' + i.sub + ')' : ''))) || para('Nothing scheduled.'));
    return { title: region + ' report: ' + R.fmtMonth(m), by, body: b, ask: 'the summary at the top of a monthly report to their director. Cover what moved, what is at risk, and what decision or support is needed' };
  }
  if (r.type === 'scorecard') {
    let b = '';
    Object.keys(R.PILLARS).forEach(k => { const ks = R.all('kpis').filter(x => x.pillar === k); if (!ks.length) return; b += H(R.PILLARS[k].name) + para(R.PILLARS[k].outcome) + tbl(['Measure', 'Start', 'Latest', 'Target', 'Progress', 'Reading'], ks.map(x => { const l = R.kpiLatest(x), p = R.kpiProgress(x); return [x.name, R.num(R.kpiBase(x), x.unit), l ? R.num(l.value, x.unit) + ' (' + R.fmtMonth(l.month) + ')' : 'Not recorded', x.target != null && x.target !== '' ? R.num(x.target, x.unit) + (x.targetDate ? ' by ' + R.fmtDate(x.targetDate, true) : '') : '', p == null ? '' : Math.round(p * 100) + '%', p == null ? '' : p >= 1 ? 'Target met' : R.kpiBehind(x) ? 'Behind' : 'On path']; })); });
    return { title: region + ' growth scorecard', by, body: b || para('No measures set up yet.'), ask: 'a short reading of this growth scorecard. Say which measures are moving, which are behind, and where to focus next' };
  }
  if (r.type === 'project') {
    const p = R.get('projects', r.projectId); if (!p) return { title: 'Project status report', by, body: para('Create a project first.'), ask: '' };
    const ms = (p.milestones || []).slice().sort((a, b) => (a.date || '9') < (b.date || '9') ? -1 : 1), hc = R.healthCheck(p), tasks = R.all('tasks').filter(t => t.projectId === p.id && t.status !== 'done').sort((a, b) => (a.due || '9') < (b.due || '9') ? -1 : 1), lm = p.logic || {};
    const last = (p.reviews || []).slice().sort((a, b) => a.date < b.date ? 1 : -1)[0];
    let b = H('Summary') + tbl(['', ''], [['Status', statusText(p)], ['Owner', R.staffName(p.ownerId) || 'None'], ['Dates', (p.start ? R.fmtDate(p.start, true) : '?') + ' to ' + (p.end ? R.fmtDate(p.end, true) : '?')], ['Milestones', ms.filter(x => x.done).length + ' of ' + ms.length + ' complete'], ['Outcomes served', (p.outcomes || []).map(o => R.OUTCOMES[o] ? R.OUTCOMES[o].name : '').filter(Boolean).join(', ')], p.budget ? ['Budget', R.num(p.spent || 0, '$') + ' spent of ' + R.num(p.budget, '$')] : null].filter(Boolean));
    b += H('Objective') + para(p.objective || 'Not written yet.') + (p.need ? H('Community need') + para(p.need) : '');
    if (lm.short || lm.long) b += H('Intended outcomes') + ul([lm.short, lm.long].filter(Boolean));
    const ks = (p.kpiIds || []).map(id => R.get('kpis', id)).filter(Boolean);
    if (ks.length) b += H('Measures') + tbl(['Measure', 'Latest', 'Change', 'Target', 'Progress'], ks.map(k => kpiRow(k)));
    b += H('Milestones') + (tbl(['Milestone', 'Date', 'State'], ms.map(x => [x.title, x.date ? R.fmtDate(x.date, true) : '', x.done ? 'Done' : x.date && x.date < R.today() ? 'Overdue' : 'To do'])) || para('None set.'));
    if (tasks.length) b += H('Next steps') + tbl(['Task', 'Who', 'Due'], tasks.slice(0, 10).map(t => [t.title, R.staffName(t.assigneeId) || 'Regional manager', t.due ? R.fmtDate(t.due) : '']));
    if ((p.risks || []).length) b += H('Risks') + tbl(['Risk', 'Rating', 'Response'], p.risks.map(k => { const sc = (Number(k.likelihood) || 1) * (Number(k.impact) || 1); return [k.risk, sc >= 6 ? 'High' : sc >= 3 ? 'Medium' : 'Low', k.mitigation || '']; }));
    if (last) b += H('Latest review, ' + R.fmtDate(last.date, true)) + ul([last.did ? 'Happened: ' + last.did : '', last.learned ? 'Learned: ' + last.learned : '', last.next ? 'Changing: ' + last.next : ''].filter(Boolean));
    const gaps = hc.filter(c => !c.ok);
    b += H('Management check') + para(hc.length - gaps.length + ' of ' + hc.length + ' principles in place.') + ul(gaps.map(c => c.principle + ': ' + c.fix));
    return { title: p.name + ': status report', by, body: b, ask: 'the summary at the top of a project status report. Cover progress against the objective, the main risk, and what is needed next' };
  }
  if (r.type === 'person') {
    const x = R.get('staff', r.staffId); if (!x) return { title: 'One-to-one brief', by, body: para('Add a person first.'), ask: '' };
    const lv = R.LEVELS[x.level], l = R.staffLoad(x.id), last = (x.log || []).slice().sort((a, b) => a.date < b.date ? 1 : -1)[0], since = last ? last.date : R.addDays(R.today(), -30);
    const open = R.all('tasks').filter(t => t.assigneeId === x.id && t.status !== 'done').sort((a, b) => (a.due || '9') < (b.due || '9') ? -1 : 1), late = open.filter(R.isOverdue);
    const done = R.all('tasks').filter(t => t.assigneeId === x.id && t.status === 'done' && t.doneAt && t.doneAt >= since);
    let b = '';
    if (last) b += H('Last time, ' + R.fmtDate(last.date, true)) + para(last.notes) + (last.actions ? para('Agreed: ' + last.actions) : '');
    const talk = [];
    done.slice(0, 3).forEach(t => talk.push('Thank them for finishing: ' + t.title + '.'));
    late.forEach(t => talk.push('Ask what is blocking: ' + t.title + ' (due ' + R.fmtDate(t.due) + ').'));
    if (l.over) talk.push('They are allocated ' + l.hrs + ' project hours against ' + l.cap + '. Agree what moves or stops.');
    if (x.development) talk.push('Progress on development goals: ' + x.development);
    if (last && last.actions) talk.push('Check the actions agreed last time.');
    if (!talk.length) talk.push('Ask what is going well, what is hard, and what they need from you.');
    b += H('Talking points') + ul(talk);
    if (lv) b += H('Approach') + para(lv.style + '. ' + lv.how);
    b += H('Open tasks') + (tbl(['Task', 'Due', 'Authority', 'Project'], open.map(t => [t.title, t.due ? R.fmtDate(t.due) + (R.isOverdue(t) ? ' (overdue)' : '') : '', (R.DELEGATION.find(o => String(o[0]) === String(t.level)) || [])[1] || '', (R.get('projects', t.projectId) || {}).name || ''])) || para('None.'));
    if (done.length) b += H('Finished since ' + R.fmtDate(since, true)) + ul(done.map(t => t.title));
    b += H('Projects and load') + (tbl(['Project', 'Hours a week'], l.list.map(i => [i.p.name, i.hours])) || para('Not allocated to a project.')) + (l.cap ? para(l.hrs + ' of ' + l.cap + ' project hours a week allocated.') : '');
    if (x.strengths) b += H('Strengths') + para(x.strengths);
    return { title: 'One-to-one brief: ' + x.name, by, body: b, ask: 'three or four sentences to open a one-to-one with this team member: warm, specific, and focused on their work and growth' };
  }
  const x = R.get('stakeholders', r.stakeholderId); if (!x) return { title: 'Stakeholder briefing', by, body: para('Add a stakeholder first.'), ask: '' };
  const q = R.QUADS[R.quadOf(x)], ps = R.all('projects').filter(p => (p.stakeholderIds || []).includes(x.id)), log = (x.log || []).slice().sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 4), next = R.nextContact(x);
  let b = H('Who they are') + tbl(['', ''], [['Role', [x.role, x.org].filter(Boolean).join(', ')], ['Group', x.category || ''], ['Stance', x.stance || ''], ['Influence and interest', (x.influence || '?') + ' and ' + (x.interest || '?') + ' out of 5'], ['Approach', q.name + '. ' + q.how], next ? ['Next contact due', R.fmtDate(next, true)] : null].filter(Boolean));
  if (x.wants) b += H('What they care about') + para(x.wants);
  if (x.asks) b += H('What we need from them') + para(x.asks);
  b += H('Projects to update them on') + (tbl(['Project', 'Status', 'Next milestone'], ps.map(p => { const nm = R.nextMilestone(p); return [p.name, statusText(p), nm ? nm.title + ' (' + R.fmtDate(nm.date) + ')' : '']; })) || para('None linked.'));
  b += H('Recent contact') + (tbl(['Date', 'How', 'Summary', 'Next step'], log.map(e => [R.fmtDate(e.date, true), e.type || '', e.summary || '', e.next || ''])) || para('None logged.'));
  const pts = ps.map(p => 'Update on ' + p.name + ': ' + statusText(p).toLowerCase() + '.'); if (x.asks) pts.push('Raise: ' + x.asks); if (log[0] && log[0].next) pts.push('Close the loop on: ' + log[0].next);
  b += H('Suggested agenda') + (ul(pts) || para('Ask what matters most to them this quarter.'));
  return { title: 'Briefing: ' + x.name, by, body: b, ask: 'a short briefing note before meeting this stakeholder: what they care about, where our work helps them, and the one thing to ask for' };
}
const noteHtml = t => String(t || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');
const fullHtml = (rep, note) => '<h1>' + esc(rep.title) + '</h1><p class="meta">Prepared by ' + esc(rep.by) + '</p>' + (note ? '<h2>Summary</h2>' + noteHtml(note) : '') + rep.body;
function toText(html) {
  const div = document.createElement('div'); div.innerHTML = html; const out = [];
  const walk = n => n.childNodes.forEach(c => {
    if (c.nodeType === 3) { out.push(c.textContent.replace(/\s+/g, ' ')); return; }
    if (c.nodeType !== 1) return;
    const t = c.tagName;
    if (t === 'TABLE') { c.querySelectorAll('tr').forEach(tr => out.push('\n' + Array.from(tr.children).map(td => td.textContent.trim().replace(/\s+/g, ' ')).filter((x, i, a) => x || a.some(Boolean)).join(' | '))); out.push('\n'); return; }
    if (t === 'LI') out.push('\n- ');
    if (t === 'BR') out.push('\n');
    if (/^H[1-4]$/.test(t)) out.push('\n\n');
    if (t === 'P' || t === 'UL') out.push('\n');
    walk(c);
    if (/^H[1-4]$/.test(t) || t === 'P') out.push('\n');
  });
  walk(div);
  return out.join('').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
R.views.reports = {
  title: 'Reports',
  render() {
    const r = reportState(), rep = build(r);
    const sel = (id, k, opts, cur, label) => '<label class="fld" for="' + id + '"><span class="fld-l">' + label + '</span><select id="' + id + '" data-chg="rp-set" data-k="' + k + '">' + opts.map(o => '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(cur) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></label>';
    const months = []; for (let i = 0; i >= -18; i--) { const m = R.addMonths(R.today().slice(0, 7), i); months.push([m, R.fmtMonth(m)]); }
    let param = '';
    if (r.type === 'monthly') param = sel('rp-month', 'month', months, r.month, 'Month');
    if (r.type === 'project') param = sel('rp-project', 'projectId', R.all('projects').map(p => [p.id, p.name]), r.projectId, 'Project');
    if (r.type === 'person') param = sel('rp-person', 'staffId', R.all('staff').filter(s => !s.isMe).map(s => [s.id, s.name]), r.staffId, 'Person');
    if (r.type === 'stakeholder') param = sel('rp-sh', 'stakeholderId', R.all('stakeholders').map(s => [s.id, s.name]), r.stakeholderId, 'Stakeholder');
    return R.head('Reports', 'Built from what is already on the desk. Add your own summary, then copy it or save it as a file.') +
      '<div class="report-layout"><div class="panel pad stack report-controls">' + sel('rp-type', 'type', Object.keys(RTYPES).map(k => [k, RTYPES[k]]), r.type, 'Report') + param +
      '<label class="fld" for="rp-note"><span class="fld-l">Your summary</span><textarea id="rp-note" rows="7" data-inp="rp-note" placeholder="What moved, what is at risk, what you need. This goes at the top of the report.">' + esc(r.note) + '</textarea></label>' +
      (R.caps.sample && rep.ask ? '<div class="row wrap gap-s">' + (r.drafting ? R.btn('rp-stop', 'Stop', { icon: 'x' }) : R.btn('rp-draft', 'Draft the summary with Claude', { icon: 'spark' })) + '<span class="muted" id="rp-state">' + esc(r.state || '') + '</span></div><p class="muted small">Claude sees only this report. Check the draft against what you know before you send it.</p>' : '') +
      '<div class="row wrap gap-s">' + R.btn('rp-copy', 'Copy as text', { icon: 'copy', cls: 'primary' }) + R.btn('rp-save', 'Save as a file', { icon: 'download' }) + '</div></div>' +
      '<article class="report-doc panel"><h1>' + esc(rep.title) + '</h1><p class="meta">Prepared by ' + esc(rep.by) + '</p><div id="rp-note-out">' + (r.note ? '<h2>Summary</h2>' + noteHtml(r.note) : '') + '</div>' + rep.body + '</article></div>';
  }
};
const setNote = t => {
  R.ui.report.note = t;
  const ta = document.getElementById('rp-note'), out = document.getElementById('rp-note-out');
  if (ta && ta.value !== t) ta.value = t;
  if (out) out.innerHTML = t ? '<h2>Summary</h2>' + noteHtml(t) : '';
};
A['rp-set'] = (d, el) => { const r = reportState(); r[d.k] = el.value; if (d.k !== 'month') r.note = ''; r.state = ''; R.render(); };
A['rp-note'] = (d, el) => setNote(el.value);
A['rp-copy'] = () => { const r = reportState(); R.copy(toText(fullHtml(build(r), r.note))); };
A['rp-save'] = () => {
  const r = reportState(), rep = build(r);
  const doc = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>' + esc(rep.title) + '</title><style>body{font:15px/1.55 Georgia,"Times New Roman",serif;max-width:780px;margin:40px auto;padding:0 20px;color:#1b1a2b}h1{font-size:26px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px;padding-bottom:4px;border-bottom:1px solid #bbb}table{border-collapse:collapse;width:100%;font:13px/1.4 Arial,Helvetica,sans-serif;margin:8px 0}th,td{border-bottom:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}.meta{color:#555;margin:0 0 20px}ul{padding-left:20px}</style></head><body>' + fullHtml(rep, r.note) + '</body></html>';
  R.saveFile(rep.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) + '.html', doc);
};
let ctl = null;
A['rp-stop'] = () => { if (ctl) ctl.abort(); };
A['rp-draft'] = async () => {
  const sample = R.caps.sample, r = reportState(), rep = build(r); if (!sample || r.drafting) return;
  ctl = new AbortController(); r.drafting = true; r.state = 'Thinking… this can take a minute.'; R.render();
  try {
    const res = await sample('You are helping a public library regional manager write ' + rep.ask + '.\n\nUse only the facts in the report below. Write 110 to 170 words in plain paragraphs, in the first person plural. No headings, no bullet points, no markdown. Do not invent numbers, names or events. If the report has little data, say what is missing in one sentence.\n\nREPORT: ' + rep.title + '\n\n' + toText(rep.body).slice(0, 14000),
      { signal: ctl.signal, cache: false, onText: u => setNote(u.text) });
    setNote(res.text); r.state = res.truncated ? 'The draft was cut short.' : 'Draft ready. Edit it to sound like you.';
  } catch (e) {
    const code = e && e.code;
    if (e && e.text) setNote(e.text); else if (code === 'refused') setNote('');
    r.state = code === 'cancelled' ? 'Stopped.' : code === 'not_granted' || code === 'sampling_disabled' ? 'Claude is not available on this page. Write the summary yourself.' : code === 'rate_limited' ? 'Claude is busy. Try again in a few minutes.' : code === 'session_expired' ? 'Sign in to Claude again, then retry.' : 'The draft did not come back. Try again.';
  }
  r.drafting = false; ctl = null; R.render();
};
})();
