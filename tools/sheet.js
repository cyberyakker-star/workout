// Contact sheet for figure poses: node tools/sheet.js out.png js/poses/a.js [more pose files...]
// Renders every pose defined in the given files (or all poses when none are given)
// at 200px with its key underneath, so a pose can be checked by eye.
// Needs playwright-core: npm install --no-save playwright-core
const fs = require('fs'), path = require('path'), vm = require('vm');
const out = process.argv[2] || 'sheet.png';
const files = process.argv.slice(3);
const ctx = { window: {}, Math, Object, String, parseInt, console };
ctx.window.POSES = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', 'figures.js'), 'utf8'), ctx);
let keys = null;
if (files.length) {
  const before = new Set(Object.keys(ctx.window.POSES));
  files.forEach(f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx));
  keys = Object.keys(ctx.window.POSES).filter(k => !before.has(k) || files.length);
  // only the poses the given files define
  const defined = new Set();
  files.forEach(f => { const src = fs.readFileSync(f, 'utf8'); (src.match(/^\s{2}([A-Za-z0-9_]+)\s*:\s*\{/gm) || []).forEach(m => defined.add(m.trim().split(/\s*:/)[0])); });
  keys = keys.filter(k => defined.has(k));
} else keys = Object.keys(ctx.window.POSES);
const cells = keys.map(k => `<div style="text-align:center;font:13px sans-serif">${ctx.FIG.svg(ctx.window.POSES[k], { size: 200 })}<br>${k}</div>`).join('');
const html = `<body style="margin:0;background:#fff"><div style="display:grid;grid-template-columns:repeat(4,216px);gap:10px;padding:10px">${cells}</div></body>`;
let pw; try { pw = require('playwright-core'); } catch (e) { pw = require('playwright'); }
(async () => {
  const exe = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined;
  const b = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 900, height: 600 } });
  await p.setContent(html);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
  console.log('wrote', out, keys.length, 'poses:', keys.join(', '));
})();
