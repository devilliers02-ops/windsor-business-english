/* Windsor Business English: behaviour. Depends on lang.js (window.WBE) and data.js (window.WBE_DATA). */
(function () {
  'use strict';
  var D = window.WBE_DATA;
  var WA_NUMBER = '2250758211746';
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var t = function (o) { return window.WBE.t(o); };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  /* ---------- day / night theme ---------- */
  function initTheme() {
    var root = document.documentElement, btns = $$('[data-theme-set]');
    var mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
    function current() { return root.getAttribute('data-theme') || (mq && mq.matches ? 'dark' : 'light'); }
    function paint() { var c = current(); btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.themeSet === c)); }); }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var want = b.dataset.themeSet;
        if (want === current()) want = want === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', want);
        try { localStorage.setItem('wbe_theme', want); } catch (e) {}
        paint();
      });
    });
    if (mq && mq.addEventListener) mq.addEventListener('change', paint);
    paint();
  }

  /* ---------- toast + copy ---------- */
  var toastTimer;
  function toast(msg) {
    var n = $('toast'); n.textContent = msg; n.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { n.classList.remove('on'); }, 2200);
  }
  function initCopy() {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-copy');
        var done = function () { toast(t({ en: 'Copied: ', fr: 'Copié : ' }) + v); };
        var fallback = function () {
          var r = document.createRange(), n = $(b.getAttribute('data-target'));
          if (n) { r.selectNodeContents(n); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
          toast(t({ en: 'Press Ctrl+C to copy', fr: 'Appuyez sur Ctrl+C pour copier' }));
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, fallback); else fallback();
      });
    });
  }

  /* ---------- WhatsApp links with a prefilled message ---------- */
  function updateWa() {
    $$('[data-wa]').forEach(function (a) {
      var topic = a.getAttribute('data-wa'), custom = a.getAttribute('data-msg-' + WBE.lang());
      var msg = custom ? custom : WBE.lang() === 'fr'
        ? 'Bonjour Windsor, je souhaite des informations' + (topic ? ' sur : ' + topic : '.')
        : 'Hello Windsor, I would like information' + (topic ? ' about: ' + topic : '.');
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    });
  }

  /* ---------- header: shadow, progress bar, burger, scrollspy ---------- */
  function initHeader() {
    var hdr = $('hdr'), bar = $('bar'), burger = $('burger'), nav = $('nav'), ticking = false;
    function onScroll() {
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      hdr.classList.toggle('stuck', y > 20);
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    function close() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    if (!('IntersectionObserver' in window)) return;
    var links = {};
    $$('a[href^="#"]', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('on'); });
          links[e.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = $(id); if (s) spy.observe(s); });
  }

  /* ---------- reveal on scroll (only below-the-fold items start hidden) ---------- */
  function initReveal() {
    var items = $$('[data-r]');
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var groups = new Map();
    items.forEach(function (n) {
      var p = n.parentElement, i = groups.get(p) || 0; groups.set(p, i + 1);
      n.style.setProperty('--i', Math.min(i, 6));
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('rv'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (n) {
      if (n.getBoundingClientRect().top > window.innerHeight * 0.92) { n.classList.add('rv'); io.observe(n); }
    });
    setTimeout(function () { $$('.rv').forEach(function (n) { n.classList.remove('rv'); }); }, 6000);
  }

  /* ---------- count-up ---------- */
  function initCount() {
    var nodes = $$('[data-count]');
    function run(n) {
      var to = +n.getAttribute('data-count'), suf = n.getAttribute('data-suf') || '', t0 = performance.now(), d = 1400;
      (function step(now) {
        var p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3);
        n.textContent = Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- marquee ---------- */
  function initMarquee() {
    var tr = $('marqTrack'); if (!tr) return;
    tr.innerHTML += tr.innerHTML;
    tr.setAttribute('aria-hidden', 'true');
    document.addEventListener('wbe:lang', function () { /* data-fr already swapped on both copies */ });
  }

  /* ---------- Windsor chat demo ---------- */
  function initKoro() {
    var box = $('msgs'); if (!box) return;
    var timers = [], started = false;
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function bubble(m) { var b = el('div', 'm ' + m.who, t(m)); b.dataset.i = D.KORO.indexOf(m); return b; }
    function showAll() { box.replaceChildren(); D.KORO.forEach(function (m) { box.appendChild(bubble(m)); }); }
    function play() {
      clear(); box.replaceChildren();
      var at = 400;
      D.KORO.forEach(function (m) {
        if (m.who === 'bot') {
          timers.push(setTimeout(function () { var ty = el('div', 'typing'); ty.innerHTML = '<i></i><i></i><i></i>'; ty.id = 'ty'; box.appendChild(ty); }, at));
          at += 1100;
          timers.push(setTimeout(function () { var ty = $('ty'); if (ty) ty.remove(); box.appendChild(bubble(m)); }, at));
          at += 1300;
        } else {
          timers.push(setTimeout(function () { box.appendChild(bubble(m)); }, at));
          at += 1000;
        }
      });
      timers.push(setTimeout(play, at + 6000));
    }
    document.addEventListener('wbe:lang', function () {
      $$('.m', box).forEach(function (b) { b.textContent = t(D.KORO[+b.dataset.i]); });
    });
    if (REDUCED || !('IntersectionObserver' in window)) { showAll(); return; }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !started) { started = true; play(); }
        else if (!e.isIntersecting && started) { clear(); started = false; showAll(); }
      });
    }, { threshold: 0.35 }).observe(box);
    showAll();
  }

  /* ---------- Prepositions in motion ---------- */
  function initPrep() {
    var stageEl = $('pstage'); if (!stageEl) return;
    var cat = 'time', list = [], idx = 0, timer = null, paused = false, visible = false;

    function flat(c) { var a = []; D.PREP[c].forEach(function (g) { g.s.forEach(function (s) { a.push({ s: s, p: g.p }); }); }); return a; }
    function tokens(h) { return h.replace(/<b>([^<]+)<\/b>/g, '<span class="tok">$1</span>'); }

    function show(i, animate) {
      idx = (i + list.length) % list.length;
      var it = list[idx], sent = $('psent');
      function paint() {
        sent.innerHTML = tokens(it.s.en);
        $('pfr').textContent = it.s.fr;
        $('ptip').textContent = '💡 ' + t(it.s.tip);
        $('scene').dataset.s = it.p.toLowerCase();
        sent.classList.remove('out'); if (animate && !REDUCED) { sent.classList.add('in2'); }
        $$('#dots i').forEach(function (d, k) { d.classList.toggle('on', k === idx); });
        mark();
      }
      if (animate && !REDUCED) { sent.classList.remove('in2'); sent.classList.add('out'); setTimeout(paint, 240); } else paint();
    }
    function groupOf(i) { return Math.floor(i / 3); }

    function dots() { var d = $('dots'); d.replaceChildren(); list.forEach(function () { d.appendChild(el('i')); }); }

    function cards() {
      var c = $('pcards'); c.replaceChildren();
      D.PREP[cat].forEach(function (g, gi) {
        var b = el('button', 'pc'); b.type = 'button'; b.dataset.p = g.p; b.dataset.g = gi; b.style.animationDelay = (gi * 70) + 'ms';
        b.innerHTML = '<b>' + g.p + '</b><em>' + t(g.label) + '</em><p>' + g.s[0].en.replace(/<b>/g, '<u>').replace(/<\/b>/g, '</u>') + '</p><small>' + t(g.note) + '</small>';
        b.addEventListener('click', function () { restart(); show(gi * 3, true); });
        c.appendChild(b);
      });
    }
    function mark() { $$('#pcards .pc').forEach(function (c) { c.classList.toggle('on', +c.dataset.g === groupOf(idx)); }); }

    function tick() { if (!paused && visible && !REDUCED) show(idx + 1, true); }
    function restart() { clearInterval(timer); timer = setInterval(tick, 5500); }

    function setCat(c) {
      cat = c; list = flat(c);
      $$('.tab').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.cat === c)); });
      cards(); dots(); show(0, false); mark(); restart();
    }

    $$('.tab').forEach(function (b, i, all) {
      b.addEventListener('click', function () { setCat(b.dataset.cat); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        var n = all[(i + d + all.length) % all.length]; n.focus(); setCat(n.dataset.cat);
      });
    });
    $('pprev').addEventListener('click', function () { show(idx - 1, true); mark(); restart(); });
    $('pnext').addEventListener('click', function () { show(idx + 1, true); mark(); restart(); });
    $('ppause').addEventListener('click', function () {
      paused = !paused; var b = $('ppause');
      b.innerHTML = '<i class="fas fa-' + (paused ? 'play' : 'pause') + '"></i>';
      b.setAttribute('aria-label', t(paused ? { en: 'Play', fr: 'Lecture' } : { en: 'Pause', fr: 'Pause' }));
    });
    stageEl.addEventListener('mouseenter', function () { paused = true; });
    stageEl.addEventListener('mouseleave', function () { paused = $('ppause').innerHTML.indexOf('play') > -1; });
    document.addEventListener('wbe:lang', function () { cards(); show(idx, false); mark(); });

    var fl = $('floaters'), words = ['AT', 'ON', 'IN', 'BY', 'TO', 'FOR', 'WITH', 'OF', 'INTO', 'FROM'];
    if (fl && !REDUCED) words.forEach(function (w, i) {
      var s = el('span', null, w);
      s.style.cssText = 'left:' + (4 + i * 9.5) + '%;--s:' + (1.2 + (i % 4) * 0.6) + 'rem;--t:' + (18 + (i * 7) % 11) + 's;--dl:' + (-i * 2.3) + 's';
      fl.appendChild(s);
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.2 }).observe(stageEl);
    else visible = true;
    setCat('time');
  }

  /* ---------- Fill-in-the-preposition quiz ---------- */
  function initQuiz() {
    var root = $('quiz'); if (!root) return;
    var pool = [], qi = 0, score = 0, chosen = null, done = false;

    function reset() { pool = shuffle(D.QUIZ); qi = 0; score = 0; chosen = null; done = false; render(); }
    function render() {
      root.replaceChildren();
      if (done) {
        var r = el('div', 'qres'); r.appendChild(el('div', 'big', score + ' / ' + pool.length));
        var msg = score >= 8 ? { en: 'Excellent. Your prepositions are business-ready.', fr: 'Excellent. Vos prépositions sont prêtes pour le monde professionnel.' }
          : score >= 5 ? { en: 'Good work. A little more practice and they will be automatic.', fr: 'Bon travail. Encore un peu de pratique et ce sera automatique.' }
          : { en: 'A solid start. Review the cards above and try again.', fr: 'Un bon début. Relisez les cartes ci-dessus et réessayez.' };
        r.appendChild(el('p', 'qf', t(msg)));
        var again = el('button', 'btn btn-gold', t({ en: 'Play again', fr: 'Rejouer' })); again.type = 'button'; again.onclick = reset;
        r.appendChild(again); root.appendChild(r); return;
      }
      var q = pool[qi], parts = q.answer.split(' … ');
      var head = el('div', 'qh'); head.appendChild(el('span', null, t({ en: 'Question ', fr: 'Question ' }) + (qi + 1) + ' / ' + pool.length));
      head.appendChild(el('span', null, t({ en: 'Score: ', fr: 'Score : ' }) + score)); root.appendChild(head);
      var bar = el('div', 'qbar'), fill = el('i'); fill.style.width = (qi / pool.length * 100) + '%'; bar.appendChild(fill); root.appendChild(bar);
      var sent = el('div', 'qs'), segs = q.sentence.split('___'), k = 0;
      segs.forEach(function (seg, n) {
        sent.appendChild(document.createTextNode(seg));
        if (n < segs.length - 1) { var bl = el('span', 'bl'); bl.textContent = chosen ? parts[k] : '   '; k++; sent.appendChild(bl); }
      });
      root.appendChild(sent);
      var opts = el('div', 'qo'); opts.setAttribute('role', 'group');
      (q._o || (q._o = shuffle(q.options))).forEach(function (o) {
        var b = el('button', null, o); b.type = 'button'; b.disabled = !!chosen;
        if (chosen) { if (o === q.answer) b.className = 'ok'; else if (o === chosen) b.className = 'no'; }
        b.onclick = function () { chosen = o; if (o === q.answer) score++; render(); };
        opts.appendChild(b);
      });
      root.appendChild(opts);
      var fb = el('div', 'qf'); fb.setAttribute('aria-live', 'polite');
      if (chosen) fb.textContent = (chosen === q.answer ? '✓ ' + t({ en: 'Correct! ', fr: 'Correct ! ' }) : '✗ ' + t({ en: 'Not quite. ', fr: 'Pas tout à fait. ' })) + t(q.exp);
      root.appendChild(fb);
      if (chosen) {
        var last = qi + 1 === pool.length;
        var nx = el('button', 'btn btn-line lt btn-sm qn', last ? t({ en: 'See my score', fr: 'Voir mon score' }) : t({ en: 'Next question →', fr: 'Question suivante →' })); nx.type = 'button';
        nx.onclick = function () { chosen = null; if (last) done = true; else qi++; render(); };
        root.appendChild(nx);
      }
    }
    document.addEventListener('wbe:lang', render);
    reset();
  }

  /* ---------- Sector phrases ---------- */
  function initSectors() {
    var tabs = $('secTabs'), grid = $('secCards'); if (!tabs || !grid) return;
    var cur = D.SECTORS[0].id;
    function paint() {
      tabs.replaceChildren(); grid.replaceChildren();
      D.SECTORS.forEach(function (s) {
        var b = el('button', 'stab'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(s.id === cur));
        var ic = el('i', 'fas ' + s.icon); b.appendChild(ic); b.appendChild(el('span', null, t(s.name)));
        b.addEventListener('click', function () { cur = s.id; paint(); });
        tabs.appendChild(b);
      });
      var sec = D.SECTORS.filter(function (s) { return s.id === cur; })[0];
      sec.phrases.forEach(function (p, i) {
        var c = el('article', 'ph'); c.style.animationDelay = (i * 80) + 'ms';
        c.appendChild(el('span', 'use', t(p.use))); c.appendChild(el('blockquote', null, p.en)); c.appendChild(el('p', null, p.fr));
        grid.appendChild(c);
      });
    }
    document.addEventListener('wbe:lang', paint);
    paint();
  }

  /* ---------- Free level check ---------- */
  function initLevel() {
    var root = $('lvlQuiz'); if (!root) return;
    var L = D.LEVEL, qi = 0, score = 0, chosen = -1, stage = 'intro';
    var LIMIT = 180, t0 = 0, elapsed = 0, tick = null, clockEl = null, timedOut = false, answered = 0;
    function fmt(sec) { var m = Math.floor(sec / 60), r = sec % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
    function stopClock() { if (tick) { clearInterval(tick); tick = null; } }
    function startClock() {
      stopClock(); t0 = Date.now(); elapsed = 0;
      tick = setInterval(function () {
        elapsed = Math.floor((Date.now() - t0) / 1000);
        var left = Math.max(0, LIMIT - elapsed);
        if (clockEl && clockEl.isConnected) { clockEl.textContent = fmt(left); clockEl.classList.toggle('qlow', left <= 30); }
        if (left === 0) finish(true);
      }, 1000);
    }
    function band() { var b = L.bands[0]; L.bands.forEach(function (x) { if (score >= x.min) b = x; }); return b; }
    function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }
    function finish(up) { track('level-finished', 'Level check finished'); stopClock(); elapsed = Math.min(LIMIT, Math.floor((Date.now() - t0) / 1000)); timedOut = up; chosen = -1; stage = 'result'; render(); }
    function start() { track('level-start', 'Level check started'); qi = 0; score = 0; answered = 0; timedOut = false; chosen = -1; stage = 'quiz'; startClock(); render(); }
    function render() {
      root.replaceChildren();
      if (stage === 'intro') {
        var w = el('div', 'lintro');
        w.appendChild(el('h3', 'qs', t({ en: 'Ready? The timer starts when you press the button.', fr: 'Prêt ? Le chronomètre démarre dès que vous appuyez sur le bouton.' })));
        var ul = el('ul');
        [{ en: '20 questions', fr: '20 questions' }, { en: '3-minute countdown', fr: 'Compte à rebours de 3 minutes' }, { en: 'Instant result', fr: 'Résultat immédiat' }, { en: 'No sign-up', fr: 'Sans inscription' }].forEach(function (x) {
          var li = el('li'); li.appendChild(el('i', 'fas fa-check')); li.appendChild(document.createTextNode(t(x))); ul.appendChild(li);
        });
        w.appendChild(ul);
        var go = el('button', 'btn btn-gold btn-lg', t({ en: 'Start the check', fr: 'Commencer le test' })); go.type = 'button'; go.onclick = start; w.appendChild(go);
        root.appendChild(w); return;
      }
      if (stage === 'result') {
        var b = band(), r = el('div', 'lres qres');
        r.appendChild(el('div', 'lv-big', b.lvl));
        r.appendChild(el('h3', null, t(b.name) + ' · ' + score + ' / ' + L.qs.length));
        r.appendChild(el('p', 'ltime', (timedOut ? t({ en: 'Time is up! ', fr: 'Temps écoulé ! ' }) : t({ en: 'Time taken: ', fr: 'Temps utilisé : ' }) + fmt(elapsed) + ' · ') + t({ en: 'Answered ', fr: 'Répondu à ' }) + answered + ' / ' + L.qs.length));
        r.appendChild(el('p', null, t(b.msg)));
        var rec = el('div', 'rec'); rec.appendChild(el('b', null, t({ en: 'Suggested for you', fr: 'Conseillé pour vous' }))); rec.appendChild(document.createTextNode(t(b.prog))); r.appendChild(rec);
        var acts = el('div', 'acts');
        var msg = WBE.lang() === 'fr' ? 'Bonjour Windsor, mon test de niveau indique ' + b.lvl + '. Je souhaite un test complet gratuit et un devis.' : 'Hello Windsor, my level check shows ' + b.lvl + '. I would like a full free level test and a quote.';
        var a1 = el('a', 'btn btn-wa btn-lg'); a1.href = wa(msg); a1.target = '_blank'; a1.rel = 'noopener';
        a1.appendChild(el('i', 'fab fa-whatsapp')); a1.appendChild(el('span', null, t({ en: 'Get my full free level test', fr: 'Obtenir mon test complet gratuit' })));
        var a2 = el('button', 'btn btn-line lt btn-lg', t({ en: 'Retake', fr: 'Refaire' })); a2.type = 'button'; a2.onclick = start;
        acts.append(a1, a2); r.appendChild(acts);
        r.appendChild(el('p', 'lnote', t({ en: 'Indicative result only. A full assessment with a coach confirms your level.', fr: 'Résultat indicatif. Une évaluation complète avec un coach confirme votre niveau.' })));
        root.appendChild(r); return;
      }
      var q = L.qs[qi];
      var head = el('div', 'qh'); head.appendChild(el('span', null, t({ en: 'Question ', fr: 'Question ' }) + (qi + 1) + ' / ' + L.qs.length));
      clockEl = el('span', 'qclock', fmt(Math.max(0, LIMIT - elapsed))); clockEl.classList.toggle('qlow', LIMIT - elapsed <= 30); clockEl.setAttribute('role', 'timer'); head.appendChild(clockEl); root.appendChild(head);
      var bar = el('div', 'qbar'), f = el('i'); f.style.width = (qi / L.qs.length * 100) + '%'; bar.appendChild(f); root.appendChild(bar);
      root.appendChild(el('div', 'qs', q.q.replace('___', '_____')));
      var opts = el('div', 'qo'); opts.setAttribute('role', 'group');
      q.o.forEach(function (txt, i) {
        var bt = el('button', null, txt); bt.type = 'button'; bt.disabled = chosen > -1;
        if (chosen > -1) { if (i === q.a) bt.className = 'ok'; else if (i === chosen) bt.className = 'no'; }
        bt.onclick = function () { chosen = i; answered++; if (i === q.a) score++; render(); };
        opts.appendChild(bt);
      });
      root.appendChild(opts);
      var fb = el('div', 'qf'); fb.setAttribute('aria-live', 'polite');
      if (chosen > -1) fb.textContent = (chosen === q.a ? '✓ ' : '✗ ') + t(q.n);
      root.appendChild(fb);
      if (chosen > -1) {
        var last = qi + 1 === L.qs.length;
        var nx = el('button', 'btn btn-line lt btn-sm qn', last ? t({ en: 'See my level', fr: 'Voir mon niveau' }) : t({ en: 'Next question →', fr: 'Question suivante →' })); nx.type = 'button';
        nx.onclick = function () { if (last) { finish(false); return; } chosen = -1; qi++; render(); };
        root.appendChild(nx);
      }
    }
    document.addEventListener('wbe:lang', render);
    render();
  }

  /* ---------- Visit statistics: GoatCounter, cookie-free, off until a site code is set ---------- */
  var gcQueue = [];
  function track(name, title) {
    var ev = { path: 'event/' + name, title: title || name, event: true };
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count(ev); else if (gcQueue) gcQueue.push(ev);
  }
  function initAnalytics() {
    var code = D.ANALYTICS && D.ANALYTICS.goatcounter;
    if (!code || !/^[a-z0-9-]+$/i.test(code)) { gcQueue = null; return; }
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { gcQueue = null; return; }
    var s = document.createElement('script');
    s.async = true; s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + code + '.goatcounter.com/count');
    s.onload = function () { var q = gcQueue || []; gcQueue = null; q.forEach(function (ev) { window.goatcounter.count(ev); }); };
    s.onerror = function () { gcQueue = null; };
    document.head.appendChild(s);

    /* what people do: delegated clicks */
    document.addEventListener('click', function (e) {
      var n;
      if ((n = e.target.closest('a[href*="wa.me"]'))) return track('whatsapp-click', 'WhatsApp button');
      if ((n = e.target.closest('a[href^="mailto:"]'))) return track('email-click', 'Email button');
      if ((n = e.target.closest('[data-prog]'))) return track('programme-open/' + n.getAttribute('data-prog'), 'Programme opened');
      if ((n = e.target.closest('[data-lang]'))) return track('language/' + n.getAttribute('data-lang'), 'Language');
      if ((n = e.target.closest('[data-theme-set]'))) return track('theme/' + n.getAttribute('data-theme-set'), 'Theme');
      if ((n = e.target.closest('a.soc'))) return track('social-click', 'Social link');
      if ((n = e.target.closest('a[href^="policies.html"]'))) return track('policies-open', 'Policies');
      if ((n = e.target.closest('#newsGrid a'))) return track('news-click', 'News story opened');
    });

    /* how far people read: each section once */
    if ('IntersectionObserver' in window) {
      var seen = {};
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var id = e.target.id; if (e.isIntersecting && !seen[id]) { seen[id] = 1; track('section/' + id, 'Section ' + id); io.unobserve(e.target); } });
      }, { threshold: 0.35 });
      $$('main section[id]').forEach(function (n) { io.observe(n); });
    }

    /* time spent: seconds the tab is visible, reported at three milestones */
    var visible = 0, marks = [30, 60, 180], fired = {};
    setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      visible += 1;
      marks.forEach(function (m) { if (visible >= m && !fired[m]) { fired[m] = 1; track('time-on-site/' + m + 's', 'Stayed ' + m + ' seconds'); } });
    }, 1000);
  }

  /* ---------- shared: "your message is ready" panel (nothing is sent until a button is tapped) ---------- */
  var MAIL = 'devilliers02@gmail.com';
  function readyPanel(host, o) {
    track('message-ready/' + (o.event || 'form'), 'Message prepared');
    host.replaceChildren();
    var w = el('div', 'ready');
    w.appendChild(el('i', 'fas fa-circle-check rk'));
    w.appendChild(el('h4', null, o.title));
    w.appendChild(el('p', null, t({ en: 'Nothing has been sent yet. Choose how you would like to send it.', fr: 'Rien n’a encore été envoyé. Choisissez comment l’envoyer.' })));
    var pre = el('pre', 'msgprev', o.msg); w.appendChild(pre);
    var row = el('div', 'rrow');
    var wa = el('a', 'btn btn-wa'); wa.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(o.msg); wa.target = '_blank'; wa.rel = 'noopener';
    wa.appendChild(el('i', 'fab fa-whatsapp')); wa.appendChild(el('span', null, t({ en: 'Send on WhatsApp', fr: 'Envoyer sur WhatsApp' })));
    var ml = el('a', 'btn btn-navy'); ml.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(o.subject) + '&body=' + encodeURIComponent(o.msg);
    ml.appendChild(el('i', 'fas fa-envelope')); ml.appendChild(el('span', null, t({ en: 'Send by email', fr: 'Envoyer par e-mail' })));
    var cp = el('button', 'btn btn-line btn-sm', t({ en: 'Copy message', fr: 'Copier le message' })); cp.type = 'button';
    cp.onclick = function () {
      var fb = function () { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(t({ en: 'Press Ctrl+C to copy', fr: 'Appuyez sur Ctrl+C pour copier' })); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(o.msg).then(function () { toast(t({ en: 'Message copied', fr: 'Message copié' })); }, fb); else fb();
    };
    var ed = el('button', 'btn btn-line btn-sm', t({ en: 'Edit details', fr: 'Modifier' })); ed.type = 'button'; ed.onclick = o.onEdit;
    row.append(wa, ml); w.appendChild(row);
    var row2 = el('div', 'rrow'); row2.append(cp, ed); w.appendChild(row2);
    host.appendChild(w);
  }
  function field(id, label, type, ph, opts) {
    opts = opts || {};
    var w = el('div', 'fld'), l = el('label', null, label); l.setAttribute('for', id);
    var i;
    if (type === 'textarea') { i = el('textarea'); i.rows = 3; }
    else if (type === 'select') { i = el('select'); opts.options.forEach(function (o) { var op = el('option', null, o.label); op.value = o.value; i.appendChild(op); }); }
    else { i = el('input'); i.type = type; }
    i.id = id; if (ph) i.placeholder = ph; if (opts.auto) i.setAttribute('autocomplete', opts.auto); if (opts.req) i.required = true;
    w.append(l, i); return { wrap: w, input: i };
  }

  /* ---------- Programme detail dialog + lead capture ---------- */
  function initProgrammes() {
    var modal = $('progModal'), box = $('pmBox'), grid = document.querySelector('#programmes .grid3');
    if (!modal || !box || !grid) return;
    var cur = null, opener = null, ptab = 'overview', mode = 'form', lead = { name: '', phone: '', email: '', org: '', format: 'any', msg: '' };
    var FORMATS = [
      { value: 'any', label: { en: 'No preference', fr: 'Pas de préférence' }, text: { en: 'no preference', fr: 'pas de préférence' } },
      { value: 'abidjan', label: { en: 'Face to face in Abidjan', fr: 'En présentiel à Abidjan' }, text: { en: 'face to face in Abidjan', fr: 'en présentiel à Abidjan' } },
      { value: 'online', label: { en: 'Online', fr: 'En ligne' }, text: { en: 'online', fr: 'en ligne' } },
      { value: 'hybrid', label: { en: 'Hybrid', fr: 'Hybride' }, text: { en: 'hybrid', fr: 'hybride' } },
      { value: 'small', label: { en: 'Small group (4 to 6 people)', fr: 'Petit groupe (4 à 6 personnes)' }, text: { en: 'small group of 4 to 6 people', fr: 'petit groupe de 4 à 6 personnes' } }
    ];
    function prog() { return D.PROGRAMMES.filter(function (p) { return p.id === cur; })[0]; }
    function list(items, cls, icon) {
      var u = el('ul', cls);
      items.forEach(function (x) { var li = el('li'); if (icon) li.appendChild(el('i', 'fas ' + icon)); li.appendChild(el('span', null, t(x))); u.appendChild(li); });
      return u;
    }
    function section(title, node) { var s = el('div', 'pm-sec'); s.appendChild(el('h4', null, title)); s.appendChild(node); return s; }

    function buildForm(P, host) {
      host.replaceChildren();
      var form = el('form', 'pm-form-in'); form.noValidate = true;
      form.appendChild(el('h4', null, t({ en: 'Request a quote', fr: 'Demander un devis' })));
      form.appendChild(el('p', 'fsub', t({ en: 'Tell us a little about you and we will reply with a clear quote and a free level check.', fr: 'Dites-nous quelques mots sur vous et nous répondons avec un devis clair et un test de niveau gratuit.' })));
      var fN = field('pfName', t({ en: 'Full name', fr: 'Nom complet' }), 'text', '', { auto: 'name', req: true });
      var fP = field('pfPhone', t({ en: 'WhatsApp or phone', fr: 'WhatsApp ou téléphone' }), 'tel', '+225 …', { auto: 'tel', req: true });
      var fE = field('pfEmail', t({ en: 'Email (optional)', fr: 'E-mail (facultatif)' }), 'email', '', { auto: 'email' });
      var fO = field('pfOrg', t({ en: 'Company and role', fr: 'Entreprise et poste' }), 'text', t({ en: 'e.g. Finance Manager, ABC Bank', fr: 'ex. Responsable financier, Banque ABC' }), { auto: 'organization' });
      var fF = field('pfFormat', t({ en: 'Preferred format', fr: 'Format souhaité' }), 'select', '', { options: FORMATS.map(function (f) { return { value: f.value, label: t(f.label) }; }) });
      var fM = field('pfMsg', t({ en: 'Anything we should know? (optional)', fr: 'Autre chose à nous dire ? (facultatif)' }), 'textarea', '');
      var all = [[fN, 'name'], [fP, 'phone'], [fE, 'email'], [fO, 'org'], [fF, 'format'], [fM, 'msg']];
      all.forEach(function (p) { p[0].input.value = lead[p[1]]; p[0].input.addEventListener('input', function () { lead[p[1]] = p[0].input.value; }); form.appendChild(p[0].wrap); });
      var err = el('div', 'fmsg'); err.setAttribute('role', 'alert'); form.appendChild(err);
      var go = el('button', 'btn btn-gold btn-lg', t({ en: 'Prepare my request', fr: 'Préparer ma demande' })); go.type = 'submit'; form.appendChild(go);
      form.appendChild(el('p', 'fine', t({ en: 'We only use your details to reply about this programme.', fr: 'Nous utilisons vos coordonnées uniquement pour répondre à propos de ce programme.' })));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (lead.name.trim().length < 2) { err.textContent = t({ en: 'Please enter your name.', fr: 'Veuillez saisir votre nom.' }); fN.input.focus(); return; }
        if (lead.phone.replace(/\D/g, '').length < 6) { err.textContent = t({ en: 'Enter a phone or WhatsApp number we can reach.', fr: 'Saisissez un numéro de téléphone ou WhatsApp joignable.' }); fP.input.focus(); return; }
        if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email.trim())) { err.textContent = t({ en: 'That email address looks incomplete.', fr: 'Cette adresse e-mail semble incomplète.' }); fE.input.focus(); return; }
        var fmt = FORMATS.filter(function (f) { return f.value === lead.format; })[0], fr = WBE.lang() === 'fr';
        var name = lead.name.trim(), org = lead.org.trim();
        var msg = fr
          ? 'Bonjour Windsor, je suis ' + name + (org ? ' (' + org + ')' : '') + '. Je souhaite un devis et plus d’informations sur : ' + t(P.name) + '. Format souhaité : ' + t(fmt.text) + '. Téléphone/WhatsApp : ' + lead.phone.trim() + '.' + (lead.email ? ' E-mail : ' + lead.email.trim() + '.' : '') + (lead.msg.trim() ? ' Précisions : ' + lead.msg.trim() : '')
          : 'Hello Windsor, I am ' + name + (org ? ' (' + org + ')' : '') + '. I would like a quote and more information about: ' + t(P.name) + '. Preferred format: ' + t(fmt.text) + '. Phone/WhatsApp: ' + lead.phone.trim() + '.' + (lead.email ? ' Email: ' + lead.email.trim() + '.' : '') + (lead.msg.trim() ? ' Notes: ' + lead.msg.trim() : '');
        mode = 'ready';
        readyPanel(host, { title: t({ en: 'Your request is ready', fr: 'Votre demande est prête' }), msg: msg, subject: 'Windsor enquiry: ' + t(P.name), event: 'quote/' + P.id, onEdit: function () { mode = 'form'; buildForm(P, host); } });
      });
      host.appendChild(form);
    }

    function render() {
      var P = prog(); if (!P) return;
      box.replaceChildren();
      var x = el('button', 'mx', '×'); x.type = 'button'; x.setAttribute('aria-label', t({ en: 'Close', fr: 'Fermer' })); x.onclick = close; box.appendChild(x);
      var head = el('div', 'pm-head'), ic = el('div', 'ico'); ic.appendChild(el('i', 'fas ' + P.icon)); head.appendChild(ic);
      var hd = el('div'); var h3 = el('h3', null, t(P.name)); h3.id = 'pmTitle'; hd.append(h3, el('p', 'tg', t(P.tag))); head.appendChild(hd); box.appendChild(head);
      var body = el('div', 'pm-body'), info = el('div', 'pm-info');
      var pf = el('figure', 'photo pm-photo'); pf.setAttribute('data-dyn', '1'); photoFill(pf, 'prog-' + P.id, { en: t(P.name), fr: t(P.name) }); info.appendChild(pf);
      info.appendChild(el('p', 'pm-intro', t(P.intro)));
      var facts = el('dl', 'pm-facts');
      P.facts.forEach(function (fa) { var d = el('div'); d.append(el('dt', null, t(fa.k)), el('dd', null, t(fa.v))); facts.appendChild(d); });
      info.appendChild(facts);
      var TABS = [['overview', { en: 'Overview', fr: 'Aperçu' }], ['syllabus', { en: 'Syllabus', fr: 'Programme détaillé' }], ['sample', { en: 'Sample lesson', fr: 'Exemple de leçon' }], ['faq', { en: 'FAQ', fr: 'FAQ' }]];
      if (!P.syllabus) ptab = 'overview';
      if (P.syllabus) {
        var bar = el('div', 'pm-tabs'); bar.setAttribute('role', 'tablist');
        TABS.forEach(function (x) {
          var tb = el('button', 'pm-tab', t(x[1])); tb.type = 'button'; tb.setAttribute('role', 'tab'); tb.setAttribute('aria-selected', String(ptab === x[0]));
          tb.onclick = function () { ptab = x[0]; render(); }; bar.appendChild(tb);
        });
        info.appendChild(bar);
      }
      var pane = el('div', 'pm-pane'); info.appendChild(pane);
      if (ptab === 'syllabus') {
        var acc = el('div', 'pm-acc');
        P.syllabus.forEach(function (mo, i) {
          var d = el('details'); if (i === 0) d.open = true;
          var sm = el('summary'); sm.appendChild(el('b', null, t(mo.t))); sm.appendChild(el('span', 'mh', t(mo.h))); d.appendChild(sm);
          d.appendChild(list(mo.pts, 'pm-list', 'fa-angle-right'));
          var oc = el('p', 'mo'); oc.appendChild(el('b', null, t({ en: 'You will be able to: ', fr: 'Vous serez capable de : ' }))); oc.appendChild(document.createTextNode(t(mo.out))); d.appendChild(oc);
          acc.appendChild(d);
        });
        pane.appendChild(acc);
        if (P.assess) pane.appendChild(section(t({ en: 'How progress is assessed', fr: 'Comment la progression est évaluée' }), el('p', 'pm-p', t(P.assess))));
        if (P.prereq) pane.appendChild(section(t({ en: 'Who can join', fr: 'Qui peut s’inscrire' }), el('p', 'pm-p', t(P.prereq))));
        if (P.schedule) pane.appendChild(section(t({ en: 'Schedule and delivery', fr: 'Calendrier et format' }), el('p', 'pm-p', t(P.schedule))));
        pane.appendChild(el('p', 'pm-note', t({ en: 'Indicative content. The exact plan is confirmed in your quote.', fr: 'Contenu indicatif. Le plan exact est confirmé dans votre devis.' })));
      } else if (ptab === 'sample' && P.sample) {
        var ol2 = el('ol', 'pm-steps'); P.sample.steps.forEach(function (st) { ol2.appendChild(el('li', null, t(st))); });
        pane.appendChild(section(t(P.sample.title), ol2));
        pane.appendChild(el('p', 'pm-note', t({ en: 'A taste of the kind of activity you will do in class.', fr: 'Un aperçu du type d’activité que vous ferez en cours.' })));
      } else if (ptab === 'faq' && P.faq) {
        var fq = el('div', 'pm-acc');
        P.faq.forEach(function (it) { var d = el('details'); var sm = el('summary'); sm.appendChild(el('b', null, t(it.q))); d.appendChild(sm); d.appendChild(el('p', 'pm-p', t(it.a))); fq.appendChild(d); });
        pane.appendChild(fq);
      } else {
        pane.appendChild(section(t({ en: 'Who it is for', fr: 'À qui s’adresse-t-il' }), list(P.who, 'pm-list', 'fa-user-check')));
        pane.appendChild(section(t({ en: 'What you will achieve', fr: 'Ce que vous allez atteindre' }), list(P.outcomes, 'pm-list', 'fa-check')));
        pane.appendChild(section(t({ en: 'What you will cover', fr: 'Ce que vous allez travailler' }), list(P.modules, 'pm-list mods', 'fa-angle-right')));
        if (P.flow) {
          var ol = el('ol', 'pm-flow');
          P.flow.forEach(function (st) { var li = el('li'); li.appendChild(el('b', null, t(st.when))); li.appendChild(el('span', null, t(st.what))); ol.appendChild(li); });
          var fs = section(t({ en: 'How it runs', fr: 'Comment ça se déroule' }), ol);
          fs.appendChild(el('p', 'pm-note', t({ en: 'Indicative structure. The exact plan is confirmed in your quote.', fr: 'Structure indicative. Le plan exact est confirmé dans votre devis.' })));
          pane.appendChild(fs);
        }
        var chips = el('div', 'pm-chips'); P.inc.forEach(function (c) { chips.appendChild(el('span', null, t(c))); });
        pane.appendChild(section(t({ en: 'Included', fr: 'Inclus' }), chips));
      }
      var alt = el('div', 'pm-alt');
      var a1 = el('a', 'btn btn-line btn-sm', t({ en: 'Take the free level check', fr: 'Faire le test de niveau gratuit' })); a1.href = '#level'; a1.onclick = close;
      alt.appendChild(a1); info.appendChild(alt);
      var side = el('aside', 'pm-form'); body.append(info, side); box.appendChild(body);
      if (mode === 'ready') { mode = 'form'; }
      buildForm(P, side);
    }
    function open(id, from) {
      cur = id; ptab = 'overview'; opener = from || document.activeElement; mode = 'form';
      lead = { name: lead.name, phone: lead.phone, email: lead.email, org: lead.org, format: lead.format, msg: '' };
      render(); modal.classList.add('open'); document.documentElement.classList.add('nolock'); modal.scrollTop = 0;
      var cb = box.querySelector('.mx'); if (cb) cb.focus();
    }
    function close() { modal.classList.remove('open'); document.documentElement.classList.remove('nolock'); if (opener && opener.focus) opener.focus(); }
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-prog]'); if (!card) return;
      open(card.getAttribute('data-prog'), e.target.closest('button') || card.querySelector('button'));
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = $$('a[href],button:not([disabled]),input,select,textarea', box).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return; var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    document.addEventListener('wbe:lang', function () { if (modal.classList.contains('open')) render(); });
  }

  /* ---------- Feedback / testimonial form ---------- */
  function initFeedback() {
    var host = $('fbHost'); if (!host) return;
    var st = { name: '', role: '', prog: 'other', rating: 0, text: '', ok: false };
    function build() {
      host.replaceChildren();
      var form = el('form', 'fbform'); form.noValidate = true;
      var two = el('div', 'two');
      var fN = field('fbName', t({ en: 'Your name (optional)', fr: 'Votre nom (facultatif)' }), 'text', '', { auto: 'name' });
      var fR = field('fbRole', t({ en: 'Role and company (optional)', fr: 'Poste et entreprise (facultatif)' }), 'text', '', { auto: 'organization' });
      two.append(fN.wrap, fR.wrap); form.appendChild(two);
      var opts = D.PROGRAMMES.map(function (p) { return { value: p.id, label: t(p.name) }; }).concat([{ value: 'other', label: t({ en: 'Another Windsor service', fr: 'Un autre service Windsor' }) }]);
      var fP = field('fbProg', t({ en: 'What did you do with Windsor?', fr: 'Qu’avez-vous suivi chez Windsor ?' }), 'select', '', { options: opts });
      form.appendChild(fP.wrap);
      var rw = el('div', 'fld'), rl = el('label', null, t({ en: 'Your rating', fr: 'Votre note' })); rl.id = 'fbRateL'; rw.appendChild(rl);
      var stars = el('div', 'stars'); stars.setAttribute('role', 'group'); stars.setAttribute('aria-labelledby', 'fbRateL');
      for (var s = 1; s <= 5; s++) (function (v) {
        var b = el('button', 'star', '★'); b.type = 'button'; b.setAttribute('aria-pressed', String(st.rating >= v)); b.setAttribute('aria-label', v + ' / 5');
        b.onclick = function () { st.rating = v; $$('.star', stars).forEach(function (n, k) { n.setAttribute('aria-pressed', String(k < v)); }); };
        stars.appendChild(b);
      })(s);
      rw.appendChild(stars); form.appendChild(rw);
      var fT = field('fbText', t({ en: 'What changed for you at work?', fr: 'Qu’est-ce qui a changé pour vous au travail ?' }), 'textarea', t({ en: 'A meeting you led, an email you wrote, a promotion…', fr: 'Une réunion que vous avez animée, un e-mail que vous avez rédigé, une promotion…' }), { req: true });
      fT.input.rows = 4; form.appendChild(fT.wrap);
      var cw = el('label', 'chk'); var cb = el('input'); cb.type = 'checkbox'; cb.id = 'fbOk'; cb.checked = st.ok; cw.append(cb, el('span', null, t({ en: 'Windsor may publish my feedback with my name and role.', fr: 'Windsor peut publier mon témoignage avec mon nom et mon poste.' }))); form.appendChild(cw);
      var map = [[fN, 'name'], [fR, 'role'], [fP, 'prog'], [fT, 'text']];
      map.forEach(function (m) { m[0].input.value = st[m[1]]; m[0].input.addEventListener('input', function () { st[m[1]] = m[0].input.value; }); });
      cb.addEventListener('change', function () { st.ok = cb.checked; });
      var err = el('div', 'fmsg'); err.setAttribute('role', 'alert'); form.appendChild(err);
      var go = el('button', 'btn btn-gold btn-lg', t({ en: 'Prepare my feedback', fr: 'Préparer mon témoignage' })); go.type = 'submit'; form.appendChild(go);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (st.text.trim().length < 10) { err.textContent = t({ en: 'Please write a sentence or two about your experience.', fr: 'Écrivez une ou deux phrases sur votre expérience.' }); fT.input.focus(); return; }
        var pr = D.PROGRAMMES.filter(function (p) { return p.id === st.prog; })[0], fr = WBE.lang() === 'fr';
        var pname = pr ? t(pr.name) : t({ en: 'Windsor', fr: 'Windsor' });
        var who = (st.name.trim() || t({ en: 'a Windsor learner', fr: 'un apprenant Windsor' })) + (st.role.trim() ? ', ' + st.role.trim() : '');
        var msg = fr
          ? 'Bonjour Windsor, voici mon retour sur « ' + pname + ' »' + (st.rating ? ' (' + st.rating + '/5)' : '') + ' : « ' + st.text.trim() + ' » De la part de : ' + who + '. ' + (st.ok ? 'Vous pouvez publier ce témoignage avec mon nom et mon poste.' : 'Merci de ne pas le publier.')
          : 'Hello Windsor, here is my feedback on “' + pname + '”' + (st.rating ? ' (' + st.rating + '/5)' : '') + ': “' + st.text.trim() + '” From: ' + who + '. ' + (st.ok ? 'You may publish this with my name and role.' : 'Please do not publish it.');
        readyPanel(host, { title: t({ en: 'Your feedback is ready', fr: 'Votre témoignage est prêt' }), msg: msg, subject: 'Windsor feedback: ' + pname, event: 'feedback', onEdit: build });
      });
      host.appendChild(form);
    }
    document.addEventListener('wbe:lang', function () { if (host.querySelector('.fbform')) build(); });
    build();
  }

  /* ---------- Daily business brief (reads news.json, which a daily job refreshes) ---------- */
  function initNews() {
    var grid = $('newsGrid'); if (!grid) return;
    var items = [], shown = 6, updated = '', failed = false;
    var more = $('newsMore'), stamp = $('newsStamp');
    function fmt(d) { try { return new Date(d + 'T00:00:00').toLocaleDateString(WBE.lang() === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } }
    function paint() {
      grid.replaceChildren();
      if (failed || !items.length) {
        grid.appendChild(el('p', 'nempty', t({ en: 'Today’s brief could not be loaded. Please refresh the page in a moment.', fr: 'Le point du jour n’a pas pu être chargé. Actualisez la page dans un instant.' })));
        more.hidden = true; return;
      }
      items.slice(0, shown).forEach(function (n, i) {
        var c = el('article', 'ncard'); c.style.animationDelay = ((i % 6) * 60) + 'ms';
        var top = el('div', 'ntop'); top.append(el('span', 'nsrc', n.source), el('time', null, fmt(n.date))); c.appendChild(top);
        if (n.topic) c.appendChild(el('span', 'ntag', t(n.topic)));
        var h = el('h3'); var a = el('a', null, n.title); a.href = n.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; h.appendChild(a); c.appendChild(h);
        c.appendChild(el('p', 'nsum', n.summary));
        if (n.vocab && n.vocab.length) {
          var w = el('div', 'nwords'); w.appendChild(el('b', null, t({ en: 'Words to learn', fr: 'Mots à retenir' })));
          var ul = el('ul'); n.vocab.forEach(function (v) { var li = el('li'); li.appendChild(el('strong', null, v.term)); li.appendChild(document.createTextNode(' · ' + v.fr)); li.title = v.eg; ul.appendChild(li); });
          w.appendChild(ul); c.appendChild(w);
        }
        var r = el('a', 'nread'); r.href = n.url; r.target = '_blank'; r.rel = 'noopener noreferrer'; r.appendChild(el('span', null, t({ en: 'Read the full story at ', fr: 'Lire l’article sur ' }) + n.source)); r.appendChild(el('i', 'fas fa-arrow-up-right-from-square')); c.appendChild(r);
        grid.appendChild(c);
      });
      more.hidden = shown >= items.length;
      if (updated) stamp.textContent = t({ en: 'Last updated ', fr: 'Dernière mise à jour : ' }) + fmt(updated);
    }
    more.addEventListener('click', function () { shown += 6; paint(); });
    document.addEventListener('wbe:lang', paint);
    if (window.fetch) fetch('news.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function (j) { items = (j.items || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }); updated = j.updated || ''; paint(); })
      .catch(function () { failed = true; paint(); });
    else { failed = true; paint(); }
  }

  /* ---------- Social icons: live link when a url is set, "coming soon" placeholder otherwise ---------- */
  function initSocial() {
    var hosts = $$('[data-social]'); if (!hosts.length || !D.SOCIAL) return;
    function paint() {
      hosts.forEach(function (host) {
        host.replaceChildren();
        D.SOCIAL.forEach(function (s) {
          var n;
          if (s.url) { n = el('a', 'soc'); n.href = s.url; n.target = '_blank'; n.rel = 'noopener noreferrer'; n.setAttribute('aria-label', s.name); }
          else { n = el('span', 'soc off'); n.setAttribute('role', 'img'); n.setAttribute('aria-label', s.name + ', ' + t({ en: 'coming soon', fr: 'bientôt disponible' })); n.title = s.name + ' · ' + t({ en: 'coming soon', fr: 'bientôt disponible' }); }
          n.appendChild(el('i', s.icon)); host.appendChild(n);
        });
      });
    }
    document.addEventListener('wbe:lang', paint); paint();
  }

  /* ---------- Proof tiles: shown only for real, non-zero figures ---------- */
  function initProof() {
    var host = $('proofRow'); if (!host) return;
    var labels = { learners: { en: 'Learners trained', fr: 'Apprenants formés' }, companies: { en: 'Companies served', fr: 'Entreprises accompagnées' }, hours: { en: 'Hours of coaching', fr: 'Heures de coaching' }, sectors: { en: 'Sectors covered', fr: 'Secteurs couverts' } };
    var keys = Object.keys(labels).filter(function (k) { return D.PROOF && +D.PROOF[k] > 0; });
    if (!keys.length) { host.hidden = true; return; }
    function paint() {
      host.replaceChildren();
      keys.forEach(function (k) { var d = el('div'); d.append(el('b', null, Number(D.PROOF[k]).toLocaleString(WBE.lang() === 'fr' ? 'fr-FR' : 'en-GB')), el('span', null, t(labels[k]))); host.appendChild(d); });
    }
    document.addEventListener('wbe:lang', paint); paint();
  }

  /* ---------- Photo slots: real image when `src` is set, an elegant placeholder otherwise ---------- */
  function photoFill(fig, key, hintOverride) {
    var spec = D.PHOTOS[key] || D.PHOTOS.prog;
    var hint = hintOverride || spec.hint;
    fig.style.setProperty('--ar', spec.ar || '4 / 3');
    fig.replaceChildren();
    if (spec.src) {
      var img = el('img'); img.src = spec.src; img.alt = t(spec.alt || hint); img.loading = key === 'hero' ? 'eager' : 'lazy'; img.decoding = 'async'; if (spec.pos) img.style.objectPosition = spec.pos; if (spec.zoom) { img.style.transform = 'scale(' + spec.zoom + ')'; img.style.transformOrigin = spec.origin || 'center'; }
      fig.appendChild(img);
    } else {
      var w = el('div', 'ph-in'); w.setAttribute('role', 'img'); w.setAttribute('aria-label', t({ en: 'Photo placeholder: ', fr: 'Emplacement photo : ' }) + t(hint));
      w.appendChild(el('i', 'fas fa-camera'));
      w.appendChild(el('b', null, t({ en: 'Photo', fr: 'Photo' })));
      w.appendChild(el('span', null, t(hint)));
      if (spec.size) w.appendChild(el('small', null, spec.size));
      fig.appendChild(w);
    }
  }
  function initPhotos() {
    function paint() { $$('[data-photo]').forEach(function (f) { if (!f.hasAttribute('data-dyn')) photoFill(f, f.getAttribute('data-photo')); }); }
    document.addEventListener('wbe:lang', paint); paint();
  }

  /* ---------- Events (reads events.json) ---------- */
  function initEvents() {
    var tabsEl = $('evTabs'), grid = $('evGrid'); if (!tabsEl || !grid) return;
    var items = [], tab = 'upcoming', failed = false, today = new Date().toISOString().slice(0, 10);
    function isPast(e) { return e.status === 'past' || (e.date && e.date < today); }
    function fmtParts(d) {
      var dt = new Date(d + 'T00:00:00'), loc = WBE.lang() === 'fr' ? 'fr-FR' : 'en-GB';
      return { day: dt.getDate(), mon: dt.toLocaleDateString(loc, { month: 'short' }) };
    }
    function waLink(e) {
      var title = t(e.title), when = e.date ? ' (' + e.date + ')' : '';
      var msg = WBE.lang() === 'fr' ? 'Bonjour Windsor, je souhaite m’inscrire ou être informé pour : ' + title + when + '.' : 'Hello Windsor, I would like to register or be notified about: ' + title + when + '.';
      return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    }
    function paint() {
      tabsEl.replaceChildren(); grid.replaceChildren();
      [['upcoming', { en: 'Upcoming', fr: 'À venir' }], ['past', { en: 'Past', fr: 'Passés' }]].forEach(function (x) {
        var b = el('button', 'stab', t(x[1])); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(tab === x[0]));
        b.onclick = function () { tab = x[0]; paint(); }; tabsEl.appendChild(b);
      });
      if (failed) { grid.appendChild(el('p', 'nempty', t({ en: 'Events could not be loaded. Please refresh the page.', fr: 'Les événements n’ont pas pu être chargés. Actualisez la page.' }))); return; }
      var list = items.filter(function (e) { return tab === 'past' ? isPast(e) : !isPast(e); });
      list.sort(function (a, b) { return (a.date || '9999') < (b.date || '9999') ? -1 : 1; });
      if (!list.length) { grid.appendChild(el('p', 'nempty', tab === 'past' ? t({ en: 'Past events will appear here.', fr: 'Les événements passés apparaîtront ici.' }) : t({ en: 'New dates are coming soon. Message us to be told first.', fr: 'De nouvelles dates arrivent bientôt. Écrivez-nous pour être prévenu en premier.' }))); return; }
      list.forEach(function (e, i) {
        var c = el('article', 'ecard'); c.style.animationDelay = (i * 70) + 'ms';
        var dt = el('div', 'edate');
        if (e.date) { var p = fmtParts(e.date); dt.append(el('b', null, String(p.day)), el('span', null, p.mon)); }
        else { dt.append(el('i', 'far fa-calendar'), el('em', null, e.status === 'recurring' ? t({ en: 'Recurring', fr: 'Récurrent' }) : t({ en: 'Dates soon', fr: 'Dates à venir' }))); }
        var body = el('div', 'ebody');
        body.append(el('span', 'etype', t(e.type)), el('h3', null, t(e.title)), el('p', null, t(e.desc)));
        var meta = el('ul', 'emeta');
        function li(icon, txt) { var l = el('li'); l.appendChild(el('i', 'fas ' + icon)); l.appendChild(document.createTextNode(txt)); meta.appendChild(l); }
        if (e.recurrence) li('fa-rotate', t(e.recurrence));
        if (e.date) li('fa-calendar-day', e.date);
        if (e.time) li('fa-clock', e.time);
        if (e.place) li('fa-location-dot', t(e.place));
        body.appendChild(meta);
        if (!isPast(e)) { var a = el('a', 'btn btn-gold btn-sm'); a.href = waLink(e); a.target = '_blank'; a.rel = 'noopener'; a.appendChild(el('i', 'fab fa-whatsapp')); a.appendChild(el('span', null, t(e.cta || { en: 'Register', fr: 'S’inscrire' }))); body.appendChild(a); }
        c.append(dt, body); grid.appendChild(c);
      });
    }
    document.addEventListener('wbe:lang', paint);
    if (window.fetch) fetch('events.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(function (j) { items = j.items || []; paint(); }).catch(function () { failed = true; paint(); });
    else { failed = true; paint(); }
  }

  /* ---------- Testimonials: only verified entries are shown ---------- */
  function initQuotes() {
    var sec = $('testimonials'), host = $('quotes'); if (!sec) return;
    var ok = D.TESTIMONIALS.filter(function (x) { return x.verified; });
    if (!ok.length) { host.hidden = true; return; }
    ok.forEach(function (x) {
      var c = el('figure', 'q'); c.setAttribute('data-r', '');
      var p = el('p', null, '“' + t(x) + '”'); var b = el('b', null, x.name); var s = el('span', null, t(x.role));
      c.append(p, b, s); host.appendChild(c);
    });
  }

  /* ---------- Learner portal (front-end demo: profiles live in this browser only) ---------- */
  function initPortal() {
    var USERS = 'wbe_users', SESSION = 'wbe_session', STATS = 'wbe_stats';
    var modal = $('loginModal'), opener = null, idx = 0, score = 0;

    async function hash(s) {
      try { var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
      catch (e) { return btoa(unescape(encodeURIComponent(s))); }
    }
    function open() { opener = document.activeElement; modal.classList.add('open'); $('loginEmail').focus(); }
    function close() { modal.classList.remove('open'); $('loginMsg').textContent = ''; if (opener && opener.focus) opener.focus(); }

    async function submit(e) {
      e.preventDefault();
      var email = $('loginEmail').value.trim().toLowerCase(), pass = $('loginPass').value, msg = $('loginMsg');
      if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = t({ en: 'Enter a valid email address.', fr: 'Entrez une adresse e-mail valide.' }); return; }
      if (pass.length < 6) { msg.textContent = t({ en: 'Use at least 6 characters for the password.', fr: 'Le mot de passe doit contenir au moins 6 caractères.' }); return; }
      var users = store(USERS) || {}, h = await hash(email + ':' + pass);
      if (users[email] && users[email] !== h) { msg.textContent = t({ en: 'Incorrect password.', fr: 'Mot de passe incorrect.' }); return; }
      if (!users[email]) { users[email] = h; store(USERS, users); }
      store(SESSION, email); $('loginPass').value = ''; close(); render();
      $('portal').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    }
    function logout() { try { localStorage.removeItem(SESSION); } catch (e) {} render(); }

    function question() {
      var q = D.PORTAL[idx], box = $('quizBody'); box.replaceChildren();
      var bar = el('div', 'lbar'), f = el('i'); f.style.width = (idx / D.PORTAL.length * 100) + '%'; bar.appendChild(f);
      var h = el('div', 'lq', (idx + 1) + '. ' + q.q), opts = el('div', 'lo'), note = el('div', 'kn', t({ en: 'Windsor: choose the best answer.', fr: 'Windsor : choisissez la meilleure réponse.' }));
      note.setAttribute('aria-live', 'polite');
      q.o.forEach(function (txt, i) {
        var b = el('button', null, txt); b.type = 'button';
        b.onclick = function () {
          $$('button', opts).forEach(function (x) { x.disabled = true; });
          var ok = i === q.a; if (ok) score++;
          b.classList.add(ok ? 'ok' : 'no'); if (!ok) opts.children[q.a].classList.add('ok');
          note.textContent = 'Windsor: ' + (ok ? t({ en: 'Correct! ', fr: 'Correct ! ' }) : '') + t(q.n);
          var nx = el('button', 'btn btn-gold', idx + 1 < D.PORTAL.length ? t({ en: 'Next', fr: 'Suivant' }) : t({ en: 'See my score', fr: 'Voir mon score' }));
          nx.type = 'button'; nx.style.marginTop = '18px';
          nx.onclick = function () { idx++; if (idx < D.PORTAL.length) question(); else finish(); };
          box.appendChild(nx);
        };
        opts.appendChild(b);
      });
      box.append(bar, h, opts, note);
    }
    function finish() {
      var email = store(SESSION), stats = store(STATS) || {}, prev = stats[email] || { best: 0, attempts: 0 };
      stats[email] = { best: Math.max(prev.best, score), attempts: prev.attempts + 1 }; store(STATS, stats);
      var box = $('quizBody'); box.replaceChildren();
      var w = el('div', 'score'); w.appendChild(el('div', 'big', score + ' / ' + D.PORTAL.length));
      w.appendChild(el('p', null, t({ en: 'Best score: ', fr: 'Meilleur score : ' }) + stats[email].best + ' · ' + t({ en: 'Attempts: ', fr: 'Essais : ' }) + stats[email].attempts));
      var again = el('button', 'btn btn-gold', t({ en: 'Practise again', fr: 'Pratiquer encore' })); again.type = 'button'; again.style.marginTop = '18px';
      again.onclick = start; w.appendChild(again); box.appendChild(w);
    }
    function start() { idx = 0; score = 0; question(); }
    function render() {
      var email = store(SESSION);
      $('gate').classList.toggle('hid', !!email); $('app').classList.toggle('hid', !email);
      $('navLoginText').textContent = email ? t({ en: 'My portal', fr: 'Mon portail' }) : t({ en: 'Learner portal', fr: 'Espace apprenant' });
      if (email) { $('who').textContent = email; start(); }
    }

    $('navLogin').addEventListener('click', function () { store(SESSION) ? $('portal').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }) : open(); });
    $$('[data-open-login]').forEach(function (b) { b.addEventListener('click', open); });
    $('loginClose').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = $$('input,button', modal).filter(function (n) { return !n.disabled; }), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    $('loginForm').addEventListener('submit', submit);
    $('logoutBtn').addEventListener('click', logout);
    document.addEventListener('wbe:lang', render);
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAnalytics(); initTheme(); initCopy(); initHeader(); initMarquee(); initKoro(); initPrep(); initQuiz(); initSectors(); initLevel(); initProgrammes(); initFeedback(); initNews(); initProof(); initSocial(); initPhotos(); initEvents(); initQuotes(); initPortal(); initCount(); initReveal();
    updateWa(); document.addEventListener('wbe:lang', updateWa);
  });
})();
