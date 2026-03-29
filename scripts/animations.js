// ============================================
// animations.js — Final clean version
// ============================================

function initAnimations() {

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ---- SKILL BARS ----
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute("data-width");
          fill.style.width = targetWidth + "%";
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.1 }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));
}