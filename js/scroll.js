(function () {
  var chapters = Array.prototype.slice.call(document.querySelectorAll(".chapter"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var frame = 0;

  function measure() {
    chapters.forEach(function (chapter) {
      var intro = chapter.querySelector(".intro");
      var text = intro.querySelector("h2");
      intro.style.height = "auto";
      var height = Math.ceil(text.getBoundingClientRect().height);
      intro.style.height = "";
      chapter.style.setProperty("--intro-space", height + "px");
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function update() {
    if (reduce.matches) {
      chapters.forEach(function (chapter) {
        chapter.style.setProperty("--reveal", "1");
        chapter.querySelector(".runway").style.height = "";
      });
      return;
    }

    var view = window.innerHeight;
    chapters.forEach(function (chapter) {
      var runway = chapter.querySelector(".runway");
      var travel = runway.offsetHeight - view;
      var raw = travel <= 0 ? 1 : clamp(-runway.getBoundingClientRect().top / travel, 0, 1);
      chapter.style.setProperty("--reveal", String(clamp(raw / 0.62, 0, 1)));
    });
  }

  function layout() {
    if (!reduce.matches) {
      var view = window.innerHeight;
      chapters.forEach(function (chapter) {
        if (chapter.classList.contains("text-only")) return;
        chapter.querySelector(".runway").style.height = Math.round(view * 1.85) + "px";
      });
    }
    measure();
    update();
  }

  function requestUpdate() {
    if (frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      update();
    });
  }

  layout();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", layout);
  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", layout);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layout);
  }
})();
