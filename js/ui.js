/* UI helpers: icons, full-screen layers, bottom sheets, toasts, press-and-hold, videos. */
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function h(html) { var t = document.createElement('template'); t.innerHTML = String(html).trim(); return t.content.firstElementChild; }
function on(root, sel, ev, fn) { $$(sel, root).forEach(function (el) { el.addEventListener(ev, function (e) { fn.call(el, e, el); }); }); }

var I = (function () {
  function s(d, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>'; }
  return {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>',
    check: s('<polyline points="5,12.5 10,17 19,7"/>', ' stroke-width="3"'),
    x: s('<path d="M6 6l12 12M18 6L6 18"/>'),
    back: s('<polyline points="15,5 8,12 15,19"/>'),
    chev: s('<polyline points="9,5 16,12 9,19"/>'),
    down: s('<polyline points="5,9 12,16 19,9"/>'),
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="7" r="1.7" fill="currentColor"/><path d="M12 11v7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6L4 12l8 6zM20 6l-8 6 8 6z" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6l8 6-8 6zM4 6l8 6-8 6z" fill="currentColor"/></svg>',
    plus: s('<path d="M12 5v14M5 12h14"/>'),
    minus: s('<path d="M5 12h14"/>'),
    swap: s('<path d="M7 7h11l-3-3M17 17H6l3 3"/>'),
    sliders: s('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
    trash: s('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    reset: s('<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/>'),
    video: s('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>'),
    flag: s('<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'),
    sound: s('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
    mute: s('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    users: s('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.8c1.6.9 2.6 2.6 3 5.2"/>'),
    list: s('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
    spark: s('<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/><path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>'),
    book: s('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
    run: s('<circle cx="14" cy="4.5" r="2"/><path d="M8 21l3-6 3 2v5M6 12l3-4 4 1 3 4 3 1"/>'),
    download: s('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    upload: s('<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>'),
    clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    edit: s('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
    copy: s('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
    timer: s('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>'),
    old: s('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/>')
  };
})();

/* full-screen layers (overview, player, finish, setup...) */
var Layers = {
  stack: [],
  push: function (el, opt) {
    opt = opt || {};
    el.classList.add('layer'); if (opt.white) el.classList.add('white');
    $('#layers').appendChild(el);
    this.stack.push({ el: el, onClose: opt.onClose });
    document.body.style.overflow = 'hidden';
    el.scrollTop = 0;
    return el;
  },
  pop: function () {
    var t = this.stack.pop(); if (!t) return;
    t.el.remove(); if (t.onClose) t.onClose();
    if (!this.stack.length) document.body.style.overflow = '';
  },
  closeAll: function () { while (this.stack.length) this.pop(); },
  replaceTop: function (el, opt) { var t = this.stack.pop(); if (t) t.el.remove(); return this.push(el, opt); }
};

/* bottom sheets */
var Sheet = {
  cur: null,
  open: function (html, opt) {
    opt = opt || {};
    this.close(true);
    var scrim = h('<div class="scrim"></div>');
    var el = h('<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div></div>');
    if (typeof html === 'string') el.insertAdjacentHTML('beforeend', html); else el.appendChild(html);
    document.body.appendChild(scrim); document.body.appendChild(el);
    var self = this;
    var opened = Date.now();
    scrim.addEventListener('click', function () { if (Date.now() - opened > 350) self.close(); });
    // swipe down on the grabber area to close
    var y0 = null;
    el.addEventListener('touchstart', function (e) { if (el.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchmove', function (e) {
      if (y0 == null) return; var dy = e.touches[0].clientY - y0;
      if (dy > 0 && el.scrollTop <= 0) el.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (y0 == null) return; var dy = (e.changedTouches[0].clientY - y0); y0 = null;
      if (dy > 110) self.close(); else el.style.transform = '';
    });
    this.cur = { el: el, scrim: scrim, onClose: opt.onClose };
    return el;
  },
  close: function (silent) {
    var c = this.cur; if (!c) return; this.cur = null;
    c.el.remove(); c.scrim.remove();
    if (!silent && c.onClose) c.onClose();
  }
};

/* toast with optional Undo */
var _toastT = null;
function toast(msg, action, fn, ms) {
  var t = $('#toast');
  t.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button type="button">' + esc(action) + '</button>' : '');
  t.classList.add('on');
  if (action) t.querySelector('button').onclick = function () { t.classList.remove('on'); fn && fn(); };
  clearTimeout(_toastT); _toastT = setTimeout(function () { t.classList.remove('on'); }, ms || (action ? 5000 : 2600));
}

/* press-and-hold: onHold after 450 ms (cancelled by scrolling); a normal tap still clicks.
   After a hold, the click that follows the finger lifting is swallowed wherever it lands. */
var _holdUntil = 0;
document.addEventListener('click', function (e) { if (Date.now() < _holdUntil) { e.preventDefault(); e.stopPropagation(); _holdUntil = 0; } }, true);
function holdable(el, onHold) {
  var timer = null, x0 = 0, y0 = 0, held = false, pressT = null;
  el.classList.add('hold', 'press');
  function cancel() { clearTimeout(timer); clearTimeout(pressT); timer = null; el.classList.remove('pressing'); }
  el.addEventListener('pointerdown', function (e) {
    if (e.button && e.button !== 0) return;
    held = false; x0 = e.clientX; y0 = e.clientY;
    pressT = setTimeout(function () { el.classList.add('pressing'); }, 90);
    timer = setTimeout(function () { held = true; cancel(); _holdUntil = Date.now() + 700; onHold(e); }, 450);
  });
  el.addEventListener('pointermove', function (e) { if (timer && (Math.abs(e.clientX - x0) > 10 || Math.abs(e.clientY - y0) > 10)) cancel(); });
  el.addEventListener('pointerup', cancel);
  el.addEventListener('pointerleave', cancel);
  el.addEventListener('pointercancel', cancel);
  el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  el.addEventListener('click', function (e) { if (held) { e.preventDefault(); e.stopImmediatePropagation(); held = false; } }, true);
}

/* demo video: a frame from the middle of the video (not clickbait thumbnails), tap to play inline */
function videoHTML(v) {
  if (!v) return '';
  return '<button type="button" class="vid" data-vid="' + v + '" aria-label="Play demo video"><img alt="" src="https://i.ytimg.com/vi/' + v + '/hq2.jpg">' +
    '<span class="pb"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="#fff"/></svg></span></button>';
}
function wireVideo(root) {
  var FRAMES = ['hq1', 'hq3', 'mqdefault'];
  $$('.vid img', root).forEach(function (img) {
    function fb() { var i = +(img.dataset.fb || 0); if (i >= FRAMES.length) return; img.dataset.fb = i + 1; img.src = 'https://i.ytimg.com/vi/' + img.parentNode.dataset.vid + '/' + FRAMES[i] + '.jpg'; }
    img.addEventListener('load', function () { if (img.naturalWidth <= 120) fb(); });
    img.addEventListener('error', fb);
  });
  $$('.vid', root).forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.vid + '?rel=0&playsinline=1&modestbranding=1&autoplay=1&mute=1';
      f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture'); f.setAttribute('allowfullscreen', '');
      f.setAttribute('title', 'Demo video');
      b.innerHTML = ''; b.appendChild(f); b.style.cursor = 'default';
    }, { once: true });
  });
}

function avatarHTML(id, size) {
  var s = size || 48;
  return '<span class="av" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * 0.42) + 'px;background:' + personColor(id) + '">' + esc((personName(id) || '?')[0]) + '</span>';
}
function dotsHTML(n, target) {
  var o = '<span class="dots" aria-hidden="true">';
  for (var i = 0; i < Math.max(target, n); i++) o += '<i' + (i < n ? ' class="on"' : '') + '></i>';
  return o + '</span>';
}
