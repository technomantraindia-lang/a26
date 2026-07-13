(function () {
  if (!document.querySelector(".a26-services-page")) {
    return;
  }

  var revealItems = document.querySelectorAll(".a26-services-page .a26-reveal");
  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  revealItems.forEach(function (el) {
    observer.observe(el);
  });

  /* Subtle parallax on pillar images while scrolling */
  var pillars = document.querySelectorAll(".a26-service-pillar-media img");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (pillars.length && !reduceMotion && window.matchMedia("(min-width: 992px)").matches) {
    var ticking = false;

    function updateParallax() {
      pillars.forEach(function (img) {
        var card = img.closest(".a26-service-pillar");
        if (!card) {
          return;
        }
        var rect = card.getBoundingClientRect();
        var viewH = window.innerHeight;
        if (rect.bottom < 0 || rect.top > viewH) {
          img.style.transform = "";
          return;
        }
        var progress = (viewH - rect.top) / (viewH + rect.height);
        var shift = (progress - 0.5) * 16;
        img.style.transform = "translateY(" + shift.toFixed(1) + "px)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateParallax();
  }

  /* Micro tilt on solution cards — desktop only */
  var solutionCards = document.querySelectorAll(".a26-solution-item");
  if (solutionCards.length && !reduceMotion && window.matchMedia("(min-width: 992px)").matches) {
    solutionCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        card.classList.add("is-hovered");
      });

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", (-y * 3.5).toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", (x * 3.5).toFixed(2) + "deg");
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-hovered");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }
})();
