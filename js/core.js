/* Core: storage, people, plans, rotation, logging, sets, sounds, timers.
   No screen code here. Storage keys and shapes are the same as the original app
   (trainops:*), so history, weights, check-ins and goals carry straight over. */

/* ---------- storage ---------- */
var store = {
  get: function (k, d) {
    try { var v = localStorage.getItem(k); return v == null ? (d === undefined ? null : d) : JSON.parse(v); }
    catch (e) { return d === undefined ? null : d; }
  },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  raw: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  setRaw: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

/* ---------- small helpers ---------- */
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function dateISO(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function todayISO() { return dateISO(new Date()); }
function parseDate(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function fmtSecs(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad2(s % 60); }
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function fmtDay(iso) { var d = parseDate(iso); return WEEKDAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); }
function daysBetween(aIso, bIso) { return Math.round((parseDate(bIso) - parseDate(aIso)) / 864e5); }
function daysAgoText(iso) {
  var n = daysBetween(iso, todayISO());
  return n <= 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago';
}
function titleCase(s) { return String(s || '').toLowerCase().replace(/(^|[\s-])\S/g, function (c) { return c.toUpperCase(); }); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function isoWeek(d) {
  var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  var day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day + 3);
  var firstThu = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  var fday = (firstThu.getUTCDay() + 6) % 7;
  firstThu.setUTCDate(firstThu.getUTCDate() - fday + 3);
  return t.getUTCFullYear() + '-W' + pad2(1 + Math.round((t - firstThu) / (7 * 864e5)));
}
function clone(o) { return JSON.parse(JSON.stringify(o)); }

/* ---------- per-person stores (same keys as before) ---------- */
function cfgGet(id) { return store.get('trainops:cfg:' + id, {}) || {}; }
function cfgSet(id, v) { store.set('trainops:cfg:' + id, v); }
function cfgPatch(id, patch) { var c = cfgGet(id); for (var k in patch) c[k] = patch[k]; cfgSet(id, c); return c; }
function logGet(id) { return store.get('trainops:log:' + id, {}) || {}; }
function logSet(id, v) { store.set('trainops:log:' + id, v); }
function setsGet(id) { return store.get('trainops:sets:' + id, {}) || {}; }
function setsSave(id, v) { store.set('trainops:sets:' + id, v); }
function editsGet(id) { return store.get('trainops:edits:' + id, {}) || {}; }     // { name: {sets, reps, secs, w} }
function editsSave(id, v) { store.set('trainops:edits:' + id, v); }
function modsGet(id) { return store.get('trainops:mods:' + id, {}) || {}; }       // { "day|loc|gi_xi": {swap} | {rm:1} }
function modsSave(id, v) { store.set('trainops:mods:' + id, v); }
function stretchLogGet(id) { return store.get('trainops:stretch:' + id, {}) || {}; } // { iso: [{r, title, mins}] }
function stretchLogSet(id, v) { store.set('trainops:stretch:' + id, v); }
function myRoutinesGet(id) { return store.get('trainops:routines:' + id, []) || []; }
function myRoutinesSave(id, v) { store.set('trainops:routines:' + id, v); }

/* ---------- people ---------- */
var AVATAR_COLORS = { anthony: '#23304A', her: '#8A4FBF' };
var AVATAR_PALETTE = ['#1F6F54', '#B4521C', '#2B5BA8', '#9C3D54', '#5B4BB0', '#23304A'];
LIMIT_FLAGS.back = ['spinal', 'impact'];

function loadPeople() {
  (store.get('trainops:custom', []) || []).forEach(function (cfg) {   // made with the old plan builder
    try { ATHLETES[cfg.id] = toRotation(buildCustomPlan(cfg), { hair: cfg.sex === 'male' ? 'short' : 'bun', mins: +cfg.duration || 45 }); } catch (e) {}
  });
  (store.get('trainops:people', []) || []).forEach(function (cfg) {   // made with "Add a person"
    try { ATHLETES[cfg.id] = makePersonPlan(cfg); } catch (e) {}
  });
}
function peopleIds() {
  var hidden = store.get('trainops:hidden', []) || [];
  return Object.keys(ATHLETES).filter(function (id) { return hidden.indexOf(id) === -1; });
}
function personName(id) { var a = ATHLETES[id]; return a ? titleCase(a.meta.name) : ''; }
function personColor(id) {
  var a = ATHLETES[id]; if (a && a.color) return a.color;
  if (AVATAR_COLORS[id]) return AVATAR_COLORS[id];
  var ids = Object.keys(ATHLETES); return AVATAR_PALETTE[Math.max(0, ids.indexOf(id)) % AVATAR_PALETTE.length];
}
function personHair(id) { var a = ATHLETES[id]; if (a && a.hair) return a.hair; return id === 'anthony' ? 'short' : 'bun'; }
function currentId() {
  var id = store.raw('trainops:lastUser');
  if (id && ATHLETES[id] && peopleIds().indexOf(id) !== -1) return id;
  return peopleIds()[0] || 'anthony';
}
function setCurrent(id) { store.setRaw('trainops:lastUser', id); }

// any weekly/phase plan -> a rotation of its training days (A -> B -> C ...)
function toRotation(plan, opt) {
  opt = opt || {};
  var pk = plan.phases[0].key, letters = 'abcdefg';
  var days = (plan.phaseDays[pk] || []).filter(function (d) { return d.type !== 'rest'; }).map(function (d, i) {
    var c = clone(d); c.key = letters[i]; c.label = 'Session ' + letters[i].toUpperCase(); return c;
  });
  plan.phaseDays[pk] = days;
  plan.mode = 'phase'; plan.rotation = true;
  plan.perWeek = opt.perWeek || days.length;
  plan.quickMin = opt.mins && opt.mins <= 20 ? 10 : 15;
  plan.hair = opt.hair; plan.color = opt.color;
  return plan;
}
// "Add a person" answers -> a plan from the generator, as a rotation
function makePersonPlan(p) {
  var goals = p.goals || [];
  var goal = goals.indexOf('strong') !== -1 ? 'stronger' : goals.indexOf('look') !== -1 ? 'muscle'
    : goals.indexOf('run') !== -1 ? 'endurance' : 'general';
  var gear = p.gear || [];
  var homeEquip = (!gear.length || gear.indexOf('none') !== -1) ? 'bodyweight'
    : (gear.filter(function (g) { return ['db', 'kb'].indexOf(g) === -1; }).length ? 'home' : 'dumbbells');
  var equip = p.place === 'gym' ? 'full' : homeEquip;
  var limits = [];
  (p.limits || []).forEach(function (l) { if (l === 'back') limits.push('back'); if (l === 'knees') limits.push('knee'); if (l === 'shoulders') limits.push('shoulder'); });
  var mins = +p.mins || 30;
  var cfg = { id: p.id, name: p.name, seed: p.id, goal: goal, exp: 'beginner', freq: Math.max(3, +p.days || 3),
    duration: mins <= 30 ? '30' : mins <= 45 ? '45' : '60', equip: equip, limits: limits, weeks: 0 };
  var plan = toRotation(buildCustomPlan(cfg), { perWeek: +p.days || 3, mins: mins, hair: p.hair || 'bun', color: p.color });
  plan.meta.goal = '';
  plan.phaseDays[plan.phases[0].key].forEach(function (d) {      // holds are timed, not counted
    (d.groups || []).forEach(function (g) { g.items.forEach(function (it) {
      if (/wall sit|plank|carry/i.test(it.name) && !/s\b/.test(it.scheme || '')) { var m = String(it.scheme || '').match(/^(\d+)\s*×/); it.scheme = (m ? m[1] : 3) + ' × 30s' + (/side plank/i.test(it.name) ? ' / side' : ''); }
    }); });
  });
  plan.check = (p.limits && p.limits.length) ? 'back & joints' : null;
  plan.v2 = p;
  if (false && p.place === 'both') {     // (Home/Gym switching was removed for simplicity)
    plan.locations = { home: 'Home', gym: 'Gym' };
    var used = {};
    plan.phaseDays[plan.phases[0].key].forEach(function (d) {
      (d.groups || []).forEach(function (g) {
        g.items.forEach(function (it) {
          var ex = EX_DB.filter(function (x) { return x.name === it.name; })[0];
          if (!ex) return;
          var alt = EX_DB.filter(function (x) {
            return x.pat === ex.pat && ['machine', 'cable', 'barbell'].indexOf(x.eq) !== -1 && !used[x.name] &&
              !x.flags.some(function (f) { return limits.some(function (l) { return (LIMIT_FLAGS[l] || []).indexOf(f) !== -1; }); });
          })[0];
          if (alt) { used[alt.name] = 1; it.gym = { name: alt.name }; }
        });
      });
    });
  }
  return plan;
}

/* ---------- plans ---------- */
function planKey(id) { return ATHLETES[id].phases[0].key; }
function baseSessions(id) {
  var a = ATHLETES[id], all = (a.phaseDays[planKey(id)] || []).filter(function (d) { return d.type !== 'rest'; });
  if (a.splits) {     // plans split by muscle group: the sessions for the chosen days a week
    var n = Math.max(2, Math.min(6, daysPerWeek(id))), keys = a.splits[n] || a.splits[3];
    var byKey = {}; all.forEach(function (d) { byKey[d.key] = d; });
    return keys.map(function (k) { return byKey[k]; }).filter(Boolean);
  }
  return all;
}
function allSessions(id) { return (ATHLETES[id].phaseDays[planKey(id)] || []).filter(function (d) { return d.type !== 'rest'; }); }
function daysPerWeek(id) { var c = cfgGet(id); return +c.days || ATHLETES[id].perWeek || 3; }
// change how many days a week; split plans change which sessions rotate, generated plans are rebuilt
function setDaysPerWeek(id, n) {
  cfgPatch(id, { days: n });
  var a = ATHLETES[id];
  if (a && a.v2) {
    var list = store.get('trainops:people', []) || [];
    list.forEach(function (p) { if (p.id === id) p.days = n; });
    store.set('trainops:people', list);
    var cfg = list.filter(function (p) { return p.id === id; })[0];
    if (cfg) try { ATHLETES[id] = makePersonPlan(cfg); } catch (e) {}
  }
}
function renameSession(id, key, name) {
  var c = cfgGet(id); c.names = c.names || {};
  if (name) c.names[key] = name; else delete c.names[key];
  cfgSet(id, c);
}
// Celina's run moves up a level every `perLevel` runs (counted before today); Easier/Harder nudges it
function applyLevels(id, days) {
  var pk = planKey(id), today = todayISO(), log = null, off = cfgGet(id).lvl || {};
  return days.map(function (d) {
    if (!d.levels) return d;
    if (!log) log = logGet(id);
    var done = 0;
    Object.keys(log).forEach(function (t) { var e = log[t]; if (t < today && e && e.rot === pk && e.k === d.key) done++; });
    var per = d.perLevel || 3, n = d.levels.length, base = Math.floor(done / per);
    var i = Math.max(0, Math.min(n - 1, base + (off[d.key] || 0))), L = d.levels[i], c = {};
    for (var k in d) if (k !== 'levels') c[k] = d[k];
    c.title = L.title; c.dur = L.dur || d.dur; c.run = L.run;
    c.level = { i: i, n: n, base: base, inLevel: done % per, per: per };
    return c;
  });
}
function levelNudge(id, key, delta) {
  var d = sessions(id).filter(function (x) { return x.key === key; })[0]; if (!d || !d.level) return;
  var target = Math.max(0, Math.min(d.level.n - 1, d.level.i + delta));
  var c = cfgGet(id); c.lvl = c.lvl || {}; c.lvl[key] = target - d.level.base; cfgSet(id, c);
}
function sessions(id) {
  var names = cfgGet(id).names || {};
  return applyLevels(id, baseSessions(id)).map(function (d) {
    if (!names[d.key]) return d;
    var c = {}; for (var k in d) c[k] = d[k]; c.title = names[d.key]; c.renamed = true; return c;
  });
}
function sessionLetter(d) { return String(d.key || '').toUpperCase(); }
// "Workout A · Glutes & Legs" for lettered plans, just the name for named ones ("Push Day")
function sessionFull(d) { return String(d.key || '').length === 1 ? 'Workout ' + sessionLetter(d) + ' · ' + d.title : d.title; }
function sessionTag(d) { return String(d.key || '').length === 1 ? 'Workout ' + sessionLetter(d) : (d.focus || ''); }

/* rotation: sessions run in order on whatever days you train; worked out from the log */
function rotationState(id) {
  var days = sessions(id), pk = planKey(id), log = logGet(id), today = todayISO();
  function idx(e) {
    if (!e || e.rot !== pk) return -1;
    for (var i = 0; i < days.length; i++) if (days[i].key === e.k) return i;
    return -1;
  }
  var count = 0, last = -1;
  Object.keys(log).sort().forEach(function (t) { if (t >= today) return; var i = idx(log[t]); if (i !== -1) { count++; last = i; } });
  var ti = idx(log[today]);
  var next = ti !== -1 ? ti : (last + 1) % Math.max(1, days.length);
  var pick = cfgGet(id).pick;
  if (ti === -1 && pick && pick.date === today) {
    for (var j = 0; j < days.length; j++) if (days[j].key === pick.key) next = j;
  }
  return { days: days, count: count, doneToday: ti !== -1, next: next, last: last };
}
function todaySession(id) { var r = rotationState(id); return r.days[r.next]; }
function pickSession(id, key) { cfgPatch(id, { pick: { date: todayISO(), key: key } }); }

/* where you train */
function locsOf(id) { return ATHLETES[id].locations || null; }
function locGet(id) { var L = locsOf(id); if (!L) return null; var l = cfgGet(id).loc; return L[l] ? l : 'home'; }
function locSet(id, l) { cfgPatch(id, { loc: l }); }
function itemAt(it, loc, locs) {
  if (!loc || loc === 'home' || !it[loc]) return it;
  var v = typeof it[loc] === 'string' ? { name: it[loc] } : it[loc], o = {};
  for (var k in it) if (!(locs && k in locs)) o[k] = it[k];
  if (v.name && v.name !== it.name) { o.name = v.name; delete o.cues; if (v.note === undefined) delete o.note; }
  if (v.scheme) o.scheme = v.scheme;
  if (v.note !== undefined) { if (v.note) o.note = v.note; else delete o.note; }
  if (v.cues) o.cues = v.cues;
  return o;
}

function groupKind(label) {
  if (/warm/i.test(label)) return 'warm';
  if (/cool/i.test(label)) return 'cool';
  if (/pair|alternate/i.test(label)) return 'pair';
  if (/finish/i.test(label)) return 'finish';
  return 'main';
}
function groupTitle(label) {
  var k = groupKind(label), first = String(label || '').split(' · ')[0].trim();
  if (k === 'pair') return first + ' · back and forth';
  if (k === 'warm') return 'Warm-up';
  if (k === 'cool') return 'Cool-down';
  if (/^strength/i.test(first)) return 'Strength';
  return first || 'Moves';
}
function oneSet(scheme, sets) {
  if (!sets || !/^\s*\d+\s*×/.test(scheme || '')) return scheme;
  var rest = scheme.replace(/^\s*\d+\s*×\s*/, '');
  return sets > 1 ? sets + ' × ' + rest : (/^\d+\s*(s\b|min|steps)/.test(rest) ? rest : '× ' + rest);
}
// scheme with the person's own sets/reps/seconds applied
function schemeWithEdits(id, name, scheme) {
  var e = editsGet(id)[name]; if (!e) return scheme;
  var p = parseScheme(scheme);
  var hold = /hold/i.test(scheme) ? ' hold' : '';
  if (p.kind === 'timed' && (e.secs || e.sets)) {
    var w = p.phases.filter(function (x) { return x.kind === 'work'; })[0];
    var tsets = e.sets || +((String(scheme).match(/^\s*(\d+)\s*[×x]/) || [])[1] || 1);
    return (tsets > 1 ? tsets + ' × ' : '') + (e.secs || (w ? w.secs : 30)) + 's' + hold + (p.side ? ' / side' : '');
  }
  if ((p.kind === 'reps' || p.kind === 'max') && (e.sets || e.reps != null)) {
    var sets = e.sets || p.sets, reps = e.reps != null ? e.reps : (p.kind === 'max' ? 'max' : p.label);
    return sets + ' × ' + reps + (p.side ? ' / side' : '');
  }
  if (p.kind === 'count' && e.sets) return e.sets + ' × ' + String(scheme).replace(/^\s*\d+\s*[×x]\s*/, '').replace(/^\s*[×x]\s*/, '');
  return scheme;
}

/* The day you'll actually do: location swaps, your swaps/removals, your sets & reps,
   the short version, and a cool-down at the end. Items keep stable ids (gi_xi). */
function resolveDay(id, d, opt) {
  opt = opt || {};
  var loc = opt.loc !== undefined ? opt.loc : locGet(id), locs = locsOf(id), mods = modsGet(id);
  var out = { key: d.key, title: d.title, focus: d.focus, label: d.label, type: d.type, dur: d.dur, run: d.run, level: d.level,
    loc: loc, short: !!opt.short, groups: [] };
  if (!d.groups) return out;
  var groups = d.groups.map(function (g, gi) {
    var items = [];
    g.items.forEach(function (raw, xi) {
      var it = itemAt(raw, loc, locs), iid = gi + '_' + xi, m = mods[d.key + '|' + (loc || 'home') + '|' + iid] || {};
      if (m.rm) return;
      var o = { id: iid, gi: gi, xi: xi, base: it.name, name: it.name, scheme: it.scheme, note: it.note || '', cues: it.cues || null };
      if (m.swap && m.swap !== it.name) { o.name = m.swap; o.note = ''; o.cues = null; o.swapped = true; }
      o.scheme = schemeWithEdits(id, o.name, o.scheme);
      items.push(o);
    });
    return { label: g.label || '', kind: groupKind(g.label || ''), title: groupTitle(g.label || ''), items: items, gi: gi };
  });
  if (opt.short) {
    var picks = [];
    if (d.quick) d.quick.forEach(function (q) { picks.push(q); });
    else {
      var main = -1, best = -1;
      groups.forEach(function (g, gi) { if (g.kind !== 'warm' && g.items.length > best) { best = g.items.length; main = gi; } });
      if (main !== -1) for (var i = 0; i < d.groups[main].items.length && picks.length < 4; i++) picks.push([main, i]);
    }
    var byG = {};
    picks.forEach(function (q) {
      var g = groups[q[0]]; if (!g) return;
      var it = g.items.filter(function (x) { return x.xi === q[1]; })[0]; if (!it) return;
      var c = {}; for (var k in it) c[k] = it[k];
      if (q[2]) c.scheme = oneSet(c.scheme, q[2]);
      (byG[q[0]] = byG[q[0]] || []).push(c);
    });
    groups = Object.keys(byG).sort(function (a, b) { return a - b; }).map(function (gi) {
      var g = groups[gi]; return { label: g.label, kind: g.kind, title: g.title, items: byG[gi], gi: g.gi };
    });
  }
  groups = groups.filter(function (g) { return g.items.length; });
  if (!opt.short && !opt.noCool && d.type !== 'run') {
    var cd = COOLDOWNS[id + ':' + d.key] || COOLDOWNS['default:strength'];
    groups.push({ label: 'Cool-down', kind: 'cool', title: 'Cool-down', gi: 'cd', items: cd.map(function (c, i) {
      return { id: 'cd_' + i, base: c[0], name: c[0], scheme: c[1], note: '', cues: null, cool: true };
    }) });
  }
  out.groups = groups;
  return out;
}
function dayMoves(rd) { var n = 0; rd.groups.forEach(function (g) { n += g.items.length; }); return n; }
function dayMinutes(id, d, short) {
  if (short) return (ATHLETES[id].quickMin || 10);
  var m = String(d.dur || '').match(/(\d+)/); return m ? +m[1] : 30;
}

/* ---------- logging ---------- */
var CHECK_LABELS = ['', 'Feels fine', 'A twinge', 'Flared up'];
function runBit(r) { return 'run ' + (+r.dist).toFixed(1) + ' ' + r.unit; }
function mergeDay(old, neu) {
  if (!old) return neu;
  if (old.rot && neu.rot && old.k !== neu.k) {      // two plan sessions in one day: keep both
    neu.title = old.title + ' + ' + neu.title;
    neu.ks = (old.ks || [old.k]).concat([neu.k]);
    if (old.run && !neu.run) neu.run = old.run;
    if (old.si && !neu.si) neu.si = old.si;
    if (old.cb) neu.cb = old.cb;
    return neu;
  }
  if (neu.run && !old.run && old.t !== 'run') { old.run = neu.run; old.title += ' + ' + runBit(neu.run); return old; }
  if (!neu.run && old.run) { neu.run = old.run; neu.title += ' + ' + runBit(old.run); return neu; }
  return neu;
}
function prevLog(id) {
  var log = logGet(id), today = todayISO();
  var iso = Object.keys(log).filter(function (t) { return t < today; }).sort().pop();
  if (!iso) return null;
  return { iso: iso, entry: log[iso], gap: daysBetween(iso, today) };
}
function logEntry(id, d, title) {
  var e = { t: d.type, title: title };
  e.rot = planKey(id); e.k = d.key;
  var p = prevLog(id); if (p && p.gap >= 3) e.cb = 1;   // first workout back after a break
  return e;
}
function logSession(id, d, extra) {
  var log = logGet(id), t = todayISO();
  var e = logEntry(id, d, d.title + (extra && extra.short ? ' · ' + (ATHLETES[id].quickMin || 10) + '-min' : ''));
  if (extra) for (var k in extra) if (k !== 'short') e[k] = extra[k];
  log[t] = mergeDay(log[t], e);
  logSet(id, log);
  var c = cfgGet(id); if (c.pick) { delete c.pick; cfgSet(id, c); }
  return log[t];
}
function logCheck(id, n) { var log = logGet(id), t = todayISO(); if (log[t]) { log[t].si = n; logSet(id, log); } }
function logRun(id, iso, run, asPlanRun) {
  var log = logGet(id), u = run && run.unit || 'mi';
  var entry = run && run.dist ? { t: 'run', title: 'Run · ' + (+run.dist).toFixed(1) + ' ' + u, run: run } : { t: 'run', title: 'Run' };
  if (asPlanRun) {
    var tagged = logEntry(id, asPlanRun, asPlanRun.title + (run && run.dist ? ' · ' + (+run.dist).toFixed(1) + ' ' + u : ''));
    for (var k in tagged) entry[k] = tagged[k];
    if (run && run.dist) entry.run = run;
  }
  log[iso] = mergeDay(log[iso], entry);
  logSet(id, log);
}
function deleteLog(id, iso) { var log = logGet(id); delete log[iso]; logSet(id, log); }
function addStretchLog(id, r, title, mins) {
  var s = stretchLogGet(id), t = todayISO();
  (s[t] = s[t] || []).push({ r: r, title: title, mins: mins });
  stretchLogSet(id, s);
}
function weekCount(id) {
  var log = logGet(id), wk = isoWeek(new Date());
  return Object.keys(log).filter(function (x) { return isoWeek(parseDate(x)) === wk; }).length;
}
function weeklyTarget(id) { return daysPerWeek(id) || Math.max(1, baseSessions(id).length); }

/* ---------- schemes ---------- */
// timed moves -> phases (no get-ready; the player adds that): "45s", "30s / side", "2 × 20s / side",
// "5 × 10s hold", "40s on / 20s off × 4", "3 min"
function holdPhases(scheme) {
  var s = String(scheme || ''), m, work = 0, reps = 1, rest = 0, unit = /hold/i.test(s) ? 'Hold' : 'Set';
  if ((m = s.match(/(\d+)\s*s\s*on\s*\/\s*(\d+)\s*s\s*off\s*[×x]\s*(\d+)/i))) { work = +m[1]; rest = +m[2]; reps = +m[3]; unit = 'Round'; }
  else if ((m = s.match(/(?:(\d+)\s*[×x]\s*)?(\d+)\s*s\b/i))) { work = +m[2]; if (m[1]) { reps = +m[1]; rest = unit === 'Hold' ? 5 : 10; } }
  else if ((m = s.match(/^\s*(\d+)(?:\s*[–-]\s*\d+)?\s*min\b/i))) { work = +m[1] * 60; }
  if (!work || work > 1800 || reps > 20) return null;
  var sides = /\/\s*side/i.test(s) ? 2 : 1, ph = [];
  for (var r = 0; r < reps; r++) {
    for (var sd = 0; sd < sides; sd++) {
      if (sd) ph.push({ kind: 'switch', lab: 'Switch sides', secs: 5 });
      ph.push({ kind: 'work', secs: work,
        lab: (reps > 1 ? unit + ' ' + (r + 1) + ' of ' + reps : '') + (sides > 1 ? (reps > 1 ? ' · ' : '') + (sd ? 'Left side' : 'Right side') : '') });
    }
    if (r < reps - 1 && rest) ph.push({ kind: 'rest', lab: 'Rest', secs: rest });
  }
  return ph;
}
function parseScheme(scheme) {
  var s = String(scheme || '').trim(), side = /\/\s*side|each/i.test(s);
  var ph = holdPhases(s);
  if (ph) { var tot = 0; ph.forEach(function (p) { tot += p.secs; }); return { kind: 'timed', phases: ph, secs: tot, side: side }; }
  var sets = 1, rest = s, m;
  if ((m = s.match(/^(\d+)\s*[×x]\s*(.+)$/))) { sets = +m[1]; rest = m[2]; }
  else if ((m = s.match(/^[×x]\s*(.+)$/))) rest = m[1];
  rest = rest.trim();
  if (/max/i.test(rest)) return { kind: 'max', sets: sets, side: side, label: 'max' };
  var r = rest.match(/^(\d+)(?:\s*[–-]\s*(\d+))?\s*(.*)$/);
  if (r) {
    var tail = r[3].trim(), steps = /step/i.test(tail);
    return { kind: steps ? 'count' : 'reps', sets: sets, lo: +r[1], hi: r[2] ? +r[2] : +r[1], side: side,
      label: r[1] + (r[2] ? '–' + r[2] : ''), unit: steps ? 'steps' : 'reps' };
  }
  return { kind: 'count', sets: sets, side: side, label: rest, unit: '' };
}
function schemeText(scheme) {   // friendly: "3 × 10–15" stays; "45s" -> "45 sec"
  var p = parseScheme(scheme);
  if (p.kind === 'timed') return String(scheme).replace(/(\d+)\s*s\b/, '$1 sec');
  if (p.kind === 'max') return p.sets + ' × as many as you can';
  return String(scheme);
}
function needsWeight(name) {
  if (/anti-rotation|pallof|band|bodyweight|push-up|pull-up|chin-up|plank|bird dog|dead bug|clamshell|abduction|side step|walk|squeeze|kickbacks$|wheel|isolated|double pulse|pulse|nordic|hang|crawl|pogo|skip|hop|jump|sled|med-ball|patrick|step-down|tibialis|pike|backward/i.test(name)) return false;
  return /db|dumbbell|kb|kettlebell|barbell|machine|cable|press|row|curl|triceps|goblet|thrust|deadlift|leg press|pulldown|split squat|back extension|halo|farmer|carry|march|get-up/i.test(name);
}

/* ---------- sets & progression ---------- */
function recordSet(id, name, w, r) {
  var all = setsGet(id), e = all[name] || {}, d = todayISO();
  e.last = { w: w, r: r, d: d };
  if (!e.best || w > e.best.w || (w === e.best.w && r > e.best.r)) e.best = { w: w, r: r, d: d };
  e.hist = e.hist || [];
  var h = e.hist[e.hist.length - 1];
  if (h && h.d === d) { h.sets++; if (w > h.w || (w === h.w && r > h.r)) { h.w = w; h.r = r; } }
  else { e.hist.push({ d: d, w: w, r: r, sets: 1 }); if (e.hist.length > 30) e.hist.shift(); }
  all[name] = e; setsSave(id, all);
}
// what to aim for today: hit the top of the range -> go heavier, else one more rep
function suggestion(id, name, p) {
  var h = setsGet(id)[name], ed = editsGet(id)[name], today = todayISO();
  if (p && p.kind === 'max') {        // as many as you can: start from last time
    if (h && h.last && h.last.d === today) return { w: h.last.w, r: h.last.r, hint: '' };
    var pm = h && h.hist ? h.hist.filter(function (x) { return x.d < today; }).pop() : null;
    return pm ? { w: pm.w, r: pm.r, hint: 'Last time ' + pm.r + ' — go for ' + (pm.r + 1) } : { w: 0, r: 5, hint: '' };
  }
  var reps = p && p.lo || 10, top = p && p.hi || reps;
  if (h && h.last && h.last.d === today) return { w: h.last.w, r: h.last.r, hint: '' };   // next set: same as the last one
  var prev = h && h.hist ? h.hist.filter(function (x) { return x.d < today; }).pop() : null;
  if (!prev && h && h.last && h.last.d < today) prev = h.last;
  var w = ed && ed.w != null ? ed.w : (prev ? prev.w : 0);
  if (!prev) return { w: w, r: reps, hint: '' };
  if (prev.r >= top && prev.w) {
    var step = prev.w >= 50 ? 10 : 5;
    return { w: prev.w, r: reps, tryW: prev.w + step, hint: 'Last time ' + prev.w + ' lb × ' + prev.r + ' — ready for ' + (prev.w + step) + '?' };
  }
  var goal = Math.max(reps, Math.min(top, prev.r + 1));
  return { w: prev.w, r: goal, hint: 'Last time ' + (prev.w ? prev.w + ' lb × ' : '') + prev.r + ' — go for ' + goal };
}

/* ---------- progress (resume an interrupted workout) ---------- */
function progGet(id) { var p = store.get('trainops:prog:' + id, null); return p && p.date === todayISO() ? p : null; }
function progSet(id, p) { p.date = todayISO(); store.set('trainops:prog:' + id, p); }
function progClear(id) { store.del('trainops:prog:' + id); }

/* ---------- sound + voice ---------- */
var Sound = {
  ctx: null,
  on: function () { return store.raw('trainops:mute') !== '1'; },
  set: function (v) { store.setRaw('trainops:mute', v ? '0' : '1'); },
  voice: function () { return store.raw('trainops:voice') === '1'; },
  setVoice: function (v) { store.setRaw('trainops:voice', v ? '1' : '0'); },
  unlock: function () {     // call from a tap so iOS lets timers make sound later
    // "ambient" mixes our beeps with whatever music is playing instead of pausing it (iOS 17+)
    try { if (navigator.audioSession) navigator.audioSession.type = 'ambient'; } catch (e) {}
    if (!this.on() && !this.voice()) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC && !this.ctx) this.ctx = new AC();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (this.ctx) { var b = this.ctx.createBuffer(1, 1, 22050), s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.ctx.destination); s.start(0); }
    } catch (e) {}
    try { if (this.voice() && window.speechSynthesis && !this._spoke) { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); this._spoke = true; } } catch (e) {}
  },
  tone: function (f, ms, vol, when) {
    if (!this.on() || !this.ctx) return;
    try {
      var t = this.ctx.currentTime + (when || 0), o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
      o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + ms / 1000 + 0.05);
    } catch (e) {}
  },
  tick: function () { this.tone(880, 120, 0.18); },
  go: function () { this.tone(660, 160, 0.25); this.tone(990, 260, 0.25, 0.14); },
  chime: function () { this.tone(784, 220, 0.22); this.tone(1047, 420, 0.22, 0.18); },
  done: function () { this.tone(523, 180, 0.22); this.tone(659, 180, 0.22, 0.15); this.tone(784, 380, 0.22, 0.3); },
  say: function (text) {
    if (!this.voice() || !window.speechSynthesis || !text) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text); u.rate = 1.02; u.pitch = 1; u.volume = 1;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^en(-|_)/i.test(x.lang); });
      var pref = v.filter(function (x) { return /samantha|karen|daniel|google us|ava|allison/i.test(x.name); })[0] || v[0];
      if (pref) u.voice = pref;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
};

/* ---------- keep the screen on during a workout ---------- */
var Wake = {
  lock: null, want: false,
  on: function () {
    this.want = true; var self = this;
    try { if ('wakeLock' in navigator) navigator.wakeLock.request('screen').then(function (l) { self.lock = l; }).catch(function () {}); } catch (e) {}
  },
  off: function () { this.want = false; try { if (this.lock) this.lock.release(); } catch (e) {} this.lock = null; }
};
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && Wake.want) Wake.on(); });

/* ---------- timestamp-based countdown (no drift, survives the app sleeping) ---------- */
function Countdown(secs, onTick, onDone) {
  var end = Date.now() + secs * 1000, paused = false, left = secs * 1000, iv = null, last = -1, total = secs;
  function tick() {
    var ms = paused ? left : end - Date.now(), s = Math.ceil(ms / 1000);
    if (s !== last) { last = s; onTick(Math.max(0, s), total); }
    if (ms <= 0 && !paused) { stop(); onDone(); }
  }
  function stop() { if (iv) { clearInterval(iv); iv = null; } }
  iv = setInterval(tick, 200); setTimeout(tick, 0);
  return {
    pause: function () { if (paused) return; paused = true; left = end - Date.now(); tick(); },
    resume: function () { if (!paused) return; paused = false; end = Date.now() + left; tick(); },
    toggle: function () { if (paused) this.resume(); else this.pause(); return paused; },
    add: function (s) { total += s; if (paused) left += s * 1000; else end += s * 1000; last = -1; tick(); },
    paused: function () { return paused; },
    stop: stop,
    finish: function () { stop(); onDone(); }
  };
}

/* ---------- drawings ---------- */
function poseFor(name) {
  var st = STRETCHES[name];
  var key = st ? st.pose : POSE_OF[name];
  if (key && POSES[key]) return key;
  for (var i = 0; i < POSE_RULES.length; i++) if (POSE_RULES[i][0].test(name) && POSES[POSE_RULES[i][1]]) return POSE_RULES[i][1];
  return POSES.walk ? 'walk' : 'gobletSquat';
}
var FIG_BG = ['#6E9A8B', '#D8B44E', '#5560A8', '#93688A', '#6E9CC4', '#4E8C8C', '#A08BD6', '#9AA36A', '#A89A8A', '#7C8FB8'];
function figHTML(name, size, id, opt) {
  opt = opt || {};
  var key = opt.pose || poseFor(name), p = POSES[key];
  return FIG.svg(p, { size: size, hair: personHair(id), bg: opt.bg || (p && p.bg), label: opt.label ? name : null });
}
function cuesFor(item) {
  if (item.cues && item.cues.length) return item.cues;
  if (STRETCHES[item.name]) return STRETCHES[item.name].cues;
  return typeof autoCues === 'function' ? autoCues(item.name) : [];
}
function videoFor(name) { var v = typeof videoIds === 'function' ? videoIds(name) : null; return v && v[0] || null; }

/* ---------- routines (Bend-style) ---------- */
function routineSecs(moves) {
  var t = 0;
  moves.forEach(function (m) { var p = parseScheme(m[1]); t += (p.kind === 'timed' ? p.secs : 40) + 8; });
  return t;
}
function routineMinutes(moves) { return Math.max(1, Math.round(routineSecs(moves) / 60)); }
function allRoutines(id) {
  return ROUTINES.concat(myRoutinesGet(id).map(function (r) { r.mine = true; r.kind = r.kind || 'stretch'; return r; }));
}
function routineById(id, rid) { return allRoutines(id).filter(function (r) { return r.id === rid; })[0]; }
/* Levels 1–4 (like Bend's Planks I–IV): a routine can list its own `levels`;
   otherwise each level holds longer and, from level 3, swaps in harder versions. */
var LEVEL_SCALE = [1, 1.25, 1.5, 1.75];
var HARDER = { "Kneeling Push-up": "Push-up", "Glute Bridge": "Single-Leg Glute Bridge", "Bodyweight Squat": "Split Squat", "Banded Glute Bridge": "Single-Leg Glute Bridge" };
function routineLevel(id, rid) { var c = cfgGet(id).rlvl || {}; return Math.max(1, Math.min(4, +c[rid] || 1)); }
function setRoutineLevel(id, rid, n) { var c = cfgGet(id); c.rlvl = c.rlvl || {}; c.rlvl[rid] = Math.max(1, Math.min(4, n)); cfgSet(id, c); }
function scaleScheme(s, f) { return String(s).replace(/(\d+)\s*s\b/, function (all, n) { return Math.max(10, Math.round(+n * f / 5) * 5) + 's'; }); }
function levelMoves(id, r, lvl) {
  lvl = lvl || routineLevel(id, r.id);
  var base = r.levels && r.levels[lvl - 1] ? r.levels[lvl - 1] : r.moves.map(function (m) {
    var name = lvl >= 3 && HARDER[m[0]] ? HARDER[m[0]] : m[0], sch = lvl > 1 ? scaleScheme(m[1], LEVEL_SCALE[lvl - 1]) : m[1];
    if (name !== m[0] && /single-leg|split squat/i.test(name) && !/side/.test(sch))      // one-leg version: time each side
      sch = sch.replace(/(\d+)\s*s\b/, function (a, n) { return Math.max(15, Math.round(+n * 0.6 / 5) * 5) + 's / side'; });
    return [name, sch];
  });
  return base.map(function (m) { return [m[0], schemeWithEdits(id, m[0], m[1])]; });
}
function stretchPickId(id) {
  var picks = STRETCH_PICKS[id] || STRETCH_PICKS['default'];
  var log = logGet(id)[todayISO()];
  if (log && log.t === 'run') return 'run';
  var d = new Date(), doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
  return picks[doy % picks.length];
}
// a routine as a "day" the player understands
function routineDay(id, r) {
  return { key: 'r:' + r.id, title: r.title, type: 'routine', routine: r.id, groups: [{ label: r.kind === 'stretch' ? 'Stretch' : 'Moves',
    kind: 'flow', title: r.title, gi: 0, items: levelMoves(id, r).map(function (m, i) {
      return { id: 'm_' + i, base: m[0], name: m[0], scheme: m[1], note: '', cues: null };
    }) }] };
}

/* ---------- backup ---------- */
function exportData() {
  var o = {};
  for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf('trainops:') === 0) o[k] = localStorage.getItem(k); }
  return { app: 'workout', v: 2, at: new Date().toISOString(), data: o };
}
function importData(obj) {
  if (!obj || !obj.data) throw new Error('Not a backup file');
  Object.keys(obj.data).forEach(function (k) { if (k.indexOf('trainops:') === 0) store.setRaw(k, obj.data[k]); });
}
