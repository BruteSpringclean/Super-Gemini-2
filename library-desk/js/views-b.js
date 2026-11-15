/* Regional Library Desk — views: Tasks, Calendar, People, Stakeholders. */
(function () {
'use strict';
const R = window.RLD, esc = R.esc, icon = R.icon, A = R.actions;

/* ================= Tasks ================= */
R.taskRow = t => {
  const mine = R.isMine(t), p = R.get('projects', t.projectId), done = t.status === 'done';
  return '<li class="li"><input type="checkbox" class="cb" id="tk-' + t.id + '" data-act="task-toggle" data-id="' + t.id + '"' + (done ? ' checked' : '') + ' aria-label="Mark done: ' + esc(t.title) + '">' +
    '<div class="li-main"><button type="button" class="linkish li-title' + (done ? ' done' : '') + '" data-act="task-edit" data-id="' + t.id + '">' + esc(t.title) + '</button>' + R.exTag(t) + '<span class="li-meta">' +
    (!mine ? '<span>' + icon('user') + esc(R.staffName(t.assigneeId) || 'Unassigned') + '</span>' : '') +
    (p ? '<span>' + esc(p.name) + '</span>' : '') +
    (t.status === 'doing' ? '<span class="tag">In progress</span>' : t.status === 'waiting' ? '<span class="tag">Waiting</span>' : '') +
    (t.important ? '<span class="tag imp">Important</span>' : '') +
    (!mine && t.followUp && !done ? '<span>Follow up ' + R.due(t.followUp) + '</span>' : '') +
    '</span></div><div class="li-end">' + (t.due ? R.due(t.due, done) : '') + '</div></li>';
};
const byDue = (a, b) => (a.due || '9') < (b.due || '9') ? -1 : (a.due || '9') > (b.due || '9') ? 1 : 0;
const isUrgent = t => !!t.urgent || (!!t.due && R.diffDays(t.due, R.today()) <= 2);
const group = (title, list, note) => list.length ? '<section class="sec"><div class="sec-h"><div><h2>' + esc(title) + '<span class="count">' + list.length + '</span></h2>' + (note ? '<p class="sec-sub">' + esc(note) + '</p>' : '') + '</div></div><div class="panel"><ul class="list">' + list.map(R.taskRow).join('') + '</ul></div></section>' : '';

R.views.tasks = {
  title: 'Tasks',
  render() {
    const all = R.all('tasks'), open = all.filter(t => t.status !== 'done'), t0 = R.today();
    const mine = open.filter(R.isMine).sort(byDue), deleg = open.filter(t => !R.isMine(t)).sort(byDue);
    const tab = R.ui.taskTab || 'mine';
    let h = R.head('Tasks', 'Your own work, and the work you have handed to others.', R.btn('task-new', 'Delegate a task', { icon: 'user', data: { delegate: '1' } }) + R.btn('task-new', 'New task', { icon: 'plus', cls: 'primary' }));
    h += '<div class="quick"><label class="sr" for="quick-task">Add a task for yourself</label><input id="quick-task" type="text" placeholder="Add a task for yourself and press Enter" data-enter="task-quick" autocomplete="off">' + R.btn('task-quick', 'Add', { icon: 'plus' }) + '</div>';
    h += R.tabs('task-tab', tab, [['mine', 'Mine', mine.length], ['delegated', 'Delegated', deleg.length], ['matrix', 'Priority matrix'], ['done', 'Done']]);
    if (tab === 'mine') {
      if (!mine.length) return h + R.empty('Nothing on your list', 'Add a task above, or start a project: each playbook adds its first tasks for you.');
      const wk = R.addDays(t0, 7);
      h += group('Overdue', mine.filter(t => t.due && t.due < t0)) + group('This week', mine.filter(t => t.due && t.due >= t0 && t.due <= wk)) + group('Later', mine.filter(t => t.due && t.due > wk)) + group('No date', mine.filter(t => !t.due), 'Give these a date or drop them.');
    } else if (tab === 'delegated') {
      if (!deleg.length) return h + R.empty('Nothing delegated', 'Hand a task to someone with a clear level of authority and a follow-up date. It will show here until it is done.', R.btn('task-new', 'Delegate a task', { cls: 'primary', icon: 'user', data: { delegate: '1' } }));
      const ids = Array.from(new Set(deleg.map(t => t.assigneeId)));
      ids.forEach(id => {
        const list = deleg.filter(t => t.assigneeId === id), late = list.filter(R.isOverdue).length;
        h += '<section class="sec"><div class="sec-h"><div class="row gap-s">' + R.avatar(R.staffName(id)) + '<div><h2>' + (R.get('staff', id) ? R.link('staff-open', id, R.staffName(id)) : 'Unassigned') + '<span class="count">' + list.length + '</span></h2>' + (late ? '<p class="sec-sub warn-text">' + late + ' overdue</p>' : '') + '</div></div>' + R.btn('task-new', 'Task', { icon: 'plus', cls: 'sm', data: { assignee: id } }) + '</div><div class="panel"><ul class="list">' + list.map(R.taskRow).join('') + '</ul></div></section>';
      });
    } else if (tab === 'matrix') {
      const q = (title, how, list, cls) => '<div class="q ' + cls + '"><div class="q-h"><h3>' + title + '<span class="count">' + list.length + '</span></h3><p>' + how + '</p></div>' + (list.length ? '<ul class="list">' + list.map(R.taskRow).join('') + '</ul>' : '<p class="muted pad">Empty</p>') + '</div>';
      h += '<p class="aside">Urgent means due within two days or marked urgent. Important is your call: does it move a growth outcome or a person?</p><div class="quad">' +
        q('Do first', 'Urgent and important. Do these yourself, today.', mine.filter(t => isUrgent(t) && t.important), 'q1') +
        q('Schedule', 'Important, not urgent. Growth work lives here: protect time for it.', mine.filter(t => !isUrgent(t) && t.important), 'q2') +
        q('Delegate', 'Urgent, not important for you. Open the task and hand it on.', mine.filter(t => isUrgent(t) && !t.important), 'q3') +
        q('Drop or limit', 'Neither. Delete it or decide a small time box.', mine.filter(t => !isUrgent(t) && !t.important), 'q4') + '</div>';
    } else {
      const done = all.filter(t => t.status === 'done').sort((a, b) => (a.doneAt || '') < (b.doneAt || '') ? 1 : -1).slice(0, 60);
      h += done.length ? '<div class="panel"><ul class="list">' + done.map(R.taskRow).join('') + '</ul></div>' : '<p class="muted pad">Finished tasks show here.</p>';
    }
    return h;
  }
};
A['task-tab'] = d => { R.ui.taskTab = d.v; R.render(); };
const taskFields = () => [
  { k: 'title', label: 'Task', req: true, ph: 'Brief branch teams on the welcome-back offer' },
  { k: 'assigneeId', label: 'Who does it', type: 'select', half: true, blank: R.me() ? 'Nobody yet (stays on my list)' : 'Me', opts: R.staffOpts() },
  { k: 'status', label: 'Status', type: 'select', half: true, opts: Object.keys(R.TASK_STATUS).map(k => [k, R.TASK_STATUS[k]]) },
  { k: 'due', label: 'Due', type: 'date', half: true },
  { k: 'followUp', label: 'Follow up on', type: 'date', half: true, help: 'For delegated work: when you will check in.' },
  { k: 'important', label: 'Important: moves a growth outcome or a person', type: 'bool', half: true },
  { k: 'urgent', label: 'Urgent, whatever the due date says', type: 'bool', half: true },
  { k: 'level', label: 'How much authority goes with it', type: 'select', half: true, blank: 'Not delegated', opts: R.DELEGATION, help: 'Say this out loud when you hand the task over.' },
  { k: 'projectId', label: 'Project', type: 'select', half: true, blank: 'None', opts: R.all('projects').map(p => [p.id, p.name]) },
  { k: 'stakeholderId', label: 'Stakeholder', type: 'select', half: true, blank: 'None', opts: R.all('stakeholders').map(s => [s.id, s.name]) },
  { k: 'notes', label: 'Notes', type: 'textarea', rows: 3, ph: 'What done looks like, and anything they need to know.' }
];
function taskForm(t) {
  const isNew = !t.id;
  R.form({
    title: isNew ? 'New task' : 'Edit task', wide: true, fields: taskFields(), values: t,
    onSubmit: v => {
      const doc = Object.assign(R.clone(t), v);
      if (doc.status === 'done') doc.doneAt = doc.doneAt || R.today(); else delete doc.doneAt;
      if (isNew) doc.createdAt = R.today();
      R.save('tasks', doc);
    },
    onDelete: isNew ? null : () => R.remove('tasks', t.id)
  });
}
A['task-new'] = d => {
  const me = R.me(), dr = R.directReports();
  if (d.delegate && !R.all('staff').some(s => !s.isMe)) { R.toast('Add the people you delegate to first, in People.', 'bad'); return; }
  const who = d.assignee || (d.delegate ? (dr[0] || R.all('staff').find(s => !s.isMe) || {}).id : (me ? me.id : ''));
  const deleg = !!(d.assignee || d.delegate);
  taskForm({ title: '', status: 'todo', assigneeId: who || '', projectId: d.project || '', due: d.date || '', important: !!d.project, level: deleg ? 3 : '', followUp: deleg ? R.addDays(R.today(), 7) : '' });
};
A['task-edit'] = d => { const t = R.get('tasks', d.id); if (t) { if (R.topModal()) R.closeModal(); taskForm(t); } };
A['task-toggle'] = d => R.edit('tasks', d.id, t => { if (t.status === 'done') { t.status = 'todo'; delete t.doneAt; } else { t.status = 'done'; t.doneAt = R.today(); } });
A['task-quick'] = () => {
  const el = document.getElementById('quick-task'), title = el ? el.value.trim() : '';
  if (!title) { if (el) el.focus(); return; }
  const me = R.me();
  R.save('tasks', { title, status: 'todo', assigneeId: me ? me.id : '', createdAt: R.today() });
  R.ui.taskTab = 'mine';
  el.value = ''; el.focus();
};

/* ================= Calendar ================= */
R.views.calendar = {
  title: 'Calendar',
  render() {
    const c = R.ui.cal = R.ui.cal || { mode: window.innerWidth < 640 ? 'agenda' : 'month', month: R.today().slice(0, 7) };
    let h = R.head('Calendar', 'Everything with a date: events, task deadlines, milestones, reviews, one-to-ones and stakeholder contact.', R.btn('event-new', 'New event', { icon: 'plus', cls: 'primary' }));
    h += R.tabs('cal-mode', c.mode, [['month', 'Month'], ['timeline', 'Project timeline'], ['agenda', 'Agenda']]);
    if (c.mode === 'month') h += month(c.month);
    else if (c.mode === 'timeline') h += gantt();
    else h += '<div class="panel">' + R.agendaHtml(R.calItems(R.today(), R.addDays(R.today(), 60), true), 'Nothing in the next 60 days. Add an event, or give your tasks and milestones dates.') + '</div>';
    return h;
  }
};
const nav = (label, prev, next, now) => '<div class="cal-nav"><h2>' + esc(label) + '</h2><div class="row gap-s">' + R.iconBtn(prev, 'left', 'Earlier') + R.btn(now, 'Today', { cls: 'sm' }) + R.iconBtn(next, 'right', 'Later') + '</div></div>';
function month(ym) {
  const first = R.parse(ym + '-01'), ws = Number(R.store.settings.weekStart) === 0 ? 0 : 1;
  const lead = (first.getDay() - ws + 7) % 7, start = R.addDays(ym + '-01', -lead);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(), rows = Math.ceil((lead + days) / 7), t0 = R.today();
  const by = {};
  R.calItems(start, R.addDays(start, rows * 7 - 1)).forEach(i => { (by[i.date] = by[i.date] || []).push(i); });
  let h = nav(R.MONTHS[first.getMonth()] + ' ' + first.getFullYear(), 'cal-prev', 'cal-next', 'cal-now') + '<div class="cal-grid">';
  for (let i = 0; i < 7; i++) h += '<div class="cal-dow">' + R.DOW[(i + ws) % 7].slice(0, 3) + '</div>';
  for (let i = 0; i < rows * 7; i++) {
    const date = R.addDays(start, i), items = by[date] || [], dn = R.parse(date).getDate();
    h += '<button type="button" class="cal-day' + (date.slice(0, 7) !== ym ? ' out' : '') + (date === t0 ? ' today' : '') + '" data-act="cal-day" data-date="' + date + '" aria-label="' + esc(R.fmtLong(date)) + ', ' + items.length + (items.length === 1 ? ' item' : ' items') + '"><span class="cal-num">' + dn + '</span>' +
      items.slice(0, 3).map(it => '<span class="cal-chip k-' + it.kind + (it.done ? ' done' : '') + '">' + icon(R.KINDS[it.kind][0]) + '<span class="lbl">' + esc(it.title) + '</span></span>').join('') +
      (items.length > 3 ? '<span class="cal-more">+' + (items.length - 3) + ' more</span>' : '') + '</button>';
  }
  return h + '</div><p class="aside">Select a day to see everything on it or to add an event or task.</p>';
}
function gantt() {
  const c = R.ui.cal, startM = c.gstart || R.addMonths(R.today().slice(0, 7), -1), start = startM + '-01';
  const endD = R.parse(R.addMonths(startM, 12) + '-01'); endD.setDate(0);
  const end = R.iso(endD), total = R.diffDays(end, start) + 1, t0 = R.today();
  const pc = d => Math.max(0, Math.min(100, R.diffDays(d, start) / total * 100));
  const ps = R.all('projects').filter(p => p.start && p.end && p.end >= start && p.start <= end && p.status !== 'Idea').sort((a, b) => a.start < b.start ? -1 : 1);
  let h = nav(R.fmtMonth(startM) + ' to ' + R.fmtMonth(R.addMonths(startM, 11)), 'gantt-prev', 'gantt-next', 'gantt-now');
  if (!ps.length) return h + R.empty('No projects in this window', 'Projects with a start and end date appear here as bars, with their milestones.', R.btn('project-new', 'Start a project', { icon: 'plus', cls: 'primary' }));
  let lines = '', months = '';
  for (let i = 0; i < 12; i++) {
    const m = R.addMonths(startM, i), left = pc(m + '-01');
    lines += '<i class="g-line" style="left:' + left.toFixed(2) + '%"></i>';
    months += '<span class="g-month" style="left:' + left.toFixed(2) + '%">' + R.MON[R.parse(m + '-01').getMonth()] + (m.slice(5) === '01' || i === 0 ? ' ' + m.slice(2, 4) : '') + '</span>';
  }
  const todayLine = t0 >= start && t0 <= end ? '<i class="g-today" style="left:' + pc(t0).toFixed(2) + '%"></i>' : '';
  h += '<div class="row wrap gap-s legend-row">' + Object.keys(R.PILLARS).map(R.pillarChip).join('') + '<span class="chip"><i class="g-key-ms"></i>Milestone</span><span class="chip"><i class="g-key-today"></i>Today</span></div>';
  h += '<div class="gantt-wrap panel"><div class="gantt"><div class="g-row g-head"><div class="g-label">Project</div><div class="g-track">' + months + '</div></div>' + ps.map(p => {
    const a = p.start < start ? start : p.start, b = p.end > end ? end : p.end, left = pc(a), w = Math.max(0.8, (R.diffDays(b, a) + 1) / total * 100);
    return '<div class="g-row"><div class="g-label">' + R.link('project-open', p.id, p.name) + '<span class="li-meta">' + esc(R.staffName(p.ownerId) || 'No owner') + '</span></div><div class="g-track">' + lines + todayLine +
      '<button type="button" class="g-bar' + (p.status === 'Complete' ? ' done' : '') + '" data-act="project-open" data-id="' + p.id + '" style="left:' + left.toFixed(2) + '%;width:' + w.toFixed(2) + '%;background:' + (R.PILLARS[p.pillar] || R.PILLARS.members).color + '" title="' + esc(p.name + ': ' + R.fmtDate(p.start, true) + ' to ' + R.fmtDate(p.end, true)) + '" aria-label="' + esc(p.name + ', ' + R.fmtDate(p.start, true) + ' to ' + R.fmtDate(p.end, true)) + '"></button>' +
      (p.milestones || []).filter(m => m.date && m.date >= start && m.date <= end).map(m => '<i class="g-ms' + (m.done ? ' done' : '') + '" style="left:' + pc(m.date).toFixed(2) + '%" title="' + esc(m.title + ', ' + R.fmtDate(m.date, true) + (m.done ? ' (done)' : '')) + '"></i>').join('') + '</div></div>';
  }).join('') + '</div></div>';
  return h;
}
A['cal-mode'] = d => { R.ui.cal.mode = d.v; R.render(); };
A['cal-prev'] = () => { R.ui.cal.month = R.addMonths(R.ui.cal.month, -1); R.render(); };
A['cal-next'] = () => { R.ui.cal.month = R.addMonths(R.ui.cal.month, 1); R.render(); };
A['cal-now'] = () => { R.ui.cal.month = R.today().slice(0, 7); R.render(); };
const g0 = () => R.ui.cal.gstart || R.addMonths(R.today().slice(0, 7), -1);
A['gantt-prev'] = () => { R.ui.cal.gstart = R.addMonths(g0(), -3); R.render(); };
A['gantt-next'] = () => { R.ui.cal.gstart = R.addMonths(g0(), 3); R.render(); };
A['gantt-now'] = () => { R.ui.cal.gstart = null; R.render(); };
A['cal-day'] = d => {
  const items = R.calItems(d.date, d.date);
  R.modal({ title: R.fmtLong(d.date), noFocus: true,
    body: items.length ? '<ul class="ag-list solo">' + items.map(it => '<li><span class="ag-ic" title="' + esc(R.KINDS[it.kind][1]) + '">' + icon(R.KINDS[it.kind][0]) + '</span><div class="li-main">' + R.link(it.act, it.id, it.title, it.done ? 'done' : '') + '<span class="li-meta">' + esc(R.KINDS[it.kind][1]) + (it.sub ? ' · ' + esc(it.sub) : '') + '</span></div></li>').join('') + '</ul>' : '<p class="muted">Nothing on this day yet.</p>',
    foot: R.btn('task-new', 'Add a task', { icon: 'plus', data: { date: d.date } }) + '<span class="spacer"></span>' + R.btn('event-new', 'Add an event', { icon: 'plus', cls: 'primary', data: { date: d.date } }) });
};
const eventFields = () => [
  { k: 'title', label: 'Event', req: true, ph: 'Branch managers meeting' },
  { k: 'type', label: 'Kind', type: 'select', half: true, opts: R.EVENT_TYPES },
  { k: 'time', label: 'Time', half: true, ph: '10:00 to 11:30' },
  { k: 'date', label: 'Date', type: 'date', half: true, req: true },
  { k: 'endDate', label: 'Last day, if more than one', type: 'date', half: true },
  { k: 'projectId', label: 'Project', type: 'select', half: true, blank: 'None', opts: R.all('projects').map(p => [p.id, p.name]) },
  { k: 'staffId', label: 'With', type: 'select', half: true, blank: 'Nobody in particular', opts: R.staffOpts() },
  { k: 'notes', label: 'Notes', type: 'textarea', rows: 2 }
];
function eventForm(e) {
  const isNew = !e.id;
  if (R.topModal()) R.closeModal();
  R.form({ title: isNew ? 'New event' : 'Edit event', wide: true, fields: eventFields(), values: e, onSubmit: v => R.save('events', Object.assign(R.clone(e), v)), onDelete: isNew ? null : () => R.remove('events', e.id) });
}
A['event-new'] = d => eventForm({ title: '', type: 'Meeting', date: d.date || R.today() });
A['event-edit'] = d => { const e = R.get('events', d.id); if (e) eventForm(e); };

/* ================= People ================= */
const loadMeter = id => { const l = R.staffLoad(id); return l.cap || l.hrs ? R.meter(l.frac, l.over ? 'crit' : l.frac > 0.85 ? 'warn' : '', 'Project hours used') + ' <span class="mono">' + l.hrs + (l.cap ? ' of ' + l.cap : '') + ' h/wk</span>' : '<span class="muted">Not set</span>'; };
const openFor = id => R.all('tasks').filter(t => t.assigneeId === id && t.status !== 'done');
function personCard(s) {
  const tasks = openFor(s.id), late = tasks.filter(R.isOverdue).length, next = R.next1on1(s), last = R.last1on1(s), lv = R.LEVELS[s.level];
  return '<article class="panel pad card"><div class="card-top">' + R.avatar(s.name, s.isMe) + '<div class="li-main">' + R.link('staff-open', s.id, s.name, 'card-title') + '<span class="li-meta"><span>' + esc([s.title, s.branch].filter(Boolean).join(' · ')) + '</span>' + R.exTag(s) + '</span></div>' + (lv ? '<span class="tag" title="' + esc(lv.who) + '">' + esc(lv.style) + '</span>' : '') + '</div>' +
    '<dl class="kv"><div><dt>Project load</dt><dd>' + loadMeter(s.id) + '</dd></div><div><dt>Open tasks</dt><dd>' + tasks.length + (late ? ' <span class="warn-text">(' + late + ' overdue)</span>' : '') + '</dd></div>' +
    '<div><dt>Last one-to-one</dt><dd>' + (last ? esc(R.fmtDate(last, true)) : '<span class="muted">None logged</span>') + '</dd></div><div><dt>Next one-to-one</dt><dd>' + (next ? R.due(next) : '<span class="muted">No rhythm set</span>') + '</dd></div></dl></article>';
}
R.views.people = {
  title: 'People',
  render() {
    if (R.ui.staffId) { const s = R.get('staff', R.ui.staffId); if (s) return staffDetail(s); R.ui.staffId = null; }
    const all = R.all('staff'), me = R.me(), tab = R.ui.peopleTab || 'team';
    let h = R.head('People', 'Profiles, workloads and one-to-ones for your team, and the shape of the organization.', R.btn('staff-new', 'Add a person', { icon: 'plus', cls: 'primary' }));
    if (!all.length) return h + R.empty('No one here yet', 'Start with yourself, then add your four direct reports. Add their teams when you want the full org chart.', R.btn('staff-new', 'Add yourself', { cls: 'primary', icon: 'plus', data: { me: '1' } }));
    h += R.tabs('people-tab', tab, [['team', 'Team', all.length], ['org', 'Org chart']]);
    if (tab === 'org') return h + orgChart();
    const dr = R.directReports(), rest = all.filter(s => !s.isMe && !dr.includes(s)).sort((a, b) => a.name.localeCompare(b.name));
    if (!me) h += '<p class="banner b-info">' + icon('user') + '<span>Mark one profile as you, so the desk knows whose tasks are yours and who reports to you.</span></p>';
    if (me) h += '<section class="sec"><div class="panel"><ul class="list"><li class="li">' + R.avatar(me.name, true) + '<div class="li-main">' + R.link('staff-open', me.id, me.name, 'li-title') + R.exTag(me) + '<span class="li-meta"><span>' + esc([me.title, me.branch].filter(Boolean).join(' · ') || 'You') + '</span></span></div><div class="li-end">' + loadMeter(me.id) + '</div></li></ul></div></section>';
    h += '<section class="sec">' + R.sec('Your direct reports', '', dr.length ? dr.length + (dr.length === 1 ? ' person' : ' people') : '') + (dr.length ? '<div class="cols-2">' + dr.map(personCard).join('') + '</div>' : '<p class="muted">Nobody reports to you yet. Edit a profile and set who they report to.</p>') + '</section>';
    if (rest.length) h += '<section class="sec">' + R.sec('Wider team') + '<div class="panel"><ul class="list">' + rest.map(s => '<li class="li">' + R.avatar(s.name) + '<div class="li-main">' + R.link('staff-open', s.id, s.name, 'li-title') + R.exTag(s) + '<span class="li-meta"><span>' + esc([s.title, s.branch].filter(Boolean).join(' · ')) + '</span>' + (s.reportsTo && R.get('staff', s.reportsTo) ? '<span>Reports to ' + esc(R.staffName(s.reportsTo)) + '</span>' : '') + '</span></div><div class="li-end">' + loadMeter(s.id) + '</div></li>').join('') + '</ul></div></section>';
    return h;
  }
};
function orgChart() {
  const all = R.all('staff'), seen = new Set();
  const node = s => {
    if (seen.has(s.id)) return ''; seen.add(s.id);
    const kids = all.filter(k => k.reportsTo === s.id).sort((a, b) => a.name.localeCompare(b.name));
    return '<li><button type="button" class="org-node' + (s.isMe ? ' me' : '') + '" data-act="staff-open" data-id="' + s.id + '">' + R.avatar(s.name, s.isMe) + '<b>' + esc(s.name) + '</b><span>' + esc(s.title || '') + '</span>' + (s.branch ? '<span class="muted">' + esc(s.branch) + '</span>' : '') + '</button>' + (kids.length ? '<ul>' + kids.map(node).join('') + '</ul>' : '') + '</li>';
  };
  const roots = all.filter(s => !s.reportsTo || !R.get('staff', s.reportsTo));
  let h = '<div class="org panel"><ul>' + roots.map(node).join('') + '</ul></div>';
  const lost = all.filter(s => !seen.has(s.id));
  if (lost.length) h += '<p class="aside">Not shown because their reporting lines loop: ' + esc(lost.map(s => s.name).join(', ')) + '.</p>';
  return h + '<p class="aside">The chart is drawn from each profile\'s "reports to". Select anyone to open their profile.</p>';
}
function staffDetail(s) {
  const l = R.staffLoad(s.id), lv = R.LEVELS[s.level], tasks = openFor(s.id).sort(byDue), boss = R.get('staff', s.reportsTo), kids = R.all('staff').filter(k => k.reportsTo === s.id), next = R.next1on1(s);
  let h = '<p class="crumb">' + R.btn('people-back', 'All people', { icon: 'left', cls: 'sm ghost' }) + '</p><header class="vh"><div class="vh-text"><div class="row gap-s">' + R.avatar(s.name, s.isMe) + '<h1>' + esc(s.name) + '</h1></div><div class="row wrap gap-s meta-row"><span>' + esc([s.title, s.branch].filter(Boolean).join(' · ')) + '</span>' + (s.isMe ? '<span class="tag">You</span>' : '') + R.exTag(s) + '</div></div>' +
    '<div class="vh-actions">' + (s.isMe ? '' : R.btn('staff-brief', 'One-to-one brief', { icon: 'reports', data: { id: s.id } }) + R.btn('oo-add', 'Log a one-to-one', { icon: 'chat', data: { id: s.id } })) + R.btn('staff-edit', 'Edit', { icon: 'edit', cls: 'primary', data: { id: s.id } }) + '</div></header>';
  let L = '<section class="sec"><div class="panel pad stack"><dl class="kv">' +
    '<div><dt>Reports to</dt><dd>' + (boss ? R.link('staff-open', boss.id, boss.name) : '<span class="muted">Top of the chart</span>') + '</dd></div>' +
    (s.email ? '<div><dt>Email</dt><dd class="sel">' + esc(s.email) + '</dd></div>' : '') + (s.phone ? '<div><dt>Phone</dt><dd class="sel">' + esc(s.phone) + '</dd></div>' : '') +
    (s.startDate ? '<div><dt>Started</dt><dd>' + esc(R.fmtDate(s.startDate, true)) + '</dd></div>' : '') + (s.fte ? '<div><dt>Hours</dt><dd>' + esc(s.fte) + ' FTE</dd></div>' : '') +
    (s.oneOnOneEvery ? '<div><dt>Next one-to-one</dt><dd>' + R.due(next) + '</dd></div>' : '') + '</dl>' +
    (s.strengths ? '<div><h3 class="label">Strengths</h3><p>' + esc(s.strengths) + '</p></div>' : '') + (s.development ? '<div><h3 class="label">Development goals</h3><p>' + esc(s.development) + '</p></div>' : '') + (s.notes ? '<div><h3 class="label">Notes</h3><p>' + esc(s.notes) + '</p></div>' : '') +
    (!s.strengths && !s.development && !s.notes ? '<p class="muted">Add strengths and development goals so one-to-ones and delegation build on them.</p>' : '') + '</div></section>';
  if (lv && !s.isMe) L += '<section class="sec">' + R.sec('How to lead ' + esc(s.name.split(' ')[0])) + '<div class="panel pad stack-s"><p><b>' + esc(lv.style) + '.</b> ' + esc(lv.how) + '</p><p class="muted">Where they are now: ' + esc(lv.who.toLowerCase()) + '. This is about the work in front of them, and it changes task by task.</p></div></section>';
  if (!s.isMe) L += '<section class="sec">' + R.sec('One-to-one notes', R.btn('oo-add', 'Log a one-to-one', { icon: 'plus', cls: 'sm', data: { id: s.id } })) + '<div class="panel">' + ((s.log || []).length ? '<ul class="list">' + s.log.slice().sort((a, b) => a.date < b.date ? 1 : -1).map(e =>
    '<li class="li top"><span class="due">' + esc(R.fmtDate(e.date, true)) + '</span><div class="li-main stack-s">' + (e.notes ? '<p>' + esc(e.notes) + '</p>' : '') + (e.actions ? '<p><b>Agreed:</b> ' + esc(e.actions) + '</p>' : '') + '</div><div class="li-end">' + R.iconBtn('oo-edit', 'edit', 'Edit this note', { id: s.id, eid: e.id }) + '</div></li>').join('') + '</ul>' : '<p class="muted pad">No notes yet. Log each one-to-one so the next starts where the last ended.</p>') + '</div></section>';
  let S = '<section class="sec">' + R.sec('Project load') + '<div class="panel pad stack-s"><div>' + loadMeter(s.id) + '</div>' + (l.over ? '<p class="warn-text">Over-committed. Move hours or reschedule a project.</p>' : '') + (l.list.length ? '<ul class="mini">' + l.list.map(x => '<li>' + R.link('project-open', x.p.id, x.p.name) + ' <span class="mono">' + x.hours + ' h</span></li>').join('') + '</ul>' : '<p class="muted">Not allocated to a project.</p>') + '</div></section>';
  S += '<section class="sec">' + R.sec(s.isMe ? 'Your open tasks' : 'Open tasks', s.isMe ? '' : R.btn('task-new', 'Delegate', { icon: 'plus', cls: 'sm', data: { assignee: s.id } })) + '<div class="panel">' + (tasks.length ? '<ul class="list">' + tasks.map(R.taskRow).join('') + '</ul>' : '<p class="muted pad">No open tasks.</p>') + '</div></section>';
  if (kids.length) S += '<section class="sec">' + R.sec('Their team') + '<div class="panel"><ul class="list">' + kids.map(k => '<li class="li">' + R.avatar(k.name) + '<div class="li-main">' + R.link('staff-open', k.id, k.name, 'li-title') + '<span class="li-meta">' + esc(k.title || '') + '</span></div></li>').join('') + '</ul></div></section>';
  return h + '<div class="split wide-left"><div>' + L + '</div><div>' + S + '</div></div>';
}
A['people-tab'] = d => { R.ui.peopleTab = d.v; R.render(); };
A['people-back'] = () => R.go('people');
A['staff-open'] = d => { if (R.topModal()) R.closeModal(); R.go('people', { staffId: d.id }); };
A['staff-brief'] = d => { R.ui.report = { type: 'person', staffId: d.id }; R.go('reports'); };
const staffFields = cur => {
  const br = R.store.settings.branches || [];
  return [
    { k: 'name', label: 'Name', req: true, half: true },
    { k: 'title', label: 'Job title', half: true, ph: 'Branch Manager' },
    br.length ? { k: 'branch', label: 'Branch or team', type: 'select', half: true, blank: 'Region-wide', opts: br } : { k: 'branch', label: 'Branch or team', half: true, help: 'Add your branch list in Settings to choose from a list.' },
    { k: 'reportsTo', label: 'Reports to', type: 'select', half: true, blank: 'Nobody here (top of the chart)', opts: R.staffOpts().filter(o => !cur || o[0] !== cur.id) },
    { k: 'isMe', label: 'This is me', type: 'bool' },
    { k: 'email', label: 'Email', type: 'email', half: true }, { k: 'phone', label: 'Phone', type: 'tel', half: true },
    { k: 'startDate', label: 'Start date', type: 'date', third: true }, { k: 'fte', label: 'FTE', type: 'number', third: true, min: 0, max: 1, step: 0.1, ph: '1.0' },
    { k: 'projectHours', label: 'Project hours a week', type: 'number', third: true, min: 0, help: 'Time free for project work after rostered duties.' },
    { type: 'h', label: 'Leading and developing them' },
    { k: 'oneOnOneEvery', label: 'One-to-one rhythm', type: 'select', half: true, blank: 'None', opts: [[7, 'Weekly'], [14, 'Every two weeks'], [30, 'Monthly']] },
    { k: 'level', label: 'Where they are with their current work', type: 'select', half: true, blank: 'Not set', opts: Object.keys(R.LEVELS).map(k => [k, R.LEVELS[k].who]) },
    { k: 'strengths', label: 'Strengths', type: 'textarea', rows: 2, half: true }, { k: 'development', label: 'Development goals', type: 'textarea', rows: 2, half: true },
    { k: 'notes', label: 'Notes', type: 'textarea', rows: 2 }
  ];
};
function staffForm(s) {
  const isNew = !s.id;
  R.form({
    title: isNew ? 'Add a person' : 'Edit profile', wide: true, fields: staffFields(s), values: s,
    onSubmit: v => {
      const doc = Object.assign(R.clone(s), v);
      if (doc.isMe) R.all('staff').filter(x => x.isMe && x.id !== doc.id).forEach(x => R.edit('staff', x.id, y => { y.isMe = false; }));
      R.save('staff', doc);
    },
    onDelete: isNew ? null : () => { R.remove('staff', s.id); R.go('people'); },
    deleteLabel: 'This removes the profile and its one-to-one notes. Tasks and projects keep their history.'
  });
}
A['staff-new'] = d => { const me = R.me(); staffForm(!me && d.me ? { name: '', title: 'Regional Manager', isMe: true } : { name: '', reportsTo: me ? me.id : '', oneOnOneEvery: me ? 14 : '' }); };
A['staff-edit'] = d => { const s = R.get('staff', d.id); if (s) staffForm(s); };
const ooFields = [{ k: 'date', label: 'Date', type: 'date', half: true, req: true }, { k: 'notes', label: 'What you talked about', type: 'textarea', rows: 4, ph: 'Wins, worries, progress on development goals.' }, { k: 'actions', label: 'Agreed actions', type: 'textarea', rows: 2 }];
A['oo-add'] = d => { const s = R.get('staff', d.id); if (s) R.form({ title: 'One-to-one with ' + s.name, fields: ooFields, values: { date: R.today() }, onSubmit: v => R.edit('staff', s.id, x => { x.log = (x.log || []).concat([Object.assign({ id: R.uid('o') }, v)]); }) }); };
A['oo-edit'] = d => {
  const s = R.get('staff', d.id), e = s && (s.log || []).find(x => x.id === d.eid); if (!e) return;
  R.form({ title: 'One-to-one with ' + s.name, fields: ooFields, values: e, onSubmit: v => R.edit('staff', s.id, x => { Object.assign(x.log.find(y => y.id === e.id), v); }), onDelete: () => R.edit('staff', s.id, x => { x.log = x.log.filter(y => y.id !== e.id); }) });
};

/* ================= Stakeholders ================= */
const stancePill = h => h.stance ? R.pill({ Champion: 'good', Supportive: 'good', Neutral: 'mute', Skeptical: 'warn', Opposed: 'crit' }[h.stance] || 'mute', h.stance, h.stance === 'Skeptical' || h.stance === 'Opposed' ? 'alert' : null) : '';
const shProjects = id => R.all('projects').filter(p => (p.stakeholderIds || []).includes(id));
R.views.stakeholders = {
  title: 'Stakeholders',
  render() {
    if (R.ui.stakeholderId) { const s = R.get('stakeholders', R.ui.stakeholderId); if (s) return shDetail(s); R.ui.stakeholderId = null; }
    const all = R.all('stakeholders').slice().sort((a, b) => (Number(b.influence) || 0) - (Number(a.influence) || 0) || a.name.localeCompare(b.name)), tab = R.ui.shTab || 'list';
    let h = R.head('Stakeholders', 'The people outside your team who can help or block growth, and how often you are in touch.', R.btn('sh-new', 'Add a stakeholder', { icon: 'plus', cls: 'primary' }));
    if (!all.length) return h + R.empty('No stakeholders yet', 'Add your director, council contacts, school principals, community partners, funders and suppliers. Rate their influence and interest to see where to spend your time.', R.btn('sh-new', 'Add a stakeholder', { cls: 'primary', icon: 'plus' }));
    h += R.tabs('sh-tab', tab, [['list', 'List', all.length], ['map', 'Influence map']]);
    if (tab === 'map') {
      const cell = k => { const list = all.filter(s => R.quadOf(s) === k); return '<div class="q"><div class="q-h"><h3>' + esc(R.QUADS[k].name) + '<span class="count">' + list.length + '</span></h3><p>' + esc(R.QUADS[k].how) + '</p></div><div class="row wrap gap-s pad">' + (list.map(s => '<button type="button" class="chip btnchip" data-act="sh-open" data-id="' + s.id + '">' + esc(s.name) + '</button>').join('') || '<span class="muted">Nobody</span>') + '</div></div>'; };
      return h + '<div class="map"><span class="axis-y">Influence</span><div class="quad">' + cell('satisfied') + cell('close') + cell('monitor') + cell('informed') + '</div><span class="axis-x">Interest in your work</span></div><p class="aside">High means 4 or 5 out of 5. Edit a stakeholder to change their ratings.</p>';
    }
    h += '<div class="tbl-wrap panel"><table class="tbl"><thead><tr><th>Name</th><th>Group</th><th>Approach</th><th>Stance</th><th>Last contact</th><th>Next contact</th><th class="num">Projects</th></tr></thead><tbody>' + all.map(s => {
      const last = R.lastContact(s), next = R.nextContact(s);
      return '<tr><td>' + R.link('sh-open', s.id, s.name, 'li-title') + R.exTag(s) + '<span class="li-meta">' + esc([s.role, s.org].filter(Boolean).join(', ')) + '</span></td><td>' + esc(s.category || '') + '</td><td><span class="tag">' + esc(R.QUADS[R.quadOf(s)].name) + '</span></td><td>' + stancePill(s) + '</td><td>' + (last ? esc(R.fmtDate(last, true)) : '<span class="muted">Never</span>') + '</td><td>' + (next ? R.due(next) : '<span class="muted">No rhythm</span>') + '</td><td class="num">' + shProjects(s.id).length + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    return h;
  }
};
function shDetail(s) {
  const q = R.QUADS[R.quadOf(s)], next = R.nextContact(s), ps = shProjects(s.id), tasks = R.all('tasks').filter(t => t.stakeholderId === s.id && t.status !== 'done');
  let h = '<p class="crumb">' + R.btn('sh-back', 'All stakeholders', { icon: 'left', cls: 'sm ghost' }) + '</p><header class="vh"><div class="vh-text"><h1>' + esc(s.name) + '</h1><div class="row wrap gap-s meta-row"><span>' + esc([s.role, s.org].filter(Boolean).join(', ')) + '</span>' + (s.category ? '<span class="tag">' + esc(s.category) + '</span>' : '') + stancePill(s) + R.exTag(s) + '</div></div>' +
    '<div class="vh-actions">' + R.btn('sh-brief', 'Briefing', { icon: 'reports', data: { id: s.id } }) + R.btn('sh-log', 'Log contact', { icon: 'chat', data: { id: s.id } }) + R.btn('sh-edit', 'Edit', { icon: 'edit', cls: 'primary', data: { id: s.id } }) + '</div></header>';
  let L = '<section class="sec"><div class="panel pad stack"><div class="cols-2 tight"><div><h3 class="label">What they care about</h3><p>' + (esc(s.wants) || '<span class="muted">Not recorded.</span>') + '</p></div><div><h3 class="label">What you need from them</h3><p>' + (esc(s.asks) || '<span class="muted">Not recorded.</span>') + '</p></div></div>' + (s.notes ? '<div><h3 class="label">Notes</h3><p>' + esc(s.notes) + '</p></div>' : '') + '</div></section>';
  L += '<section class="sec">' + R.sec('Contact log', R.btn('sh-log', 'Log contact', { icon: 'plus', cls: 'sm', data: { id: s.id } })) + '<div class="panel">' + ((s.log || []).length ? '<ul class="list">' + s.log.slice().sort((a, b) => a.date < b.date ? 1 : -1).map(e =>
    '<li class="li top"><span class="due">' + esc(R.fmtDate(e.date, true)) + '</span><div class="li-main stack-s"><p>' + (e.type ? '<span class="tag">' + esc(e.type) + '</span> ' : '') + esc(e.summary || '') + '</p>' + (e.next ? '<p><b>Next step:</b> ' + esc(e.next) + '</p>' : '') + '</div><div class="li-end">' + R.iconBtn('sh-log-edit', 'edit', 'Edit this entry', { id: s.id, eid: e.id }) + '</div></li>').join('') + '</ul>' : '<p class="muted pad">No contact logged yet.</p>') + '</div></section>';
  let S = '<section class="sec">' + R.sec('Approach') + '<div class="panel pad stack-s"><p><b>' + esc(q.name) + '.</b> ' + esc(q.how) + '</p><dl class="kv"><div><dt>Influence</dt><dd>' + (s.influence || '?') + ' of 5</dd></div><div><dt>Interest</dt><dd>' + (s.interest || '?') + ' of 5</dd></div><div><dt>Next contact</dt><dd>' + (next ? R.due(next) : '<span class="muted">No rhythm set</span>') + '</dd></div></dl></div></section>';
  if (s.email || s.phone) S += '<section class="sec">' + R.sec('Contact') + '<div class="panel pad"><dl class="kv">' + (s.email ? '<div><dt>Email</dt><dd class="sel">' + esc(s.email) + '</dd></div>' : '') + (s.phone ? '<div><dt>Phone</dt><dd class="sel">' + esc(s.phone) + '</dd></div>' : '') + '</dl></div></section>';
  S += '<section class="sec">' + R.sec('Projects') + '<div class="panel">' + (ps.length ? '<ul class="list">' + ps.map(p => '<li class="li">' + R.spine(p.code) + '<div class="li-main">' + R.link('project-open', p.id, p.name, 'li-title') + '</div><div class="li-end">' + R.healthPill(p) + '</div></li>').join('') + '</ul>' : '<p class="muted pad">Not linked to a project. Link them from a project\'s edit form.</p>') + '</div></section>';
  if (tasks.length) S += '<section class="sec">' + R.sec('Open tasks') + '<div class="panel"><ul class="list">' + tasks.map(R.taskRow).join('') + '</ul></div></section>';
  return h + '<div class="split wide-left"><div>' + L + '</div><div>' + S + '</div></div>';
}
A['sh-tab'] = d => { R.ui.shTab = d.v; R.render(); };
A['sh-back'] = () => R.go('stakeholders');
A['sh-open'] = d => { if (R.topModal()) R.closeModal(); R.go('stakeholders', { stakeholderId: d.id }); };
A['sh-brief'] = d => { R.ui.report = { type: 'stakeholder', stakeholderId: d.id }; R.go('reports'); };
const shFields = [
  { k: 'name', label: 'Name', req: true, half: true }, { k: 'role', label: 'Role', half: true, ph: 'Principal' },
  { k: 'org', label: 'Organization', half: true }, { k: 'category', label: 'Group', type: 'select', half: true, opts: R.SH_CATS },
  { k: 'influence', label: 'Influence over your work', type: 'scale', half: true }, { k: 'interest', label: 'Interest in your work', type: 'scale', half: true },
  { k: 'stance', label: 'Stance', type: 'select', half: true, opts: R.STANCE }, { k: 'cadence', label: 'Stay in touch', type: 'select', half: true, blank: 'No set rhythm', opts: [[14, 'Every two weeks'], [30, 'Monthly'], [60, 'Every two months'], [90, 'Quarterly'], [180, 'Twice a year']] },
  { k: 'email', label: 'Email', type: 'email', half: true }, { k: 'phone', label: 'Phone', type: 'tel', half: true },
  { k: 'wants', label: 'What they care about', type: 'textarea', rows: 2, half: true }, { k: 'asks', label: 'What you need from them', type: 'textarea', rows: 2, half: true },
  { k: 'notes', label: 'Notes', type: 'textarea', rows: 2 }
];
function shForm(s) {
  const isNew = !s.id;
  R.form({ title: isNew ? 'Add a stakeholder' : 'Edit stakeholder', wide: true, fields: shFields, values: s, onSubmit: v => R.save('stakeholders', Object.assign(R.clone(s), v)), onDelete: isNew ? null : () => { R.remove('stakeholders', s.id); R.go('stakeholders'); }, deleteLabel: 'This removes the stakeholder and their contact log.' });
}
A['sh-new'] = () => shForm({ name: '', category: R.SH_CATS[0], stance: 'Neutral', influence: 3, interest: 3, cadence: 60 });
A['sh-edit'] = d => { const s = R.get('stakeholders', d.id); if (s) shForm(s); };
const logFields = [{ k: 'date', label: 'Date', type: 'date', half: true, req: true }, { k: 'type', label: 'How', type: 'select', half: true, opts: ['Meeting', 'Call', 'Email', 'Event', 'Other'] }, { k: 'summary', label: 'What was said', type: 'textarea', rows: 3, req: true }, { k: 'next', label: 'Next step', ph: 'Send the membership figures by Friday' }];
A['sh-log'] = d => { const s = R.get('stakeholders', d.id); if (s) R.form({ title: 'Contact with ' + s.name, fields: logFields, values: { date: R.today(), type: 'Meeting' }, onSubmit: v => R.edit('stakeholders', s.id, x => { x.log = (x.log || []).concat([Object.assign({ id: R.uid('c') }, v)]); }) }); };
A['sh-log-edit'] = d => {
  const s = R.get('stakeholders', d.id), e = s && (s.log || []).find(x => x.id === d.eid); if (!e) return;
  R.form({ title: 'Contact with ' + s.name, fields: logFields, values: e, onSubmit: v => R.edit('stakeholders', s.id, x => { Object.assign(x.log.find(y => y.id === e.id), v); }), onDelete: () => R.edit('stakeholders', s.id, x => { x.log = x.log.filter(y => y.id !== e.id); }) });
};
})();
