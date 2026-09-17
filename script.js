(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var menuButton = document.getElementById("menuButton");
  var siteNav = document.getElementById("site-nav");

  function closeMenu() {
    if (!siteNav || !menuButton) return;
    siteNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Graceful image fallback ----------
     If a photo hasn't been added to /assets yet (or fails to load),
     swap it for a simple, on-brand initials placeholder instead of a
     broken-image icon, so the site never looks broken. */
  function placeholderSVG(initials) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">' +
      '<rect width="100%" height="100%" fill="#142238"/>' +
      '<rect x="6" y="6" width="388" height="488" fill="none" stroke="#cf9e4f" stroke-opacity="0.35"/>' +
      '<text x="50%" y="52%" fill="#cf9e4f" font-family="Georgia, serif" font-size="56" ' +
      'text-anchor="middle" dominant-baseline="middle">' +
      initials +
      "</text>" +
      '<text x="50%" y="64%" fill="#a7b0c2" font-family="monospace" font-size="14" ' +
      'text-anchor="middle" dominant-baseline="middle">Photo coming soon</text>' +
      "</svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  document.querySelectorAll("img[data-fallback-initials]").forEach(function (img) {
    img.addEventListener(
      "error",
      function () {
        if (img.dataset.broken === "true") return;
        img.dataset.broken = "true";
        img.src = placeholderSVG(img.dataset.fallbackInitials || "LKD");
      },
      { once: true }
    );
  });

  /* ---------- Disabled placeholder contact links ----------
     Prevents a dead "#" jump when a real URL hasn't been added yet. */
  document.querySelectorAll('[data-placeholder="true"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
      }
    });
  });
})();
