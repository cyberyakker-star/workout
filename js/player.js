/* Workout overview, move sheet (tap or hold a move), player, finish, run timer. */

/* ---------- swap candidates ---------- */
var PAT_RULES = [
  [/curl|tricep/i, 'arms'], [/pulldown|pull-up|chin/i, 'pullV'], [/row|pull-apart|face pull/i, 'pullH'],
  [/overhead|shoulder press|pike|kb press|single-arm kb press/i, 'pushV'], [/bench|push-up|chest press|incline/i, 'pushH'],
  [/deadlift|rdl|swing|back extension|good morning/i, 'hinge'], [/lunge|step-up|split squat/i, 'lunge'],
  [/bridge|thrust|kickback|abduction|clam|lateral walk|side step|adductor/i, 'hip'],
  [/squat|leg press|wall sit|pulse/i, 'squat'], [/plank|bug|bird|pallof|anti-rotation|wheel|carry|knee raise/i, 'core'], [/calf/i, 'calf']
];
function patOf(name) {
  var e = EX_DB.concat(MOBILITY).filter(function (x) { return x.name === name; })[0];
  if (e && e.pat !== 'warm' && e.pat !== 'cond') return e.pat;
  for (var i = 0; i < PAT_RULES.length; i++) if (PAT_RULES[i][0].test(name)) return PAT_RULES[i][1];
  return e ? e.pat : null;
}
var _allNames = null;
function allMoveNames() {
  if (_allNames) return _allNames;
  var set = {};
  EX_DB.forEach(function (x) { set[x.name] = 1; });
  Object.keys(ATHLETES).forEach(function (pid) {
    try {
      baseSessions(pid).forEach(function (d) {
        (d.groups || []).forEach(function (g) {
          g.items.forEach(function (it) {
            set[it.name] = 1;
            Object.keys(it).forEach(function (k) { var v = it[k]; if (v && typeof v === 'object' && v.name) set[v.name] = 1; });
          });
        });
      });
    } catch (e) {}
  });
  _allNames = Object.keys(set).filter(function (n) { return !/finisher\)/i.test(n); }).sort();
  return _allNames;
}
function fitsLoc(name, loc) {
  if (loc === 'gym') return true;
  if (loc === 'min') return !/db|dumbbell|kb|kettlebell|barbell|machine|cable|leg press|pulldown|bench|goblet|thrust$/i.test(name) || /band/i.test(name);
  return !/machine|cable|barbell|leg press|lat pulldown|assisted|seated calf/i.test(name);
}
function alternativesFor(name, loc) {
  var careful = !!(ATHLETES[App.id] && ATHLETES[App.id].check);
  if (STRETCHES[name]) return Object.keys(STRETCHES).filter(function (n) { return n !== name; }).slice(0, 12);
  var pat = patOf(name); if (!pat) return [];
  return allMoveNames().filter(function (n) {
    var e = EX_DB.filter(function (x) { return x.name === n; })[0];
    if (e && e.flags.indexOf('impact') !== -1) return false;    // no jumping swaps
    if (e && careful && e.flags.indexOf('spinal') !== -1) return false;   // back/SI: nothing that loads the spine
    return n !== name && patOf(n) === pat && fitsLoc(n, loc || 'home');
  }).slice(0, 10);
}

/* ---------- overview ---------- */
// src: {type:'plan', key} | {type:'routine', rid}
function openOverview(src) {
  var id = App.id, st = { loc: locGet(id), short: false };
  var p0 = progGet(id);
  if (p0 && p0.src && sameSrc(p0.src, src)) { if (p0.loc !== undefined && p0.loc !== null) st.loc = p0.loc; st.short = !!p0.short; }
  var lay = Layers.push(h('<div></div>'), { onClose: function () { renderTab(); } });
  function day() {
    if (src.type === 'routine') { var r = routineById(id, src.rid); return r ? routineDay(id, r) : null; }
    var d = sessions(id).filter(function (x) { return x.key === src.key; })[0];
    return d ? resolveDay(id, d, { loc: st.loc, short: st.short }) : null;
  }
  function render() {
    var rd = day(); if (!rd) { Layers.pop(); return; }
    var r = src.type === 'routine' ? routineById(id, src.rid) : null;
    if (rd.type === 'run') { renderRun(rd); return; }
    var mins = r ? routineMinutes(r.moves.map(function (m) { return [m[0], schemeWithEdits(id, m[0], m[1])]; })) : dayMinutes(id, rd, st.short);
    var prog = progGet(id), resume = prog && prog.src && sameSrc(prog.src, src) && prog.loc === st.loc && !!prog.short === st.short ? prog : null;
    var locs = locsOf(id), html = '';
    html += '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button>' +
      (r && r.mine ? '<button class="icon-btn" data-act="rmore" aria-label="Routine options">' + I.more + '</button>' : '') + '</div>';
    html += '<div class="ov-title">' + (r ? '<span class="eyebrow">' + (r.kind === 'stretch' ? 'Stretch' : 'Quick strength') + '</span>' :
      '<span class="eyebrow">' + esc(sessionTag(rd) || 'Workout') + '</span>') +
      '<div style="display:flex;align-items:flex-start;gap:8px"><h1 style="flex:1">' + esc(r ? r.title : rd.title) + '</h1>' +
      (!r ? '<button class="icon-btn" data-act="rename" aria-label="Rename this workout" style="margin-top:14px">' + I.edit + '</button>' : '') + '</div><p>' + mins + ' min · ' + dayMoves(rd) + ' moves' + (r && r.blurb ? ' · ' + esc(r.blurb) : '') + '</p></div>';
    if (!r) {
      html += '<div class="segs">';
      if (locs) html += '<div class="seg" role="group" aria-label="Where are you?">' + Object.keys(locs).map(function (k) {
        return '<button data-loc="' + k + '" class="' + (k === st.loc ? 'on' : '') + '">' + esc(locs[k]) + '</button>'; }).join('') + '</div>';
      html += '<div class="seg" role="group" aria-label="How long?"><button data-short="0" class="' + (!st.short ? 'on' : '') + '">Full · ' + dayMinutes(id, rd, false) + ' min</button>' +
        '<button data-short="1" class="' + (st.short ? 'on' : '') + '">Short · ' + (ATHLETES[id].quickMin || 10) + ' min</button></div>';
      html += '</div>';
    }
    if (!store.raw('trainops:tip:hold')) html += '<div class="tip"><span>Tap any move to see how it’s done. Press and hold to change it.</span><button data-act="tip">Got it</button></div>';
    rd.groups.forEach(function (g) {
      html += '<section class="grp' + (g.kind === 'pair' ? ' pair' : '') + '"><div class="grp-h"><span>' + esc(g.title) + '</span><span>' +
        (g.kind === 'pair' ? '' : g.items.length + (g.items.length === 1 ? ' move' : ' moves')) + '</span></div><div class="card grp-b">';
      g.items.forEach(function (it) {
        html += '<div class="mv" role="button" tabindex="0" data-iid="' + it.id + '">' + figHTML(it.name, 56, id) +
          '<span class="tx"><b>' + esc(it.name) + '</b><small>' + esc(schemeText(it.scheme)) + (it.swapped ? ' · <em>swapped</em>' : '') + '</small></span>' +
          '<button class="more" data-more="' + it.id + '" aria-label="Change ' + esc(it.name) + '">' + I.more + '</button></div>';
      });
      html += '</div></section>';
    });
    html += '</div><div class="foot"><div class="in"><button class="btn" data-act="start">' + I.play +
      (resume ? 'Resume · ' + (resume.mi + 1) + ' of ' + resume.moves : 'Start') + '</button>' +
      (resume ? '<button class="link" data-act="restart">Start over</button>' : '') + '</div></div>';
    lay.innerHTML = html;
    var items = {}; rd.groups.forEach(function (g) { g.items.forEach(function (it) { items[it.id] = it; }); });
    var ctx = { id: id, src: src, rd: rd, loc: st.loc, onChange: render };
    on(lay, '[data-act="back"]', 'click', function () { Layers.pop(); });
    on(lay, '[data-act="tip"]', 'click', function () { store.setRaw('trainops:tip:hold', '1'); render(); });
    on(lay, '[data-loc]', 'click', function (e, b) { st.loc = b.dataset.loc; locSet(id, st.loc); render(); });
    on(lay, '[data-short]', 'click', function (e, b) { st.short = b.dataset.short === '1'; render(); });
    on(lay, '[data-act="start"]', 'click', function () {
      Sound.unlock();
      var p = progGet(id), res = p && p.src && sameSrc(p.src, src) && p.loc === st.loc && !!p.short === st.short ? p : null;
      startPlayer(src, day(), st, res, render);
    });
    on(lay, '[data-act="restart"]', 'click', function () { progClear(id); Sound.unlock(); startPlayer(src, day(), st, null, render); });
    on(lay, '[data-act="rmore"]', 'click', function () { routineMenu(r); });
    on(lay, '[data-act="rename"]', 'click', function () {
      var d0 = sessions(id).filter(function (x) { return x.key === src.key; })[0];
      if (d0) openRename(id, d0, render);
    });
    $$('.mv', lay).forEach(function (row) {
      var it = items[row.dataset.iid];
      holdable(row, function () { openMoveSheet(ctx, it, 'edit'); });
      row.addEventListener('click', function (e) { if (e.target.closest('.more')) return; openMoveSheet(ctx, it, 'info'); });
      row.addEventListener('keydown', function (e) { if (e.key === 'Enter') openMoveSheet(ctx, it, 'info'); });
    });
    on(lay, '[data-more]', 'click', function (e, b) { e.stopPropagation(); openMoveSheet(ctx, items[b.dataset.more], 'edit'); });
  }
  function renderRun(rd) {
    var d = sessions(id).filter(function (x) { return x.key === src.key; })[0], run = d.run || {}, L = d.level;
    lay.innerHTML = '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button></div>' +
      '<div class="ov-title"><span class="eyebrow">' + esc(sessionTag(d) || 'Workout') + '</span><h1>Run day</h1><p>' + (L ? 'Level ' + (L.i + 1) + ' of ' + L.n + ' · ' : '') + esc(d.dur || '') + '</p></div>' +
      '<div style="display:flex;justify-content:center;margin:18px 0">' + figHTML('Run', 180, id, { pose: 'run' }) + '</div>' +
      '<div class="card list">' + (run.warm ? '<div class="li" style="cursor:default"><span class="grow"><span class="cap">Warm up</span><b style="display:block;font-weight:600">' + esc(run.warm) + '</b></span></div>' : '') +
      '<div class="li" style="cursor:default"><span class="grow"><span class="cap">Run</span><b style="display:block;font-weight:600">' + esc(run.extra || d.title) + '</b></span></div>' +
      (run.cool ? '<div class="li" style="cursor:default"><span class="grow"><span class="cap">Cool down</span><b style="display:block;font-weight:600">' + esc(run.cool) + '</b></span></div>' : '') + '</div>' +
      (L ? '<p class="muted" style="font-size:14px;margin:12px 4px 0">Moves up a level every ' + L.per + ' runs. Too easy or too hard? Use ⋯ on the Today card.</p>' : '') +
      '</div><div class="foot"><div class="in"><button class="btn" data-act="ran">' + I.check + 'I did my run</button><button class="link" data-act="timer">Use the interval timer</button></div></div>';
    on(lay, '[data-act="back"]', 'click', function () { Layers.pop(); });
    on(lay, '[data-act="ran"]', 'click', function () {
      var isToday = todaySession(id) && todaySession(id).key === d.key && !rotationState(id).doneToday;
      Layers.pop(); logRunFlow(isToday ? d : null, false);
    });
    on(lay, '[data-act="timer"]', 'click', function () { openRunTimer(d); });
  }
  render();
  return lay;
}
function sameSrc(a, b) { return a && b && a.type === b.type && a.key === b.key && a.rid === b.rid; }

/* ---------- move sheet: how-to + change it ---------- */
function moveInfoHTML(id, name, item) {
  var cues = cuesFor(item || { name: name }), v = videoFor(name), hist = setsGet(id)[name];
  var o = '';
  if (cues && cues.length) o += '<ul class="cues">' + cues.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>';
  if (hist && hist.last) o += '<p class="muted" style="margin:12px 0 0;font-size:15px">Last time: ' + (hist.last.w ? hist.last.w + ' lb × ' : '') + hist.last.r +
    ' reps (' + daysAgoText(hist.last.d) + ')' + (hist.best && hist.best.w ? ' · Best: ' + hist.best.w + ' lb × ' + hist.best.r : '') + '</p>';
  o += v ? videoHTML(v) : '<a class="link" style="display:inline-block;padding-left:0" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' +
    encodeURIComponent(name + ' how to') + '">Find a video</a>';
  return o;
}
function openMoveSheet(ctx, item, mode) {
  var id = ctx.id, isPlan = ctx.src && ctx.src.type === 'plan';
  function key() { return ctx.rd.key + '|' + (ctx.loc || 'home') + '|' + item.id; }
  function render() {
    var p = parseScheme(item.scheme), ed = editsGet(id)[item.name] || {}, mods = modsGet(id), changed = !!(isPlan && mods[key()]) || !!editsGet(id)[item.name];
    var head = '<div style="display:flex;gap:14px;align-items:center;margin-bottom:6px">' + figHTML(item.name, 76, id) +
      '<div><h2>' + esc(item.name) + '</h2><div class="muted" data-scheme style="font-size:15px;margin-top:2px">' + esc(schemeText(item.scheme)) + '</div>' +
      (item.note ? '<div style="font-size:14px;color:var(--ink2);margin-top:4px">' + esc(item.note) + '</div>' : '') + '</div></div>';
    var info = '<div>' + moveInfoHTML(id, item.name, item) + '</div>';
    var edit = '';
    if (isPlan && !item.cool) {
      var alts = alternativesFor(item.name, ctx.loc);
      if (alts.length) edit += '<h3 style="font-size:17px;margin:18px 0 8px">Swap for</h3><div class="swaps">' + alts.map(function (n) {
        return '<button data-swap="' + esc(n) + '">' + figHTML(n, 72, id) + '<span>' + esc(n) + '</span></button>'; }).join('') + '</div>';
    }
    // sets / reps / seconds — saved straight away, for this move everywhere
    var rows = '';
    if (p.kind === 'timed') {
      var w0 = p.phases.filter(function (x) { return x.kind === 'work'; })[0];
      var setsT = ed.sets || ((String(item.scheme).match(/^(\d+)\s*×/) || [])[1] | 0) || 1;
      rows += stepRow('Sets', setsT, 'sets'); rows += stepRow('Seconds', ed.secs || (w0 ? w0.secs : 30), 'secs');
    } else if (p.kind === 'reps' || p.kind === 'max') {
      rows += stepRow('Sets', ed.sets || p.sets || 1, 'sets');
      if (p.kind === 'reps') rows += stepRow('Reps', ed.reps != null ? ed.reps : p.lo, 'reps');
    } else if (p.kind === 'count' && p.sets > 1) rows += stepRow('Sets', ed.sets || p.sets, 'sets');
    if (rows) edit += '<h3 style="font-size:17px;margin:18px 0 2px">Sets &amp; reps</h3>' + rows +
      '<p class="muted" style="font-size:13px;margin:0 0 6px">Changes apply wherever ' + esc(item.name) + ' shows up.</p>';
    var acts = '';
    if (isPlan) acts += '<button class="opt danger" data-act="rm">' + I.trash + 'Remove from this workout</button>';
    if (changed) acts += '<button class="opt" data-act="reset">' + I.reset + 'Reset to original</button>';
    var html = head + (mode === 'edit' ? edit + acts + '<h3 style="font-size:17px;margin:18px 0 0">How to do it</h3>' + info : info + edit + acts) +
      '<button class="btn soft sm" style="margin-top:18px" data-act="close">Done</button>';
    var el = Sheet.open(html);
    wireVideo(el);
    on(el, '[data-act="close"]', 'click', function () { Sheet.close(); });
    on(el, '[data-swap]', 'click', function (e, b) {
      var m = modsGet(id), k = key(), prev = m[k] ? clone(m[k]) : null;
      m[k] = { swap: b.dataset.swap }; modsSave(id, m); Sheet.close(); ctx.onChange();
      toast('Swapped to ' + b.dataset.swap, 'Undo', function () { var m2 = modsGet(id); if (prev) m2[k] = prev; else delete m2[k]; modsSave(id, m2); ctx.onChange(); });
    });
    on(el, '[data-act="rm"]', 'click', function () {
      var m = modsGet(id), k = key(), prev = m[k] ? clone(m[k]) : null;
      m[k] = { rm: 1 }; modsSave(id, m); Sheet.close(); ctx.onChange();
      toast('Removed ' + item.name, 'Undo', function () { var m2 = modsGet(id); if (prev) m2[k] = prev; else delete m2[k]; modsSave(id, m2); ctx.onChange(); });
    });
    on(el, '[data-act="reset"]', 'click', function () {
      var m = modsGet(id); delete m[key()]; modsSave(id, m);
      var e2 = editsGet(id); delete e2[item.name]; editsSave(id, e2);
      Sheet.close(); ctx.onChange(); toast('Back to the original');
    });
    on(el, '[data-step]', 'click', function (e, b) {
      var f = b.dataset.step, d = +b.dataset.d, all = editsGet(id), cur = all[item.name] || {};
      var span = $('[data-val="' + f + '"]', el), v = +span.textContent;
      var lim = { sets: [1, 8, 1], reps: [1, 60, 1], secs: [10, 300, 5] }[f];
      v = Math.max(lim[0], Math.min(lim[1], v + d * lim[2]));
      span.textContent = v;
      cur[f] = v;
      if (f !== 'sets' && cur.sets == null) cur.sets = +($('[data-val="sets"]', el) || { textContent: 1 }).textContent;
      if (f === 'sets' && p.kind === 'timed' && cur.secs == null) { var w1 = p.phases.filter(function (x) { return x.kind === 'work'; })[0]; cur.secs = w1 ? w1.secs : 30; }
      all[item.name] = cur; editsSave(id, all);
      item.scheme = schemeWithEdits(id, item.name, itemBaseScheme(ctx, item) || item.scheme);
      var sc = $('[data-scheme]', el); if (sc) sc.textContent = schemeText(item.scheme);
      ctx.onChange();
    });
  }
  function stepRow(label, val, f) {
    return '<div class="stepper-row"><b>' + label + '</b><div class="step"><button data-step="' + f + '" data-d="-1" aria-label="Fewer ' + label.toLowerCase() + '">−</button>' +
      '<span data-val="' + f + '">' + val + '</span><button data-step="' + f + '" data-d="1" aria-label="More ' + label.toLowerCase() + '">+</button></div></div>';
  }
  render();
}
// the plan's own scheme for an item (before personal sets/reps edits)
function itemBaseScheme(ctx, item) {
  try {
    if (ctx.src.type === 'routine') { var r = routineById(ctx.id, ctx.src.rid); var m = r.moves[+String(item.id).split('_')[1]]; return m && m[1]; }
    if (item.cool) { var cd = COOLDOWNS[ctx.id + ':' + ctx.rd.key] || COOLDOWNS['default:strength']; return cd[+item.id.split('_')[1]][1]; }
    var d = sessions(ctx.id).filter(function (x) { return x.key === ctx.rd.key; })[0];
    var raw = d.groups[item.gi].items[item.xi];
    return itemAt(raw, ctx.loc, locsOf(ctx.id)).scheme;
  } catch (e) { return null; }
}

/* ---------- player ---------- */
function restFor(g, short) {
  var r = { warm: 10, cool: 0, flow: 0, pair: 40, finish: 45, main: 60 }[g.kind];
  if (r == null) r = 60;
  return short ? Math.min(r, 30) : r;
}
function buildSteps(rd, short) {
  var steps = [], moves = [];
  rd.groups.forEach(function (g) {
    if (g.kind === 'pair') {
      var ps = g.items.map(function (it) { var p = parseScheme(it.scheme); var mi = moves.length; moves.push(it); return { it: it, p: p, mi: mi, n: p.kind === 'timed' ? 1 : (p.sets || 1) }; });
      var rounds = Math.max.apply(null, ps.map(function (x) { return x.n; }));
      for (var r = 1; r <= rounds; r++) {
        ps.forEach(function (x) { if (r <= x.n) steps.push({ it: x.it, p: x.p, g: g, mi: x.mi, set: r, sets: x.n, round: r, rounds: rounds }); });
        steps.push({ rest: restFor(g, short), g: g });
      }
    } else {
      g.items.forEach(function (it) {
        var p = parseScheme(it.scheme), mi = moves.length; moves.push(it);
        if (p.kind === 'timed') { steps.push({ it: it, p: p, g: g, mi: mi, set: 1, sets: 1 }); return; }
        var n = p.sets || 1;
        for (var k = 1; k <= n; k++) {
          steps.push({ it: it, p: p, g: g, mi: mi, set: k, sets: n });
          if (k < n) steps.push({ rest: restFor(g, short), g: g });
        }
        if (g.kind === 'main' || g.kind === 'finish') steps.push({ rest: restFor(g, short), g: g });
      });
    }
  });
  // no rest before a cool-down / timed move's own get-ready, none at the end, none doubled
  var out = [];
  steps.forEach(function (s, i) {
    if (!('rest' in s)) { out.push(s); return; }
    var nx = steps[i + 1];
    if (!s.rest || !nx || ('rest' in nx) || nx.g.kind === 'cool' || (out.length && ('rest' in out[out.length - 1]))) return;
    out.push(s);
  });
  return { steps: out, moves: moves };
}

function startPlayer(src, rd, st, resume, onExit) {
  var id = App.id, built = buildSteps(rd, st.short), steps = built.steps, N = built.moves.length;
  if (!steps.length) { toast('Nothing to do here — add a move first'); return; }
  var i = resume ? Math.min(resume.step || 0, steps.length - 1) : 0;
  var timer = null, el = h('<div></div>'), firstTimed = true, closed = false;
  var R = 45, CIRC = 2 * Math.PI * R;
  Layers.push(el, { white: true, onClose: function () { closed = true; stopTimer(); Wake.off(); try { speechSynthesis.cancel(); } catch (e) {} if (onExit && !finished) onExit(); } });
  Wake.on();
  var finished = false;
  function stopTimer() { if (timer) { timer.stop(); timer = null; } }
  function save() {
    var s0 = steps[i], mi = s0 ? ('rest' in s0 ? (nextMove(i) || {}).mi : s0.mi) : 0;
    progSet(id, { src: src, loc: st.loc, short: st.short, step: i, mi: mi || 0, moves: N });
  }
  function header(s) {
    var sub = s.rest ? 'Rest' : s.g.kind === 'pair' ? s.g.title.split(' · ')[0] + ' · Round ' + s.round + ' of ' + s.rounds : s.g.title;
    var mi = s.rest ? nextMove(i).mi : s.mi;
    return '<div class="lhead"><button class="icon-btn" data-act="exit" aria-label="Close">' + I.x + '</button>' +
      '<div class="mid"><b>' + (Math.min(mi, N - 1) + 1) + ' of ' + N + '</b><span class="cap">' + esc(sub) + '</span></div>' +
      '<button class="icon-btn" data-act="menu" aria-label="More options">' + I.more + '</button></div>';
  }
  function nextMove(from) { for (var j = from + 1; j < steps.length; j++) if (!steps[j].rest) return steps[j]; return null; }
  function ring(frac, cls, figName, figPose) {
    return '<div class="ringwrap"><svg class="ring ' + (cls || '') + '" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="' + R + '"/>' +
      '<circle class="val" cx="50" cy="50" r="' + R + '" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="' + (CIRC * (1 - frac)).toFixed(1) + '"/></svg>' +
      '<div class="figbox">' + figHTML(figName, 260, id, { pose: figPose, label: true }) + '</div></div>';
  }
  function setRing(frac) { var v = $('.ring .val', el); if (v) v.style.strokeDashoffset = (CIRC * (1 - Math.max(0, Math.min(1, frac)))).toFixed(1); }
  function nameRow(it) {
    return '<div class="pl-name"><h1>' + esc(it.name) + '</h1><button class="info" data-act="info" aria-label="How to do ' + esc(it.name) + '">' + I.info + '</button></div>';
  }
  function wireCommon(s) {
    on(el, '[data-act="exit"]', 'click', function () { save(); Layers.pop(); toast('Saved — pick up where you left off'); });
    on(el, '[data-act="menu"]', 'click', function () { menu(s); });
    on(el, '[data-act="info"]', 'click', function () {
      var t = timer, wasRunning = t && !t.paused(); if (wasRunning) { t.pause(); updatePause(); }
      var sh = Sheet.open('<div style="display:flex;gap:14px;align-items:center">' + figHTML(s.it.name, 64, id) + '<h2>' + esc(s.it.name) + '</h2></div>' +
        (s.it.note ? '<p style="margin:10px 0 0;color:var(--ink2)">' + esc(s.it.note) + '</p>' : '') + moveInfoHTML(id, s.it.name, s.it) +
        '<button class="btn soft sm" style="margin-top:18px" data-act="close">Back to it</button>', { onClose: function () { if (wasRunning && timer === t && t.paused()) { t.resume(); updatePause(); } } });
      wireVideo(sh); on(sh, '[data-act="close"]', 'click', function () { Sheet.close(); });
    });
    on(el, '[data-act="prev"]', 'click', function () { go(prevIndex()); });
    on(el, '[data-act="skip"]', 'click', function () { go(skipIndex()); });
  }
  function prevIndex() { var j = i - 1; while (j > 0 && steps[j].rest) j--; return Math.max(0, j); }
  function skipIndex() {      // skip the rest of this move (all its sets)
    var s = steps[i], j = i + 1;
    if (s.rest) return j;
    while (j < steps.length && (steps[j].rest || (steps[j].it === s.it && s.g.kind !== 'pair'))) j++;
    return j;
  }
  function go(j) {
    if (closed) return;
    stopTimer();
    try { speechSynthesis.cancel(); } catch (e) {}
    i = j;
    if (i >= steps.length) { finish(); return; }
    save(); show();
  }
  function updatePause() {
    var b = $('[data-act="pause"]', el); if (!b || !timer) return;
    var p = timer.paused(); b.innerHTML = p ? I.play : I.pause; b.setAttribute('aria-label', p ? 'Resume' : 'Pause');
  }
  function menu(s) {
    var inCool = s.g && s.g.kind === 'cool';
    var html = '<h2 style="margin-bottom:6px">Options</h2>' +
      '<button class="opt" data-m="sound">' + (Sound.on() ? I.sound + 'Sounds &amp; voice: on' : I.mute + 'Sounds &amp; voice: off') + '</button>' +
      (inCool ? '<button class="opt" data-m="cool">' + I.next + 'Skip the cool-down</button>' : '') +
      '<button class="opt" data-m="finish">' + I.check + 'Finish now</button>' +
      '<button class="btn soft sm" style="margin-top:14px" data-m="close">Close</button>';
    var sh = Sheet.open(html);
    on(sh, '[data-m="sound"]', 'click', function () { Sound.set(!Sound.on()); Sheet.close(); toast(Sound.on() ? 'Sounds on' : 'Sounds off'); });
    on(sh, '[data-m="cool"]', 'click', function () { Sheet.close(); finish(); });
    on(sh, '[data-m="finish"]', 'click', function () { Sheet.close(); if (confirm('Finish now and log this workout?')) finish(); });
    on(sh, '[data-m="close"]', 'click', function () { Sheet.close(); });
  }

  function show() {
    var s = steps[i];
    el.scrollTop = 0;
    if (s.rest) return showRest(s);
    if (s.p.kind === 'timed') return showTimed(s);
    return showReps(s);
  }

  function showRest(s) {
    var nx = nextMove(i), np = nx && nx.p;
    var nextTxt = nx ? nx.it.name + (np.kind === 'reps' ? ' · ' + np.label + ' reps' + (np.side ? ' / side' : '') : '') : '';
    el.innerHTML = '<div class="pl">' + header(s) + ring(1, 'rest', nx ? nx.it.name : 'Child\'s Pose') +
      '<div class="pl-lab">Rest</div><div class="pl-big" data-t>' + fmtSecs(s.rest) + '</div>' +
      '<div class="pl-sub">' + (nx ? 'Next: ' + esc(nextTxt) + (nx.set > 1 ? ' · set ' + nx.set + ' of ' + nx.sets : '') : '') + '</div>' +
      '<div class="pl-ctrl"><button class="round-btn" data-act="add" aria-label="Add 15 seconds"><span style="font-weight:800;font-size:15px">+15s</span></button>' +
      '<button class="btn" data-act="skip">Skip rest</button></div></div>';
    wireCommon(s);
    var said = false;
    timer = Countdown(s.rest, function (left, total) {
      $('[data-t]', el).textContent = fmtSecs(left); setRing(left / total);
      if (left === 5 && nx && !said) { said = true; Sound.say('Next: ' + nx.it.name); }
      if (left > 0 && left <= 3) Sound.tick();
    }, function () { Sound.go(); go(i + 1); });
    on(el, '[data-act="add"]', 'click', function () { if (timer) timer.add(15); });
  }

  function showTimed(s) {
    var it = s.it, phases = s.p.phases, isFlow = s.g.kind === 'flow' || s.g.kind === 'cool';
    var ready = firstTimed ? 10 : 5; firstTimed = false;
    var seq = [{ kind: 'ready', lab: 'Get ready', secs: ready }].concat(phases), k = 0;
    el.innerHTML = '<div class="pl">' + header(s) + ring(1, '', it.name) + nameRow(it) +
      '<div class="pl-sub">' + esc(it.note || (cuesFor(it)[0] || '')) + '</div>' +
      '<div class="pl-lab" data-lab>Get ready</div><div class="pl-big" data-t>' + fmtSecs(ready) + '</div>' +
      '<div class="pl-ctrl"><button class="round-btn" data-act="prev" aria-label="Previous">' + I.prev + '</button>' +
      '<button class="round-btn big" data-act="pause" aria-label="Pause">' + I.pause + '</button>' +
      '<button class="round-btn" data-act="skip" aria-label="Skip">' + I.next + '</button></div></div>';
    wireCommon(s);
    on(el, '[data-act="pause"]', 'click', function () { if (timer) { timer.toggle(); updatePause(); } });
    function run() {
      var ph = seq[k];
      $('[data-lab]', el).textContent = ph.lab || (ph.kind === 'work' ? 'Go' : '');
      $('.ring', el).classList.toggle('rest', ph.kind !== 'work');
      if (ph.kind === 'ready') Sound.say((isFlow && i > 0 ? 'Next: ' : 'Get ready: ') + it.name + (phases.length > 1 && /side/i.test(phases[0].lab) ? ', right side' : ''));
      else if (ph.kind === 'work') { Sound.go(); if (k > 1 && /left/i.test(ph.lab)) Sound.say('Left side'); }
      else if (ph.kind === 'switch') { Sound.chime(); Sound.say('Switch sides'); }
      else if (ph.kind === 'rest') { Sound.chime(); Sound.say('Rest'); }
      timer = Countdown(ph.secs, function (left, total) {
        $('[data-t]', el).textContent = fmtSecs(left); setRing(left / total);
        if (left > 0 && left <= 3 && ph.kind !== 'switch') Sound.tick();
      }, function () {
        k++;
        if (k < seq.length) { run(); return; }
        Sound.chime();
        setTimeout(function () { if (!closed && steps[i] === s) go(i + 1); }, 900);
      });
      updatePause();
    }
    run();
  }

  function showReps(s) {
    var it = s.it, p = s.p, warm = s.g.kind === 'warm', loggable = (p.kind === 'reps' || p.kind === 'max') && !warm;
    var weighted = loggable && needsWeight(it.name);
    var sug = suggestion(id, it.name, p), w = weighted ? sug.w : 0, reps = sug.r || p.lo || 10;
    if (p.kind === 'reps' && (reps < p.lo || reps > p.hi)) reps = p.lo;
    var showReps = p.kind === 'max';
    var big = p.kind === 'max' ? 'Max<small>reps</small>' : p.kind === 'count' ? esc(p.label) + (p.unit || p.side ? '<small>' + (p.unit || '') + (p.side ? ' / side' : '') + '</small>' : '') :
      esc(p.label) + '<small>' + (p.unit || 'reps') + (p.side ? ' / side' : '') + '</small>';
    var dots = ''; for (var d = 1; d <= s.sets; d++) dots += '<i class="' + (d < s.set ? 'on' : d === s.set ? 'cur' : '') + '"></i>';
    function render() {
      el.innerHTML = '<div class="pl reps">' + header(s) + ring((s.set - 1) / s.sets, '', it.name) + nameRow(it) +
        '<div class="pl-sub">' + esc(it.note || '') + '</div>' +
        '<button class="pl-big" data-act="reps" style="background:none;border:0;color:inherit;cursor:pointer">' + big + '</button>' +
        (s.sets > 1 ? '<div class="pl-lab">' + (s.g.kind === 'pair' ? 'Set ' : 'Set ') + s.set + ' of ' + s.sets + '<span class="setdots">' + dots + '</span></div>' : '') +
        (showReps && loggable ? '<div class="wt"><b>Reps done</b><div class="step"><button data-r="-1" aria-label="Fewer reps">−</button><span data-rv>' + reps + '</span><button data-r="1" aria-label="More reps">+</button></div></div>' : '') +
        (weighted ? '<div class="wt"><b>Weight</b><div class="step"><button data-w="-1" aria-label="Less weight">−</button><span data-wv>' + w + ' lb</span><button data-w="1" aria-label="More weight">+</button></div></div>' : '') +
        (weighted && sug.hint ? '<div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap"><span class="muted" style="font-size:14px">' + esc(sug.hint) + '</span>' +
          (sug.tryW && w !== sug.tryW ? '<button class="try" data-act="try">Use ' + sug.tryW + ' lb</button>' : '') + '</div>' : '') +
        '<div class="pl-ctrl"><button class="round-btn" data-act="prev" aria-label="Previous">' + I.prev + '</button>' +
        '<button class="btn" data-act="done">' + I.check + 'Done</button>' +
        '<button class="round-btn" data-act="skip" aria-label="Skip">' + I.next + '</button></div></div>';
      wireCommon(s);
      on(el, '[data-act="reps"]', 'click', function () { if (loggable && !showReps) { showReps = true; render(); } });
      on(el, '[data-r]', 'click', function (e, b) { reps = Math.max(0, reps + +b.dataset.r); $('[data-rv]', el).textContent = reps; });
      on(el, '[data-w]', 'click', function (e, b) { w = Math.max(0, w + (+b.dataset.w) * (w >= 50 ? 5 : 5)); $('[data-wv]', el).textContent = w + ' lb'; });
      on(el, '[data-act="try"]', 'click', function () { w = sug.tryW; render(); });
      on(el, '[data-act="done"]', 'click', function () {
        if (loggable) recordSet(id, it.name, weighted ? w : 0, reps);
        Sound.tone(880, 90, 0.2);
        go(i + 1);
      });
    }
    if (i === 0 || steps[i - 1].rest || steps[i - 1].it !== it) Sound.say(it.name + (p.kind === 'reps' ? ', ' + p.label + ' reps' : ''));
    render();
  }

  function finish() {
    if (closed) return;
    finished = true; stopTimer(); progClear(id); Wake.off();
    showFinish(src, rd, st);
  }
  show();
}

/* ---------- finish ---------- */
function showFinish(src, rd, st) {
  var id = App.id, a = ATHLETES[id], isPlan = src.type === 'plan';
  var r = !isPlan ? routineById(id, src.rid) : null;
  if (isPlan) logSession(id, rd, { short: st.short, loc: st.loc });
  else addStretchLog(id, r.id, r.title, routineMinutes(r.moves));
  Sound.done(); Sound.say(isPlan ? 'Workout done. Nice work!' : 'All done. Nice!');
  var n = weekCount(id), T = weeklyTarget(id), rot = rotationState(id);
  var nxt = isPlan && rot.days.length ? rot.days[(rot.next + 1) % rot.days.length] : null;
  var el = h('<div></div>');
  function render() {
    var e = logGet(id)[todayISO()] || {};
    el.innerHTML = '<div class="lwrap fin"><div class="bigcheck"><i>' + I.check.replace('stroke="currentColor"', 'stroke="#fff"') + '</i></div>' +
      '<h1>Nice work, ' + esc(personName(id)) + '!</h1>' +
      '<p style="text-align:center;margin:-6px 0 0;font-size:17px;color:var(--ink2)">' + esc(isPlan ? rd.title + ' done' : r.title + ' done · ' + routineMinutes(r.moves) + ' min') +
      (isPlan ? ' · ' + n + ' of ' + T + ' this week' : '') + '</p>' +
      (isPlan ? '<div style="display:flex;justify-content:center">' + dotsHTML(n, T) + '</div>' : '') +
      (isPlan && a.check ? '<div class="card" style="padding:18px"><div style="font-size:18px;font-weight:700;text-align:center;margin-bottom:12px">How’s your ' + esc(a.check) + '?</div>' +
        '<div class="choices">' + [1, 2, 3].map(function (k) { return '<button class="choice' + (e.si === k ? ' on' : '') + '" data-si="' + k + '">' + CHECK_LABELS[k] + '</button>'; }).join('') + '</div></div>' : '') +
      (nxt ? '<div class="card" style="display:flex;align-items:center;gap:14px;padding:12px 16px 12px 12px">' + figHTML(repName(nxt), 52, id) +
        '<div><span class="cap">Next time</span><div style="font-size:16px;font-weight:600">' + esc(sessionFull(nxt)) + '</div></div></div>' : '') +
      '</div><div class="foot"><div class="in"><button class="btn" data-act="fin">Finish</button></div></div>';
    on(el, '[data-si]', 'click', function (ev, b) { logCheck(id, +b.dataset.si); render(); if (+b.dataset.si === 3) toast('Noted — next time goes easier on it'); });
    on(el, '[data-act="fin"]', 'click', function () { Layers.closeAll(); App.tab = 'today'; renderTab(); });
  }
  Layers.closeAll();
  Layers.push(el, { onClose: function () { renderTab(); } });
  render();
}
// the move that best represents a session (its first strength move)
function repName(d) {
  if (d.type === 'run') return 'Run';
  var gs = d.groups || [], g = gs.filter(function (x) { return !/warm/i.test(x.label || ''); })[0] || gs[0];
  return g && g.items[0] ? g.items[0].name : 'Goblet Squat';
}

/* ---------- run: interval timer ---------- */
function minsIn(text, dflt) { var m = String(text || '').match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*min/i); return m ? +m[1] * 60 : dflt; }
function runPhases(d) {
  var run = d.run || {}, ph = [];
  if (run.warm) ph.push({ lab: 'Warm-up', say: 'Warm up. ' + run.warm, secs: minsIn(run.warm, 180), easy: true });
  var iv = parseIntervals(run.extra || '');
  if (iv) {
    for (var r = 0; r < iv.rounds; r++) {
      if (iv.startEasy) ph.push({ lab: iv.easyLab === 'WALK' ? 'Walk' : 'Easy', secs: iv.easy, easy: true, round: r + 1, rounds: iv.rounds });
      ph.push({ lab: iv.workLab === 'JOG' ? 'Jog' : 'Hard', secs: iv.work, round: r + 1, rounds: iv.rounds });
      if (!iv.startEasy) ph.push({ lab: iv.easyLab === 'WALK' ? 'Walk' : 'Easy', secs: iv.easy, easy: true, round: r + 1, rounds: iv.rounds });
    }
  } else {
    var segs = String(run.extra || '').replace(/^[^:]*:\s*/, '').split(/\s*,\s*/).map(function (x) { var m = x.match(/(\d+)\s*min\s*(.*)/i); return m ? { mins: +m[1], what: m[2] } : null; }).filter(Boolean);
    if (segs.length > 1) segs.forEach(function (g) {
      var hard = /hard|fast|tempo/i.test(g.what);
      ph.push({ lab: hard ? 'Comfortably hard' : 'Easy', say: g.what || 'Run', secs: g.mins * 60, easy: !hard });
    });
    else ph.push({ lab: 'Run', say: run.extra || 'Run', secs: minsIn(run.extra, 20 * 60) });
  }
  if (run.cool) ph.push({ lab: 'Cool-down', say: 'Cool down. ' + run.cool, secs: minsIn(run.cool, 120), easy: true });
  return ph;
}
function toSecs(n, unit) { return /min/i.test(unit) ? Math.round(+n * 60) : Math.round(+n); }
function parseIntervals(text) {
  if (!text) return null;
  var m = text.match(/(\d+)(?:\s*[–-]\s*\d+)?\s*[×x]\s*\(?\s*(\d+(?:\.\d+)?)\s*(min|s)\b[^\/]*\/\s*(\d+(?:\.\d+)?)\s*(min|s)\b/i);
  if (m) return { rounds: +m[1], work: toSecs(m[2], m[3]), easy: toSecs(m[4], m[5]), workLab: 'HARD', easyLab: 'EASY', startEasy: false };
  var j = text.match(/jog\s*(\d+)\s*min\s*\/\s*walk\s*(\d+)\s*min(?:\s*[×x]\s*(\d+)(?:\s*[–-]\s*(\d+))?)?/i);
  if (j) return { rounds: +(j[4] || j[3] || 4), work: +j[1] * 60, easy: +j[2] * 60, workLab: 'JOG', easyLab: 'WALK', startEasy: false };
  return null;
}
function openRunTimer(d) {
  var id = App.id, ph = runPhases(d), k = 0, timer = null, el = h('<div></div>');
  var R = 45, CIRC = 2 * Math.PI * R;
  Sound.unlock();
  Layers.push(el, { white: true, onClose: function () { if (timer) timer.stop(); Wake.off(); try { speechSynthesis.cancel(); } catch (e) {} } });
  Wake.on();
  function show() {
    var p = ph[k];
    el.innerHTML = '<div class="pl"><div class="lhead"><button class="icon-btn" data-act="exit" aria-label="Close">' + I.x + '</button>' +
      '<div class="mid"><b>' + esc(d.title) + '</b><span class="cap">' + (p.round ? 'Round ' + p.round + ' of ' + p.rounds : p.lab) + '</span></div><span style="width:44px"></span></div>' +
      '<div class="ringwrap"><svg class="ring' + (p.easy ? ' rest' : '') + '" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="' + R + '"/><circle class="val" cx="50" cy="50" r="' + R +
      '" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="0"/></svg><div class="figbox">' + figHTML(p.easy ? 'Treadmill walk' : 'Run', 260, id, { pose: p.easy && POSES.walk ? 'walk' : 'run' }) + '</div></div>' +
      '<div class="pl-name"><h1>' + esc(p.lab) + '</h1></div><div class="pl-big" data-t>' + fmtSecs(p.secs) + '</div>' +
      '<div class="pl-sub">' + (ph[k + 1] ? 'Then: ' + esc(ph[k + 1].lab) + ' ' + fmtSecs(ph[k + 1].secs) : 'Last one!') + '</div>' +
      '<div class="pl-ctrl"><button class="round-btn" data-act="prev" aria-label="Previous">' + I.prev + '</button>' +
      '<button class="round-btn big" data-act="pause" aria-label="Pause">' + I.pause + '</button>' +
      '<button class="round-btn" data-act="skip" aria-label="Skip">' + I.next + '</button></div>' +
      '<p class="muted" style="font-size:13px;text-align:center;margin:0">Keep the screen on for voice cues — or run with Nike Run Club and just tap “I did my run”.</p></div>';
    on(el, '[data-act="exit"]', 'click', function () { Layers.pop(); });
    on(el, '[data-act="pause"]', 'click', function (e, b) { if (!timer) return; var pz = timer.toggle(); b.innerHTML = pz ? I.play : I.pause; b.setAttribute('aria-label', pz ? 'Resume' : 'Pause'); });
    on(el, '[data-act="prev"]', 'click', function () { if (timer) timer.stop(); k = Math.max(0, k - 1); show(); });
    on(el, '[data-act="skip"]', 'click', function () { if (timer) timer.stop(); next(); });
    Sound.go(); Sound.say(p.say || p.lab);
    timer = Countdown(p.secs, function (left, total) {
      $('[data-t]', el).textContent = fmtSecs(left);
      var v = $('.ring .val', el); if (v) v.style.strokeDashoffset = (CIRC * (1 - left / total)).toFixed(1);
      if (left > 0 && left <= 3) Sound.tick();
    }, next);
  }
  function next() {
    k++;
    if (k < ph.length) { show(); return; }
    Sound.done(); Sound.say('Run done. Great job!');
    Layers.pop();
    var isToday = todaySession(id) && todaySession(id).key === d.key && !rotationState(id).doneToday;
    logRunFlow(isToday ? d : null, true);
  }
  show();
}
