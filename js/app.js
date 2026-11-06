/* Screens: Today, History, Me + sheets (people, change session, goal, run log),
   Add a person, Make your own, exercise library. */
var App = { id: null, tab: 'today', calMonth: null };

var NUDGES = [
  "Just do the warm-up. You’re allowed to stop after that.",
  "One short session. Future you says thanks.",
  "Start with one move — momentum does the rest.",
  "Not feeling it? The short version still counts.",
  "Put your shoes on. That’s the whole first step.",
  "Showing up is the workout. The rest is details."
];

function renderTab() {
  if (!ATHLETES[App.id]) App.id = currentId();
  $$('#tabbar button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === App.tab); });
  var v = $('#view');
  if (App.tab === 'history') renderHistory(v);
  else if (App.tab === 'me') renderMe(v);
  else renderToday(v);
}

/* ---------- goal ---------- */
function goalInfo(id) {
  var c = cfgGet(id), date = c.goalDate || c.race || '', name = c.goalName || (c.race ? 'Race' : '');
  if (!date && !name) return null;
  var days = date ? daysBetween(todayISO(), date) : null;
  var when = days == null ? '' : days < 0 ? 'done' : days === 0 ? 'today!' : days === 1 ? 'tomorrow' : days < 21 ? days + ' days to go' : Math.round(days / 7) + ' weeks to go';
  return { name: name || 'Goal', date: date, days: days, when: when, past: days != null && days < 0 };
}
function openGoalEditor(id, after) {
  var g = goalInfo(id) || {}, past = g.past;
  var el = Sheet.open('<h2>Your goal</h2><p class="muted" style="margin:6px 0 0">Something to count down to — a race, a trip, a date.</p>' +
    '<div class="field"><label for="g-name">Goal</label><input id="g-name" maxlength="40" placeholder="e.g. Strong 5K" value="' + esc(past ? '' : g.name || '') + '"></div>' +
    '<div class="field"><label for="g-date">Date (optional)</label><input id="g-date" type="date" value="' + esc(past ? '' : g.date || '') + '"></div>' +
    '<div class="row-btns" style="margin-top:18px">' + (g.name ? '<button class="btn ghost sm" data-act="clear">Clear</button>' : '') + '<button class="btn sm" data-act="save">Save</button></div>');
  on(el, '[data-act="save"]', 'click', function () {
    var c = cfgGet(id), nm = $('#g-name', el).value.trim(), dt = $('#g-date', el).value;
    delete c.race;
    if (nm || dt) { c.goalName = nm || 'Goal'; if (dt) c.goalDate = dt; else delete c.goalDate; } else { delete c.goalName; delete c.goalDate; }
    cfgSet(id, c); Sheet.close(); after && after();
  });
  on(el, '[data-act="clear"]', 'click', function () { var c = cfgGet(id); delete c.goalName; delete c.goalDate; delete c.race; cfgSet(id, c); Sheet.close(); after && after(); });
}

/* ---------- Today ---------- */
function renderToday(v) {
  var id = App.id, a = ATHLETES[id], rot = rotationState(id), d = rot.days[rot.next];
  var log = logGet(id), todayE = log[todayISO()], prev = prevLog(id);
  var n = weekCount(id), T = weeklyTarget(id), hr = new Date().getHours();
  var hello = hr < 12 ? 'Good morning,' : hr < 17 ? 'Good afternoon,' : 'Good evening,';
  var g = goalInfo(id);
  var comeback = !todayE && prev && prev.gap >= 3, flare = a.check && prev && prev.entry && prev.entry.si === 3;
  var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  var nudge = rot.doneToday ? '' : flare ? 'Your ' + a.check + ' flared up last time — go lighter today and swap anything that hurts.'
    : comeback ? (prev.gap >= 14 ? 'Welcome back! Start easy — the short version is perfect today.' : 'Comeback day — the workout after a break matters most. Even the short version counts.')
    : todayE && todayE.t === 'run' ? 'Run logged. Lifting today is a bonus, not a must.'
    : n >= T ? 'Weekly goal hit — anything more is a bonus.' : NUDGES[dayOfYear % NUDGES.length];
  var html = '<div class="top"><div class="hello"><small>' + hello + '</small><b>' + esc(personName(id)) + '</b></div>' +
    '<button class="av" data-act="people" aria-label="Switch person" style="background:' + personColor(id) + '">' + esc(personName(id)[0] || '?') + '</button></div>';
  html += '<div class="card week"><div><b>' + n + ' of ' + T + ' this week</b>' +
    (g && !g.past ? '<div class="muted" style="font-size:14px;margin-top:2px">' + esc(g.name) + (g.when ? ' · ' + esc(g.when) : '') + '</div>' : '') + '</div>' + dotsHTML(n, T) + '</div>';
  if (nudge) html += '<p class="nudge' + (flare ? ' warn' : '') + '">' + esc(nudge) + '</p>';
  html += heroHTML(id, d, rot, todayE);

  // stretch + quick strength library: 4 each, "See all" for the rest
  var pick = stretchPickId(id), all = allRoutines(id);
  var stretches = all.filter(function (r) { return r.kind === 'stretch' && !r.baby; });
  stretches.sort(function (x, y) { return (y.id === pick) - (x.id === pick) || (y.mine ? 1 : 0) - (x.mine ? 1 : 0); });
  var strength = all.filter(function (r) { return r.kind === 'strength' && !r.baby; });
  var withBaby = all.filter(function (r) { return r.baby; });
  strength.sort(function (x, y) { return (y.mine ? 1 : 0) - (x.mine ? 1 : 0); });
  App.seeAll = App.seeAll || {};
  function section(key, title, list) {
    var open = App.seeAll[key], shown = open ? list : list.slice(0, 4);
    return '<div class="sec"><h2>' + title + '</h2>' + (list.length > 4 ? '<button class="link" data-all="' + key + '" style="padding:6px 0">' + (open ? 'Show less' : 'See all ' + list.length) + '</button>' : '') + '</div>' +
      '<div class="grid">' + shown.map(function (r) { return tileHTML(r, r.id === pick && key === 'stretch'); }).join('') + '</div>';
  }
  html += section('stretch', 'Stretch', stretches) + section('strength', 'Quick strength', strength) + (withBaby.length ? section('baby', 'With baby', withBaby) : '');
  html += '<button class="card li" data-act="make" style="margin-top:14px;padding:14px 16px"><span class="plusdot">' + I.plus + '</span>' +
    '<span class="grow"><b style="display:block;font-size:17px">Make your own</b><small>Pick the stretches or moves you like</small></span><span class="chev">' + I.chev + '</span></button>';
  v.innerHTML = html;

  function startPlan(short) {
    Sound.unlock();
    var p = progGet(id), res = p && p.src && p.src.type === 'plan' && p.src.key === d.key && !!p.short === !!short ? p : null;
    startPlayer({ type: 'plan', key: d.key }, resolveDay(id, d, { short: short }), { loc: null, short: short }, res, renderTab);
  }
  on(v, '[data-act="people"]', 'click', openPeople);
  on(v, '[data-act="start"]', 'click', function () { startPlan(false); });
  on(v, '[data-act="short"]', 'click', function () { startPlan(true); });
  on(v, '[data-act="peek"]', 'click', function () { openOverview({ type: 'plan', key: d.key }); });
  on(v, '[data-act="change"]', 'click', function () { openSessionPicker(id); });
  on(v, '[data-act="ran"]', 'click', function () { logRunFlow(d, false); });
  on(v, '[data-act="runmore"]', 'click', function () { runMenu(d); });
  on(v, '[data-act="make"]', 'click', function () { openBuilder(null, 'stretch'); });
  on(v, '[data-all]', 'click', function (e, b) { App.seeAll[b.dataset.all] = !App.seeAll[b.dataset.all]; renderTab(); });
  on(v, '[data-si]', 'click', function (e, b) { logCheck(id, +b.dataset.si); renderTab(); });
  $$('.tile[data-rid]', v).forEach(function (t) {
    t.addEventListener('click', function () { openOverview({ type: 'routine', rid: t.dataset.rid }); });
  });
}
function levelCap(id, r) {
  var lv = routineLevel(id, r.id), mins = routineMinutes(levelMoves(id, r));
  return (r.levels || lv > 1 ? 'Level ' + lv + ' · ' : '') + mins + ' min';
}
function tileHTML(r, today) {
  return '<button class="tile card" data-rid="' + esc(r.id) + '">' + (today ? '<span class="badge">Today</span>' : r.mine ? '<span class="badge">Yours</span>' : '') +
    FIG.svg(POSES[r.pose] || POSES[poseFor(r.moves[0][0])], { size: 64, hair: personHair(App.id), bg: r.bg }) +
    '<span class="n">' + esc(r.title) + '</span><span class="cap">' + levelCap(App.id, r) + '</span></button>';
}
function heroHTML(id, d, rot, todayE) {
  var a = ATHLETES[id];
  if (!d) return '<div class="card hero"><p>No sessions in this plan yet.</p></div>';
  if (rot.doneToday) {
    var nx = rot.days[(rot.next + 1) % rot.days.length], si = todayE && todayE.si;
    return '<div class="card hero"><div class="hero-top">' + figHTML(repName(d), 96, id) + '<div><span class="done-badge">' + I.check.replace('<svg', '<svg width="14" height="14"') + ' Done today</span>' +
      '<div class="t" style="margin-top:6px">' + esc(d.title) + '</div><div class="s">Next time: ' + esc(sessionFull(nx)) + '</div></div></div>' +
      (a.check ? (si ? '<div class="muted" style="font-size:15px">' + esc(a.check.charAt(0).toUpperCase() + a.check.slice(1)) + ': ' + esc(CHECK_LABELS[si]) + ' ✓</div>' :
        '<div><div style="font-weight:700;margin-bottom:10px">How’s your ' + esc(a.check) + '?</div><div class="seg">' +
        [1, 2, 3].map(function (k) { return '<button data-si="' + k + '">' + CHECK_LABELS[k] + '</button>'; }).join('') + '</div></div>') : '') + '</div>';
  }
  if (d.type === 'run') {
    var run = d.run || {}, L = d.level;
    return '<div class="card hero"><div class="hero-top">' + figHTML('Run', 112, id, { pose: 'run' }) + '<div style="flex:1">' +
      '<span class="eyebrow">Next up</span><div class="t">Run day</div>' +
      '<div class="s">' + (L ? 'Level ' + (L.i + 1) + ' of ' + L.n : '') + (d.dur ? ' · ' + esc(d.dur) : '') + '</div></div>' +
      '<button class="icon-btn" data-act="runmore" aria-label="Run options: timer, easier, harder">' + I.more + '</button></div>' +
      '<div style="background:var(--soft);border-radius:18px;padding:12px 14px"><div style="font-size:17px;font-weight:700">' + esc(run.extra || d.title) + '</div>' +
      (run.warm ? '<div class="muted" style="font-size:14px;margin-top:4px">Warm up: ' + esc(run.warm) + ' · Cool down: ' + esc(run.cool || '') + '</div>' : '') + '</div>' +
      '<button class="btn" data-act="ran">' + I.check + 'I did my run</button>' +
      '<div class="row2"><button class="link" data-act="change">Do a different workout</button></div></div>';
  }
  var rd = resolveDay(id, d, {}), prog = progGet(id);
  var resume = prog && prog.src && prog.src.type === 'plan' && prog.src.key === d.key ? prog : null;
  return '<div class="card hero"><button class="hero-top" data-act="peek" aria-label="See the moves in ' + esc(d.title) + '" style="border:0;background:none;padding:0;text-align:left;color:inherit;cursor:pointer;width:100%">' +
    figHTML(repName(d), 112, id) + '<span style="display:block;flex:1">' +
    '<span class="eyebrow">Next up</span><span class="t" style="display:block">' + esc(d.title) + '</span>' + (sessionTag(d) ? '<span class="s" style="display:block">' + esc(sessionTag(d)) + '</span>' : '') +
    '<span class="cap m" style="display:block">' + dayMinutes(id, d) + ' min · ' + dayMoves(rd) + ' moves · see all ›</span></span></button>' +
    '<div style="display:flex;gap:10px"><button class="btn" data-act="start" style="flex:2">' + I.play + (resume && !resume.short ? 'Resume' : 'Start') + '</button>' +
    '<button class="btn soft" data-act="short" style="flex:1;font-size:17px" aria-label="Short version, ' + (a.quickMin || 10) + ' minutes">' + (resume && resume.short ? 'Resume' : 'Short') + '</button></div>' +
    '<div class="row2"><button class="link" data-act="change">Do a different workout</button></div></div>';
}

/* ---------- sheets: people, change session, routine + run menus ---------- */
function openPeople() {
  var ids = peopleIds();
  var el = Sheet.open('<h2>Who’s working out?</h2><div style="margin-top:8px">' + ids.map(function (pid) {
    var sub = baseSessions(pid).map(function (d) { return d.title; }).join(' · ');
    return '<button class="opt" data-pid="' + pid + '">' + avatarHTML(pid, 44) + '<span style="flex:1"><span style="display:block">' + esc(personName(pid)) + '</span>' +
      '<small class="muted" style="font-weight:500;font-size:13px">' + esc(sub) + '</small></span>' + (pid === App.id ? I.check : '') + '</button>';
  }).join('') + '<button class="opt" data-act="add">' + I.plus + 'Add a person</button></div>');
  on(el, '[data-pid]', 'click', function (e, b) { App.id = b.dataset.pid; setCurrent(App.id); Sheet.close(); App.tab = 'today'; renderTab(); });
  on(el, '[data-act="add"]', 'click', function () { Sheet.close(); openSetup(); });
}
function openSessionPicker(id) {
  var rot = rotationState(id), real = rotationState(id);
  var el = Sheet.open('<h2>Pick today’s workout</h2><p class="muted" style="margin:6px 0 4px;font-size:15px">The order carries on from whichever one you do.</p>' +
    rot.days.map(function (d, i) {
      return '<button class="opt" data-key="' + d.key + '">' + figHTML(repName(d), 52, id) + '<span style="flex:1"><span style="display:block">' + esc(sessionFull(d)) + '</span>' +
        '<small class="muted" style="font-weight:500;font-size:13px">' + esc(d.dur || '') + '</small></span>' + (i === real.next ? '<span class="tag s1">Up next</span>' : '') + '</button>';
    }).join(''));
  on(el, '[data-key]', 'click', function (e, b) {
    pickSession(id, b.dataset.key); Sheet.close(); renderTab();
    var picked = sessions(id).filter(function (x) { return x.key === b.dataset.key; })[0];
    if (picked && picked.type !== 'run') openOverview({ type: 'plan', key: picked.key });
    var r = rotationState(id), nx = r.days[(r.next + 1) % r.days.length];
    var cur = r.days[r.next];
    toast('Today: ' + (cur ? cur.title : '') + '. Next time: ' + nx.title + '.');
  });
}
function routineMenu(r) {
  var el = Sheet.open('<div style="display:flex;gap:14px;align-items:center">' + FIG.svg(POSES[r.pose] || POSES[poseFor(r.moves[0][0])], { size: 60, hair: personHair(App.id), bg: r.bg }) +
    '<div><h2>' + esc(r.title) + '</h2><div class="muted" style="font-size:15px">' + routineMinutes(levelMoves(App.id, r)) + ' min · ' + levelMoves(App.id, r).length + ' moves</div></div></div>' +
    '<div style="margin-top:10px">' +
    (r.mine ? '<button class="opt" data-a="edit">' + I.edit + 'Edit</button><button class="opt danger" data-a="del">' + I.trash + 'Delete</button>'
      : '<button class="opt" data-a="copy">' + I.copy + 'Make my own version</button>') + '</div>');
  on(el, '[data-a="start"]', 'click', function () { Sheet.close(); openOverview({ type: 'routine', rid: r.id }); });
  on(el, '[data-a="edit"]', 'click', function () { Sheet.close(); Layers.closeAll(); openBuilder(r); });
  on(el, '[data-a="copy"]', 'click', function () { Sheet.close(); openBuilder({ title: 'My ' + r.title, kind: r.kind, moves: levelBase(r, routineLevel(App.id, r.id)).map(function (m) { return m.slice(); }), pose: r.pose, bg: r.bg }); });
  on(el, '[data-a="del"]', 'click', function () {
    var list = myRoutinesGet(App.id), before = clone(list);
    myRoutinesSave(App.id, list.filter(function (x) { return x.id !== r.id; }));
    Sheet.close(); Layers.closeAll(); renderTab();
    toast('Deleted ' + r.title, 'Undo', function () { myRoutinesSave(App.id, before); renderTab(); });
  });
}
function runMenu(d) {
  var L = d.level;
  var el = Sheet.open('<h2>Run day</h2><div style="margin-top:8px">' +
    (L && L.i > 0 ? '<button class="opt" data-a="easier">' + I.minus + 'Easier — level ' + L.i + '</button>' : '') +
    (L && L.i < L.n - 1 ? '<button class="opt" data-a="harder">' + I.plus + 'Harder — level ' + (L.i + 2) + '</button>' : '') +
    '<button class="opt" data-a="timer">' + I.timer + 'Interval timer</button>' +
    '<button class="opt" data-a="change">' + I.swap + 'Do a different workout</button></div>' +
    (L ? '<p class="muted" style="font-size:14px">Moves up a level every ' + L.per + ' runs on its own.</p>' : ''));
  on(el, '[data-a="easier"]', 'click', function () { levelNudge(App.id, d.key, -1); Sheet.close(); renderTab(); });
  on(el, '[data-a="harder"]', 'click', function () { levelNudge(App.id, d.key, 1); Sheet.close(); renderTab(); });
  on(el, '[data-a="timer"]', 'click', function () { Sheet.close(); openRunTimer(d); });
  on(el, '[data-a="change"]', 'click', function () { Sheet.close(); openSessionPicker(App.id); });
}

/* ---------- days a week + renaming ---------- */
function splitPreview(id, n) {
  var a = ATHLETES[id];
  if (a.splits) {
    var byKey = {}; allSessions(id).forEach(function (d) { byKey[d.key] = d; });
    var names = cfgGet(id).names || {};
    return (a.splits[n] || []).map(function (k) { return byKey[k] ? (names[k] || byKey[k].title) : ''; }).filter(Boolean);
  }
  return null;
}
function openDaysPicker(id) {
  var sel = daysPerWeek(id);
  function body() {
    var pv = splitPreview(id, sel);
    return '<h2>How many days a week?</h2><p class="muted" style="margin:6px 0 12px;font-size:15px">Any days you like — the app just keeps the order.</p>' +
      '<div class="seg" role="group" aria-label="Days a week">' + [2, 3, 4, 5, 6].map(function (n) { return '<button data-n="' + n + '" aria-pressed="' + (n === sel) + '" class="' + (n === sel ? 'on' : '') + '">' + n + '</button>'; }).join('') + '</div>' +
      (pv ? '<div class="card list" style="margin-top:14px">' + pv.map(function (t, i) { return '<div class="li" style="cursor:default"><span class="tag" style="margin:0 6px 0 0">' + (i + 1) + '</span><span class="grow">' + esc(t) + '</span></div>'; }).join('') + '</div>' +
        '<p class="muted" style="font-size:13px;margin:8px 4px 0">' + (sel <= 3 ? 'Each muscle group gets one solid day a week.' : 'Legs get two days (squat day + hinge day), and every muscle group is worked more often.') + '</p>'
        : '<p class="muted" style="font-size:14px;margin-top:12px">Your workouts keep rotating in order — this sets your weekly goal.</p>') +
      '<button class="btn sm" style="margin-top:16px" data-a="save">Save</button>';
  }
  var el = Sheet.open('<div data-body>' + body() + '</div>');
  function wire() {
    on(el, '[data-n]', 'click', function (e, b) { sel = +b.dataset.n; $('[data-body]', el).innerHTML = body(); wire(); });
    on(el, '[data-a="save"]', 'click', function () { setDaysPerWeek(id, sel); Sheet.close(); renderTab(); toast(sel + ' days a week — saved'); });
  }
  wire();
}
function openRename(id, d, after) {
  var base = allSessions(id).filter(function (x) { return x.key === d.key; })[0], orig = base ? base.title : d.title;
  var el = Sheet.open('<h2>Rename workout</h2><div class="field"><label for="rn">Name</label><input id="rn" maxlength="30" value="' + esc(d.title) + '"></div>' +
    '<div class="row-btns" style="margin-top:16px">' + (d.renamed ? '<button class="btn ghost sm" data-a="reset">Use “' + esc(orig) + '”</button>' : '') + '<button class="btn sm" data-a="save">Save</button></div>');
  var inp = $('#rn', el); setTimeout(function () { try { inp.focus(); inp.select(); } catch (e) {} }, 250);
  on(el, '[data-a="save"]', 'click', function () { var v = inp.value.trim(); renameSession(id, d.key, v && v !== orig ? v : ''); Sheet.close(); after && after(); });
  on(el, '[data-a="reset"]', 'click', function () { renameSession(id, d.key, ''); Sheet.close(); after && after(); });
}

/* ---------- logging a run ---------- */
function unitsFor(id) { return store.raw('trainops:units:' + id) || 'mi'; }
function fmtPace(sPer) { if (!isFinite(sPer) || sPer <= 0 || sPer > 3599) return ''; return Math.floor(sPer / 60) + ':' + pad2(Math.round(sPer) % 60); }
// planDay: today's run session (counts toward the plan) or null for an extra run
function logRunFlow(planDay, fromTimer) {
  var id = App.id, u = unitsFor(id), today = todayISO();
  if (planDay) { logRun(id, today, null, planDay); renderTab(); }
  var el = Sheet.open('<h2>' + (planDay ? 'Nice run!' : 'Log a run') + '</h2>' +
    '<p class="muted" style="margin:6px 0 0">' + (planDay ? 'It’s logged. Add the details from Nike Run Club if you like.' : 'From Nike Run Club or anywhere else.') + '</p>' +
    '<div class="row-btns"><div class="field" style="flex:1"><label for="r-dist">Distance (' + u + ')</label><input id="r-dist" type="number" inputmode="decimal" step="0.01" min="0" placeholder="3.1"></div>' +
    '<div class="field" style="flex:1"><label for="r-min">Time (min)</label><input id="r-min" type="number" inputmode="decimal" step="0.1" min="0" placeholder="30"></div></div>' +
    (planDay ? '' : '<div class="field"><label for="r-date">Date</label><input id="r-date" type="date" value="' + today + '" max="' + today + '"></div>') +
    '<div class="row-btns" style="margin-top:18px">' + (planDay ? '<button class="btn ghost sm" data-a="skip">Skip</button>' : '') + '<button class="btn sm" data-a="save">Save</button></div>');
  on(el, '[data-a="skip"]', 'click', function () { Sheet.close(); });
  on(el, '[data-a="save"]', 'click', function () {
    var dist = parseFloat($('#r-dist', el).value), mins = parseFloat($('#r-min', el).value);
    var iso = planDay ? today : ($('#r-date', el).value || today);
    var run = dist > 0 ? { dist: +dist.toFixed(2), unit: u, secs: mins > 0 ? Math.round(mins * 60) : 0, pace: mins > 0 ? fmtPace(mins * 60 / dist) : '', manual: true } : null;
    if (!planDay && !run) { toast('Add a distance first'); return; }
    // a run on today's run day counts as the plan's run
    var asPlan = planDay || (iso === today && todaySession(id) && todaySession(id).type === 'run' && !rotationState(id).doneToday ? todaySession(id) : null);
    if (run || !planDay) logRun(id, iso, run, asPlan);
    Sheet.close(); renderTab(); toast('Run saved');
  });
}

/* ---------- History ---------- */
function renderHistory(v) {
  var id = App.id, log = logGet(id), sl = stretchLogGet(id), now = new Date();
  if (!App.calMonth) App.calMonth = [now.getFullYear(), now.getMonth()];
  var y = App.calMonth[0], m = App.calMonth[1], first = new Date(y, m, 1), startDow = (first.getDay() + 6) % 7, nDays = new Date(y, m + 1, 0).getDate();
  var cal = '<div class="card"><div style="display:flex;align-items:center;justify-content:space-between;padding:12px 12px 0 18px"><b style="font-size:17px">' + MONTHS[m] + ' ' + y + '</b>' +
    '<span style="display:flex;gap:6px"><button class="icon-btn" data-cal="-1" aria-label="Previous month">' + I.back + '</button>' +
    '<button class="icon-btn" data-cal="1" aria-label="Next month">' + I.chev + '</button></span></div><div class="cal">' +
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(function (x) { return '<span>' + x + '</span>'; }).join('');
  for (var b = 0; b < startDow; b++) cal += '<i class="blank"></i>';
  for (var dd = 1; dd <= nDays; dd++) {
    var iso = y + '-' + pad2(m + 1) + '-' + pad2(dd), e = log[iso], cls = e ? (e.t === 'run' ? 'r' : 'w') : '';
    if (!e && sl[iso]) cls = 'st';
    if (iso === todayISO()) cls += ' today';
    cal += '<i class="' + cls + '">' + dd + '</i>';
  }
  cal += '</div><div style="display:flex;gap:14px;padding:0 18px 14px;font-size:13px;color:var(--muted)"><span>● Workout</span><span style="color:#3F6FA0">● Run</span><span>○ Stretch</span></div></div>';
  var dates = {};
  Object.keys(log).forEach(function (k) { dates[k] = 1; }); Object.keys(sl).forEach(function (k) { dates[k] = 1; });
  var sorted = Object.keys(dates).sort().reverse(), rows = '', lastWk = null, checkTag = ATHLETES[id].checkTag || 'Check';
  sorted.slice(0, 60).forEach(function (iso) {
    var wk = isoWeek(parseDate(iso));
    if (wk !== lastWk) { rows += (lastWk ? '</div>' : '') + '<div class="cap" style="margin:18px 4px 8px">' + (wk === isoWeek(now) ? 'This week' : 'Week of ' + fmtDay(mondayOf(iso)).split(', ')[1]) + '</div><div class="card list">'; lastWk = wk; }
    var e = log[iso];
    if (e) rows += '<button class="li" data-iso="' + iso + '"><span class="grow"><b style="font-weight:600">' + esc(e.title) + '</b>' + (e.cb ? '<span class="tag">Comeback</span>' : '') +
      (e.si ? '<span class="tag s' + e.si + '">' + esc(checkTag) + ' · ' + esc(CHECK_LABELS[e.si]) + '</span>' : '') +
      '<small>' + fmtDay(iso) + (e.run && e.run.pace ? ' · ' + e.run.pace + ' /' + e.run.unit : '') + '</small></span><span class="chev">' + I.chev + '</span></button>';
    (sl[iso] || []).forEach(function (s, si) {
      var rr = routineById(id, s.r), kindTag = rr && rr.kind === 'strength' ? 'Quick workout' : 'Stretch';
      rows += '<button class="li" data-st="' + iso + '|' + si + '"><span class="grow"><b style="font-weight:600">' + esc(s.title) + '</b><span class="tag">' + kindTag + '</span><small>' + fmtDay(iso) + ' · ' + s.mins + ' min</small></span></button>';
    });
  });
  if (lastWk) rows += '</div>';
  v.innerHTML = '<div class="top"><h1 style="font-weight:900;font-size:32px">History</h1><button class="btn sm" style="width:auto;padding:0 18px" data-act="logrun">' + I.plus + 'Log a run</button></div>' +
    '<div style="margin-top:16px">' + cal + '</div>' + (rows || '<p class="muted" style="margin-top:20px;text-align:center">Nothing yet — today’s a good day to start.</p>') +
    '';
  on(v, '[data-act="logrun"]', 'click', function () { logRunFlow(null, false); });
  on(v, '[data-cal]', 'click', function (e, b) { var mm = App.calMonth[1] + +b.dataset.cal, yy = App.calMonth[0]; if (mm < 0) { mm = 11; yy--; } if (mm > 11) { mm = 0; yy++; } App.calMonth = [yy, mm]; renderTab(); });
  $$('[data-iso]', v).forEach(function (row) {
    row.addEventListener('click', function () { entryDetail(row.dataset.iso); });
  });
  $$('[data-st]', v).forEach(function (row) {
    row.addEventListener('click', function () {
      var p = row.dataset.st.split('|'), s0 = stretchLogGet(id)[p[0]][+p[1]];
      var sh = Sheet.open('<span class="cap">' + fmtDay(p[0]) + '</span><h2 style="margin-top:4px">' + esc(s0.title) + '</h2><p class="muted" style="margin:6px 0 0">' + s0.mins + ' minutes</p>' +
        '<button class="opt danger" style="margin-top:12px" data-a="del">' + I.trash + 'Delete</button><button class="btn soft sm" style="margin-top:10px" data-a="close">Close</button>');
      on(sh, '[data-a="close"]', 'click', function () { Sheet.close(); });
      on(sh, '[data-a="del"]', 'click', function () {
        var s = stretchLogGet(id), before = clone(s);
        s[p[0]].splice(+p[1], 1); if (!s[p[0]].length) delete s[p[0]]; stretchLogSet(id, s); Sheet.close(); renderTab();
        toast('Deleted', 'Undo', function () { stretchLogSet(id, before); renderTab(); });
      });
    });
  });
}
function mondayOf(iso) { var d = parseDate(iso); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dateISO(d); }
function confirmDelete(iso) {
  var id = App.id, e = logGet(id)[iso]; if (!e) return;
  var el = Sheet.open('<h2>' + esc(e.title) + '</h2><p class="muted" style="margin:6px 0 0">' + fmtDay(iso) + '</p>' +
    '<button class="opt danger" style="margin-top:12px" data-a="del">' + I.trash + 'Delete this entry</button><button class="btn soft sm" style="margin-top:10px" data-a="close">Cancel</button>');
  on(el, '[data-a="close"]', 'click', function () { Sheet.close(); });
  on(el, '[data-a="del"]', 'click', function () {
    var before = clone(e); deleteLog(id, iso); Sheet.close(); renderTab();
    toast('Deleted', 'Undo', function () { var l = logGet(id); l[iso] = before; logSet(id, l); renderTab(); });
  });
}
function entryDetail(iso) {
  var id = App.id, e = logGet(id)[iso]; if (!e) return;
  var sets = setsGet(id), lines = [];
  Object.keys(sets).forEach(function (nm) { (sets[nm].hist || []).forEach(function (h) { if (h.d === iso) lines.push({ n: nm, h: h }); }); });
  var html = '<span class="cap">' + fmtDay(iso) + '</span><h2 style="margin-top:4px">' + esc(e.title) + '</h2>' +
    (e.si ? '<p style="margin:8px 0 0"><span class="tag s' + e.si + '" style="margin-left:0">' + esc(ATHLETES[id].checkTag || 'Check') + ' · ' + esc(CHECK_LABELS[e.si]) + '</span></p>' : '');
  if (e.run && e.run.dist) html += '<div class="card" style="padding:14px 16px;margin-top:12px;display:flex;gap:18px"><div><span class="cap">Distance</span><div style="font-size:20px;font-weight:800">' + e.run.dist + ' ' + e.run.unit + '</div></div>' +
    (e.run.secs ? '<div><span class="cap">Time</span><div style="font-size:20px;font-weight:800">' + fmtSecs(e.run.secs) + '</div></div>' : '') +
    (e.run.pace ? '<div><span class="cap">Pace</span><div style="font-size:20px;font-weight:800">' + e.run.pace + '</div></div>' : '') + '</div>';
  if (lines.length) html += '<div class="card list" style="margin-top:12px">' + lines.map(function (l) {
    return '<div class="li" style="cursor:default">' + figHTML(l.n, 40, id) + '<span class="grow">' + esc(l.n) + '<small>' + l.h.sets + ' set' + (l.h.sets > 1 ? 's' : '') + ' · best ' + (l.h.w ? l.h.w + ' lb × ' : '') + l.h.r + '</small></span></div>';
  }).join('') + '</div>';
  html += '<button class="opt danger" style="margin-top:12px" data-a="del">' + I.trash + 'Delete this entry</button><button class="btn soft sm" style="margin-top:10px" data-a="close">Close</button>';
  var el = Sheet.open(html); on(el, '[data-a="close"]', 'click', function () { Sheet.close(); });
  on(el, '[data-a="del"]', 'click', function () {
    var before = clone(e); deleteLog(id, iso); Sheet.close(); renderTab();
    toast('Deleted', 'Undo', function () { var l = logGet(id); l[iso] = before; logSet(id, l); renderTab(); });
  });
}

/* ---------- Me ---------- */
function renderMe(v) {
  var id = App.id, g = goalInfo(id), days = sessions(id);
  var html = '<div class="top"><div style="display:flex;align-items:center;gap:14px">' + avatarHTML(id, 56) + '<div class="hello"><b style="font-size:30px">' + esc(personName(id)) + '</b></div></div>' +
    '</div>';
  html += '<button class="card li" style="margin-top:18px;padding:16px 18px" data-act="goal"><span style="width:44px;height:44px;border-radius:14px;background:var(--warn-tint);color:var(--warn);display:flex;align-items:center;justify-content:center">' + I.flag + '</span>' +
    '<span class="grow"><span class="cap">Your goal</span><b style="display:block;font-size:17px;margin-top:2px">' + (g && !g.past ? esc(g.name) + (g.when ? ' · ' + esc(g.when) : '') : g && g.past ? esc(g.name) + ' ✓ — set your next one' : 'Set a goal') + '</b></span><span class="chev">' + I.chev + '</span></button>';
  html += '<div class="sec"><h2>Your plan</h2><button class="link" data-act="days" style="padding:6px 0">' + weeklyTarget(id) + ' days a week ' + I.edit.replace('<svg', '<svg width="16" height="16" style="vertical-align:-2px"') + '</button></div><div class="card list">' + days.map(function (d) {
    return '<button class="li" data-key="' + d.key + '">' + figHTML(repName(d), 48, id) + '<span class="grow"><b style="font-weight:600">' + esc(sessionFull(d)) + '</b><small>' + esc((d.focus ? d.focus + ' · ' : '') + (d.dur || '')) + '</small></span><span class="chev">' + I.chev + '</span></button>';
  }).join('') + '</div><p class="muted" style="font-size:13px;margin:8px 4px 0">Open a workout and press and hold any move to swap it or change sets and reps.</p>';
  html += '<div class="sec"><h2>More</h2></div><div class="card list">' +
    '<button class="li" data-act="library">' + I.book + '<span class="grow">Exercise library</span><span class="chev">' + I.chev + '</span></button>' +
    '<button class="li" data-act="people">' + I.users + '<span class="grow">People<small>Switch, add or remove</small></span><span class="chev">' + I.chev + '</span></button>' +
    '<button class="li" data-act="sound">' + (Sound.on() ? I.sound : I.mute) + '<span class="grow">Beeps<small>' + (Sound.on() ? 'On — plays over your music' : 'Off') + '</small></span></button>' +
    '<button class="li" data-act="voice">' + (Sound.voice() ? I.sound : I.mute) + '<span class="grow">Voice cues<small>' + (Sound.voice() ? 'On — music may pause while it talks' : 'Off') + '</small></span></button>' +
    '<button class="li" data-act="units">' + I.sliders + '<span class="grow">Run distance<small>' + (unitsFor(id) === 'km' ? 'Kilometres' : 'Miles') + '</small></span></button>' +
    '<button class="li" data-act="backup">' + I.download + '<span class="grow">Back up my data<small>Saves a file you can restore later</small></span></button>' +
    '<button class="li" data-act="restore">' + I.upload + '<span class="grow">Restore from backup</span></button>' +
    (['anthony', 'her'].indexOf(id) === -1 ? '<button class="li" data-act="remove" style="color:#B3261E">' + I.trash + '<span class="grow">Remove ' + esc(personName(id)) + '</span></button>' : '') +
    '</div><p class="muted" style="font-size:12px;text-align:center;margin-top:18px">Version ' + esc(window.BUILD || '') + '</p>' +
    '<input type="file" id="restore-file" accept="application/json,.json" class="hidden">';
  v.innerHTML = html;
  on(v, '[data-act="people"]', 'click', openPeople);
  on(v, '[data-act="goal"]', 'click', function () { openGoalEditor(id, renderTab); });
  on(v, '[data-act="days"]', 'click', function () { openDaysPicker(id); });
  on(v, '[data-key]', 'click', function (e, b) { openOverview({ type: 'plan', key: b.dataset.key }); });
  on(v, '[data-act="library"]', 'click', openLibrary);
  on(v, '[data-act="logrun"]', 'click', function () { logRunFlow(null, false); });
  on(v, '[data-act="sound"]', 'click', function () { Sound.set(!Sound.on()); Sound.unlock(); if (Sound.on()) Sound.chime(); renderTab(); });
  on(v, '[data-act="voice"]', 'click', function () { Sound.setVoice(!Sound.voice()); Sound.unlock(); if (Sound.voice()) Sound.say('Voice cues on'); renderTab(); });
  on(v, '[data-act="units"]', 'click', function () { store.setRaw('trainops:units:' + id, unitsFor(id) === 'km' ? 'mi' : 'km'); renderTab(); });
  on(v, '[data-act="backup"]', 'click', function () {
    var blob = new Blob([JSON.stringify(exportData(), null, 1)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'workout-backup-' + todayISO() + '.json'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });
  on(v, '[data-act="restore"]', 'click', function () { $('#restore-file', v).click(); });
  $('#restore-file', v).addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    if (!confirm('Replace the data on this phone with this backup?')) { this.value = ''; return; }
    var rd = new FileReader();
    rd.onload = function () { try { importData(JSON.parse(rd.result)); toast('Restored — reloading'); setTimeout(function () { location.reload(); }, 800); } catch (e) { toast('That file isn’t a backup'); } };
    rd.readAsText(f);
  });
  on(v, '[data-act="remove"]', 'click', function () {
    var el = Sheet.open('<h2>Remove ' + esc(personName(id)) + '?</h2><p class="muted">Their plan goes away. History stays in your backup if you made one.</p>' +
      '<button class="opt danger" data-a="yes">' + I.trash + 'Remove</button><button class="btn soft sm" style="margin-top:10px" data-a="no">Cancel</button>');
    on(el, '[data-a="no"]', 'click', function () { Sheet.close(); });
    on(el, '[data-a="yes"]', 'click', function () {
      store.set('trainops:people', (store.get('trainops:people', []) || []).filter(function (p) { return p.id !== id; }));
      store.set('trainops:custom', (store.get('trainops:custom', []) || []).filter(function (p) { return p.id !== id; }));
      delete ATHLETES[id]; App.id = peopleIds()[0]; setCurrent(App.id); Sheet.close(); App.tab = 'today'; renderTab();
    });
  });
}

/* ---------- exercise library ---------- */
function openLibrary() {
  var id = App.id, names = allMoveNames().concat(Object.keys(STRETCHES)).filter(function (n, i, a) { return a.indexOf(n) === i; }).sort();
  var el = h('<div></div>');
  Layers.push(el);
  el.innerHTML = '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button></div>' +
    '<h1 style="font-weight:900;font-size:30px;margin-top:10px">Exercise library</h1>' +
    '<div class="field"><input id="lib-q" type="search" placeholder="Search ' + names.length + ' moves" aria-label="Search moves"></div>' +
    '<div class="card list" style="margin-top:14px" id="lib-list"></div></div>';
  function list(q) {
    q = (q || '').toLowerCase();
    $('#lib-list', el).innerHTML = names.filter(function (n) { return !q || n.toLowerCase().indexOf(q) !== -1; }).map(function (n) {
      return '<button class="li" data-n="' + esc(n) + '">' + figHTML(n, 48, id) + '<span class="grow">' + esc(n) + '</span><span class="chev">' + I.chev + '</span></button>';
    }).join('') || '<p class="muted" style="padding:14px 0">No moves match.</p>';
    on(el, '[data-n]', 'click', function (e, b) {
      var n = b.dataset.n;
      var sh = Sheet.open('<div style="display:flex;gap:14px;align-items:center">' + figHTML(n, 76, id) + '<h2>' + esc(n) + '</h2></div>' + moveInfoHTML(id, n, { name: n }) +
        '<button class="btn soft sm" style="margin-top:18px" data-a="close">Done</button>');
      wireVideo(sh); on(sh, '[data-a="close"]', 'click', function () { Sheet.close(); });
    });
  }
  list('');
  $('#lib-q', el).addEventListener('input', function () { list(this.value); });
  on(el, '[data-act="back"]', 'click', function () { Layers.pop(); });
}

/* ---------- Make your own (Bend-style picker) ---------- */
function builderPool(kind) {
  if (kind === 'stretch') return Object.keys(STRETCHES).filter(function (n) { return !STRETCHES[n].baby; });
  var s = {}; ROUTINES.filter(function (r) { return r.kind === 'strength' && !r.baby; }).forEach(function (r) {
    (r.levels || [r.moves]).forEach(function (L) { L.forEach(function (m) { s[m[0]] = 1; }); }); });
  ['Push-up', 'Kneeling Push-up', 'Reverse Lunge', 'Step-Up', 'Mountain Climber', 'Band Row', 'Band Pull-Apart', 'Goblet Squat', 'DB Romanian Deadlift', 'Standing Hip Abduction', 'Suitcase Carry', 'Standing Anti-Rotation Press'].forEach(function (n) { s[n] = 1; });
  return Object.keys(s);
}
function openBuilder(existing, kind) {
  var id = App.id, st = {
    title: existing ? existing.title : '', kind: existing ? existing.kind || 'stretch' : (kind || 'stretch'),
    secs: 45, picked: existing ? existing.moves.map(function (m) { return m[0]; }) : [],
    schemes: {}
  };
  if (existing) existing.moves.forEach(function (m) { st.schemes[m[0]] = m[1]; });
  var el = h('<div></div>');
  Layers.push(el, { onClose: function () { renderTab(); } });
  function scheme(n) {
    if (st.schemes[n]) return st.schemes[n];
    var sided = /stretch|lunge|step|clam|abduction|kickback|side plank|world|thread|figure|pigeon|quad|calf|open book|neck side|90\/90|lying twist|hamstring|single-leg|split|carry|row/i.test(n) && !/butterfly|forward fold|side stretch$/i.test(n);
    var s = sided ? Math.round(st.secs * 2 / 3 / 5) * 5 : st.secs;
    return s + 's' + (sided ? ' / side' : '');
  }
  function render() {
    var pool = builderPool(st.kind);
    var moves = st.picked.map(function (n) { return [n, scheme(n)]; });
    el.innerHTML = '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + I.x + '</button><div class="mid"><b>' + (existing && existing.id ? 'Edit routine' : 'Make your own') + '</b></div><span style="width:44px"></span></div>' +
      '<div class="field"><label for="b-name">Name</label><input id="b-name" maxlength="32" placeholder="e.g. My morning stretch" value="' + esc(st.title) + '"></div>' +
      '<div class="segs"><div class="seg"><button data-kind="stretch" class="' + (st.kind === 'stretch' ? 'on' : '') + '">Stretches</button><button data-kind="strength" class="' + (st.kind === 'strength' ? 'on' : '') + '">Strength moves</button></div>' +
      '<div class="seg">' + [30, 45, 60].map(function (s) { return '<button data-secs="' + s + '" class="' + (st.secs === s ? 'on' : '') + '">' + s + ' sec each</button>'; }).join('') + '</div></div>' +
      '<div class="sec" style="margin-top:20px"><h2 style="font-size:19px">Your routine</h2><span class="cap">' + (moves.length ? routineMinutes(moves) + ' min · ' + moves.length + ' moves' : 'Tap moves below') + '</span></div>' +
      '<div class="picked">' + (moves.length ? st.picked.map(function (n, i) {
        return '<button class="hold" data-un="' + i + '" aria-label="Remove ' + esc(n) + '" style="border:0;background:none;padding:0;position:relative;cursor:pointer">' + figHTML(n, 52, id) +
          '<span style="position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-radius:999px;background:var(--accent);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</span></button>';
      }).join('') : '<span class="muted" style="font-size:15px">Nothing yet — tap the moves you like, in order.</span>') + '</div>' +
      '<div class="pick-grid">' + pool.map(function (n) {
        var idx = st.picked.indexOf(n);
        return '<button data-pick="' + esc(n) + '" aria-pressed="' + (idx !== -1) + '">' + figHTML(n, 84, id) + (idx !== -1 ? '<span class="num">' + (idx + 1) + '</span>' : '') + '<span>' + esc(n) + '</span></button>';
      }).join('') + '</div></div>' +
      '<div class="foot"><div class="in"><button class="btn" data-act="save"' + (moves.length ? '' : ' disabled style="opacity:.5"') + '>Save routine</button></div></div>';
    on(el, '[data-act="back"]', 'click', function () { Layers.pop(); });
    $('#b-name', el).addEventListener('input', function () { st.title = this.value; });
    on(el, '[data-kind]', 'click', function (e, b) { if (st.kind !== b.dataset.kind) { st.kind = b.dataset.kind; st.picked = []; } render(); });
    on(el, '[data-secs]', 'click', function (e, b) { st.secs = +b.dataset.secs; st.schemes = {}; render(); });
    on(el, '[data-pick]', 'click', function (e, b) {
      var n = b.dataset.pick, i = st.picked.indexOf(n);
      if (i === -1) st.picked.push(n); else st.picked.splice(i, 1);
      var y = el.scrollTop; render(); el.scrollTop = y;
    });
    on(el, '[data-un]', 'click', function (e, b) { st.picked.splice(+b.dataset.un, 1); var y = el.scrollTop; render(); el.scrollTop = y; });
    on(el, '[data-act="save"]', 'click', function () {
      if (!st.picked.length) return;
      var list = myRoutinesGet(id), rid = existing && existing.id ? existing.id : 'my_' + Date.now().toString(36);
      var r = { id: rid, kind: st.kind, title: (st.title || '').trim() || (st.kind === 'stretch' ? 'My stretch' : 'My workout'),
        pose: poseFor(st.picked[0]), bg: existing && existing.bg ? existing.bg : FIG_BG[list.length % FIG_BG.length], blurb: '', moves: st.picked.map(function (n) { return [n, scheme(n)]; }) };
      var i = list.map(function (x) { return x.id; }).indexOf(rid);
      if (i === -1) list.push(r); else list[i] = r;
      myRoutinesSave(id, list); Layers.pop(); App.tab = 'today'; renderTab(); toast('Saved ' + r.title);
    });
  }
  render();
}

/* ---------- Add a person ---------- */
function openSetup() {
  var st = { step: 0, name: '', hair: 'bun', goals: { strong: true }, limits: {}, place: 'home', gear: {}, days: 3, mins: 30, stretch: 'am' };
  var el = h('<div></div>');
  Layers.push(el);
  var GOALS = [['strong', 'Get stronger', 'Lift more, feel solid', 'gobletSquat', '#6E9A8B'], ['look', 'Look & feel great', 'Tone up, lose a little', 'gluteBridge', '#A08BD6'],
    ['run', 'Run a strong 5K', 'Build up from walk–jog', 'run', '#6E9CC4'], ['move', 'Move better', 'Stretching, mobility, posture', 'hipFlexor', '#4E8C8C'],
    ['pain', 'Ease aches & pains', 'Back, hips or joints', 'birdDog', '#9AA36A']];
  var LIMITS = [['back', 'Low back / SI joint'], ['hips', 'Hips'], ['knees', 'Knees'], ['shoulders', 'Shoulders'], ['neck', 'Neck'], ['wrists', 'Wrists']];
  var GEAR = [['db', 'Dumbbells'], ['kb', 'Kettlebell'], ['bench', 'Bench'], ['pullup', 'Pull-up bar'], ['bands', 'Resistance bands'], ['booty', 'Booty band'], ['none', 'Nothing yet']];
  function prog(n) { var o = '<div class="prog" role="img" aria-label="Step ' + (n + 1) + ' of 5">'; for (var i = 0; i < 5; i++) o += '<i class="' + (i <= n ? 'on' : '') + '"></i>'; return o + '</div>'; }
  function render() {
    var s = st.step, body = '', cta = 'Continue';
    if (s === 0) {
      body = '<h1 style="font-weight:900;font-size:30px;margin-top:8px">Let’s set you up</h1><p class="muted" style="margin:6px 0 0">Five quick questions and you’ll have a plan.</p>' +
        '<div class="field"><label for="s-name">Your name</label><input id="s-name" maxlength="20" autocomplete="given-name" value="' + esc(st.name) + '"></div>' +
        '<div class="field"><label>Your figure</label><div style="display:flex;gap:14px">' + ['bun', 'short'].map(function (hs) {
          return '<button class="optc' + (st.hair === hs ? ' on' : '') + '" data-hair="' + hs + '" style="flex-direction:column;padding:12px;width:auto;flex:1">' +
            FIG.svg(POSES.hipFlexor, { size: 84, hair: hs }) + '<b style="font-size:15px">' + (hs === 'bun' ? 'Hair up' : 'Short hair') + '</b></button>'; }).join('') + '</div></div>';
    } else if (s === 1) {
      body = '<h1 style="font-weight:900;font-size:30px;margin-top:8px">What do you want from working out?</h1><p class="muted" style="margin:6px 0 0">Pick up to two.</p><div class="opts">' +
        GOALS.map(function (g) { return '<button class="optc' + (st.goals[g[0]] ? ' on' : '') + '" data-goal="' + g[0] + '">' + FIG.svg(POSES[g[3]], { size: 60, hair: st.hair, bg: g[4] }) +
          '<span class="tx"><b>' + g[1] + '</b><small>' + g[2] + '</small></span><span class="tick"></span></button>'; }).join('') + '</div>';
    } else if (s === 2) {
      body = '<h1 style="font-weight:900;font-size:30px;margin-top:8px">Anything we should go easy on?</h1><p class="muted" style="margin:6px 0 0">We’ll leave out moves that load it.</p><div class="chips">' +
        LIMITS.map(function (l) { return '<button class="chip' + (st.limits[l[0]] ? ' on' : '') + '" data-lim="' + l[0] + '">' + l[1] + '</button>'; }).join('') +
        '<button class="chip' + (!Object.keys(st.limits).some(function (k) { return st.limits[k]; }) ? ' on' : '') + '" data-lim="none">Nothing — I’m good</button></div>';
    } else if (s === 3) {
      body = '<h1 style="font-weight:900;font-size:30px;margin-top:8px">Where do you work out?</h1><div class="seg" style="margin-top:16px">' +
        [['home', 'Home'], ['gym', 'Gym'], ['both', 'Both']].map(function (p) { return '<button data-place="' + p[0] + '" class="' + (st.place === p[0] ? 'on' : '') + '">' + p[1] + '</button>'; }).join('') + '</div>' +
        (st.place !== 'gym' ? '<h2 style="font-size:20px;margin-top:22px">What do you have at home?</h2><div class="chips">' +
          GEAR.map(function (g) { return '<button class="chip' + (st.gear[g[0]] ? ' on' : '') + '" data-gear="' + g[0] + '">' + g[1] + '</button>'; }).join('') + '</div>' : '');
    } else if (s === 4) {
      cta = 'Build my plan';
      body = '<h1 style="font-weight:900;font-size:30px;margin-top:8px">How much time do you have?</h1>' +
        '<h2 style="font-size:17px;margin-top:20px">Workouts a week</h2><div class="seg" style="margin-top:8px">' + [2, 3, 4, 5].map(function (n) { return '<button data-days="' + n + '" class="' + (st.days === n ? 'on' : '') + '">' + n + '</button>'; }).join('') + '</div>' +
        '<h2 style="font-size:17px;margin-top:20px">How long each time?</h2><div class="seg" style="margin-top:8px">' + [20, 30, 45, 60].map(function (n) { return '<button data-mins="' + n + '" class="' + (st.mins === n ? 'on' : '') + '">' + n + ' min</button>'; }).join('') + '</div>' +
        '<p class="muted" style="font-size:14px;margin:14px 4px 0">Any days you like — the app just keeps the order. Every workout has a short version for busy days, and there’s a stretch library on the Today screen.</p>';
    }
    el.innerHTML = '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + (s ? I.back : I.x) + '</button>' + prog(s) + '<span style="width:44px"></span></div>' + body + '</div>' +
      '<div class="foot"><div class="in"><button class="btn" data-act="next">' + cta + '</button></div></div>';
    on(el, '[data-act="back"]', 'click', function () { if (st.step) { st.step--; render(); } else Layers.pop(); });
    on(el, '[data-act="next"]', 'click', function () {
      if (st.step === 0) { st.name = ($('#s-name', el).value || '').trim(); if (!st.name) { toast('Add your name first'); return; } }
      if (st.step < 4) { st.step++; render(); el.scrollTop = 0; } else finish();
    });
    var nm = $('#s-name', el); if (nm) nm.addEventListener('input', function () { st.name = this.value; });
    on(el, '[data-hair]', 'click', function (e, b) { st.hair = b.dataset.hair; render(); });
    on(el, '[data-goal]', 'click', function (e, b) {
      var k = b.dataset.goal, cnt = Object.keys(st.goals).filter(function (x) { return st.goals[x]; }).length;
      if (st.goals[k]) delete st.goals[k]; else { if (cnt >= 2) { toast('Pick up to two'); return; } st.goals[k] = true; }
      render();
    });
    on(el, '[data-lim]', 'click', function (e, b) { var k = b.dataset.lim; if (k === 'none') st.limits = {}; else st.limits[k] = !st.limits[k]; render(); });
    on(el, '[data-place]', 'click', function (e, b) { st.place = b.dataset.place; render(); });
    on(el, '[data-gear]', 'click', function (e, b) { var k = b.dataset.gear; if (k === 'none') st.gear = { none: true }; else { delete st.gear.none; st.gear[k] = !st.gear[k]; } render(); });
    on(el, '[data-days]', 'click', function (e, b) { st.days = +b.dataset.days; render(); });
    on(el, '[data-mins]', 'click', function (e, b) { st.mins = +b.dataset.mins; render(); });
  }
  function finish() {
    var pid = 'p_' + Date.now().toString(36);
    var cfg = { id: pid, name: st.name, hair: st.hair, color: AVATAR_PALETTE[(store.get('trainops:people', []) || []).length % AVATAR_PALETTE.length],
      goals: Object.keys(st.goals).filter(function (k) { return st.goals[k]; }), limits: Object.keys(st.limits).filter(function (k) { return st.limits[k]; }),
      place: st.place, gear: Object.keys(st.gear).filter(function (k) { return st.gear[k]; }), days: st.days, mins: st.mins };
    try { ATHLETES[pid] = makePersonPlan(cfg); } catch (e) { toast('Couldn’t build that plan — try different answers'); return; }
    var list = store.get('trainops:people', []) || []; list.push(cfg); store.set('trainops:people', list);
    App.id = pid; setCurrent(pid);
    var days = sessions(pid);
    el.innerHTML = '<div class="lwrap"><span class="eyebrow">All set</span><h1 style="font-weight:900;font-size:30px;margin-top:6px">Your plan is ready, ' + esc(st.name) + '</h1>' +
      '<div class="card" style="padding:18px;margin-top:16px"><div style="display:flex;justify-content:space-between"><b>' + st.days + ' workouts a week</b><span class="cap">' + st.mins + ' min each</span></div>' +
      '<div style="display:grid;grid-template-columns:repeat(' + Math.min(3, days.length) + ',minmax(0,1fr));gap:8px;margin-top:14px">' + days.slice(0, 3).map(function (d) {
        return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center">' + figHTML(repName(d), 76, pid) + '<b style="font-size:14px">' + esc(String(d.key).length === 1 ? 'Workout ' + sessionLetter(d) : d.title) + '</b><span class="muted" style="font-size:13px">' + esc(d.title) + '</span></div>';
      }).join('') + '</div><p class="muted" style="font-size:14px;margin:12px 0 0">Each one ends with a short cool-down stretch.</p></div>' +
      '<p class="muted" style="margin:16px 4px 0;font-size:15px">Press and hold any move to swap it. You can redo this anytime by adding yourself again under Me → People.</p></div>' +
      '<div class="foot"><div class="in"><button class="btn" data-act="go">Let’s go</button></div></div>';
    on(el, '[data-act="go"]', 'click', function () { Layers.closeAll(); App.tab = 'today'; renderTab(); });
  }
  render();
}

/* ---------- start ---------- */
(function init() {
  loadPeople();
  try { migrateLevels(); } catch (e) {}
  App.id = currentId();
  $$('#tabbar button').forEach(function (b) {
    b.addEventListener('click', function () { App.tab = b.dataset.tab; Layers.closeAll(); Sheet.close(true); renderTab(); window.scrollTo(0, 0); });
  });
  renderTab();
  // a new day while the app sat open: refresh Today when it comes back
  var lastDay = todayISO();
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && todayISO() !== lastDay) { lastDay = todayISO(); if (!Layers.stack.length) renderTab(); }
  });
})();
