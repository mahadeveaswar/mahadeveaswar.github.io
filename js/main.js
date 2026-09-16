(function () {
  "use strict";

  /* ---------- header scrolled state ---------- */
  function initHeaderState() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "150px 0px -5% 0px" }
    );
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      io.observe(el);
    });
  }

  /* ---------- active nav link on scroll ---------- */
  function initActiveNav() {
    var sections = ["work", "journey", "writing", "about"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var links = document.querySelectorAll(".primary-nav a");
    if (!sections.length || !links.length) return;

    var map = {};
    links.forEach(function (l) { map[l.getAttribute("data-nav")] = l; });

    var ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * 0.35;
      var current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) current = sections[i];
      }
      links.forEach(function (l) { l.classList.remove("active"); });
      var link = map[current.id];
      if (link) link.classList.add("active");
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* ---------- scroll cue button ---------- */
  function initScrollCue() {
    var cue = document.querySelector(".scroll-cue");
    if (!cue) return;
    cue.addEventListener("click", function () {
      var target = document.querySelector(cue.getAttribute("data-scroll-to"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- impact counters ---------- */
  function initCounters() {
    var nums = document.querySelectorAll(".impact-number[data-count]");
    if (!nums.length) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (reduceMotion) {
        el.textContent = target;
        return;
      }
      var duration = 1100;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nums.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeaderState();
    initReveal();
    initActiveNav();
    initScrollCue();
    initCounters();
  });
})();
