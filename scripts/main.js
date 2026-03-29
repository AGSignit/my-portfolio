// ============================================
// main.js — Portfolio brain (clean version)
// ============================================

const components = [
  { file: "components/navbar.html",   target: "navbar-container"   },
  { file: "components/hero.html",     target: "hero-container"     },
  { file: "components/about.html",    target: "about-container"    },
  { file: "components/skills.html",   target: "skills-container"   },
  { file: "components/projects.html", target: "projects-container" },
  { file: "components/contact.html",  target: "contact-container"  },
  { file: "components/footer.html",   target: "footer-container"   },
];

// Load one component into its container
async function loadComponent({ file, target }) {
  try {
    const response = await fetch(file);
    const html     = await response.text();
    document.getElementById(target).innerHTML = html;
  } catch (error) {
    console.error("Failed to load: " + file, error);
  }
}

// Load all components then reveal page
async function initPortfolio() {
  await Promise.all(components.map(loadComponent));

  // Hide loader
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
  }

  // Show page
  const app = document.getElementById("app");
  if (app) app.style.opacity = "1";

  // Run animations
  if (typeof initAnimations === "function") {
    initAnimations();
  }

  // Run navbar
  initNavbar();

  // Run typing
  initTypingAnimation();

  // Run project filter
  initProjectFilter();

  // Run footer year
  initFooter();
  // Connect Formspree form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
}

document.addEventListener("DOMContentLoaded", initPortfolio);

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar     = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks   = document.querySelectorAll(".nav-link");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    highlightActiveSection();
  });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      mobileMenu.classList.toggle("hidden");
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.classList.remove("open");
      if (mobileMenu) mobileMenu.classList.add("hidden");
    });
  });

  function highlightActiveSection() {
    const sections = ["about", "skills", "projects", "contact"];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (rect.top <= 120 && rect.bottom >= 120) {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }
}

// ============================================
// TYPING ANIMATION
// ============================================
function initTypingAnimation() {
  const titles = [
    "Business Analyst",
    "Data Science Student",
    "AI Enthusiast",
    "Financial Analyst",
    "Problem Solver",
  ];

  const el = document.getElementById("typed-text");
  if (!el) return;

  let titleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      el.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
      speed = 1800;
      isDeleting = true;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
}

// ============================================
// PROJECT FILTER
// ============================================
function initProjectFilter() {
  const filterBtns   = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

// ============================================
// CONTACT FORM
// ============================================
// ============================================
// CONTACT FORM — Formspree handler
// ============================================
async function handleFormSubmit(e) {
  if (e) e.preventDefault();

  const form     = document.getElementById("contact-form");
  const btn      = document.getElementById("form-submit");
  const btnText  = document.getElementById("btn-text");
  const feedback = document.getElementById("form-feedback");

  // Loading state
  btn.disabled        = true;
  btnText.textContent = "Sending...";

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      // Success!
      btnText.textContent = "Message Sent! ✅";
      showFeedback(feedback, "success",
        "✅ Message sent successfully! I'll get back to you soon.");
      form.reset();
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    btnText.textContent = "Send Message";
    showFeedback(feedback, "error",
      "❌ Something went wrong. Please email me directly.");
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      btnText.textContent = "Send Message";
      feedback.classList.add("hidden");
    }, 5000);
  }
}

function showFeedback(el, type, message) {
  el.textContent = message;
  el.className   = "form-feedback " + type;
}

// ============================================
// FOOTER YEAR
// ============================================
function initFooter() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
