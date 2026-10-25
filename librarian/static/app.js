"use strict";

const PRESET_MIME = "application/x-sgl-preset";
const SLOT_MIME = "application/x-sgl-slot";
const KIND_MIME = "application/x-sgl-kind-"; // + "patch" | "performance", so dragover can check the type
const KIND_EXT = { patch: ".usg", performance: ".xsg" };
const KIND_NAME = { patch: "patch", performance: "performance" };

let state = null;
let lastStateJson = "";
const staged = new Map(); // "bank|slot" -> {bank, slot, presetId|null}
let selected = null;      // {type: "preset", id} | {type: "slot", bank, slot}
let activeSection = 0;
const activeTags = new Set();
let favoritesOnly = false;
let kindFilter = "all"; // "all" | "patch" | "performance"

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const key = (bank, slot) => `${bank}|${slot}`;

// ------------------------------------------------------------------ api

async function api(method, path, body, headers = {}) {
  const opts = { method, headers: { ...headers } };
  if (body instanceof Blob || body instanceof ArrayBuffer) {
    opts.body = body;
  } else if (body !== undefined) {
    opts.body = JSON.stringify(body);
    opts.headers["Content-Type"] = "application/json";
  }
  const res = await fetch("/api/" + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function refresh(force = false) {
  try {
    const next = await api("GET", "state");
    const json = JSON.stringify(next);
    if (!force && json === lastStateJson) return;
    lastStateJson = json;
    state = next;
    pruneStaged();
    render(force);
  } catch (e) {
    $("deviceStatus").textContent = "Librarian app is not running. Start it again from the launcher.";
    $("deviceStatus").className = "device-status off";
  }
}

function toast(msg, isError = false, ms = 5000) {
  const t = $("toast");
  t.textContent = msg;
  t.className = "toast" + (isError ? " error" : "");
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), ms);
}

async function run(fn) {
  try {
    return await fn();
  } catch (e) {
    toast(e.message, true, 8000);
  }
}

// ------------------------------------------------------------------ helpers

const presetById = (id) => state.library.find((p) => p.id === id);

const kindOfFile = (name) => Object.keys(KIND_EXT).find((k) => name.toLowerCase().endsWith(KIND_EXT[k])) || null;

function wrongKindMessage(name, kind) {
  return kind === "performance"
    ? `“${name}” is a performance (.xsg). Performances can only go into the Performances A/B folders.`
    : `“${name}” is a patch (.usg). Patches can only go into the patch banks, not the Performances folders.`;
}

async function toggleFavorite(id) {
  const p = presetById(id);
  if (!p) return;
  await run(async () => {
    await api("PATCH", "library/" + id, { favorite: !p.favorite });
    await refresh(true);
  });
}

function findSlot(bank, slot) {
  for (const s of state.device.sections) {
    for (const b of s.banks) if (b.path === bank) return { section: s, bank: b, slot: b.slots[slot - 1] };
  }
  return null;
}

function pruneStaged() {
  // Drop staged changes whose bank vanished (e.g. drive unplugged).
  for (const [k, ch] of staged) {
    if (!state.device.connected || !findSlot(ch.bank, ch.slot)) staged.delete(k);
    else if (ch.presetId && !presetById(ch.presetId)) staged.delete(k);
  }
}

function stage(bank, slot, presetId) {
  const current = findSlot(bank, slot);
  if (!current) return;
  const already = current.slot.hash && current.slot.hash === presetId;
  const alreadyEmpty = !current.slot.file && !presetId;
  if (already || alreadyEmpty) staged.delete(key(bank, slot));
  else staged.set(key(bank, slot), { bank, slot, presetId });
}

function filteredLibrary() {
  const q = $("search").value.trim().toLowerCase();
  return state.library.filter((p) => {
    if (favoritesOnly && !p.favorite) return false;
    if (kindFilter !== "all" && p.kind !== kindFilter) return false;
    for (const t of activeTags) if (!p.tags.includes(t)) return false;
    if (!q) return true;
    return [p.name, p.notes, p.kind, ...p.tags].join(" ").toLowerCase().includes(q);
  }).sort((a, b) => (b.favorite - a.favorite) || a.name.localeCompare(b.name));
}

// ------------------------------------------------------------------ render

function render(force = true) {
  renderStatus();
  renderTags();
  renderLibrary();
  renderDevice();
  renderPending();
  // background polls must not wipe out what you are typing in the details panel
  if (force || !$("details").contains(document.activeElement)) renderDetails();
}

function renderStatus() {
  const d = state.device;
  const el = $("deviceStatus");
  if (d.connected) {
    const banks = d.sections.reduce((n, s) => n + s.banks.length, 0);
    el.textContent = `Synth connected at ${d.path} · ${banks} banks found`;
    el.className = "device-status on";
  } else {
    el.textContent = "Synth not connected";
    el.className = "device-status off";
  }
  document.querySelectorAll(".needs-device").forEach((b) => (b.disabled = !d.connected));
}

function renderTags() {
  const box = $("tagFilter");
  const kinds = [["all", "All"], ["patch", "Patches"], ["performance", "Performances"]];
  let html = `<span class="kind-filter">${kinds.map(([k, label]) =>
    `<button class="${kindFilter === k ? "active" : ""}" data-kind="${k}">${label}</button>`).join("")}</span>`;
  html += `<span class="tag ${favoritesOnly ? "active" : ""}" data-fav="1">★ favourites</span>`;
  for (const t of state.tags) {
    html += `<span class="tag ${activeTags.has(t) ? "active" : ""}" data-tag="${esc(t)}">${esc(t)}</span>`;
  }
  for (const t of [...activeTags]) if (!state.tags.includes(t)) activeTags.delete(t);
  box.innerHTML = html;
}

function renderLibrary() {
  const list = filteredLibrary();
  $("libCount").textContent = `${list.length}/${state.library.length}`;
  const ul = $("presetList");
  if (!state.library.length) {
    ul.innerHTML = `<li class="empty">Your library is empty.<br>Drop preset files above, or connect the synth and choose “Import all from synth”.</li>`;
    return;
  }
  if (!list.length) {
    ul.innerHTML = `<li class="empty">No presets match.</li>`;
    return;
  }
  ul.innerHTML = list.map((p) => `
    <li class="preset ${selected?.type === "preset" && selected.id === p.id ? "selected" : ""}" draggable="true" data-id="${p.id}" data-kind="${p.kind}">
      <button class="fav ${p.favorite ? "on" : ""}" data-fav-id="${p.id}" title="${p.favorite ? "Remove from favourites" : "Add to favourites"}">${p.favorite ? "★" : "☆"}</button>
      <div class="body">
        <div class="name">${esc(p.name)}</div>
        <div class="meta"><span class="kind ${p.kind}">${p.kind === "performance" ? "perf" : "patch"}</span>${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </li>`).join("");
}

function renderDevice() {
  const d = state.device;
  $("deviceHelp").hidden = d.connected && d.sections.length > 0;
  if (d.connected && !d.sections.length) {
    $("deviceHelp").innerHTML = `<h3>No bank folders found on ${esc(d.path)}</h3>
      <p>The drive is mounted but no folders like <code>a1</code>…<code>h2</code> with <code>p1_…</code> files were found.
      Make sure you held PATCH while switching on, or set the drive location in ⚙ Settings.</p>`;
  }
  if (activeSection >= d.sections.length) activeSection = 0;
  // patches and performances get separate groups of tabs
  let tabs = "";
  for (const kind of ["patch", "performance"]) {
    const group = d.sections.map((s, i) => [s, i]).filter(([s]) => s.kind === kind);
    if (!group.length) continue;
    tabs += `<span class="tab-group ${kind}"><span class="tab-group-label">${kind === "patch" ? "Patches" : "Performances"}</span>` +
      group.map(([s, i]) => `<button class="${i === activeSection ? "active" : ""}" data-section="${i}" title="${esc(s.path)}">${esc(s.name.replace(/^(Patches|Performances) /, ""))}</button>`).join("") +
      `</span>`;
  }
  $("sectionTabs").innerHTML = tabs;
  const section = d.sections[activeSection];
  if (!section) {
    $("banks").innerHTML = "";
    return;
  }
  let html = "";
  let lastRow = null;
  for (const b of section.banks) {
    const row = b.name.slice(-1);
    if (lastRow !== null && row !== lastRow) html += `<div class="bank-group-gap"></div>`;
    lastRow = row;
    html += `<div class="bank"><div class="bank-label" title="${esc(b.path)}">${esc(b.name)}</div>`;
    for (const s of b.slots) html += slotHtml(b, s, section.kind);
    html += `</div>`;
  }
  $("banks").innerHTML = html;
  $("banks").className = "banks " + section.kind;
}

function slotHtml(bank, s, kind) {
  const pending = staged.get(key(bank.path, s.slot));
  let name = s.name;
  let classes = ["slot"];
  let inLib = !!s.presetId;
  if (pending) {
    classes.push("staged");
    const p = pending.presetId && presetById(pending.presetId);
    name = p ? p.name : null;
    inLib = !!p;
  }
  if (!name) classes.push("empty-slot");
  if (inLib) classes.push("inlib");
  if (!pending && s.conflicts && s.conflicts.length) classes.push("conflict");
  if (selected?.type === "slot" && selected.bank === bank.path && selected.slot === s.slot) classes.push("selected");
  const draggable = name ? "true" : "false";
  const title = pending ? "Staged change" : (s.file || "Empty slot");
  return `<div class="${classes.join(" ")}" draggable="${draggable}" data-bank="${esc(bank.path)}" data-slot="${s.slot}" data-kind="${kind}" title="${esc(title)}">
    <span class="num">${esc(bank.name)}·${s.slot}</span><span class="badge"></span>
    <span class="sname">${name ? esc(name) : "empty"}</span></div>`;
}

function renderPending() {
  const n = staged.size;
  $("pendingBar").hidden = n === 0;
  if (n) {
    const kinds = new Set([...staged.values()].map((ch) => findSlot(ch.bank, ch.slot)?.section.kind));
    const backedUp = [...kinds].filter((k) => state.settings.backup[k]);
    const note = backedUp.length ? ` Changed ${backedUp.map((k) => k === "patch" ? "patch" : "performance").join(" and ")} banks are backed up first.` : " No backup will be made (see ⚙ Settings).";
    $("pendingText").innerHTML = `<b>${n}</b> slot${n === 1 ? "" : "s"} staged. Nothing changes on the synth until you send.${esc(note)}`;
  }
}

function renderDetails() {
  const box = $("details");
  if (!selected) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  if (selected.type === "preset") {
    const p = presetById(selected.id);
    if (!p) { selected = null; box.hidden = true; return; }
    box.innerHTML = `
      <h3>Preset</h3>
      <label>Name</label><input id="dName" value="${esc(p.name)}" maxlength="60">
      <label>Type</label>
      <div>${p.kind === "performance" ? "Performance (.xsg) — goes into Performances A/B" : "Patch (.usg) — goes into the patch banks"}</div>
      <label>Tags</label>
      <div class="tag-editor">${p.tags.map((t) => `<span class="tag">${esc(t)} <span class="x" data-remove-tag="${esc(t)}">×</span></span>`).join("")}</div>
      <input id="dTag" placeholder="Add tag and press Enter (e.g. pad, bass, lead)" list="tagList">
      <datalist id="tagList">${state.tags.map((t) => `<option value="${esc(t)}">`).join("")}</datalist>
      <label>Notes</label><textarea id="dNotes" placeholder="Mod wheel opens filter…">${esc(p.notes)}</textarea>
      <div class="row">
        <button id="dFav">${p.favorite ? "★ Unfavourite" : "☆ Favourite"}</button>
        <a href="/api/library/${p.id}/download"><button>Export file</button></a>
        <button id="dDelete" class="danger">Delete</button>
      </div>
      <div class="info">Drag this preset onto a slot to stage it.<br>
        Added ${esc(p.added)} · ${p.size} bytes<br>From: ${esc(p.source)}<br>ID: ${p.id}</div>`;
    return;
  }
  const found = findSlot(selected.bank, selected.slot);
  if (!found) { selected = null; box.hidden = true; return; }
  const { bank, slot } = found;
  const pending = staged.get(key(bank.path, slot.slot));
  const pendingPreset = pending?.presetId && presetById(pending.presetId);
  const libPreset = slot.presetId && presetById(slot.presetId);
  box.innerHTML = `
    <h3>Slot ${esc(bank.name)} · ${slot.slot}</h3>
    <div class="info">
      On synth now: <b>${slot.file ? esc(slot.name) : "empty"}</b><br>
      ${slot.file ? `File: ${esc(bank.path)}/${esc(slot.file)}<br>` : ""}
      ${slot.file ? (slot.presetId ? "In your library ✓" : "Not in your library yet") : ""}
      ${slot.conflicts?.length ? `<br>⚠ Extra files for this slot: ${slot.conflicts.map(esc).join(", ")}. Writing to this slot replaces them all.` : ""}
    </div>
    ${pending ? `<div class="info">Staged: <b>${pendingPreset ? esc(pendingPreset.name) : "clear slot"}</b></div>` : ""}
    <div class="row">
      ${slot.file ? `<button id="sFav">${libPreset?.favorite ? "★ Unfavourite" : "☆ Favourite"}</button>` : ""}
      ${slot.file && !slot.presetId ? `<button id="sSave">Save to library</button>` : ""}
      ${slot.presetId ? `<button id="sShow">Show in library</button>` : ""}
      ${pending ? `<button id="sUnstage">Undo staged change</button>` : ""}
      ${slot.file && !(pending && !pending.presetId) ? `<button id="sClear" class="danger">Clear slot</button>` : ""}
    </div>
    <div class="info">Tip: drag presets from the library onto slots, drag slots onto other slots to copy them, or drop preset files from Finder straight onto a slot.</div>`;
}

// ------------------------------------------------------------------ files

async function filesFromDataTransfer(dt) {
  // Supports dropping folders (e.g. a downloaded patch pack) as well as files.
  const items = [...(dt.items || [])].filter((i) => i.kind === "file");
  const entries = items.map((i) => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
  if (!entries.length) return [...dt.files].map((f) => ({ file: f, folder: null }));
  const out = [];
  async function walk(entry, topFolder) {
    if (entry.isFile) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      out.push({ file, folder: topFolder });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((res, rej) => reader.readEntries(res, rej));
        for (const e of batch) await walk(e, topFolder || entry.name);
      } while (batch.length);
    }
  }
  for (const e of entries) await walk(e, null);
  return out;
}

// Only Super Gemini patches (.usg) and performances (.xsg) are accepted;
// anything else could confuse the synth.
function isPresetFile(name) {
  return !name.startsWith(".") && kindOfFile(name) !== null;
}

async function uploadFiles(items) {
  const presets = [];
  let created = 0, skipped = 0;
  // keep p1..p8 order inside folders so a dropped bank lands in order
  items.sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true }));
  for (const { file, folder } of items) {
    if (!isPresetFile(file.name)) { skipped++; continue; }
    const headers = { "X-Filename": encodeURIComponent(file.name) };
    if (folder) headers["X-Tags"] = encodeURIComponent(folder);
    const res = await api("POST", "library/upload", file, headers);
    presets.push(res.preset);
    if (res.created) created++;
  }
  const dupes = presets.length - created;
  const skippedMsg = skipped ? `Skipped ${skipped} file(s) that aren't Super Gemini patches (.usg) or performances (.xsg).` : "";
  if (!presets.length && skipped) toast(skippedMsg, true, 8000);
  else toast(`Added ${created} preset${created === 1 ? "" : "s"} to the library` +
    (dupes ? ` (${dupes} already there)` : "") + "." + (skippedMsg ? " " + skippedMsg : ""), !!skipped, skipped ? 8000 : 5000);
  await refresh(true);
  return presets;
}

// ------------------------------------------------------------------ drag & drop

function setupDropTarget(el, { onPreset, onSlot, onFiles, over }) {
  el.addEventListener("dragover", (e) => {
    const target = over ? over(e) : el;
    if (!target) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    document.querySelectorAll(".drag-over").forEach((n) => n !== target && n.classList.remove("drag-over"));
    target.classList.add("drag-over");
  });
  el.addEventListener("dragleave", (e) => {
    if (!el.contains(e.relatedTarget)) document.querySelectorAll(".drag-over").forEach((n) => n.classList.remove("drag-over"));
  });
  el.addEventListener("drop", async (e) => {
    const target = over ? over(e) : el;
    document.querySelectorAll(".drag-over").forEach((n) => n.classList.remove("drag-over"));
    if (!target) return;
    e.preventDefault();
    const dt = e.dataTransfer;
    const presetId = dt.getData(PRESET_MIME);
    const slotData = dt.getData(SLOT_MIME);
    await run(async () => {
      if (presetId && onPreset) return onPreset(presetId, target);
      if (slotData && onSlot) return onSlot(JSON.parse(slotData), target);
      if (dt.files && dt.files.length && onFiles) return onFiles(await filesFromDataTransfer(dt), target);
    });
  });
}

async function ensureSlotInLibrary(bank, slotNum) {
  const found = findSlot(bank, slotNum);
  if (!found || !found.slot.file) throw new Error("That slot is empty");
  if (!found.slot.presetId) {
    await api("POST", "device/import", { bank, slot: slotNum });
    await refresh(true);
  }
  return found.slot.hash;
}

function slotPresetId(src) {
  // A slot being dragged may itself carry a staged (not yet written) preset.
  const pending = staged.get(key(src.bank, src.slot));
  if (pending) return pending.presetId ? Promise.resolve(pending.presetId) : Promise.reject(new Error("That slot is staged to be cleared"));
  return ensureSlotInLibrary(src.bank, src.slot);
}

function setupDnD() {
  // library list items and slots are drag sources
  document.addEventListener("dragstart", (e) => {
    const preset = e.target.closest?.(".preset");
    const slot = e.target.closest?.(".slot");
    if (preset) {
      e.dataTransfer.setData(PRESET_MIME, preset.dataset.id);
      e.dataTransfer.setData(KIND_MIME + preset.dataset.kind, "1");
      e.dataTransfer.effectAllowed = "copy";
    } else if (slot) {
      e.dataTransfer.setData(SLOT_MIME, JSON.stringify({ bank: slot.dataset.bank, slot: +slot.dataset.slot, kind: slot.dataset.kind }));
      e.dataTransfer.setData(KIND_MIME + slot.dataset.kind, "1");
      e.dataTransfer.effectAllowed = "copy";
    }
  });

  // library panel accepts files and slots
  setupDropTarget($("libraryPanel"), {
    over: () => $("libDrop"),
    onSlot: async (src) => {
      const pending = staged.get(key(src.bank, src.slot));
      if (pending) throw new Error("That slot has a staged change. Send it to the synth first.");
      const res = await api("POST", "device/import", { bank: src.bank, slot: src.slot });
      toast(res.added ? "Saved slot to library" : "That preset is already in your library");
      await refresh(true);
    },
    onFiles: (items) => uploadFiles(items),
  });

  // slots accept presets, other slots and files of the matching type only
  const slotFromEvent = (e) => {
    const el = e.target.closest?.(".slot");
    if (!el) return null;
    const dragged = [...e.dataTransfer.types].find((t) => t.startsWith(KIND_MIME));
    if (dragged && dragged !== KIND_MIME + el.dataset.kind) return null; // wrong type: refuse the drop
    return el;
  };
  setupDropTarget($("banks"), {
    over: slotFromEvent,
    onPreset: (id, el) => {
      const p = presetById(id);
      if (p.kind !== el.dataset.kind) throw new Error(wrongKindMessage(p.name, p.kind));
      stage(el.dataset.bank, +el.dataset.slot, id);
      selected = { type: "slot", bank: el.dataset.bank, slot: +el.dataset.slot };
      render();
    },
    onSlot: async (src, el) => {
      if (src.bank === el.dataset.bank && src.slot === +el.dataset.slot) return;
      if (src.kind !== el.dataset.kind) throw new Error(wrongKindMessage(`slot ${src.slot}`, src.kind));
      const id = await slotPresetId(src);
      stage(el.dataset.bank, +el.dataset.slot, id);
      render();
    },
    onFiles: async (items, el) => {
      const kind = el.dataset.kind;
      const wrong = items.filter(({ file }) => kindOfFile(file.name) && kindOfFile(file.name) !== kind);
      items = items.filter((it) => !wrong.includes(it));
      if (wrong.length && !items.length) throw new Error(wrongKindMessage(wrong[0].file.name, kindOfFile(wrong[0].file.name)));
      const presets = await uploadFiles(items);
      if (wrong.length) toast(`${wrong.length} ${kind === "patch" ? "performance (.xsg)" : "patch (.usg)"} file(s) were left out — they don't belong in this folder.`, true, 8000);
      const bank = el.dataset.bank;
      let slot = +el.dataset.slot;
      // several files fill consecutive slots in the bank
      for (const p of presets) {
        if (slot > 8) break;
        stage(bank, slot++, p.id);
      }
      if (presets.length > 9 - +el.dataset.slot) toast(`Only ${9 - +el.dataset.slot} slot(s) left in this bank — the rest went to the library only.`);
      render();
    },
  });
}

// ------------------------------------------------------------------ events

async function savePreset(changes) {
  if (selected?.type !== "preset") return;
  await run(async () => {
    await api("PATCH", "library/" + selected.id, changes);
    await refresh(true);
  });
}

function setupEvents() {
  $("search").addEventListener("input", renderLibrary);

  $("tagFilter").addEventListener("click", (e) => {
    const t = e.target.closest(".tag, button[data-kind]");
    if (!t) return;
    const kb = e.target.closest("button[data-kind]");
    if (kb) {
      kindFilter = kb.dataset.kind;
      renderTags();
      renderLibrary();
      return;
    }
    if (t.dataset.fav) favoritesOnly = !favoritesOnly;
    else if (activeTags.has(t.dataset.tag)) activeTags.delete(t.dataset.tag);
    else activeTags.add(t.dataset.tag);
    renderTags();
    renderLibrary();
  });

  $("presetList").addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav-id]");
    if (fav) return toggleFavorite(fav.dataset.favId);
    const li = e.target.closest(".preset");
    if (!li) return;
    selected = { type: "preset", id: li.dataset.id };
    render();
  });

  $("sectionTabs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    activeSection = +b.dataset.section;
    renderDevice();
  });

  $("banks").addEventListener("click", (e) => {
    const s = e.target.closest(".slot");
    if (!s) return;
    selected = { type: "slot", bank: s.dataset.bank, slot: +s.dataset.slot };
    render();
  });

  $("details").addEventListener("change", (e) => {
    if (e.target.id === "dName") savePreset({ name: e.target.value });
    if (e.target.id === "dNotes") savePreset({ notes: e.target.value });
  });

  $("details").addEventListener("keydown", (e) => {
    if (e.target.id === "dTag" && e.key === "Enter") {
      e.preventDefault();
      const p = presetById(selected.id);
      const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
      if (tags.length) savePreset({ tags: [...p.tags, ...tags] }).then(() => $("dTag")?.focus());
    }
  });

  $("details").addEventListener("click", async (e) => {
    const id = e.target.id;
    if (e.target.dataset.removeTag) {
      const p = presetById(selected.id);
      return savePreset({ tags: p.tags.filter((t) => t !== e.target.dataset.removeTag) });
    }
    if (id === "dFav") return savePreset({ favorite: !presetById(selected.id).favorite });
    if (id === "dDelete") {
      const p = presetById(selected.id);
      if (!confirm(`Delete “${p.name}” from your library?\n(This does not touch the synth.)`)) return;
      await run(async () => {
        await api("DELETE", "library/" + p.id);
        selected = null;
        await refresh(true);
      });
    }
    if (id === "sFav") {
      await run(async () => {
        const pid = await ensureSlotInLibrary(selected.bank, selected.slot);
        await toggleFavorite(pid);
      });
    }
    if (id === "sSave") {
      await run(async () => {
        await ensureSlotInLibrary(selected.bank, selected.slot);
        toast("Saved to library");
      });
    }
    if (id === "sShow") {
      const { slot } = findSlot(selected.bank, selected.slot);
      selected = { type: "preset", id: slot.presetId };
      render();
      document.querySelector(`.preset[data-id="${slot.presetId}"]`)?.scrollIntoView({ block: "center" });
    }
    if (id === "sUnstage") {
      staged.delete(key(selected.bank, selected.slot));
      render();
    }
    if (id === "sClear") {
      stage(selected.bank, selected.slot, null);
      render();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if ((e.key === "Backspace" || e.key === "Delete") && selected?.type === "slot") {
      stage(selected.bank, selected.slot, null);
      render();
    }
    if (e.key === "Escape") {
      selected = null;
      render();
    }
  });

  $("fileInput").addEventListener("change", async (e) => {
    await run(() => uploadFiles([...e.target.files].map((f) => ({ file: f, folder: null }))));
    e.target.value = "";
  });

  $("btnRefresh").onclick = () => refresh(true);

  $("btnQuit").onclick = () => {
    if (staged.size && !confirm("You have staged changes that were not sent. Quit anyway?")) return;
    staged.clear();
    api("POST", "quit").catch(() => {});
    document.body.innerHTML = `<div class="device-help"><h3>Librarian closed</h3><p>You can close this tab. Open the app again to continue.</p></div>`;
  };

  $("btnImportAll").onclick = () => run(async () => {
    const res = await api("POST", "device/import", {});
    const failed = res.failed.length ? ` ${res.failed.length} file(s) couldn't be read from the synth: ${res.failed.join(", ")}` : "";
    toast(`Imported ${res.added} new preset(s) from ${res.seen} slot(s).${failed}`, !!failed, failed ? 15000 : 5000);
    await refresh(true);
  });

  $("btnBackup").onclick = () => run(async () => {
    const res = await api("POST", "device/backup");
    const bad = res.unreadable.length ? ` ${res.unreadable.length} file(s) couldn't be read: ${res.unreadable.join(", ")}` : "";
    toast(`Backed up ${res.files} file(s) as ${res.name}.${bad}`, !!bad, bad ? 15000 : 5000);
    await refresh(true);
  });

  $("btnEject").onclick = () => run(async () => {
    if (staged.size && !confirm("You have staged changes that were not sent. Eject anyway?")) return;
    await api("POST", "device/eject");
    staged.clear();
    toast("Drive ejected. Switch the Super Gemini off and on again to load the presets.", false, 10000);
    await refresh(true);
  });

  $("btnDiscard").onclick = () => {
    staged.clear();
    render();
  };

  $("btnWrite").onclick = () => run(async () => {
    const changes = [...staged.values()];
    const btn = $("btnWrite");
    btn.disabled = true;
    btn.textContent = "Writing…";
    try {
      const res = await api("POST", "device/write", { changes });
      staged.clear();
      const trash = res.trashFreed ? ` Emptied ${Math.ceil(res.trashFreed / 1024)} KB from the synth's trash.` : "";
      toast(`Wrote ${res.written} slot(s).` + (res.backup ? ` Backup saved first (${res.backup}).` : "") + trash +
        " Eject the drive and restart the Super Gemini to hear the new presets.", false, 12000);
      await refresh(true);
    } finally {
      btn.disabled = false;
      btn.textContent = "Send to synth";
    }
  });

  $("btnSettings").onclick = () => {
    $("drivePath").value = state.settings.drivePath || "";
    $("drivePath").disabled = !!state.settings.driveOverride;
    $("homePath").textContent = state.settings.home;
    $("backupPatch").checked = state.settings.backup.patch;
    $("backupPerformance").checked = state.settings.backup.performance;
    $("backupList").innerHTML = state.backups.length
      ? state.backups.map((b) => `<li><span>${esc(b.name)} · ${b.files} files</span>
          <button type="button" data-restore="${esc(b.name)}" ${state.device.connected ? "" : "disabled"}>Restore to synth</button></li>`).join("")
      : `<li>No backups yet.</li>`;
    $("settingsDialog").showModal();
  };

  $("backupList").addEventListener("click", (e) => {
    const name = e.target.dataset.restore;
    if (!name) return;
    if (!confirm(`Replace the presets on the synth with backup “${name}”?\nThe current state is backed up first.`)) return;
    run(async () => {
      const res = await api("POST", `backups/${encodeURIComponent(name)}/restore`);
      $("settingsDialog").close();
      staged.clear();
      toast(`Restored ${res.restored} file(s). Previous state saved as ${res.backup}.`, false, 10000);
      await refresh(true);
    });
  });

  $("revealHome").onclick = (e) => {
    e.preventDefault();
    api("POST", "reveal");
  };

  $("saveSettings").onclick = (e) => {
    e.preventDefault();
    run(async () => {
      await api("POST", "settings", {
        drivePath: $("drivePath").value,
        backup: { patch: $("backupPatch").checked, performance: $("backupPerformance").checked },
      });
      $("settingsDialog").close();
      await refresh(true);
    });
  };

  window.addEventListener("beforeunload", (e) => {
    if (staged.size) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

setupEvents();
setupDnD();
refresh(true);
setInterval(refresh, 3000);
