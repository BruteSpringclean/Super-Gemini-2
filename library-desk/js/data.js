/* Regional Library Desk — domain: pillars, playbooks, management checks, measures, calendar feed, shared UI parts. */
(function () {
'use strict';
const R = window.RLD, esc = R.esc, icon = R.icon;

/* ---------- vocabulary ---------- */
R.PILLARS = {
  members: { name: 'Membership', code: 'MEM', color: 'var(--p-members)', outcome: 'More of the community holds a library card and uses it in the first month.' },
  borrowers: { name: 'Borrowing habit', code: 'BOR', color: 'var(--p-borrowers)', outcome: 'Lapsed and casual members become people who borrow in most months.' },
  programs: { name: 'Programs and community', code: 'PRG', color: 'var(--p-programs)', outcome: 'Programs start from a community need and are judged by what changes for the people who take part.' },
  collections: { name: 'Collections', code: 'COL', color: 'var(--p-collections)', outcome: 'What is on the shelf matches what the community wants, and stock decisions show up in loans.' }
};
R.OUTCOMES = {
  engagement: { name: 'Engagement', q: 'More people use the library, more often.' },
  relevancy: { name: 'Relevancy', q: 'The community sees its interests and languages in what we offer.' },
  literacy: { name: 'Literacy', q: 'People read, learn and find information with more skill and confidence.' }
};
R.TYPES = ['Growth project', 'Community program', 'Collection initiative', 'Operational improvement'];
R.STATUSES = ['Idea', 'Planning', 'Active', 'On hold', 'Complete'];
R.HEALTH = { on: 'On track', risk: 'At risk', off: 'Off track' };
R.LITERACY = ['Early literacy (0 to 5)', 'School-age reading', 'Teen reading', 'Adult literacy', 'Digital literacy', 'Information and media literacy', 'English language learning', 'Health and financial literacy'];
R.STAGES = { members: 'Total members', 'new': 'New members', active: 'Active borrowers', regular: 'Multi-monthly borrowers', casual: 'Casual borrowers', lapsed: 'Lapsed members', reactivated: 'Lapsed members reactivated', attendance: 'Program attendance', outcome: 'Participant outcome', turnover: 'Collection turnover', loans: 'Loans' };
R.UNITS = [['', 'Count'], ['%', 'Percent'], ['x', 'Ratio (for example loans per item)'], ['$', 'Money']];
R.DELEGATION = [[1, 'Follow the brief'], [2, 'Look into it and report back'], [3, 'Recommend, I decide'], [4, 'Decide, then tell me'], [5, 'Own it completely']];
R.TASK_STATUS = { todo: 'To do', doing: 'In progress', waiting: 'Waiting on someone', done: 'Done' };
R.EVENT_TYPES = ['Meeting', 'One-to-one', 'Program session', 'Deadline', 'Council or board', 'Site visit', 'Leave', 'Other'];
R.SH_CATS = ['Executive and council', 'Schools and education', 'Community organization', 'Funder or grants body', 'Friends and volunteers', 'Supplier', 'Government agency', 'Media', 'Internal team'];
R.STANCE = ['Champion', 'Supportive', 'Neutral', 'Skeptical', 'Opposed'];
R.LEVELS = {
  D1: { who: 'New to this work: keen, still learning', style: 'Direct', how: 'Give clear steps and short deadlines. Check in often and show what good looks like.' },
  D2: { who: 'Some skill, confidence dipping', style: 'Coach', how: 'Explain the why, ask for their ideas, and keep making the decisions together.' },
  D3: { who: 'Capable, sometimes unsure', style: 'Support', how: 'Let them lead. Listen, ask questions and remove obstacles rather than giving answers.' },
  D4: { who: 'Skilled and self-reliant', style: 'Delegate', how: 'Hand over the outcome and the decisions. Agree how results are reviewed, then step back.' }
};
R.QUADS = {
  close: { name: 'Manage closely', how: 'High influence, high interest. Involve them in decisions and meet often.' },
  satisfied: { name: 'Keep satisfied', how: 'High influence, lower interest. Brief them early, briefly, and never surprise them.' },
  informed: { name: 'Keep informed', how: 'High interest, lower influence. Share progress and use them as advocates.' },
  monitor: { name: 'Monitor', how: 'Lower influence and interest. A light touch; watch for change.' }
};
R.quadOf = h => { const inf = Number(h.influence) >= 4, int = Number(h.interest) >= 4; return inf && int ? 'close' : inf ? 'satisfied' : int ? 'informed' : 'monitor'; };

/* ---------- project playbooks (templates, filled in when a project is created) ---------- */
R.PLAYBOOKS = [
  {
    id: 'winback', name: 'Lapsed member win-back', pillar: 'borrowers', type: 'Growth project', outcomes: ['engagement', 'relevancy'], stages: ['reactivated', 'lapsed', 'regular'],
    blurb: 'Contact members who have not borrowed for a year, bring them back with a personal offer, and learn why they left.',
    objective: 'Reactivate 12% of members who have not borrowed in 12 months within 90 days of first contact, with half of them borrowing again in the following 8 weeks.',
    need: 'Lapsed members chose the library once already. Winning them back costs less than recruiting new members, and their reasons for leaving tell us what to fix.',
    audience: 'Members with no loan, renewal, e-loan or program booking in the past 12 months, grouped by last-used branch and what they used to borrow.',
    logic: {
      inputs: 'Lapsed-member export from the library management system; staff time for messages and calls; a welcome-back offer (replacement card, fines amnesty, free hold); refreshed displays.',
      activities: 'Group the list by past borrowing. Send a personal "we have missed you" message with picks matched to past loans. Phone the largest groups. Run a welcome-back table in branch. Ask one question: why did you stop?',
      outputs: 'Messages sent, replies, cards renewed, reasons-for-lapsing tally.',
      short: 'Lapsed members borrow again within 30 days of contact.',
      long: 'Returned members become multi-monthly borrowers, and the lapse rate falls because the causes are fixed.'
    },
    milestones: [[0, 'Lapsed-member list pulled and grouped'], [14, 'Message and offer approved'], [21, 'First wave sent'], [49, 'Second wave and phone follow-up'], [90, 'Review: reactivation rate and reasons for lapsing']],
    raci: ['Data export and grouping', 'Message writing and approval', 'Branch welcome-back displays', 'Phone follow-up', 'Results reporting'],
    risks: [['Contact details are out of date', 3, 2, 'Clean the list first; use text messages where email bounces.'], ['Privacy or consent complaint', 1, 3, 'Check the list against contact preferences and policy before anything is sent.'], ['Returned members lapse again', 2, 2, 'Follow up at 4 and 8 weeks with a next-read suggestion.']],
    tasks: [[3, 'Request the lapsed-member export'], [10, 'Draft the welcome-back message and reading picks'], [18, 'Brief branch teams on the welcome-back offer']]
  },
  {
    id: 'ladder', name: 'Casual to regular: the borrowing habit', pillar: 'borrowers', type: 'Growth project', outcomes: ['engagement'], stages: ['regular', 'casual', 'active'],
    blurb: 'Give occasional borrowers a reason to return within four weeks of every visit, until borrowing is a habit.',
    objective: 'Move 15% of casual borrowers (a few visits a year) to borrowing in at least two of every three months by the end date.',
    need: 'Most members borrow a few times a year. The gap is habit, not awareness: each visit needs to set up the next one.',
    audience: 'Members who borrowed in the last 12 months but in fewer than four separate months.',
    logic: {
      inputs: 'Borrowing-frequency report; desk staff trained in readers\' advisory; "your next read" slips; series and author alerts; a monthly reading challenge card.',
      activities: 'Recommend a next read at every checkout. Place a hold before the borrower leaves. Display series starters. Stamp a challenge card on each visit. Send a reminder with picks three weeks after a visit.',
      outputs: 'Recommendations made, holds placed at checkout, challenge cards issued and completed.',
      short: 'Casual borrowers return within four weeks of a visit.',
      long: 'A larger share of members borrow in several months of each quarter, and loans per active member rise.'
    },
    milestones: [[0, 'Baseline: casual and multi-monthly counts by branch'], [14, 'Readers\' advisory refresher for desk staff'], [28, 'Next-read slips and challenge card launched'], [56, 'Mid-point check: return-within-four-weeks rate'], [120, 'Review: scale, adjust or stop']],
    raci: ['Baseline report', 'Staff training', 'Challenge card design and print', 'Displays and stock', 'Monthly tracking'],
    risks: [['Desk staff are too busy to recommend', 3, 2, 'Script a 20-second version and trial it at one branch first.'], ['Popular titles are not available', 2, 2, 'Buy extra copies of series starters and point to eBook copies.']],
    tasks: [[5, 'Run the borrowing-frequency baseline report'], [12, 'Book the readers\' advisory refresher'], [20, 'Approve the challenge card design']]
  },
  {
    id: 'drive', name: 'New member drive: schools and new residents', pillar: 'members', type: 'Growth project', outcomes: ['engagement', 'literacy'], stages: ['new', 'members'],
    blurb: 'Sign up people where they already are, and make sure the first loan happens within a month.',
    objective: 'Sign up 600 new members by the end date, with at least 60% borrowing within 30 days of joining.',
    need: 'Parts of the community do not know what the library offers or think it is not for them. Joining must be easy, and the first visit must send them home with something.',
    audience: 'School-age children and their families, new residents, and neighborhoods with low membership per household.',
    logic: {
      inputs: 'Membership-by-area data; school and council partners; a pop-up sign-up kit; a short joining form; welcome packs.',
      activities: 'Visit classes and issue cards on the spot. Sign up at enrollment days and in new-resident mailings. Hand over a welcome pack with a first-loan prompt. Follow up two weeks later.',
      outputs: 'Sign-up events held, cards issued, first loans within 30 days.',
      short: 'New members borrow within their first month.',
      long: 'Membership rises as a share of population in under-served areas, and new members become regular borrowers.'
    },
    milestones: [[0, 'Low-membership areas mapped and targets chosen'], [21, 'School and council partners confirmed'], [35, 'Sign-up kit and welcome packs ready'], [42, 'First sign-up events'], [100, 'Review: sign-ups and 30-day activation']],
    raci: ['Membership data and targets', 'School and council liaison', 'Sign-up kit and welcome packs', 'Event staffing', 'Activation follow-up'],
    risks: [['People sign up but never borrow', 3, 3, 'Issue the first loan at sign-up and follow up at two weeks.'], ['School calendar clashes', 2, 2, 'Agree dates a term ahead.']],
    tasks: [[4, 'Pull membership by area and pick three target areas'], [10, 'Contact school principals about class visits'], [25, 'Order welcome packs']]
  },
  {
    id: 'program', name: 'Community program with a literacy outcome', pillar: 'programs', type: 'Community program', outcomes: ['literacy', 'engagement'], stages: ['attendance', 'outcome'],
    blurb: 'Design a program backwards from the change you want for participants, with a collection built in.',
    objective: 'Run a 10-week program in which at least 70% of participants report reading more or with more confidence, and half borrow from the linked collection.',
    need: 'State the community need in one sentence and name the evidence for it (school results, census data, partner feedback).',
    audience: 'Who the program is for, and who it must not miss.',
    logic: {
      inputs: 'A trained facilitator; a partner organization; a matched collection (kits, leveled readers, bilingual titles); a room and time slot; a start and end survey.',
      activities: 'Weekly sessions. A take-home item from the collection at every session. Referrals through the partner. A short survey in the first and last sessions.',
      outputs: 'Sessions held, attendance, items borrowed by participants, surveys returned.',
      short: 'Participants borrow from the linked collection and report more confidence.',
      long: 'Participants keep reading and borrowing after the program ends, and partners refer the next group.'
    },
    milestones: [[0, 'Need and outcome agreed with the partner'], [21, 'Sessions designed and collection chosen'], [35, 'Promotion and referrals open'], [49, 'First session'], [112, 'Final session and outcome survey'], [126, 'Evaluation shared with partners']],
    raci: ['Program design', 'Partner liaison', 'Collection selection', 'Session delivery', 'Outcome evaluation'],
    risks: [['Low attendance', 2, 3, 'Recruit through partners rather than posters; confirm numbers a week ahead.'], ['Outcomes are not measured', 2, 3, 'Build the start and end survey into the first and last sessions.']],
    tasks: [[5, 'Meet the partner to agree the need and the outcome'], [14, 'Choose the collection that goes home with participants'], [28, 'Write the start and end survey']]
  },
  {
    id: 'refresh', name: 'Collection refresh for relevancy', pillar: 'collections', type: 'Collection initiative', outcomes: ['relevancy', 'engagement'], stages: ['turnover', 'loans'],
    blurb: 'Weed what is not borrowed, buy to demand, and display what remains so that it gets found.',
    objective: 'Lift turnover of this collection by 25% by the end date by weeding dead stock, buying to demand and displaying what remains.',
    need: 'Shelves crowded with unused stock hide the titles people want. A smaller, fresher, better-displayed collection is borrowed more.',
    audience: 'Current and potential borrowers of this collection. Compare the community profile (ages, languages, interests) with what is on the shelf.',
    logic: {
      inputs: 'Collection usage report (turnover, relative use, dead stock, age); community profile; selection budget; shelf space for face-out display.',
      activities: 'Weed using MUSTIE criteria. Buy to holds and requests. Move copies to branches where they are borrowed. Build face-out and themed displays. Promote the collection in programs.',
      outputs: 'Items weeded, items added, displays refreshed, holds filled faster.',
      short: 'Turnover and relative use improve; the wait for holds shortens.',
      long: 'The community finds its interests and languages on the shelf, and more members borrow every month.'
    },
    milestones: [[0, 'Usage and age report run'], [14, 'Weeding list approved'], [35, 'Weeding done and orders placed'], [56, 'New stock shelved and displayed'], [150, 'Review: turnover against the baseline']],
    raci: ['Usage reporting', 'Weeding decisions', 'Selection and ordering', 'Display and merchandising', 'Review'],
    risks: [['Community concern about discarded books', 2, 2, 'Publish the weeding criteria; pass withdrawn stock to a book sale or partners.'], ['New stock arrives late', 2, 2, 'Order early and stagger the displays.']],
    tasks: [[3, 'Run the usage and age report for this collection'], [12, 'Review the weeding list'], [30, 'Approve the replacement order']]
  },
  {
    id: 'popup', name: 'Pop-up library and outreach', pillar: 'members', type: 'Growth project', outcomes: ['engagement', 'relevancy'], stages: ['new', 'members', 'attendance'],
    blurb: 'Take cards, stock and staff to markets, aged-care homes, clubs and playgroups.',
    objective: 'Run 12 pop-up visits by the end date, signing up 250 members and issuing 400 loans on site.',
    need: 'Some residents will never walk past a branch. Meeting them where they already gather removes the first barrier.',
    audience: 'Residents in areas far from a branch, and groups under-represented among members.',
    logic: {
      inputs: 'A portable kit (tablet, card stock, browsing collection, banner); two staff per visit; host venues; a schedule shared with partners.',
      activities: 'Visit each location on a fixed rhythm. Join people and lend on the spot. Take requests. Invite visitors to a branch program.',
      outputs: 'Visits held, members joined, loans issued, requests taken.',
      short: 'New members borrow on the day and again within a month.',
      long: 'Under-served areas hold more cards, and outreach members start using a branch.'
    },
    milestones: [[0, 'Locations chosen from membership-by-area data'], [21, 'Hosts confirmed and kit ready'], [35, 'First pop-up'], [90, 'Half-way review'], [150, 'Review: members joined and repeat borrowing']],
    raci: ['Location choice', 'Host liaison', 'Kit and stock', 'Visit staffing', 'Follow-up and reporting'],
    risks: [['Weather or venue cancellations', 2, 2, 'Keep one indoor fallback venue each month.'], ['Stock is not returned', 2, 1, 'Use long loans and accept returns at any branch or the next visit.']],
    tasks: [[5, 'Shortlist six locations with hosts'], [15, 'Assemble and test the pop-up kit']]
  },
  {
    id: 'blank', name: 'Blank project', pillar: 'members', type: 'Growth project', outcomes: [], stages: [],
    blurb: 'Start from an empty plan.', objective: '', need: '', audience: '',
    logic: { inputs: '', activities: '', outputs: '', short: '', long: '' }, milestones: [], raci: [], risks: [], tasks: []
  }
];
R.projectCode = pillar => {
  const pre = (R.PILLARS[pillar] || R.PILLARS.members).code;
  const n = R.all('projects').reduce((m, p) => { const k = /^([A-Z]+)-(\d+)$/.exec(p.code || ''); return k && k[1] === pre ? Math.max(m, Number(k[2])) : m; }, 0);
  return pre + '-' + String(n + 1).padStart(3, '0');
};
R.newProject = (pb, start) => {
  start = start || R.today();
  const last = pb.milestones.length ? pb.milestones[pb.milestones.length - 1][0] : 90;
  return {
    name: pb.id === 'blank' ? '' : pb.name, type: pb.type, pillar: pb.pillar, status: 'Planning', health: 'on',
    outcomes: pb.outcomes.slice(), objective: pb.objective, need: pb.need, audience: pb.audience, logic: Object.assign({}, pb.logic),
    start, end: R.addDays(start, last), nextReview: R.addDays(start, 28),
    milestones: pb.milestones.map(m => ({ id: R.uid('m'), title: m[1], date: R.addDays(start, m[0]), done: false })),
    raci: pb.raci.map(a => ({ id: R.uid('r'), activity: a, r: '', a: '', c: '', i: '' })),
    risks: pb.risks.map(k => ({ id: R.uid('k'), risk: k[0], likelihood: k[1], impact: k[2], mitigation: k[3] })),
    allocations: [], stakeholderIds: [], branches: [], reviews: [],
    kpiIds: R.all('kpis').filter(k => pb.stages.includes(k.stage)).map(k => k.id), playbook: pb.id
  };
};

R.STANDARD_KPIS = [
  { name: 'Total members', stage: 'members', pillar: 'members', unit: '', dir: 'up' },
  { name: 'New members this month', stage: 'new', pillar: 'members', unit: '', dir: 'up' },
  { name: 'Active borrowers (last 12 months)', stage: 'active', pillar: 'borrowers', unit: '', dir: 'up' },
  { name: 'Multi-monthly borrowers', stage: 'regular', pillar: 'borrowers', unit: '', dir: 'up' },
  { name: 'Casual borrowers', stage: 'casual', pillar: 'borrowers', unit: '', dir: 'down' },
  { name: 'Lapsed members', stage: 'lapsed', pillar: 'borrowers', unit: '', dir: 'down' },
  { name: 'Lapsed members reactivated', stage: 'reactivated', pillar: 'borrowers', unit: '', dir: 'up' },
  { name: 'Program attendance', stage: 'attendance', pillar: 'programs', unit: '', dir: 'up' },
  { name: 'Participants reporting more reading confidence', stage: 'outcome', pillar: 'programs', unit: '%', dir: 'up' },
  { name: 'Collection turnover (loans per item)', stage: 'turnover', pillar: 'collections', unit: 'x', dir: 'up' }
];
R.STANDARD_SEGMENTS = ['Picture books', 'Junior fiction', 'Junior non-fiction', 'Young adult', 'Adult fiction', 'Adult non-fiction', 'Large print', 'Community languages', 'DVDs and audiobooks', 'eBooks and eAudio'];

/* ---------- measures ---------- */
R.kpiSeries = k => (k.entries || []).slice().sort((a, b) => a.month < b.month ? -1 : 1);
R.kpiLatest = k => { const s = R.kpiSeries(k); return s.length ? s[s.length - 1] : null; };
R.kpiBase = k => (k.baseline != null && k.baseline !== '') ? Number(k.baseline) : (R.kpiSeries(k)[0] || {}).value;
R.kpiProgress = k => {
  const l = R.kpiLatest(k), b = R.kpiBase(k);
  if (!l || b == null || k.target == null || k.target === '' || Number(k.target) === b) return null;
  return Math.max(0, Math.min(1, (l.value - b) / (Number(k.target) - b)));
};
R.kpiBehind = k => {
  const p = R.kpiProgress(k), s = R.kpiSeries(k);
  if (p == null || !k.targetDate || s.length < 2 || p >= 1) return false;
  const start = s[0].month + '-01', total = R.diffDays(k.targetDate, start), gone = R.diffDays(R.today(), start);
  if (total <= 0) return true;
  return gone > 45 && p < Math.min(1, gone / total) - 0.2;
};
R.stage = st => R.all('kpis').find(k => k.stage === st) || null;
R.stageVal = st => { const k = R.stage(st), l = k && R.kpiLatest(k); return l ? l.value : null; };

/* ---------- people and stakeholders ---------- */
R.staffLoad = id => {
  const s = R.get('staff', id), cap = s ? Number(s.projectHours) || 0 : 0;
  let hrs = 0; const list = [];
  R.all('projects').forEach(p => {
    if (p.status !== 'Planning' && p.status !== 'Active') return;
    (p.allocations || []).forEach(a => { if (a.staffId === id) { hrs += Number(a.hours) || 0; list.push({ p, hours: Number(a.hours) || 0 }); } });
  });
  return { cap, hrs, list, over: cap > 0 && hrs > cap, frac: cap ? hrs / cap : (hrs ? 1 : 0) };
};
R.last1on1 = s => (s.log || []).reduce((m, e) => e.date > m ? e.date : m, '');
R.next1on1 = s => { const ev = Number(s.oneOnOneEvery) || 0; if (!ev) return null; const last = R.last1on1(s); return last ? R.addDays(last, ev) : R.today(); };
R.lastContact = h => (h.log || []).reduce((m, e) => e.date > m ? e.date : m, '');
R.nextContact = h => { const ev = Number(h.cadence) || 0; if (!ev) return null; const last = R.lastContact(h); return last ? R.addDays(last, ev) : R.today(); };
R.directReports = () => { const m = R.me(); return m ? R.all('staff').filter(s => s.reportsTo === m.id) : []; };

/* ---------- management health check ---------- */
R.healthCheck = p => {
  const tasks = R.all('tasks').filter(t => t.projectId === p.id);
  const lm = p.logic || {}, raci = p.raci || [], ms = p.milestones || [], risks = p.risks || [], alloc = p.allocations || [];
  const kpis = (p.kpiIds || []).filter(id => R.get('kpis', id));
  const over = alloc.some(a => R.staffLoad(a.staffId).over);
  const deleg = tasks.filter(t => !R.isMine(t) && t.status !== 'done');
  const reviewLate = !!p.nextReview && p.nextReview < R.today();
  return [
    { principle: 'SMART objective', ok: !!(p.objective && p.objective.length > 30 && p.end && kpis.length), fix: 'Write one specific objective, set an end date and link at least one measure.', act: 'project-edit' },
    { principle: 'One accountable owner', ok: !!R.get('staff', p.ownerId), fix: 'Name the one person who owns the result.', act: 'project-edit' },
    { principle: 'Outcomes, not just outputs', ok: !!(lm.activities && lm.outputs && (lm.short || lm.long)), fix: 'Complete the logic model through to the change you expect for people.', act: 'logic-edit' },
    { principle: 'Stakeholders mapped', ok: (p.stakeholderIds || []).some(id => R.get('stakeholders', id)), fix: 'Link the people outside the team who can help or block this.', act: 'project-edit' },
    { principle: 'Clear roles (RACI)', ok: raci.length > 0 && raci.every(r => r.r && r.a), fix: 'Give every activity one responsible and one accountable person.', act: 'raci-open' },
    { principle: 'Capacity planned', ok: alloc.length > 0 && !over, fix: over ? 'Someone on this project is over-committed. Rebalance their hours.' : 'Allocate people and weekly hours.', act: 'alloc-add' },
    { principle: 'Milestones on the calendar', ok: ms.filter(m => m.date).length >= 3, fix: 'Add at least three dated milestones.', act: 'ms-add' },
    { principle: 'Risks have a response', ok: risks.length > 0 && risks.every(r => r.mitigation), fix: 'List the main risks and what you will do about each.', act: 'risk-add' },
    { principle: 'Plan, do, check, act', ok: !!p.nextReview && !reviewLate, fix: reviewLate ? 'The review date has passed. Hold the review and log what you decided.' : 'Set the next review date.', act: 'review-add' },
    { principle: 'Delegated with follow-up', ok: deleg.length > 0 && deleg.every(t => t.followUp || t.due), fix: 'Delegate at least one task, with a follow-up date.', act: 'task-new' }
  ];
};
R.projectProgress = p => { const ms = p.milestones || []; return ms.length ? ms.filter(m => m.done).length / ms.length : 0; };
R.nextMilestone = p => (p.milestones || []).filter(m => !m.done && m.date).sort((a, b) => a.date < b.date ? -1 : 1)[0] || null;
R.isLive = p => p.status === 'Active' || p.status === 'Planning';

/* ---------- collections ---------- */
R.PLAYS = {
  under: { label: 'Demand outstrips stock', kind: 'warn', icon: 'up', verb: 'Buy to demand', plays: [
    ['Buy more copies and more titles here, funded from collections with relative use under 0.75.', 'relevancy'],
    ['Check holds queues. Where the wait is over four weeks, buy to a holds ratio such as one copy for every four holds.', 'engagement'],
    ['Point borrowers to eBook and eAudio copies of the same titles to shorten the wait.', 'engagement'],
    ['Build a display or program on this demand to bring casual borrowers back each month.', 'engagement']] },
  tired: { label: 'Tired stock', kind: 'crit', icon: 'alert', verb: 'Weed and refresh', plays: [
    ['Weed with MUSTIE (misleading, ugly, superseded, trivial, irrelevant, available elsewhere), starting with items not borrowed in two years.', 'relevancy'],
    ['Replace with fewer, newer titles chosen from requests, holds and the community profile.', 'relevancy'],
    ['Use the freed shelf space for face-out display.', 'engagement'],
    ['Measure turnover again after three months and report the change.', 'engagement']] },
  hidden: { label: 'Good stock, not found', kind: 'info', icon: 'flag', verb: 'Promote and move', plays: [
    ['The stock is fresh but is not being found. Move it to a high-traffic spot and display it face-out.', 'engagement'],
    ['Add it to staff picks, reading lists and the "your next read" conversation at checkout.', 'engagement'],
    ['Check whether it sits in the wrong branch. Float copies to where similar titles are borrowed.', 'relevancy'],
    ['Tie it to a program: book club kits, class sets, storytime themes or a language group.', 'literacy']] },
  balanced: { label: 'In balance', kind: 'good', icon: 'check', verb: 'Maintain', plays: [
    ['Hold its budget share steady and weed lightly each quarter.', 'relevancy'],
    ['Use this collection as the anchor for a program or reading challenge.', 'literacy'],
    ['Watch the trend, and act if relative use moves outside 0.75 to 1.25.', 'engagement']] },
  nodata: { label: 'Needs numbers', kind: 'mute', icon: 'clock', verb: 'Add figures', plays: [['Enter items held and loans for the last 12 months to see how this collection is working.', 'relevancy']] }
};
R.collectionStats = () => {
  const segs = R.all('segments');
  const tItems = R.sum(segs, s => s.items), tLoans = R.sum(segs, s => s.loans);
  return segs.map(s => {
    const items = Number(s.items) || 0, loans = Number(s.loans) || 0;
    const turnover = items ? loans / items : null;
    const ruf = items && tItems && tLoans ? (loans / tLoans) / (items / tItems) : null;
    let dx = 'balanced';
    if (ruf == null) dx = 'nodata';
    else if (ruf >= 1.25) dx = 'under';
    else if (ruf <= 0.75) dx = ((s.dead != null && Number(s.dead) >= 20) || (s.fresh != null && s.fresh !== '' && Number(s.fresh) < 30)) ? 'tired' : 'hidden';
    return { seg: s, items, loans, turnover, ruf, dx, play: R.PLAYS[dx] };
  });
};

/* ---------- calendar feed: every dated thing in one list ---------- */
R.KINDS = {
  event: ['calendar', 'Event'], task: ['tasks', 'Task due'], follow: ['clock', 'Follow-up'], milestone: ['diamond', 'Milestone'],
  pstart: ['flag', 'Project starts'], pend: ['flag', 'Project ends'], review: ['target', 'Project review'], contact: ['stakeholders', 'Stakeholder contact'], oneonone: ['user', 'One-to-one']
};
R.calItems = (from, to, flat) => {
  const out = [], inR = d => !!d && d >= from && d <= to;
  const add = (date, kind, title, sub, act, id, extra) => out.push(Object.assign({ date, kind, title, sub: sub || '', act, id }, extra || {}));
  R.all('events').forEach(e => {
    const end = e.endDate && e.endDate > e.date ? e.endDate : e.date;
    if (flat && end > e.date) { const at = e.date < from ? from : e.date; if (end >= from && inR(at)) add(at, 'event', e.title, [e.type, 'until ' + R.fmtDate(end)].filter(Boolean).join(' · '), 'event-edit', e.id); return; }
    for (let d = e.date, n = 0; d && d <= end && n < 62; d = R.addDays(d, 1), n++) if (inR(d)) add(d, 'event', e.title, [e.time, e.type].filter(Boolean).join(' · '), 'event-edit', e.id);
  });
  R.all('tasks').forEach(t => {
    if (t.status === 'done') return;
    const who = R.isMine(t) ? '' : R.staffName(t.assigneeId);
    if (inR(t.due)) add(t.due, 'task', t.title, who ? 'With ' + who : '', 'task-edit', t.id);
    if (who && inR(t.followUp) && t.followUp !== t.due) add(t.followUp, 'follow', 'Follow up: ' + t.title, 'With ' + who, 'task-edit', t.id);
  });
  R.all('projects').forEach(p => {
    if (p.status === 'Complete') return;
    (p.milestones || []).forEach(m => { if (inR(m.date)) add(m.date, 'milestone', m.title, p.name, 'project-open', p.id, { done: !!m.done }); });
    if (inR(p.start)) add(p.start, 'pstart', 'Starts: ' + p.name, '', 'project-open', p.id);
    if (inR(p.end)) add(p.end, 'pend', 'Ends: ' + p.name, '', 'project-open', p.id);
    if (R.isLive(p) && inR(p.nextReview)) add(p.nextReview, 'review', 'Review: ' + p.name, '', 'project-open', p.id);
  });
  R.all('stakeholders').forEach(h => { const d = R.nextContact(h); if (inR(d)) add(d, 'contact', 'Contact ' + h.name, h.org, 'sh-open', h.id); });
  R.all('staff').forEach(s => { const d = R.next1on1(s); if (inR(d)) add(d, 'oneonone', 'One-to-one with ' + s.name, '', 'staff-open', s.id); });
  const order = Object.keys(R.KINDS);
  return out.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : order.indexOf(a.kind) - order.indexOf(b.kind));
};

/* ---------- what needs the manager's attention ---------- */
R.attention = () => {
  const out = [], t0 = R.today();
  const add = (level, ic, text, sub, act, id) => out.push({ level, ic, text, sub, act, id });
  R.all('tasks').forEach(t => {
    if (t.status === 'done') return;
    if (R.isMine(t)) { if (R.isOverdue(t)) add(2, 'alert', t.title, 'Your task, due ' + R.rel(t.due), 'task-edit', t.id); }
    else if (R.isOverdue(t)) add(2, 'alert', t.title, 'Delegated to ' + R.staffName(t.assigneeId) + ', due ' + R.rel(t.due), 'task-edit', t.id);
    else if (t.followUp && t.followUp <= t0) add(1, 'clock', 'Follow up: ' + t.title, 'With ' + R.staffName(t.assigneeId) + ', follow-up was ' + R.rel(t.followUp), 'task-edit', t.id);
  });
  R.all('projects').forEach(p => {
    if (!R.isLive(p)) return;
    if (p.health === 'off') add(2, 'alert', p.name, 'Project is off track', 'project-open', p.id);
    else if (p.health === 'risk') add(1, 'alert', p.name, 'Project is at risk', 'project-open', p.id);
    if (p.nextReview && p.nextReview < t0) add(1, 'target', 'Review ' + p.name, 'Review was due ' + R.rel(p.nextReview), 'project-open', p.id);
    (p.milestones || []).forEach(m => { if (!m.done && m.date && m.date < t0) add(1, 'diamond', m.title, 'Milestone in ' + p.name + ', due ' + R.rel(m.date), 'project-open', p.id); });
  });
  R.all('stakeholders').forEach(h => { const d = R.nextContact(h); if (d && d < t0) add(1, 'stakeholders', 'Contact ' + h.name, 'Due ' + R.rel(d) + (h.org ? ' · ' + h.org : ''), 'sh-open', h.id); });
  R.all('staff').forEach(s => {
    const d = R.next1on1(s); if (d && d < t0) add(1, 'user', 'One-to-one with ' + s.name, 'Due ' + R.rel(d), 'staff-open', s.id);
    const l = R.staffLoad(s.id); if (l.over) add(1, 'resources', s.name + ' is over-committed', l.hrs + ' project hours a week against ' + l.cap + ' available', 'staff-open', s.id);
  });
  R.all('kpis').forEach(k => { if (R.kpiBehind(k)) add(1, 'growth', k.name + ' is behind its target path', Math.round((R.kpiProgress(k) || 0) * 100) + '% of the way to target', 'kpi-open', k.id); });
  const live = R.all('projects').filter(p => p.status === 'Active');
  if (live.length) Object.keys(R.OUTCOMES).forEach(o => { if (!live.some(p => (p.outcomes || []).includes(o))) add(0, 'flag', 'No active project aims at ' + R.OUTCOMES[o].name.toLowerCase(), R.OUTCOMES[o].q, 'go-growth', ''); });
  return out.sort((a, b) => b.level - a.level);
};

/* ---------- shared UI parts ---------- */
R.pill = (kind, label, ic) => '<span class="pill k-' + kind + '">' + (ic ? icon(ic) : '') + esc(label) + '</span>';
R.healthPill = p => {
  if (p.status === 'Complete') return R.pill('good', 'Complete', 'check');
  if (p.status === 'Idea') return R.pill('mute', 'Idea');
  if (p.status === 'On hold') return R.pill('mute', 'On hold', 'clock');
  const h = p.health || 'on';
  return R.pill(h === 'on' ? 'good' : h === 'risk' ? 'warn' : 'crit', (p.status === 'Planning' ? 'Planning · ' : '') + R.HEALTH[h], h === 'on' ? 'check' : 'alert');
};
R.pillarChip = k => { const p = R.PILLARS[k]; return p ? '<span class="chip"><i class="sw" style="background:' + p.color + '"></i>' + esc(p.name) + '</span>' : ''; };
R.outcomeTags = list => (list || []).filter(o => R.OUTCOMES[o]).map(o => '<span class="tag">' + esc(R.OUTCOMES[o].name) + '</span>').join('');
R.exTag = d => d && d.example ? '<span class="tag ex" title="Example data. Remove it in Settings and data.">Example</span>' : '';
R.due = (d, done) => {
  if (!d) return '';
  const n = R.diffDays(d, R.today()), cls = done ? '' : n < 0 ? ' over' : n <= 2 ? ' soon' : '', dt = R.parse(d);
  return '<span class="due' + cls + '" title="' + esc(R.fmtLong(d)) + (cls === ' over' ? ', overdue' : '') + '">' + (cls === ' over' ? icon('alert') : '') + dt.getDate() + ' ' + R.MON[dt.getMonth()].toUpperCase() + (dt.getFullYear() !== new Date().getFullYear() ? ' ' + String(dt.getFullYear()).slice(2) : '') + '</span>';
};
R.meter = (frac, kind, label) => {
  const pc = Math.max(0, Math.min(100, Math.round((frac || 0) * 100)));
  return '<span class="meter' + (kind ? ' m-' + kind : '') + '" role="img" aria-label="' + esc(label || pc + '%') + '"><i style="width:' + pc + '%"></i></span>';
};
R.avatar = (name, me) => '<span class="av' + (me ? ' me' : '') + '" aria-hidden="true">' + esc(R.initials(name)) + '</span>';
R.empty = (title, text, actions) => '<div class="empty"><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p>' + (actions ? '<div class="row">' + actions + '</div>' : '') + '</div>';
R.btn = (act, label, o) => {
  o = o || {};
  const data = Object.keys(o.data || {}).map(k => ' data-' + k + '="' + esc(o.data[k]) + '"').join('');
  return '<button type="button" class="btn' + (o.cls ? ' ' + o.cls : '') + '" data-act="' + act + '"' + data + (o.title ? ' title="' + esc(o.title) + '"' : '') + '>' + (o.icon ? icon(o.icon) : '') + esc(label) + '</button>';
};
R.iconBtn = (act, ic, label, data) => '<button type="button" class="icon-btn" data-act="' + act + '"' + Object.keys(data || {}).map(k => ' data-' + k + '="' + esc(data[k]) + '"').join('') + ' aria-label="' + esc(label) + '" title="' + esc(label) + '">' + icon(ic) + '</button>';
R.tabs = (act, cur, items) => '<div class="tabs" role="tablist">' + items.map(i => '<button type="button" role="tab" class="tab" aria-selected="' + (cur === i[0]) + '" data-act="' + act + '" data-v="' + i[0] + '">' + esc(i[1]) + (i[2] != null ? '<span class="count">' + i[2] + '</span>' : '') + '</button>').join('') + '</div>';
R.head = (title, sub, actions) => '<header class="vh"><div class="vh-text"><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' + (actions ? '<div class="vh-actions">' + actions + '</div>' : '') + '</header>';
R.sec = (title, actions, sub) => '<div class="sec-h"><div><h2>' + esc(title) + '</h2>' + (sub ? '<p class="sec-sub">' + esc(sub) + '</p>' : '') + '</div>' + (actions ? '<div class="row">' + actions + '</div>' : '') + '</div>';
R.link = (act, id, label, cls) => '<button type="button" class="linkish' + (cls ? ' ' + cls : '') + '" data-act="' + act + '" data-id="' + esc(id || '') + '">' + esc(label) + '</button>';
R.spine = code => { const a = String(code || '').split('-'); return '<span class="spine" aria-label="Project code ' + esc(code) + '">' + esc(a[0] || '') + '<br>' + esc(a[1] || '') + '</span>'; };

R.spark = vals => {
  if (!vals || vals.length < 2) return '';
  const w = 96, h = 28, p = 5, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), sp = (mx - mn) || 1;
  const pts = vals.map((v, i) => [p + i * (w - 2 * p) / (vals.length - 1), h - p - (v - mn) / sp * (h - 2 * p)]);
  const e = pts[pts.length - 1];
  return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true"><path d="' + pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ') + '" fill="none" stroke="var(--ink-3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + e[0].toFixed(1) + '" cy="' + e[1].toFixed(1) + '" r="3.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/></svg>';
};
R.kpiTile = k => {
  const s = R.kpiSeries(k), l = s[s.length - 1], pv = s[s.length - 2], prog = R.kpiProgress(k);
  let delta = '<span class="delta">' + (l ? esc(R.fmtMonth(l.month)) : 'No numbers recorded yet') + '</span>';
  if (l && pv) {
    const d = l.value - pv.value, good = k.dir === 'down' ? d < 0 : d > 0;
    delta = d === 0 ? '<span class="delta">No change since ' + esc(R.fmtMonth(pv.month)) + '</span>'
      : '<span class="delta ' + (good ? 'd-good' : 'd-bad') + '">' + icon(d > 0 ? 'up' : 'down') + esc(R.num(Math.abs(d), k.unit)) + ' since ' + esc(R.fmtMonth(pv.month)) + '</span>';
  }
  return '<button type="button" class="tile" data-act="kpi-open" data-id="' + k.id + '">' +
    '<span class="tile-label">' + esc(k.name) + R.exTag(k) + '</span>' +
    '<span class="tile-row"><span class="tile-value">' + (l ? esc(R.num(l.value, k.unit)) : '–') + '</span>' + R.spark(s.slice(-12).map(e => e.value)) + '</span>' + delta +
    (k.target != null && k.target !== '' ? '<span class="tile-foot">' + R.meter(prog || 0, R.kpiBehind(k) ? 'warn' : '', 'Progress to target') + '<span>Target ' + esc(R.num(k.target, k.unit)) + (k.targetDate ? ' by ' + esc(R.fmtDate(k.targetDate, true)) : '') + '</span></span>' : '') +
    '</button>';
};
/* Line chart with a hover read-out; the table beside it carries the same values. */
R.lineChart = k => {
  const s = R.kpiSeries(k); if (s.length < 2) return '';
  const W = 640, H = 220, L = 52, Rt = 16, T = 16, B = 30;
  const vals = s.map(e => e.value).concat(k.target != null && k.target !== '' ? [Number(k.target)] : []);
  let mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
  if (mn === mx) { mn -= 1; mx += 1; }
  /* round axis: pick a clean step, then widen the range to whole steps */
  const raw = (mx - mn) / 3, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
  const st = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  mn = Math.floor(mn / st + 1e-9) * st; mx = Math.ceil(mx / st - 1e-9) * st;
  const ticks = []; for (let t = mn; t <= mx + st / 2; t += st) ticks.push(Math.round(t / st) * st);
  const x = i => L + i * (W - L - Rt) / (s.length - 1), y = v => T + (mx - v) / (mx - mn) * (H - T - B);
  const step = Math.max(1, Math.ceil(s.length / 6)), lastI = s.length - 1;
  const pts = s.map((e, i) => [x(i), y(e.value), R.fmtMonth(e.month), R.num(e.value, k.unit)]);
  const e = pts[pts.length - 1];
  return '<svg class="linechart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(k.name) + ' by month" data-pts="' + esc(JSON.stringify(pts.map(p => [Math.round(p[0]), Math.round(p[1]), p[2], p[3]]))) + '">' +
    ticks.map(t => '<line x1="' + L + '" x2="' + (W - Rt) + '" y1="' + y(t).toFixed(1) + '" y2="' + y(t).toFixed(1) + '" stroke="var(--line)" stroke-width="1"/><text x="' + (L - 8) + '" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end" class="ax">' + esc(R.num(t, k.unit)) + '</text>').join('') +
    s.map((en, i) => (i === lastI || (i % step === 0 && lastI - i >= step)) ? '<text x="' + x(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + (i === s.length - 1 ? 'end' : 'middle') + '" class="ax">' + esc(R.fmtMonth(en.month)) + '</text>' : '').join('') +
    (k.target != null && k.target !== '' ? '<line x1="' + L + '" x2="' + (W - Rt) + '" y1="' + y(Number(k.target)).toFixed(1) + '" y2="' + y(Number(k.target)).toFixed(1) + '" stroke="var(--ink-3)" stroke-width="1"/><text x="' + (L + 6) + '" y="' + (y(Number(k.target)) - 6).toFixed(1) + '" class="ax">Target ' + esc(R.num(k.target, k.unit)) + '</text>' : '') +
    '<path d="' + pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + ' L' + e[0].toFixed(1) + ' ' + (H - B) + ' L' + L + ' ' + (H - B) + ' Z" fill="var(--accent)" opacity=".1" stroke="none"/>' +
    '<path d="' + pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<line class="xh" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" stroke="var(--ink-3)" stroke-width="1" visibility="hidden"/>' +
    '<circle class="xd" r="5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2" cx="' + e[0].toFixed(1) + '" cy="' + e[1].toFixed(1) + '"/>' +
    '<text x="' + (e[0] - 8).toFixed(1) + '" y="' + (e[1] - 10).toFixed(1) + '" text-anchor="end" class="ax strong">' + esc(e[3]) + '</text>' +
    '</svg>';
};
document.addEventListener('pointermove', ev => {
  const svg = ev.target.closest && ev.target.closest('svg.linechart');
  const tip = document.getElementById('tip'); if (!tip) return;
  if (!svg) { tip.hidden = true; return; }
  let pts; try { pts = JSON.parse(svg.dataset.pts); } catch (e) { return; }
  const box = svg.getBoundingClientRect(), vx = (ev.clientX - box.left) / box.width * 640;
  let best = pts[0]; pts.forEach(p => { if (Math.abs(p[0] - vx) < Math.abs(best[0] - vx)) best = p; });
  const xh = svg.querySelector('.xh'), xd = svg.querySelector('.xd');
  xh.setAttribute('x1', best[0]); xh.setAttribute('x2', best[0]); xh.setAttribute('visibility', 'visible');
  xd.setAttribute('cx', best[0]); xd.setAttribute('cy', best[1]);
  tip.textContent = best[2] + ': ' + best[3];
  tip.hidden = false;
  tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 8, Math.max(8, box.left + best[0] / 640 * box.width + 12)) + 'px';
  tip.style.top = Math.max(8, box.top + best[1] / 220 * box.height - 36) + 'px';
});
})();
