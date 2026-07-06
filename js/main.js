/* ═══════════════════════════════════════════════════════════════
   Casa Costa Matos — Scripts
   Organização: Loader → Navbar → Menu Mobile → Reveal/Counters →
                Slider → Filtro → FAQ → PIX → Formulário →
                Newsletter → Acessibilidade → Utilitários
═══════════════════════════════════════════════════════════════ */

/* ── LOADER ── */
window.addEventListener("load", () =>
  setTimeout(() => document.getElementById("loader").classList.add("out"), 1800)
);

/* ── NAVBAR (scroll) ── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
    nav.classList.remove("at-top");
  } else {
    nav.classList.remove("scrolled");
    nav.classList.add("at-top");
  }
}, { passive: true });

/* ── MENU MOBILE ── */
const ham    = document.getElementById("ham");
const mobNav = document.getElementById("mob-nav");
let navOpen  = false;

ham.addEventListener("click", () => {
  navOpen = !navOpen;
  ham.classList.toggle("open", navOpen);
  mobNav.classList.toggle("open", navOpen);
  mobNav.style.display = navOpen ? "flex" : "none";
  ham.setAttribute("aria-expanded", navOpen);
  document.body.style.overflow = navOpen ? "hidden" : "";
});

function closeNav() {
  navOpen = false;
  ham.classList.remove("open");
  mobNav.classList.remove("open");
  mobNav.style.display = "none";
  ham.setAttribute("aria-expanded", false);
  document.body.style.overflow = "";
}

/* ── REVEAL (Intersection Observer) ── */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    e.target.querySelectorAll("[data-count]").forEach(animCount);
    e.target.querySelectorAll(".s-bar-fill").forEach((b) => {
      b.style.width = b.dataset.w + "%";
    });
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal, .reveal-l, .reveal-r").forEach((el) =>
  revealIO.observe(el)
);

/* ── BARRAS DE PROGRESSO ── */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.style.width = e.target.dataset.w + "%";
  });
}, { threshold: 0.3 });

document.querySelectorAll(".s-bar-fill").forEach((el) => barIO.observe(el));

/* ── CONTADORES ANIMADOS ── */
const animated = new WeakSet();

function animCount(el) {
  if (animated.has(el)) return;
  animated.add(el);
  const target = +el.dataset.count;
  const dur    = 1600;
  const t0     = performance.now();

  const run = (t) => {
    const p    = Math.min((t - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString("pt-BR");
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = target.toLocaleString("pt-BR");
  };
  requestAnimationFrame(run);
}

// Contadores do ribbon
const ribbIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting)
      e.target.querySelectorAll("[data-count]").forEach(animCount);
  });
}, { threshold: 0.3 });

const ribbon = document.querySelector(".ribbon");
if (ribbon) ribbIO.observe(ribbon);

/* ── SLIDER DE DEPOIMENTOS ── */
const track = document.getElementById("testi-track");
let slideIndex = 0;

function cardWidth() {
  const card = track.querySelector(".testi-card");
  return card ? card.offsetWidth + 16 : 356;
}

function goSlide(n) {
  const max  = track.children.length - 1;
  slideIndex = Math.max(0, Math.min(n, max));
  track.style.transform = `translateX(-${slideIndex * cardWidth()}px)`;
}

document.getElementById("sNext").addEventListener("click", () => goSlide(slideIndex + 1));
document.getElementById("sPrev").addEventListener("click", () => goSlide(slideIndex - 1));

// Auto-play a cada 5,5 s
setInterval(() => {
  goSlide(slideIndex >= track.children.length - 1 ? 0 : slideIndex + 1);
}, 5500);

// Recalcula posição ao redimensionar
window.addEventListener("resize", () => goSlide(slideIndex));

/* ── FILTRO DE PROJETOS ── */
function filterProj(cat, btn) {
  document.querySelectorAll(".proj-card").forEach((c) => {
    c.style.display = (cat === "all" || c.dataset.cat === cat) ? "" : "none";
  });
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

/* ── FAQ (acordeão) ── */
function toggleFaq(btn) {
  const item   = btn.parentElement;
  const isOpen = item.classList.contains("open");

  // Fecha todos
  document.querySelectorAll(".faq-item").forEach((i) => {
    i.classList.remove("open");
    i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
  });

  // Abre o clicado (se estava fechado)
  if (!isOpen) {
    item.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }
}

/* ── PIX — COPIAR CHAVE ── */
function copyPix() {
  const key = document.getElementById("pixkey").textContent;
  const lbl = document.getElementById("pix-btn-txt");

  navigator.clipboard.writeText(key).catch(() => {
    // Fallback para navegadores sem Clipboard API
    const t = document.createElement("textarea");
    t.value = key;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);
  });

  lbl.textContent = "Chave copiada ✓";
  setTimeout(() => (lbl.textContent = "Copiar chave PIX"), 3000);
}

/* ── FORMULÁRIO DE CONTATO ── */
function sendForm(e) {
  e.preventDefault();
  const btn = document.getElementById("send-btn");
  const ff  = document.getElementById("ff");

  btn.textContent = "Enviando...";
  btn.disabled    = true;

  // Simulação de envio (substituir por fetch real)
  setTimeout(() => {
    btn.textContent = "Enviar mensagem";
    btn.disabled    = false;

    ff.className   = "form-feedback ok";
    ff.style.display = "block";
    ff.textContent = "Mensagem enviada com sucesso! Entraremos em contato em breve.";

    document.getElementById("cf").reset();
    setTimeout(() => (ff.style.display = "none"), 5000);
  }, 1600);
}

/* ── NEWSLETTER ── */
function nlSub(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  btn.textContent = "Inscrito ✓";
  e.target.querySelector("input").value = "";
  setTimeout(() => (btn.textContent = "Inscrever"), 4000);
}

/* ── ACESSIBILIDADE ── */
let fontSize = 16;
let darkMode = false;
let highContrast = false;

document.getElementById("btnUp").addEventListener("click", () => {
  fontSize = Math.min(fontSize + 1, 22);
  document.documentElement.style.fontSize = fontSize + "px";
});

document.getElementById("btnDown").addEventListener("click", () => {
  fontSize = Math.max(fontSize - 1, 13);
  document.documentElement.style.fontSize = fontSize + "px";
});

document.getElementById("btnDark").addEventListener("click", function () {
  darkMode = !darkMode;
  document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "");
  this.textContent = darkMode ? "◑" : "◐";
  this.setAttribute("aria-pressed", darkMode);
});

document.getElementById("btnHC").addEventListener("click", function () {
  highContrast = !highContrast;
  document.body.classList.toggle("hc", highContrast);
  this.setAttribute("aria-pressed", highContrast);
});

/* ── TECLADO ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navOpen) closeNav();
});

// Suporte a Enter/Space nos cards de documento
document.querySelectorAll(".doc-row").forEach((d) => {
  d.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") d.click();
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 80,
      behavior: "smooth",
    });
  });
});