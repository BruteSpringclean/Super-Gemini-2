# Regional Library Desk

A browser workspace for a regional library manager: growth projects, people, stakeholders,
tasks, calendars, collections and reports in one place. It is separate from the Super Gemini
Librarian in the rest of this repository and shares no code with it.

## What it does

| Section | Use it to |
|---|---|
| Today | See what is overdue or off track, the next seven days, and projects in flight. |
| Growth plan | Track measures by pillar (membership, borrowing habit, programs, collections), the borrower ladder from lapsed to casual to multi-monthly, and which outcomes active projects serve. |
| Projects | Start from a playbook (lapsed member win-back, casual to regular, new member drive, community program, collection refresh, pop-up library) and run each project against ten management checks: SMART objective, single owner, logic model, stakeholders, RACI, capacity, milestones, risks, plan-do-check-act reviews, delegation. |
| Tasks | Keep your own list, delegate with a level of authority and a follow-up date, and sort by urgent and important. |
| Calendar | Month view, project timeline and agenda of every dated item. |
| People | Staff profiles, workloads, one-to-one notes and an org chart drawn from reporting lines. |
| Stakeholders | Influence and interest map, contact rhythm and contact log. |
| Collections | Turnover and relative use per collection, a reading of each one, and recommended moves tagged by outcome. |
| Resources | Staff hours and budget by growth pillar, capacity per person, budget per project. |
| Reports | Monthly regional report, growth scorecard, project status report, one-to-one brief and stakeholder briefing, built from the data above. |

## Running it

Open `index.html` in a browser, or serve this folder from any static web host. There is no
build step and no server.

- Opened this way, data is saved in that browser on that device. Use **Settings and data** to
  save a backup file or restore one.
- `desk.html` is the same app in the form published as a Claude artifact. There, data is saved
  to the owner's Claude account, and reports can ask Claude to draft a summary.
- **Load example data** fills the desk with a made-up region. Every example record is tagged
  and can be removed in one step.

## Files

| File | Holds |
|---|---|
| `index.html` | Stand-alone page. |
| `desk.html` | Page body for the published artifact. |
| `styles.css` | All styling, light and dark. |
| `js/core.js` | Storage, modals, forms, shared utilities. |
| `js/data.js` | Pillars, playbooks, management checks, measures, calendar feed, shared UI parts. |
| `js/views-a.js` | Today, Growth plan, Projects. |
| `js/views-b.js` | Tasks, Calendar, People, Stakeholders. |
| `js/views-c.js` | Collections, Resources, Reports. |
| `js/app.js` | Navigation, settings, backup, start-up. |
| `examples.js` | Example data, loaded only on request. |
