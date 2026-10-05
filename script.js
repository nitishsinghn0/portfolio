const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#site-menu");
const progressBar = document.querySelector("#reading-progress-bar");
const backToTop = document.querySelector("#back-to-top");
const copyButton = document.querySelector("#copy-site");
const copyFeedback = document.querySelector("#copy-feedback");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const projectCards = [...document.querySelectorAll(".project-card")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#10110f" : "#f6f6f0";
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme-v2");
} catch {
  // The default theme still works when browser storage is unavailable.
}
setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("portfolio-theme-v2", nextTheme);
  } catch {
    copyFeedback.textContent = "Theme changed for this visit.";
  }
});

function closeMenu() {
  navMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  navMenu.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#filter-status").textContent = `Showing ${filter === "all" ? "all" : filter === "built" ? "hands-on" : "concept"} ${visibleCount} ${visibleCount === 1 ? "idea" : "ideas"}`;
  });
});

async function copySiteLink() {
  const link = "https://nitishsingh0.com.np";
  try {
    await navigator.clipboard.writeText(link);
    copyFeedback.textContent = "Website link copied — share it with someone!";
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = link;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.append(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    copyFeedback.textContent = copied ? "Website link copied — share it with someone!" : "Copy wasn’t available. Website: nitishsingh0.com.np";
  }
}

copyButton.addEventListener("click", copySiteLink);
document.querySelector("#current-year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
