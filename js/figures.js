/* Flat, Bend-style exercise figures.
   A pose is a handful of joints in a 120×120 box; this one renderer draws every
   pose in the same style (colour circle, floor, mat, figure with darker far-side
   limbs), so all the drawings match. Pose files add to window.POSES.

   Pose fields (all points are [x, y]; ground/top of the mat is y = 92):
     head   centre of the head            face  direction the face points ([1,0] = right)
     N      base of the neck (top of torso) H     hips (bottom of torso)
     lN/lF  near / far leg: [knee, ankle, toe]
     aN/aF  near / far arm: [elbow, hand]   (shoulder is placed 10% down the torso)
     bg     circle colour   props  extra shapes (see prop())   scale  override auto-fit
   Colours in props may be tokens: $eq (equipment), $band, $dark, $mid, $wall,
   $skin, $top, $leg. */
var FIG = (function () {
  var C = { skin: '#C98D66', skinF: '#A86E4A', hair: '#2B1E18', top: '#F6F1E9', leg: '#1F2A3C', legF: '#0F1622',
            shoe: '#FFFFFF', shoeF: '#D9D3C8', eq: '#3A3F47', band: '#F08A5D' };
  function r1(n) { return Math.round(n * 10) / 10; }
  function shade(hex, f) {
    var n = parseInt(String(hex).slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function c(v) { return Math.max(0, Math.min(255, Math.round(v * f))); }
    return '#' + ((1 << 24) + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1);
  }
  function col(v, bg) {
    if (!v || v.charAt(0) !== '$') return v;
    var k = v.slice(1);
    if (k === 'dark') return shade(bg, 0.55);
    if (k === 'mid') return shade(bg, 0.75);
    if (k === 'wall') return shade(bg, 0.86);
    return C[k] || v;
  }
  function seg(a, b, c, w) {
    return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) +
      '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  }
  function dot(p, r, c) { return '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r + '" fill="' + c + '"/>'; }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function limb(a, b, c, colr, w1, w2) { return seg(a, b, colr, w1) + seg(b, c, colr, w2); }
  function prop(q, bg) {
    var k = q.k;
    if (k === 'db') return dot(q.at, q.r || 4.6, C.eq) + dot(q.at, 1.6, '#5A606A');           // dumbbell, end-on
    if (k === 'dbh') {                                                                            // dumbbell, side-on
      var a = q.at, h = q.len || 6;
      return seg([a[0] - h, a[1]], [a[0] + h, a[1]], C.eq, 2.6) +
        '<rect x="' + r1(a[0] - h - 2.5) + '" y="' + r1(a[1] - 4) + '" width="5" height="8" rx="1.6" fill="' + C.eq + '"/>' +
        '<rect x="' + r1(a[0] + h - 2.5) + '" y="' + r1(a[1] - 4) + '" width="5" height="8" rx="1.6" fill="' + C.eq + '"/>';
    }
    if (k === 'kb') {
      var p = q.at;
      return '<path d="M' + r1(p[0] - 3.4) + ' ' + r1(p[1] - 3) + ' a3.6 3.6 0 0 1 6.8 0" fill="none" stroke="' + C.eq + '" stroke-width="2.2"/>' +
        dot([p[0], p[1] + 2.2], 5.2, C.eq);
    }
    if (k === 'plate') return dot(q.at, q.r || 8, C.eq) + dot(q.at, 2, '#5A606A');               // barbell end, side view
    if (k === 'band') return seg(q.a, q.b, C.band, q.w || 3.4);
    if (k === 'ball') return dot(q.at, q.r || 5.5, col(q.c || '$band', bg));
    if (k === 'bench') return '<rect x="' + q.x + '" y="' + q.y + '" width="' + q.w + '" height="' + q.h + '" rx="' + (q.rx == null ? 2.5 : q.rx) + '" fill="' + col(q.c || '$dark', bg) + '"/>';
    if (k === 'bar') return seg(q.a, q.b, C.eq, q.w || 3);
    if (k === 'post') return seg(q.a, q.b, col(q.c || '$dark', bg), q.w || 4);
    if (k === 'wall') return '<rect x="' + q.x + '" y="' + q.y + '" width="' + q.w + '" height="' + q.h + '" fill="' + col(q.c || '$wall', bg) + '"/>';
    if (k === 'line') return seg(q.a, q.b, col(q.c || '$eq', bg), q.w || 3);
    if (k === 'rect') return '<rect x="' + q.x + '" y="' + q.y + '" width="' + q.w + '" height="' + q.h + '" rx="' + (q.rx || 0) + '"' +
      (q.rot ? ' transform="rotate(' + q.rot + ' ' + (q.x + q.w / 2) + ' ' + (q.y + q.h / 2) + ')"' : '') + ' fill="' + col(q.c || '$dark', bg) + '"/>';
    if (k === 'circle') return dot(q.at, q.r || 4, col(q.c || '$eq', bg));
    if (k === 'poly') return '<polyline points="' + q.pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') +
      '" fill="none" stroke="' + col(q.c || '$eq', bg) + '" stroke-width="' + (q.w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (k === 'path') return '<path d="' + q.d + '" fill="' + (q.fill ? col(q.fill, bg) : 'none') + '"' +
      (q.stroke ? ' stroke="' + col(q.stroke, bg) + '" stroke-width="' + (q.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>';
    return '';
  }
  var uid = 0;
  // svg(pose or key, {size, bg, hair:'bun'|'short', label})
  function svg(p, opt) {
    opt = opt || {};
    if (typeof p === 'string') p = (window.POSES || {})[p];
    if (!p) return '';
    var bg = opt.bg || p.bg || '#6E9A8B';
    var size = opt.size || 120;
    var o = '<svg class="fig" viewBox="0 0 120 120" width="' + size + '" height="' + size + '"' +
      (opt.label ? ' role="img" aria-label="' + String(opt.label).replace(/"/g, '&quot;') + '"' : ' aria-hidden="true"') + '>';
    o += dot([60, 60], 60, bg);
    o += '<path d="M9.25 92H110.75A60 60 0 0 1 9.25 92Z" fill="' + shade(bg, 0.88) + '"/>';
    o += '<rect x="16" y="92" width="88" height="6" rx="1.5" fill="' + shade(bg, 0.68) + '"/>';
    var props = p.props || [];
    function layer(L) {
      return props.filter(function (q) { return (q.L || 'front') === L; }).map(function (q) { return prop(q, bg); }).join('');
    }
    var N = p.N, H = p.H, S = lerp(N, H, 0.1), head = p.head;
    var f = p.face || [1, 0], fl = Math.hypot(f[0], f[1]) || 1; f = [f[0] / fl, f[1] / fl];
    var xs = [head[0] - 8, head[0] + 8, N[0], H[0]], ys = [head[1] - 9];
    [p.aN, p.aF, p.lN, p.lF].forEach(function (L) { if (L) L.forEach(function (q) { xs.push(q[0]); ys.push(q[1]); }); });
    var bx0 = Math.min.apply(null, xs), bx1 = Math.max.apply(null, xs), by0 = Math.min.apply(null, ys);
    var sc = p.scale || Math.min(1.3, 90 / (bx1 - bx0), 80 / (92 - by0));
    var tx = 60 - ((bx0 + bx1) / 2) * sc + (p.dx || 0), ty = 92 - 92 * sc;
    var clip = 'fc' + (++uid);
    o += '<defs><clipPath id="' + clip + '"><circle cx="60" cy="60" r="60"/></clipPath></defs><g clip-path="url(#' + clip + ')">';
    o += '<g transform="translate(' + r1(tx) + ' ' + r1(ty) + ') scale(' + Math.round(sc * 1000) / 1000 + ')">';
    o += layer('back');
    if (p.aF) o += limb(S, p.aF[0], p.aF[1], C.skinF, 6.6, 5.8) + dot(p.aF[1], 3, C.skinF);
    if (p.lF) o += limb(H, p.lF[0], p.lF[1], C.legF, 10.5, 8.6) + seg(p.lF[1], p.lF[2], C.shoeF, 5);
    o += layer('mid0');
    o += seg(N, lerp(N, head, 0.7), C.skin, 6);
    o += seg(N, H, C.top, 14.5);
    o += seg(H, lerp(H, N, 0.24), C.leg, 14.8);
    if (p.lN) o += limb(H, p.lN[0], p.lN[1], C.leg, 11, 9) + seg(p.lN[1], p.lN[2], C.shoe, 5.2);
    o += layer('mid');
    if (p.aN) o += limb(S, p.aN[0], p.aN[1], C.skin, 7, 6) + dot(p.aN[1], 3.2, C.skin);
    o += dot([head[0] - f[0] * 1.6, head[1] - f[1] * 1.6 - 0.6], 8.2, C.hair);
    o += dot([head[0] + f[0] * 0.9, head[1] + f[1] * 0.9 + 0.3], 7.1, C.skin);
    if ((opt.hair || 'bun') === 'bun') o += dot([head[0] - f[0] * 8.6, head[1] - f[1] * 8.6 - 1.2], 3.6, C.hair);
    o += layer('front');
    return o + '</g></g></svg>';
  }
  return { svg: svg, C: C, shade: shade };
})();

window.POSES = window.POSES || {};
Object.assign(window.POSES, {
  gobletSquat: { bg: '#6E9A8B', head: [59, 30.8], face: [1, 0.15], N: [56.3, 41], H: [48.5, 70],
    lN: [[66, 72], [60, 89], [68, 90.5]], lF: [[64, 73], [58, 89], [65, 90.5]],
    aN: [[60, 56], [65, 48]], aF: [[58, 57], [63, 49]], props: [{ k: 'kb', at: [66, 50], L: 'front' }] },
  rdl: { bg: '#D8B44E', head: [82.7, 38.9], face: [0.5, 0.85], N: [73.2, 43.3], H: [46, 56],
    lN: [[53, 72], [54, 89], [62, 90.5]], lF: [[51, 72.5], [52, 89], [59, 90.5]],
    aN: [[71, 57.5], [71.5, 69.5]], aF: [[69, 58], [69.5, 70]], props: [{ k: 'db', at: [71.5, 72], L: 'front' }] },
  splitSquat: { bg: '#5560A8', head: [57.3, 30], face: [1, 0.1], N: [57, 40.5], H: [56, 70.5],
    lN: [[74, 71], [74, 89], [82, 90.5]], lF: [[46, 86], [31, 85], [28, 91]],
    aN: [[57, 56.5], [57.5, 68.5]], props: [{ k: 'db', at: [57.5, 71], L: 'front' }] },
  sidePlank: { bg: '#93688A', head: [18.7, 75.5], face: [-0.6, -0.5], N: [29, 77.5], H: [58.5, 83.1],
    lN: [[76, 86.5], [93, 89.5], [96, 84]], lF: [[76, 88.5], [92, 91.5], [95, 87]],
    aN: [[30.5, 65], [31, 52.5]], aF: [[30, 91], [41, 91.5]] },
  childsPose: { bg: '#6E9CC4', head: [40.6, 85.4], face: [-0.35, 1], N: [51, 84], H: [80, 80],
    lN: [[64, 89.5], [84, 90.5], [90, 89.5]], lF: [[66, 90], [85, 91], [91, 90]],
    aN: [[38, 90.5], [25, 91]], aF: [[39, 89.5], [26, 90]] },
  hipFlexor: { bg: '#4E8C8C', head: [54.6, 33.5], face: [1, 0.05], N: [55, 44], H: [56, 74],
    lN: [[74, 72], [76, 90], [84, 90.5]], lF: [[46, 90], [28, 89.5], [22, 90.5]],
    aN: [[59, 34.5], [61, 22]], aF: [[57.5, 35], [59.5, 22.5]] },
  gluteBridge: { bg: '#A08BD6', head: [24.2, 84.9], face: [0.15, -1], N: [34, 81], H: [62, 70],
    lN: [[79, 72], [80, 90], [87, 91]], lF: [[77, 73], [78, 90.5], [85, 91.5]],
    aN: [[48, 88.5], [60, 91]], aF: [[46, 88], [58, 90.5]] },
  bandedBridge: { bg: '#A08BD6', head: [24.2, 84.9], face: [0.15, -1], N: [34, 81], H: [62, 70],
    lN: [[79, 72], [80, 90], [87, 91]], lF: [[77, 73], [78, 90.5], [85, 91.5]],
    aN: [[48, 88.5], [60, 91]], aF: [[46, 88], [58, 90.5]],
    props: [{ k: 'band', a: [73, 66.5], b: [73, 76], L: 'mid' }] },
  birdDog: { bg: '#9AA36A', head: [90.4, 66.5], face: [0.6, 0.8], N: [80, 70], H: [50, 72.5],
    lN: [[50, 90.5], [32, 91], [27, 90]], lF: [[33, 71], [16, 70], [12, 66]],
    aN: [[89, 66], [101, 63]], aF: [[78, 81], [78.5, 91.5]] },
  run: { bg: '#6E9CC4', head: [64.2, 24.5], face: [1, 0.1], N: [62, 35], H: [56, 64],
    lN: [[70, 73], [66, 89.5], [73, 90.5]], lF: [[48, 77], [34, 80], [31, 86]],
    aN: [[51, 45], [50, 56]], aF: [[70, 47], [77, 39]] },
  kneesToChest: { bg: '#A89A8A', head: [26, 85.5], face: [0.1, -1], N: [37, 86], H: [65, 86],
    lN: [[56, 71], [72, 70], [76, 66]], lF: [[58, 72.5], [73, 72], [77, 68]],
    aN: [[46, 75], [56, 70]], aF: [[44, 76.5], [54, 71.5]] },
  deadBug: { bg: '#A89A8A', head: [25.5, 85.5], face: [0, -1], N: [37, 86], H: [65, 86],
    lN: [[67.5, 68.2], [84.5, 70], [89, 66]], lF: [[82, 83], [98, 82], [101, 77]],
    aN: [[40, 73], [41, 61]], aF: [[30, 77], [21, 69]] }
});
if (typeof module !== 'undefined') module.exports = { FIG: FIG };
