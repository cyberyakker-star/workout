/* The exercise catalog: every move the app knows, by category and equipment.
   Powers the swap picker, "All exercises", the exercise library and the
   copy-to-your-AI / paste-back round trip (no AI inside the app). */
var EQ_NAMES = { bw: 'No equipment', band: 'Band', db: 'Dumbbells', kb: 'Kettlebell', baby: 'With baby', bar: 'Pull-up bar', barbell: 'Barbell', gym: 'Gym machine' };
var EQ_ORDER = ['bw', 'band', 'db', 'kb', 'baby', 'bar', 'barbell', 'gym'];
var CATS = [['legs', 'Legs', ['squat', 'lunge', 'calf']], ['glutes', 'Glutes & hips', ['hinge', 'hip']], ['push', 'Push', ['pushH', 'pushV']],
  ['pull', 'Pull', ['pullH', 'pullV']], ['arms', 'Arms', ['arms']], ['core', 'Core', ['core']], ['power', 'Cardio & power', ['cond']],
  ['warm', 'Warm-up', ['warm']], ['other', 'Other', []], ['stretch', 'Stretch', []]];

var _exMap = null, _eqC = {}, _catC = {}, _catNames = null;
function exMap() {
  if (!_exMap) { _exMap = {}; EX_DB.concat(MOBILITY).forEach(function (x) { if (!_exMap[x.name]) _exMap[x.name] = x; }); }
  return _exMap;
}
function eqOf(name) {
  if (_eqC[name]) return _eqC[name];
  var e = exMap()[name], q;
  if (STRETCHES[name]) q = STRETCHES[name].baby ? 'baby' : 'bw';
  else if (e && e.eq) q = e.eq === 'machine' || e.eq === 'cable' ? 'gym' : e.eq;
  else if (/baby|peekaboo/i.test(name)) q = 'baby';
  else if (/band/i.test(name)) q = 'band';
  else if (/barbell/i.test(name)) q = 'barbell';
  else if (/machine|cable|leg press|pulldown|sled|treadmill|med-ball|smith/i.test(name)) q = 'gym';
  else if (/\bkb\b|kettlebell/i.test(name)) q = 'kb';
  else if (/\bdb\b|dumbbell|goblet|farmer|curl|triceps extension|hip thrust|lateral raise|fly/i.test(name)) q = 'db';
  else if (/pull-up|chin-up|dead hang|scap/i.test(name)) q = 'bar';
  else q = 'bw';
  return (_eqC[name] = EQ_NAMES[q] ? q : 'bw');
}
function catOf(name) {
  if (_catC[name]) return _catC[name];
  var c = 'other', e = exMap()[name];
  if (STRETCHES[name]) c = 'stretch';
  else if (e && e.pat === 'warm') c = 'warm';
  else if (e && e.pat === 'cond') c = 'power';
  else {
    var pat = patOf(name);
    CATS.forEach(function (k) { if (pat && k[2].indexOf(pat) !== -1) c = k[0]; });
  }
  return (_catC[name] = c);
}
function catalogNames() {
  if (_catNames) return _catNames;
  var set = {};
  function add(n) { if (n && !/finisher\)/i.test(n)) set[n] = 1; }
  allMoveNames().forEach(add);
  MOBILITY.forEach(function (x) { add(x.name); });
  Object.keys(STRETCHES).forEach(add);
  ROUTINES.forEach(function (r) { (r.levels || [r.moves]).forEach(function (L) { L.forEach(function (m) { add(m[0]); }); }); });
  _catNames = Object.keys(set).sort(function (a, b) { return a.localeCompare(b); });
  return _catNames;
}

/* ---------- swap options: same kind of move, every kind of equipment ---------- */
// tighter families than the movement pattern, where it matters
var FAMILIES = [[/nordic/i, 'hinge'], [/bridge|hip thrust/i, 'bridge'], [/curl/i, 'curl'], [/tricep/i, 'triceps'], [/carry|suitcase march/i, 'carry']];
var FAMILY_EXTRA = { curl: ['Chin-up'], triceps: ['Diamond Push-up', 'Close-Grip Push-up'] };
function famOf(name) {
  for (var i = 0; i < FAMILIES.length; i++) if (FAMILIES[i][0].test(name)) return FAMILIES[i][1];
  return patOf(name);
}
function swapOptions(name) {
  var careful = !!(ATHLETES[App.id] && ATHLETES[App.id].check);
  var isStretch = !!STRETCHES[name], pat = isStretch ? null : famOf(name), extra = FAMILY_EXTRA[pat] || [];
  var me = exMap()[name], meImpact = !!(me && me.flags.indexOf('impact') !== -1);
  var list = catalogNames().filter(function (n) {
    if (n === name) return false;
    if (isStretch) return !!STRETCHES[n];
    if (STRETCHES[n]) return false;
    var e = exMap()[n];
    if (e && !meImpact && e.flags.indexOf('impact') !== -1) return false;     // no jumping unless swapping a jump
    if (e && careful && e.flags.indexOf('spinal') !== -1) return false;       // back/SI: nothing that loads the spine
    return !!pat && (famOf(n) === pat || extra.indexOf(n) !== -1);
  });
  // variety first: one of each kind of equipment, then the next one of each…
  var by = {}; list.forEach(function (n) { var q = eqOf(n); (by[q] = by[q] || []).push(n); });
  var out = [];
  for (var k = 0; out.length < list.length && k < list.length; k++) EQ_ORDER.forEach(function (q) { if (by[q] && by[q][k]) out.push(by[q][k]); });
  return out;
}
function eqChipsHTML(names) {
  var eqs = EQ_ORDER.filter(function (q) { return names.some(function (n) { return eqOf(n) === q; }); });
  if (eqs.length < 2) return '';
  return '<div class="eqchips" role="group" aria-label="Equipment"><button data-eqf="" class="on" aria-pressed="true">All</button>' +
    eqs.map(function (q) { return '<button data-eqf="' + q + '" aria-pressed="false">' + EQ_NAMES[q] + '</button>'; }).join('') + '</div>';
}
function wireEqChips(root, apply) {
  on(root, '[data-eqf]', 'click', function (e, b) {
    $$('[data-eqf]', root).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    apply(b.dataset.eqf);
  });
}

/* ---------- All exercises (and the exercise library) ---------- */
// opts: { title, sub, current, onPick(name) }
function openCatalog(opts) {
  opts = opts || {};
  var id = App.id, names = catalogNames(), st = { q: '', eq: '' };
  var el = h('<div></div>');
  Layers.push(el);
  el.innerHTML = '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button></div>' +
    '<h1 style="font-weight:900;font-size:30px;margin-top:10px">' + esc(opts.title || 'All exercises') + '</h1>' +
    (opts.sub ? '<p class="muted" style="margin:4px 0 0;font-size:15px">' + esc(opts.sub) + '</p>' : '') +
    '<div class="field"><input id="cat-q" type="search" placeholder="Search ' + names.length + ' exercises" aria-label="Search exercises"></div>' +
    eqChipsHTML(names) + '<div id="cat-list"></div></div>';
  // swapping: the move's own category first
  var cats = opts.current ? CATS.filter(function (c) { return c[0] === catOf(opts.current); }).concat(CATS.filter(function (c) { return c[0] !== catOf(opts.current); })) : CATS;
  function list() {
    var q = st.q.toLowerCase(), html = '';
    cats.forEach(function (c) {
      var ns = names.filter(function (n) { return catOf(n) === c[0] && (!st.eq || eqOf(n) === st.eq) && (!q || n.toLowerCase().indexOf(q) !== -1); });
      if (!ns.length) return;
      html += '<div class="sec" style="margin-top:20px"><h2 style="font-size:19px">' + c[1] + '</h2><span class="cap">' + ns.length + '</span></div><div class="card list">' +
        ns.map(function (n) {
          return '<button class="li" data-n="' + esc(n) + '">' + figHTML(n, 48, id) + '<span class="grow">' + esc(n) +
            '<small>' + EQ_NAMES[eqOf(n)] + (n === opts.current ? ' · doing this now' : '') + '</small></span><span class="chev">' + I.chev + '</span></button>';
        }).join('') + '</div>';
    });
    var box = $('#cat-list', el);
    box.innerHTML = html || '<p class="muted" style="padding:14px 4px">No exercises match.</p>';
    on(box, '[data-n]', 'click', function (e, b) { if (opts.onPick) opts.onPick(b.dataset.n); });
  }
  list();
  $('#cat-q', el).addEventListener('input', function () { st.q = this.value; list(); });
  wireEqChips(el, function (q) { st.eq = q; list(); });
  on(el, '[data-act="back"]', 'click', function () { Layers.pop(); });
}
function openLibrary() {
  var id = App.id;
  openCatalog({ title: 'Exercise library', onPick: function (n) {
    var sh = Sheet.open('<div style="display:flex;gap:14px;align-items:center">' + figHTML(n, 76, id) + '<div><h2>' + esc(n) + '</h2><div class="muted" style="font-size:15px">' +
      EQ_NAMES[eqOf(n)] + '</div></div></div>' + moveInfoHTML(id, n, { name: n }) + '<button class="btn soft sm" style="margin-top:18px" data-a="close">Done</button>');
    wireVideo(sh); on(sh, '[data-a="close"]', 'click', function () { Sheet.close(); });
  } });
}

/* ---------- Plan workouts with your AI: copy the catalog out, paste workouts back ---------- */
function aiExportText(id) {
  var a = ATHLETES[id] || {}, L = [], g = null;
  try { g = goalInfo(id); } catch (e) {}
  L.push('I use a simple workout app. Please help me plan workouts using ONLY the exercises listed at the bottom (copy the names exactly), so I can paste your answer straight back into the app.');
  L.push('', 'ABOUT ME');
  L.push('- ' + personName(id) + ', working out ' + weeklyTarget(id) + ' days a week.');
  if (g && !g.past && g.name) L.push('- Goal: ' + g.name + (g.when ? ' (' + g.when + ')' : '') + '.');
  if (a.check) L.push('- Go easy on my ' + a.check + ': skip moves that load the spine (heavy deadlifts, bent-over rows, swings).');
  L.push('- My current plan:');
  sessions(id).forEach(function (d) {
    if (d.type === 'run') { L.push('  • ' + sessionFull(d) + ': a run'); return; }
    try {
      var rd = resolveDay(id, d, {}), mv = [];
      rd.groups.forEach(function (gr) { gr.items.forEach(function (it) { mv.push(it.name + ' ' + it.scheme); }); });
      L.push('  • ' + sessionFull(d) + ': ' + mv.join('; '));
    } catch (e) { L.push('  • ' + sessionFull(d)); }
  });
  var mine = myRoutinesGet(id);
  if (mine.length) L.push('- Workouts I already made: ' + mine.map(function (r) { return r.title; }).join(', ') + '.');
  L.push('', 'HOW TO REPLY SO THE APP CAN READ IT',
    'Put the workouts in one code block, each one like this:', '',
    'WORKOUT: Hotel Room Upper Body', 'TYPE: strength', '- Push-up | 3 × 12', '- Band Row | 3 × 12', '- Pike Push-up | 2 × 8', '- Plank | 40s', '',
    'Rules:',
    '- TYPE is strength or stretch.',
    '- After the "|" put the amount: 40s (timed), 30s / side, 3 × 10 (sets × reps), 3 × 8–12, or 3 × max.',
    '- Use only exercise names from the list below, spelled exactly.',
    '- Several workouts are fine: start each one with WORKOUT:.',
    '', 'EXERCISES IN THE APP (equipment in brackets)');
  var names = catalogNames();
  CATS.forEach(function (c) {
    var ns = names.filter(function (n) { return catOf(n) === c[0]; });
    if (!ns.length) return;
    var stretchy = c[0] === 'stretch';
    L.push(c[1] + ': ' + ns.map(function (n) { var q = eqOf(n); return n + (stretchy && q === 'bw' ? '' : ' (' + EQ_NAMES[q].toLowerCase() + ')'); }).join(', '));
  });
  L.push('', 'Now here is what I want:', '');
  return L.join('\n');
}
function normName(s) { return String(s || '').toLowerCase().replace(/['’]/g, '').replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim(); }
// compare names loosely: no spaces or hyphens, no plural s ("Push-ups" = "pushup" = "Push-up")
function nameKey(s) { return normName(s).split(' ').map(function (w) { return w.length > 2 && !/ss$/.test(w) ? w.replace(/s$/, '') : w; }).join(''); }
// an AI's exercise name -> the app's name (or keep theirs if it's new to the app)
function matchName(raw) {
  var names = catalogNames(), n = normName(raw), k = nameKey(raw), hit = null;
  if (!n) return null;
  names.forEach(function (c) { if (!hit && normName(c) === n) hit = c; });
  if (!hit) names.forEach(function (c) { if (!hit && nameKey(c) === k) hit = c; });
  if (!hit) names.forEach(function (c) { var ck = nameKey(c); if (ck.length >= 5 && k.indexOf(ck) !== -1 && (!hit || ck.length > nameKey(hit).length)) hit = c; });
  if (!hit && k.length >= 6) {        // e.g. "Shoulder press": the simplest-equipment, shortest name that contains it
    var rank = function (c) { return EQ_ORDER.indexOf(eqOf(c)) * 100 + nameKey(c).length; };
    names.forEach(function (c) { if (nameKey(c).indexOf(k) !== -1 && (!hit || rank(c) < rank(hit))) hit = c; });
  }
  if (hit) return { name: hit, known: true };
  var clean = String(raw).replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
  return { name: clean.charAt(0).toUpperCase() + clean.slice(1), known: false };
}
function normScheme(s, kind) {
  var fallback = kind === 'stretch' ? '30s' : '3 × 10';
  s = String(s || '').replace(/\*\*|`|_/g, '').split(/[,;]|\s[—–]\s|\s-\s|\(/)[0].trim();
  if (!s) return fallback;
  s = s.replace(/\bAMRAP\b|as many as (you can|possible)/ig, 'max')
    .replace(/(\d+)\s*(?:sets?|rounds?)\s*(?:of|x|×)?\s*(?=\d|max)/ig, '$1 × ')
    .replace(/(\d)\s*(?:x|×|\*)\s*/ig, '$1 × ')
    .replace(/(\d+)\s*(?:-|–|to)\s*(\d+)/g, '$1–$2')
    .replace(/(\d+)\s*(?:min|mins|minute|minutes)\b/ig, function (a, n) { return (+n * 60) + 's'; })
    .replace(/(\d+)\s*(?:sec|secs|second|seconds|s)\b\.?/ig, '$1s')
    .replace(/\s*(?:\/\s*side|per side|each side|a side|per leg|each leg|per arm|each arm)\b/ig, ' / side')
    .replace(/\s*\breps?\b/ig, '').replace(/\s+/g, ' ').trim();
  var p = parseScheme(s);
  if (p.kind === 'count') return fallback;
  return s;
}
function parseAIWorkouts(text) {
  var out = [], cur = null;
  function start(title) { cur = { title: title || 'My AI workout', kind: '', moves: [] }; out.push(cur); }
  String(text || '').split(/\r?\n/).forEach(function (line0) {
    var line = line0.replace(/\*\*|__|`/g, '').replace(/^\s*(?:>|#+)\s*/, '').trim(), m;
    if (!line) return;
    if ((m = line.match(/^workout\b[^:]*:\s*(.+)$/i))) { start(m[1].trim().slice(0, 40)); return; }
    if ((m = line.match(/^type\s*:\s*(.+)$/i))) { if (!cur) start(); cur.kind = /stretch|mobility|flex|yoga/i.test(m[1]) ? 'stretch' : 'strength'; return; }
    if (!(m = line.match(/^(?:[-*•‣▪]|\d+[.)])\s+(.+)$/))) return;
    var body = m[1].trim(), name = body, sch = '', mm;
    if (body.indexOf('|') !== -1) { var parts = body.split('|'); name = parts[0]; sch = parts.slice(1).join(' '); }
    else if ((mm = body.match(/^(.*?)\s*(?:[—–:]|\s-\s)\s*(.*\d.*|.*max.*)$/i))) { name = mm[1]; sch = mm[2]; }
    else if ((mm = body.match(/^(.*?)\s+(\d.*)$/))) { name = mm[1]; sch = mm[2]; }
    var hit = matchName(name);
    if (!hit) return;
    if (!cur) start();
    cur.moves.push({ name: hit.name, known: hit.known, raw: sch });
  });
  return out.filter(function (w) { return w.moves.length; }).map(function (w) {
    var kind = w.kind || (w.moves.every(function (x) { return STRETCHES[x.name]; }) ? 'stretch' : 'strength');
    return { title: w.title, kind: kind, moves: w.moves.map(function (x) { return { name: x.name, known: x.known, scheme: normScheme(x.raw, kind) }; }) };
  });
}
function copyText(text) {
  function legacy() {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta); return ok;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacy(); });
  return Promise.resolve(legacy());
}
function openAIHelper() {
  var id = App.id, el = h('<div></div>'), found = [];
  Layers.push(el, { onClose: function () { renderTab(); } });
  function render() {
    el.innerHTML = '<div class="lwrap"><div class="lhead"><button class="icon-btn" data-act="back" aria-label="Back">' + I.back + '</button></div>' +
      '<h1 style="font-weight:900;font-size:30px;margin-top:10px">Plan workouts with AI</h1>' +
      '<p class="muted" style="margin:6px 0 0;font-size:16px;line-height:1.45">Use ChatGPT, Claude or any AI you like. It gets every exercise in this app and your plan, and answers in a format the app can open.</p>' +
      '<div class="card ai-step"><span class="ai-n">1</span><div class="grow"><b>Copy everything your AI needs</b>' +
      '<p>Then paste it into a chat and add what you want, like "a 20-minute leg day with no dumbbells".</p>' +
      '<div class="ai-btns"><button class="btn" data-act="copy">' + I.copy + 'Copy for my AI</button>' +
      (navigator.share ? '<button class="btn soft" data-act="share">Share…</button>' : '') + '</div></div></div>' +
      '<div class="card ai-step"><span class="ai-n">2</span><div class="grow"><b>Paste the workout it gives you</b>' +
      '<p>Paste the whole reply. The app picks out the workouts.</p>' +
      '<textarea id="ai-in" rows="6" placeholder="WORKOUT: …&#10;TYPE: strength&#10;- Push-up | 3 × 12" aria-label="Paste your AI\'s reply"></textarea>' +
      '<div class="ai-btns"><button class="btn soft" data-act="read">Read workout</button></div><div id="ai-prev"></div></div></div></div>';
    on(el, '[data-act="back"]', 'click', function () { Layers.pop(); });
    on(el, '[data-act="copy"]', 'click', function () {
      copyText(aiExportText(id)).then(function (ok) {
        if (ok) toast('Copied. Paste it into your AI and say what you want', null, null, 4200);
        else showText();
      });
    });
    on(el, '[data-act="share"]', 'click', function () { navigator.share({ title: 'My workout app', text: aiExportText(id) }).catch(function () {}); });
    on(el, '[data-act="read"]', 'click', function () { found = parseAIWorkouts($('#ai-in', el).value); preview(); });
  }
  function showText() {
    var sh = Sheet.open('<h2>Copy this</h2><p class="muted" style="font-size:15px">Your phone blocked copying. Tap and hold in the box, Select All, then Copy.</p>' +
      '<textarea readonly rows="10" style="width:100%;font-size:13px">' + esc(aiExportText(id)) + '</textarea><button class="btn soft sm" style="margin-top:12px" data-a="close">Done</button>');
    on(sh, '[data-a="close"]', 'click', function () { Sheet.close(); });
  }
  function preview() {
    var box = $('#ai-prev', el);
    if (!found.length) { box.innerHTML = '<p class="ai-warn">No workout found. Make sure each move starts with "- ", like "- Push-up | 3 × 12".</p>'; return; }
    var unknown = 0;
    box.innerHTML = found.map(function (w, wi) {
      return '<div class="ai-w"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><b>' + esc(w.title) + '</b><span class="cap">' +
        (w.kind === 'stretch' ? 'Stretch' : 'Strength') + ' · ' + w.moves.length + ' moves</span></div>' +
        w.moves.map(function (m) {
          if (!m.known) unknown++;
          return '<div class="ai-m">' + figHTML(m.name, 40, id) + '<span class="grow">' + esc(m.name) + '<small>' + esc(schemeText(m.scheme)) + (m.known ? '' : ' · new to the app, no drawing yet') + '</small></span></div>';
        }).join('') + '</div>';
    }).join('') + (unknown ? '<p class="muted" style="font-size:13px;margin:8px 0 0">Moves new to the app still work: they get a stand-in picture and general tips.</p>' : '') +
      '<button class="btn" data-act="add" style="margin-top:14px">' + I.plus + 'Add ' + (found.length === 1 ? 'this workout' : found.length + ' workouts') + '</button>';
    on(box, '[data-act="add"]', 'click', function () {
      var list = myRoutinesGet(id), stamp = Date.now().toString(36);
      found.forEach(function (w, i) {
        list.push({ id: 'my_' + stamp + i, kind: w.kind, title: w.title, pose: poseFor(w.moves[0].name), bg: FIG_BG[list.length % FIG_BG.length],
          blurb: 'From my AI', moves: w.moves.map(function (m) { return [m.name, m.scheme]; }) });
      });
      myRoutinesSave(id, list);
      toast(found.length === 1 ? 'Added ' + found[0].title + ' to Today' : 'Added ' + found.length + ' workouts to Today');
      Layers.pop();
    });
  }
  render();
}
