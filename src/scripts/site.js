
(function () {
  "use strict";

  /* ---------- availability: single source of truth ----------
     Edit CITIES / ROLE / NOTICE here only. Every place on the site that
     mentions where I am looking or when I am free reads from this object
     through a [data-site="key"] slot. ------------------------------------- */
  var CITIES = ["Dublin", "Amsterdam", "Tallinn"];
  var ROLE   = "Forward Deployed Engineer";
  var NOTICE = "8 to 12 weeks";

  function join(list, last) {
    if (list.length < 2) return list[0] || "";
    return list.slice(0, -1).join(", ") + " " + last + " " + list[list.length - 1];
  }
  var SITE = {
    role: ROLE,
    notice: NOTICE,
    cities: CITIES.join(", "),
    citiesAnd: join(CITIES, "and"),
    citiesOr: join(CITIES, "or"),
    citiesDot: CITIES.join(" · ") + " · EU remote",
    where: CITIES.join(", ") + ", or remote across the EU",
    open: "Open to " + ROLE + " roles in " + CITIES.join(", ") +
          " or EU remote. Available in " + NOTICE + "."
  };
  (function applySite() {
    var slots = document.querySelectorAll("[data-site]");
    for (var i = 0; i < slots.length; i++) {
      var k = slots[i].getAttribute("data-site");
      if (SITE[k]) slots[i].innerHTML = SITE[k];
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", meta.getAttribute("content")
        .replace(/Open to .*$/, SITE.open.replace(/\.$/, ".")));
    }
  }());

  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  if (!RM) root.classList.add("js");

  /* ---------- theme ---------- */
  var toggle = document.getElementById("themeToggle");
  var stored = null;
  try { stored = localStorage.getItem("lc-theme"); } catch (e) { stored = null; }
  if (stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);
  function currentTheme() {
    var a = root.getAttribute("data-theme");
    if (a) return a;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  toggle.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("lc-theme", next); } catch (e) {}
  });

  /* ---------- ambient cursor spotlight ---------- */
  if (!RM && window.matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("pointer");
    window.addEventListener("pointermove", function (e) {
      document.body.style.setProperty("--mx", e.clientX + "px");
      document.body.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });
  }

  /* ---------- element spotlight (cards + dark band) ---------- */
  document.addEventListener("pointermove", function (e) {
    var t = e.target;
    while (t && t.classList) {
      if (t.classList.contains("spot")) {
        var r = t.getBoundingClientRect();
        t.style.setProperty("--cx", (e.clientX - r.left) + "px");
        t.style.setProperty("--cy", (e.clientY - r.top) + "px");
        return;
      }
      t = t.parentNode;
    }
  }, { passive: true });

  /* ---------- h1 line reveal ---------- */
  function splitHeading(h, force) {
    if (h.getAttribute("data-done") === "1" && !force) return;
    var text = h.getAttribute("data-text") || h.textContent.trim();
    if (force) h.textContent = text;
    h.setAttribute("data-done", "1");
    h.setAttribute("data-text", text);
    if (RM) return;
    // split on ordinary spaces only: JS \s also matches U+00A0, which would
    // undo any &nbsp; an author used to keep two words on the same line
    var words = text.split(/ +/);
    h.textContent = "";
    var probes = [];
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.textContent = w + (i < words.length - 1 ? " " : "");
      h.appendChild(s);
      probes.push(s);
    });
    var lines = [], cur = null, top = null;
    probes.forEach(function (s) {
      var t = s.offsetTop;
      if (top === null || Math.abs(t - top) > 3) { top = t; cur = []; lines.push(cur); }
      cur.push(s.textContent);
    });
    h.textContent = "";
    lines.forEach(function (words2, i) {
      var line = document.createElement("span");
      line.className = "split-line";
      var inner = document.createElement("i");
      inner.textContent = words2.join("");
      line.appendChild(inner);
      inner.style.transitionDelay = (i * 90) + "ms";
      h.appendChild(line);
    });
  }

  /* ---------- counters ---------- */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -9 * t); }
  function runCounter(el) {
    var to = parseInt(el.getAttribute("data-to"), 10) || 0;
    if (RM || to === 0) { el.textContent = String(to); return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = String(Math.round(easeOutExpo(p) * to));
      if (p < 1) requestAnimationFrame(step); else el.textContent = String(to);
    }
    requestAnimationFrame(step);
  }

  /* ---------- IntersectionObserver ---------- */
  var io = null;
  if (window.IntersectionObserver) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        if (el.classList.contains("cnt")) { runCounter(el); return; }
        if (el.tagName === "H1") {
          var ls = el.querySelectorAll(".split-line");
          for (var i = 0; i < ls.length; i++) ls[i].classList.add("on");
          return;
        }
        el.classList.add("on");
        if (el.classList.contains("orgfig")) litNodes(el);
        var cs = el.querySelectorAll("[data-count]");
        for (var c = 0; c < cs.length; c++) if (!cs[c].getAttribute("data-done")) { cs[c].setAttribute("data-done", "1"); countUp(cs[c]); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }
  function litNodes(fig) {
    var ns = fig.querySelectorAll(".org-node");
    for (var i = 0; i < ns.length; i++) {
      ns[i].style.transitionDelay = (RM ? 0 : i * 55) + "ms";
    }
  }

  function observeActive(section) {
    if (!io) { finishAll(section); return; }
    var i, list;
    var pops = section.querySelectorAll(".stat-in.pop");
    for (i = 0; i < pops.length; i++) pops[i].style.transitionDelay = (i * 120) + "ms";
    list = section.querySelectorAll(".rv, .clipin, .flowline.draw, .ledger li, .stat-in.pop");
    for (i = 0; i < list.length; i++) io.observe(list[i]);
    list = section.querySelectorAll(".cnt");
    for (i = 0; i < list.length; i++) io.observe(list[i]);
    list = section.querySelectorAll("h1[data-split]");
    for (i = 0; i < list.length; i++) io.observe(list[i]);
  }
  function finishAll(section) {
    var list = section.querySelectorAll(".rv, .clipin, .flowline.draw, .split-line, .ledger li, .orgfig, .stat-in.pop");
    for (var i = 0; i < list.length; i++) list[i].classList.add("on");
    var c = section.querySelectorAll(".cnt");
    for (var j = 0; j < c.length; j++) c[j].textContent = c[j].getAttribute("data-to");
    var dc = section.querySelectorAll("[data-count]");
    for (var m = 0; m < dc.length; m++) if (!dc[m].getAttribute("data-done")) { dc[m].setAttribute("data-done", "1"); countUp(dc[m]); }
    var lis = section.querySelectorAll(".tl-items li");
    for (var k = 0; k < lis.length; k++) lis[k].classList.add("lit");
    var f = section.querySelector("#tlFill");
    if (f) f.style.setProperty("--p", 1);
  }

  /* ---------- stage: data-par parallax (ported from coursekit en/index.html:854-863,
       scroll-linked) plus a pointer micro-offset; both write --px/--py so the CSS
       transform on .phone/.stat stays composable with the pop reveal ---------- */
  var parLayers = [], parHost = null, heroPhoto = null, pointerP = { x: 0, y: 0 };
  function collectPar(section) {
    parLayers = [].slice.call(section.querySelectorAll("[data-par]"));
    parHost = section.querySelector(".hero, .case-hero");
    heroPhoto = section.querySelector(".hero-photo");
    if (heroPhoto) heroPhoto.style.setProperty("--hz", "1");
  }
  function parTick() {
    if (RM || !parHost) return;
    var r = parHost.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
    if (heroPhoto) heroPhoto.style.setProperty("--hz", (1 + p * 0.04).toFixed(4));
    if (!parLayers.length) return;
    for (var i = 0; i < parLayers.length; i++) {
      var l = parLayers[i], f = parseFloat(l.getAttribute("data-par")) || 0;
      l.style.setProperty("--px", (pointerP.x * 20 * f).toFixed(1) + "px");
      l.style.setProperty("--py", (-p * 150 * f + pointerP.y * 14 * f).toFixed(1) + "px");
    }
  }
  window.addEventListener("pointermove", function (e) {
    if (RM) return;
    pointerP.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointerP.y = (e.clientY / window.innerHeight - 0.5) * 2;
    parTick();
  }, { passive: true });

  /* ---------- countUp: ported from coursekit assets/site-motion.js:22-37 ---------- */
  function ease4(t) { return 1 - Math.pow(1 - t, 4); }
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = +(el.getAttribute("data-dec") || 0);
    var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    var tn = el.firstChild;
    if (!tn || tn.nodeType !== 3) { tn = document.createTextNode(""); el.insertBefore(tn, el.firstChild); }
    if (RM) { tn.textContent = pre + target.toFixed(dec) + suf; return; }
    var dur = 1600, t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      tn.textContent = pre + (target * ease4(p)).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- scroll-linked timeline ---------- */
  var tlFill = null, tlItems = [], tlMax = 0;
  function collectTl(section) {
    tlFill = section.querySelector("#tlFill");
    tlItems = section.querySelectorAll("#tlItems li");
    tlMax = 0;
  }
  function tlTick() {
    if (!tlFill || !tlItems.length) return;
    if (RM) { tlFill.style.setProperty("--p", 1); for (var q = 0; q < tlItems.length; q++) tlItems[q].classList.add("lit"); return; }
    var band = document.getElementById("bandSec");
    if (!band) return;
    var r = band.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.92 - r.top) / (r.height * 0.62);
    p = Math.max(0, Math.min(1, p));
    if (p <= tlMax) { p = tlMax; } else { tlMax = p; }
    tlFill.style.setProperty("--p", p.toFixed(3));
    for (var i = 0; i < tlItems.length; i++) {
      var th = (i + 0.55) / tlItems.length;
      if (p >= th) tlItems[i].classList.add("lit");
    }
  }

  /* ---------- vertical timeline (About) ---------- */
  var vtlEl = null, vtlItems = [], vtlMax = 0;
  function collectVtl(section) {
    vtlEl = section.querySelector(".vtl");
    vtlItems = vtlEl ? vtlEl.querySelectorAll(".vtl-item") : [];
    vtlMax = 0;
    fitVtlRail();
  }
  /* the rail should run from the first dot centre to the last, not past them */
  function fitVtlRail() {
    if (!vtlEl) return;
    var rail = vtlEl.querySelector(".vtl-rail");
    var dots = vtlEl.querySelectorAll(".vtl-dot");
    if (!rail || dots.length < 2) return;
    var base = vtlEl.getBoundingClientRect().top;
    var a = dots[0].getBoundingClientRect();
    var b = dots[dots.length - 1].getBoundingClientRect();
    var top = a.top - base + a.height / 2;
    var bottom = b.top - base + b.height / 2;
    rail.style.top = top.toFixed(1) + "px";
    rail.style.bottom = "auto";
    rail.style.height = (bottom - top).toFixed(1) + "px";
  }
  function vtlTick() {
    if (!vtlEl || !vtlItems.length) return;
    var fill = vtlEl.querySelector(".vtl-rail i");
    if (!fill) return;
    if (RM) {
      fill.style.setProperty("--p", 1);
      for (var q = 0; q < vtlItems.length; q++) vtlItems[q].classList.add("lit");
      return;
    }
    var r = vtlEl.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.72 - r.top) / (r.height * 0.82);
    p = Math.max(0, Math.min(1, p));
    if (p <= vtlMax) { p = vtlMax; } else { vtlMax = p; }
    fill.style.setProperty("--p", p.toFixed(3));
    for (var i = 0; i < vtlItems.length; i++) {
      if (p >= (i + 0.4) / vtlItems.length) vtlItems[i].classList.add("lit");
    }
  }

  /* ---------- page init ----------
     Multi-page build: the document holds exactly one .route section, so there
     is no hash router. Everything the old render() did for the active section
     happens once here; nav highlighting is emitted by Header.astro instead. */
  var sec = document.querySelector(".route");
  if (sec) {
    sec.classList.add("active");
    var hs = sec.querySelectorAll("h1[data-split]");
    for (var k = 0; k < hs.length; k++) splitHeading(hs[k]);
    if (RM) { finishAll(sec); } else { observeActive(sec); }
    collectPar(sec);
    collectTl(sec);
    collectVtl(sec);
    parTick();
    tlTick();
    vtlTick();
  }

  function resplit() {
    if (RM) return;
    var s = document.querySelector(".route.active");
    if (!s) return;
    var list = s.querySelectorAll("h1[data-split]");
    for (var i = 0; i < list.length; i++) {
      var revealed = list[i].querySelector(".split-line.on") !== null;
      splitHeading(list[i], true);
      if (revealed || !io) {
        var ls = list[i].querySelectorAll(".split-line");
        for (var j = 0; j < ls.length; j++) ls[j].classList.add("on");
      } else if (io) {
        io.observe(list[i]);
      }
    }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resplit);
  var rsT = null;
  window.addEventListener("resize", function () {
    clearTimeout(rsT);
    rsT = setTimeout(resplit, 180);
  });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { parTick(); tlTick(); vtlTick(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", function () { fitVtlRail(); parTick(); tlTick(); vtlTick(); });
})();
