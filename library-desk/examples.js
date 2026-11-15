/* Regional Library Desk — example data: a made-up region, dated around today.
   Loaded only when asked for. Every record carries example: true so it can be removed in one step. */
(function (root) {
'use strict';
function build(today) {
  const pad = n => String(n).padStart(2, '0');
  const parse = s => { const a = s.split('-').map(Number); return new Date(a[0], a[1] - 1, a[2] || 1); };
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const d = n => { const x = parse(today); x.setDate(x.getDate() + n); return iso(x); };
  const m = n => { const x = parse(today.slice(0, 7) + '-01'); x.setMonth(x.getMonth() + n); return iso(x).slice(0, 7); };
  const series = (from, to, wobble, dp, tail) => {
    const out = [];
    for (let i = 0; i < 12; i++) {
      let v = from + (to - from) * i / 11 + wobble * Math.sin(i * 1.7);
      if (tail && i >= 12 - tail.length) v = tail[i - (12 - tail.length)];
      out.push({ month: m(i - 12), value: dp ? Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp) : Math.round(v) });
    }
    return out;
  };
  const ex = o => Object.assign(o, { example: true });
  const ME = 'ex-me';

  const staff = [
    { id: ME, name: 'Regional Manager (you)', title: 'Regional Manager', isMe: true, projectHours: 12, fte: 1 },
    { id: 'ex-s1', name: 'Priya Nair', title: 'Branch Manager', branch: 'Central', reportsTo: ME, projectHours: 8, fte: 1, oneOnOneEvery: 14, level: 'D4', strengths: 'Runs a calm, well-organized branch. Trusted by council staff. Strong with data.', development: 'Wants experience leading a region-wide project.', log: [{ id: 'ex-o1', date: d(-12), notes: 'Win-back first wave went out on time. Central welcome-back table is busy on Saturdays. Keen to present results to the director herself.', actions: 'Priya drafts the second-wave message. I book her a slot at the next director catch-up.' }] },
    { id: 'ex-s2', name: 'Tom Okafor', title: 'Branch Manager', branch: 'Northside', reportsTo: ME, projectHours: 8, fte: 1, oneOnOneEvery: 14, level: 'D2', strengths: 'Popular with the team and regular customers. Good instincts for displays.', development: 'Building confidence with project planning and reports.', log: [{ id: 'ex-o2', date: d(-20), notes: 'Worried about fitting Next Read around short staffing on the desk. Talked through a one-branch trial first.', actions: 'Tom pulls the baseline by branch. We plan the trial together next time.' }] },
    { id: 'ex-s3', name: 'Mei Chen', title: 'Community Programs Lead', reportsTo: ME, projectHours: 20, fte: 1, oneOnOneEvery: 14, level: 'D3', strengths: 'Designs programs people come back to. Strong partner relationships.', development: 'Measuring outcomes, not just attendance.', log: [{ id: 'ex-o3', date: d(-5), notes: 'Little Readers attendance is good but kit translations are late. Outcome survey drafted.', actions: 'Mei confirms translations with the Migrant Resource Centre this week.' }] },
    { id: 'ex-s4', name: 'Daniel Ruiz', title: 'Collections and Digital Lead', reportsTo: ME, projectHours: 16, fte: 1, oneOnOneEvery: 14, level: 'D3', strengths: 'Knows the collection and the suppliers inside out.', development: 'Explaining collection decisions in terms of community outcomes.', log: [{ id: 'ex-o4', date: d(-10), notes: 'Usage report shows adult non-fiction at less than half its fair share of loans. Agreed to weed before buying.', actions: 'Weeding list for the 300s and 600s ready for review.' }] },
    { id: 'ex-s5', name: 'Aisha Rahman', title: 'Children\'s Librarian', branch: 'Central', reportsTo: 'ex-s1', projectHours: 6, fte: 0.8 },
    { id: 'ex-s6', name: 'Ben Wright', title: 'Customer Service Team Leader', branch: 'Northside', reportsTo: 'ex-s2', projectHours: 4, fte: 1 },
    { id: 'ex-s7', name: 'Sofia Marino', title: 'Outreach Officer', reportsTo: 'ex-s3', projectHours: 15, fte: 0.6 },
    { id: 'ex-s8', name: 'Liam Walsh', title: 'Collections Officer', reportsTo: 'ex-s4', projectHours: 10, fte: 1 }
  ].map(ex);

  const stakeholders = [
    { id: 'ex-h1', name: 'Helen Fraser', role: 'Director, Library Services', org: 'Library service executive', category: 'Executive and council', influence: 5, interest: 5, stance: 'Supportive', cadence: 14, wants: 'Membership growth she can report to council each quarter, and no budget surprises.', asks: 'Backing for the collection budget shift and extra outreach hours.', log: [{ id: 'ex-c1', date: d(-9), type: 'Meeting', summary: 'Monthly catch-up. Pleased with early win-back numbers. Wants the borrowing-habit plan before the budget round.', next: 'Send the Next Read plan' }] },
    { id: 'ex-h2', name: 'Cr. Marcus Bell', role: 'Councillor, community services', org: 'City Council', category: 'Executive and council', influence: 5, interest: 3, stance: 'Neutral', cadence: 90, wants: 'Visible services in the northern suburbs and value for ratepayers.', asks: 'Support for pop-up library funding.', log: [{ id: 'ex-c2', date: d(-100), type: 'Event', summary: 'Spoke briefly at the Northside reopening. Asked how many residents hold a card.', next: 'Send membership by suburb' }] },
    { id: 'ex-h3', name: 'Joanne Petrie', role: 'Principal', org: 'Northside Primary School', category: 'Schools and education', influence: 3, interest: 5, stance: 'Champion', cadence: 60, wants: 'Reading for pleasure, and every student with a library card.', asks: 'Class visits each term and help reaching parents.', log: [{ id: 'ex-c3', date: d(-20), type: 'Call', summary: 'Happy to host a card sign-up at the school fair. Suggested sending kits home with new entrants.', next: 'Agree dates for term one visits' }] },
    { id: 'ex-h4', name: 'Samir Haddad', role: 'Coordinator', org: 'Migrant Resource Centre', category: 'Community organization', influence: 3, interest: 4, stance: 'Supportive', cadence: 60, wants: 'Books and programs in community languages, and a welcome for new arrivals.', asks: 'Translation checks for storytime kits and referrals to programs.', log: [{ id: 'ex-c4', date: d(-70), type: 'Meeting', summary: 'Agreed to check kit translations in Arabic, Mandarin, Vietnamese and Dari.', next: 'Send the parent guide text' }] },
    { id: 'ex-h5', name: 'Ruth Abbott', role: 'President', org: 'Friends of the Library', category: 'Friends and volunteers', influence: 2, interest: 5, stance: 'Champion', cadence: 30, wants: 'To feel useful, and to see withdrawn books go to good homes.', asks: 'Volunteers for welcome-back tables and the book sale.', log: [{ id: 'ex-c5', date: d(-12), type: 'Call', summary: 'Friends will run the book sale with withdrawn non-fiction. Six volunteers confirmed.', next: 'Confirm sale dates' }] },
    { id: 'ex-h6', name: 'Grace Lin', role: 'Grants Officer', org: 'State Library', category: 'Funder or grants body', influence: 4, interest: 2, stance: 'Neutral', cadence: 90, wants: 'Projects with measured outcomes and clean acquittals.', asks: 'Early advice on the next literacy grant round.', log: [{ id: 'ex-c6', date: d(-40), type: 'Email', summary: 'Next early-literacy round opens in the new year. Outcome evidence will be weighted heavily.', next: 'Share Little Readers survey results' }] }
  ].map(ex);

  const far = d(320);
  const kpis = [
    { id: 'ex-k1', name: 'Total members', stage: 'members', pillar: 'members', unit: '', dir: 'up', target: 45000, targetDate: far, entries: series(41200, 42950, 40) },
    { id: 'ex-k2', name: 'New members this month', stage: 'new', pillar: 'members', unit: '', dir: 'up', target: 500, targetDate: far, entries: series(310, 395, 30) },
    { id: 'ex-k3', name: 'Active borrowers (last 12 months)', stage: 'active', pillar: 'borrowers', unit: '', dir: 'up', target: 20500, targetDate: far, entries: series(18900, 19600, 50) },
    { id: 'ex-k4', name: 'Multi-monthly borrowers', stage: 'regular', pillar: 'borrowers', unit: '', dir: 'up', target: 8000, targetDate: far, entries: series(6100, 6680, 35), note: 'Members with a loan in at least two of the last three months. Source: borrowing-frequency report.' },
    { id: 'ex-k5', name: 'Casual borrowers', stage: 'casual', pillar: 'borrowers', unit: '', dir: 'down', entries: series(12800, 12920, 40) },
    { id: 'ex-k6', name: 'Lapsed members', stage: 'lapsed', pillar: 'borrowers', unit: '', dir: 'down', target: 21000, targetDate: far, entries: series(22300, 23350, 45) },
    { id: 'ex-k7', name: 'Lapsed members reactivated', stage: 'reactivated', pillar: 'borrowers', unit: '', dir: 'up', target: 400, targetDate: far, entries: series(62, 80, 8, 0, [190, 260]) },
    { id: 'ex-k8', name: 'Program attendance', stage: 'attendance', pillar: 'programs', unit: '', dir: 'up', target: 3200, targetDate: far, entries: series(2100, 2850, 160) },
    { id: 'ex-k9', name: 'Participants reporting more reading confidence', stage: 'outcome', pillar: 'programs', unit: '%', dir: 'up', target: 70, targetDate: far, entries: [{ month: m(-9), value: 58 }, { month: m(-6), value: 61 }, { month: m(-3), value: 64 }] },
    { id: 'ex-k10', name: 'Collection turnover (loans per item)', stage: 'turnover', pillar: 'collections', unit: 'x', dir: 'up', target: 3.05, targetDate: far, entries: series(2.71, 2.87, 0.02, 2) }
  ].map(ex);

  const segments = [
    { id: 'ex-g1', name: 'Picture books', audience: 'Children', format: 'Print', items: 9200, loans: 61000, fresh: 46, dead: 6 },
    { id: 'ex-g2', name: 'Junior fiction', audience: 'Children', format: 'Print', items: 11800, loans: 39500, fresh: 41, dead: 9 },
    { id: 'ex-g3', name: 'Junior non-fiction', audience: 'Children', format: 'Print', items: 8600, loans: 9800, fresh: 22, dead: 31 },
    { id: 'ex-g4', name: 'Young adult', audience: 'Teens', format: 'Print', items: 5200, loans: 7300, fresh: 48, dead: 12 },
    { id: 'ex-g5', name: 'Adult fiction', audience: 'Adults', format: 'Print', items: 24500, loans: 78000, fresh: 38, dead: 11 },
    { id: 'ex-g6', name: 'Adult non-fiction', audience: 'Adults', format: 'Print', items: 27800, loans: 36200, fresh: 24, dead: 27 },
    { id: 'ex-g7', name: 'Large print', audience: 'Adults', format: 'Print', items: 4100, loans: 15200, fresh: 35, dead: 8 },
    { id: 'ex-g8', name: 'Community languages', audience: 'All ages', format: 'Print', items: 3900, loans: 5100, fresh: 44, dead: 15, notes: 'Arabic, Mandarin, Vietnamese and Dari. Shelved at the back of Central.' },
    { id: 'ex-g9', name: 'DVDs and audiobooks', audience: 'All ages', format: 'Audio-visual', items: 6800, loans: 12900, fresh: 30, dead: 22 },
    { id: 'ex-g10', name: 'eBooks and eAudio', audience: 'All ages', format: 'Digital', items: 14500, loans: 68500, fresh: 62, dead: 4 }
  ].map(ex);

  const ms = (list) => list.map((x, i) => ({ id: 'm' + i, title: x[1], date: d(x[0]), done: !!x[2] }));
  const projects = [
    {
      id: 'ex-p1', code: 'BOR-001', name: 'Welcome Back: lapsed member win-back', type: 'Growth project', pillar: 'borrowers', status: 'Active', health: 'on', ownerId: 'ex-s1', start: d(-45), end: d(45), nextReview: d(11),
      outcomes: ['engagement', 'relevancy'], branches: ['Central', 'Northside'], stakeholderIds: ['ex-h1', 'ex-h5'], kpiIds: ['ex-k7', 'ex-k6', 'ex-k4'], budget: 4000, spent: 1850,
      objective: 'Reactivate 12% of the 2,400 members contacted who have not borrowed in 12 months within 90 days of first contact, with half of them borrowing again in the following 8 weeks.',
      need: 'More than half our members have lapsed. They chose the library once, and their reasons for leaving tell us what to fix.',
      audience: 'Members of Central and Northside with no loan or program booking in 12 months, grouped by what they used to borrow.',
      logic: { inputs: 'Lapsed-member export; staff time for messages and calls; replacement cards and a fines amnesty; welcome-back displays.', activities: 'Personal "we have missed you" messages with picks matched to past loans; phone follow-up; welcome-back tables run with the Friends; one question on why they stopped.', outputs: 'Messages sent, replies, cards renewed, reasons-for-lapsing tally.', short: 'Lapsed members borrow again within 30 days of contact.', long: 'Returned members become multi-monthly borrowers, and the lapse rate falls because the causes are fixed.' },
      milestones: ms([[-45, 'Lapsed-member list pulled and grouped', 1], [-31, 'Message and offer approved', 1], [-24, 'First wave sent', 1], [4, 'Second wave and phone follow-up'], [45, 'Review: reactivation rate and reasons for lapsing']]),
      raci: [{ id: 'r1', activity: 'Data export and grouping', r: 'ex-s4', a: 'ex-s1', c: 'Systems team', i: 'Director' }, { id: 'r2', activity: 'Message writing and approval', r: 'ex-s1', a: ME, c: 'Communications', i: 'Branch teams' }, { id: 'r3', activity: 'Branch welcome-back displays', r: 'ex-s1', a: 'ex-s1', c: 'Friends of the Library', i: '' }, { id: 'r4', activity: 'Phone follow-up', r: 'ex-s6', a: 'ex-s2', c: '', i: 'Priya' }, { id: 'r5', activity: 'Results reporting', r: 'ex-s1', a: ME, c: '', i: 'Director' }],
      risks: [{ id: 'k1', risk: 'Contact details are out of date', likelihood: 3, impact: 2, mitigation: 'Clean the list first; use text messages where email bounces.' }, { id: 'k2', risk: 'Privacy or consent complaint', likelihood: 1, impact: 3, mitigation: 'List checked against contact preferences before sending.' }, { id: 'k3', risk: 'Returned members lapse again', likelihood: 2, impact: 2, mitigation: 'Follow up at 4 and 8 weeks with a next-read suggestion.' }],
      allocations: [{ staffId: 'ex-s1', hours: 4, role: 'Lead' }, { staffId: 'ex-s6', hours: 3, role: 'Phone follow-up' }, { staffId: 'ex-s4', hours: 2, role: 'Data' }],
      reviews: [{ id: 'v1', date: d(-17), did: 'First wave of 1,200 messages sent. 190 members borrowed within three weeks.', learned: 'Picks matched to past loans got twice the response of the general message. Top reason for lapsing: did not know about eBooks.', next: 'Second wave leads with eBooks and holds. Add phone calls for members over 65.' }]
    },
    {
      id: 'ex-p2', code: 'BOR-002', name: 'Next Read: the borrowing habit', type: 'Growth project', pillar: 'borrowers', status: 'Planning', health: 'on', ownerId: 'ex-s2', start: d(10), end: d(130), nextReview: d(38),
      outcomes: ['engagement'], branches: ['Northside'], stakeholderIds: ['ex-h1'], kpiIds: ['ex-k4', 'ex-k5'], budget: 2500, spent: 0,
      objective: 'Move 15% of Northside\'s casual borrowers to borrowing in at least two of every three months within four months of launch.',
      need: 'Most members borrow a few times a year. The gap is habit, not awareness: each visit needs to set up the next one.',
      audience: 'Northside members who borrowed in the last 12 months but in fewer than four separate months.',
      logic: { inputs: 'Borrowing-frequency report; desk staff trained in readers\' advisory; next-read slips; a monthly reading challenge card.', activities: 'Recommend a next read at every checkout; place a hold before the borrower leaves; series-starter displays; reminder with picks three weeks after a visit.', outputs: 'Recommendations made, holds placed at checkout, challenge cards completed.', short: 'Casual borrowers return within four weeks of a visit.', long: 'A larger share of members borrow in several months of each quarter.' },
      milestones: ms([[10, 'Baseline: casual and multi-monthly counts by branch'], [24, 'Readers\' advisory refresher for desk staff'], [38, 'Next-read slips and challenge card launched'], [66, 'Mid-point check: return-within-four-weeks rate'], [130, 'Review: scale, adjust or stop']]),
      raci: [{ id: 'r1', activity: 'Baseline report', r: 'ex-s2', a: 'ex-s2', c: 'Daniel', i: '' }, { id: 'r2', activity: 'Staff training', r: 'ex-s6', a: '', c: '', i: '' }, { id: 'r3', activity: 'Challenge card design and print', r: '', a: '', c: '', i: '' }],
      risks: [{ id: 'k1', risk: 'Desk staff are too busy to recommend', likelihood: 3, impact: 2, mitigation: 'Script a 20-second version and trial it at one branch first.' }, { id: 'k2', risk: 'Popular titles are not available', likelihood: 2, impact: 2, mitigation: '' }],
      allocations: [{ staffId: 'ex-s2', hours: 5, role: 'Lead' }, { staffId: 'ex-s6', hours: 4, role: 'Desk training' }], reviews: []
    },
    {
      id: 'ex-p3', code: 'PRG-001', name: 'Little Readers: storytime kits for families', type: 'Community program', pillar: 'programs', status: 'Active', health: 'risk', ownerId: 'ex-s3', start: d(-60), end: d(66), nextReview: d(-2),
      outcomes: ['literacy', 'engagement'], branches: ['Central', 'Riverside'], stakeholderIds: ['ex-h3', 'ex-h4'], kpiIds: ['ex-k8', 'ex-k9'], budget: 6000, spent: 3900,
      literacy: 'Early literacy (0 to 5)', collectionTie: 'Picture books and board books, bundled as take-home kits with a parent guide in four languages.',
      objective: 'Run a 10-week storytime program for 60 families in which at least 70% of parents report reading with their child more often, and half borrow a kit every week.',
      need: 'One in four children in Riverside starts school without the early reading skills their classmates have. Many parents are new to English.',
      audience: 'Families with children under five in Riverside and central suburbs, reached through the school and the Migrant Resource Centre.',
      logic: { inputs: 'Children\'s librarian and outreach officer; 120 storytime kits; parent guides in four languages; partner referrals; start and end survey.', activities: 'Weekly storytime; a kit goes home each week; parents shown one reading technique per session; survey in weeks 1 and 10.', outputs: 'Sessions held, families attending, kits borrowed, surveys returned.', short: 'Parents read with their child more often and borrow kits weekly.', long: 'Children start school ready to read, and families keep using the library.' },
      milestones: ms([[-60, 'Need and outcome agreed with partners', 1], [-39, 'Sessions designed and kits assembled', 1], [-18, 'First session', 1], [-6, 'Parent guides translated and in every kit'], [45, 'Final session and outcome survey'], [66, 'Evaluation shared with partners']]),
      raci: [{ id: 'r1', activity: 'Program design', r: 'ex-s3', a: 'ex-s3', c: 'Principal', i: '' }, { id: 'r2', activity: 'Partner liaison', r: 'ex-s7', a: 'ex-s3', c: '', i: '' }, { id: 'r3', activity: 'Kit selection and assembly', r: 'ex-s5', a: 'ex-s4', c: '', i: '' }, { id: 'r4', activity: 'Session delivery', r: 'ex-s5', a: 'ex-s3', c: '', i: '' }, { id: 'r5', activity: 'Outcome evaluation', r: 'ex-s3', a: ME, c: 'Grants officer', i: 'Director' }],
      risks: [{ id: 'k1', risk: 'Translated parent guides arrive too late to matter', likelihood: 3, impact: 3, mitigation: 'Use the Migrant Resource Centre\'s volunteer translators for two languages now.' }, { id: 'k2', risk: 'Outcomes are not measured', likelihood: 2, impact: 3, mitigation: 'Survey built into sessions 1 and 10.' }],
      allocations: [{ staffId: 'ex-s3', hours: 8, role: 'Lead' }, { staffId: 'ex-s5', hours: 6, role: 'Delivery' }, { staffId: 'ex-s7', hours: 5, role: 'Partners' }],
      reviews: [{ id: 'v1', date: d(-30), did: 'Three sessions run. 52 families enrolled; 38 attend each week.', learned: 'Families without the translated guide borrow kits half as often.', next: 'Chase translations; ask the school to remind enrolled families.' }]
    },
    {
      id: 'ex-p4', code: 'COL-001', name: 'Adult non-fiction: weed and refresh', type: 'Collection initiative', pillar: 'collections', status: 'Active', health: 'on', ownerId: 'ex-s4', start: d(-20), end: d(130), nextReview: d(8),
      outcomes: ['relevancy', 'engagement'], branches: ['Central', 'Northside', 'Riverside', 'Hillcrest'], stakeholderIds: ['ex-h5'], kpiIds: ['ex-k10'], budget: 18000, spent: 2400,
      collectionTie: 'Adult non-fiction (27,800 items, 36,200 loans in 12 months, relative use 0.45).',
      objective: 'Lift turnover of adult non-fiction from 1.30 to 1.65 loans per item within five months by weeding dead stock, buying to demand and displaying what remains.',
      need: 'Shelves crowded with unused stock hide the titles people want. A smaller, fresher, better-displayed collection is borrowed more.',
      audience: 'Adult borrowers. Requests and holds show demand for cooking, health, personal finance and local history.',
      logic: { inputs: 'Usage and age report; community profile; selection budget; shelf space for face-out display.', activities: 'Weed using MUSTIE criteria; buy to holds and requests; move copies to branches where they are borrowed; themed face-out displays.', outputs: 'Items weeded, items added, displays refreshed.', short: 'Turnover and relative use improve.', long: 'Adults find current, useful non-fiction on the shelf and borrow more often.' },
      milestones: ms([[-20, 'Usage and age report run', 1], [-6, 'Weeding list approved'], [15, 'Weeding done and orders placed'], [36, 'New stock shelved and displayed'], [130, 'Review: turnover against the baseline']]),
      raci: [{ id: 'r1', activity: 'Usage reporting', r: 'ex-s8', a: 'ex-s4', c: '', i: '' }, { id: 'r2', activity: 'Weeding decisions', r: 'ex-s4', a: 'ex-s4', c: 'Branch managers', i: 'Friends of the Library' }, { id: 'r3', activity: 'Selection and ordering', r: 'ex-s8', a: 'ex-s4', c: '', i: '' }, { id: 'r4', activity: 'Display and merchandising', r: 'ex-s1', a: 'ex-s4', c: '', i: '' }],
      risks: [{ id: 'k1', risk: 'Community concern about discarded books', likelihood: 2, impact: 2, mitigation: 'Publish the weeding criteria; withdrawn stock goes to the Friends\' book sale.' }],
      allocations: [{ staffId: 'ex-s4', hours: 6, role: 'Lead' }, { staffId: 'ex-s8', hours: 8, role: 'Reports and ordering' }], reviews: []
    },
    {
      id: 'ex-p5', code: 'MEM-001', name: 'School card drive', type: 'Growth project', pillar: 'members', status: 'Idea', health: 'on', ownerId: '', start: d(60), end: d(160),
      outcomes: ['engagement', 'literacy'], branches: [], stakeholderIds: ['ex-h3'], kpiIds: ['ex-k2', 'ex-k1'],
      objective: 'Sign up 600 students and family members through four schools, with at least 60% borrowing within 30 days of joining.',
      need: 'Fewer than half of Northside households hold a card.', audience: 'Primary school students and their families.',
      logic: { inputs: '', activities: '', outputs: '', short: '', long: '' }, milestones: [], raci: [], risks: [], allocations: [], reviews: []
    }
  ].map(ex);

  const tasks = [
    { id: 'ex-t1', title: 'Send the Next Read plan to the director', due: d(3), status: 'todo', important: true, assigneeId: ME, projectId: 'ex-p2', stakeholderId: 'ex-h1' },
    { id: 'ex-t2', title: 'Approve the welcome-back second-wave message', due: d(-1), status: 'todo', important: true, assigneeId: ME, projectId: 'ex-p1' },
    { id: 'ex-t3', title: 'Prepare the quarterly council report', due: d(12), status: 'doing', important: true, assigneeId: ME },
    { id: 'ex-t4', title: 'Sign off roster changes for next month', due: d(1), status: 'todo', important: false, assigneeId: ME },
    { id: 'ex-t5', title: 'Review the supplier standing-order profile', status: 'todo', important: false, assigneeId: ME },
    { id: 'ex-t6', title: 'Call Cr. Bell about pop-up library funding', due: d(6), status: 'todo', important: true, assigneeId: ME, stakeholderId: 'ex-h2' },
    { id: 'ex-t7', title: 'Phone follow-up with 120 lapsed members over 65', due: d(9), followUp: d(2), status: 'doing', important: true, assigneeId: 'ex-s6', level: 2, projectId: 'ex-p1' },
    { id: 'ex-t8', title: 'Confirm storytime kit translations with the Migrant Resource Centre', due: d(-3), followUp: d(-4), status: 'todo', important: true, assigneeId: 'ex-s3', level: 4, projectId: 'ex-p3', stakeholderId: 'ex-h4' },
    { id: 'ex-t9', title: 'Run the usage and age report for adult non-fiction', due: d(-12), status: 'done', doneAt: d(-13), important: true, assigneeId: 'ex-s8', level: 1, projectId: 'ex-p4' },
    { id: 'ex-t10', title: 'Weeding list for the 300s and 600s ready for review', due: d(5), followUp: d(5), status: 'todo', important: true, assigneeId: 'ex-s4', level: 3, projectId: 'ex-p4' },
    { id: 'ex-t11', title: 'Baseline: casual and multi-monthly borrowers by branch', due: d(14), followUp: d(7), status: 'todo', important: true, assigneeId: 'ex-s2', level: 3, projectId: 'ex-p2' },
    { id: 'ex-t12', title: 'Set up the welcome-back display at Central', due: d(-22), status: 'done', doneAt: d(-20), assigneeId: 'ex-s1', level: 5, projectId: 'ex-p1' },
    { id: 'ex-t13', title: 'Agree the win-back offer with the director', due: d(-32), status: 'done', doneAt: d(-30), important: true, assigneeId: ME, projectId: 'ex-p1' }
  ].map(ex);

  const events = [
    { id: 'ex-e1', title: 'Branch managers meeting', type: 'Meeting', date: d(2), time: '9:30 to 11:00' },
    { id: 'ex-e2', title: 'Little Readers session 6', type: 'Program session', date: d(4), time: '10:30', projectId: 'ex-p3' },
    { id: 'ex-e3', title: 'Site visit: Hillcrest', type: 'Site visit', date: d(8), time: '14:00' },
    { id: 'ex-e4', title: 'Little Readers session 7', type: 'Program session', date: d(11), time: '10:30', projectId: 'ex-p3' },
    { id: 'ex-e5', title: 'Community services committee', type: 'Council or board', date: d(16), time: '18:00' },
    { id: 'ex-e6', title: 'Friends of the Library book sale', type: 'Other', date: d(20), endDate: d(21) },
    { id: 'ex-e7', title: 'Budget submission due', type: 'Deadline', date: d(25) },
    { id: 'ex-e8', title: 'Annual leave', type: 'Leave', date: d(38), endDate: d(44) }
  ].map(ex);

  return { branches: ['Central', 'Northside', 'Riverside', 'Hillcrest'], staff, stakeholders, projects, tasks, events, kpis, segments };
}
if (typeof module !== 'undefined' && module.exports) module.exports = build;
else root.RLD_EXAMPLES = build;
})(typeof window !== 'undefined' ? window : this);
