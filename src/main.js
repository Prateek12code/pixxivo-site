import "./style.css";
import gsap from "gsap";

/* ---------- DOT FONT ---------- */
const FONT = {
  0: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};

function renderDotNumber(el, str) {
  if (!el) return;
  el.innerHTML = "";
  for (const c of str) {
    const map = FONT[c] || FONT["0"];
    const digit = document.createElement("div");
    digit.className = "dot-digit";
    map.forEach((row) =>
      [...row].forEach((bit) => {
        const dot = document.createElement("div");
        dot.className = "dot" + (bit === "1" ? " on" : "");
        digit.appendChild(dot);
      }),
    );
    el.appendChild(digit);
  }
}

/* ---------- PRELOADER (unchanged medium pace) ---------- */
function runPreloader() {
  const pre = document.getElementById("preloader");
  const dots = document.getElementById("preDots");
  if (!pre || !dots) return;

  const DURATION = 1350;
  const start = performance.now();

  const raf = () => {
    const t = performance.now() - start;
    const p = Math.min(t / DURATION, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const pct = Math.floor(eased * 100);

    renderDotNumber(dots, String(pct).padStart(2, "0"));

    if (p < 1) requestAnimationFrame(raf);
    else {
      gsap.to(pre, {
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        onComplete: () => pre.remove(),
      });
    }
  };

  requestAnimationFrame(raf);
}

/* ---------- Brand Motion ---------- */
function navEntrance() {
  const glass = document.querySelector(".glass-nav");
  if (!glass) return;

  gsap.fromTo(
    glass,
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
  );
}

function revealStagger() {
  const els = Array.from(document.querySelectorAll("[data-fade]"));
  if (!els.length) return;

  gsap.from(els, {
    opacity: 0,
    y: 18,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.06,
    delay: 0.05,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  runPreloader();
  navEntrance();
  revealStagger();
});

// --- Lightbox (click-to-view full image/video) ---
(() => {
  const box = document.getElementById("lightbox");
  if (!box) return;

  const backdrop = document.getElementById("lightboxBackdrop");
  const closeBtn = document.getElementById("lightboxClose");
  const imgEl = document.getElementById("lightboxImg");
  const vidEl = document.getElementById("lightboxVid");

  const open = (src, type = "image", alt = "") => {
    box.classList.remove("hidden");
    box.classList.add("flex");
    box.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("overflow-hidden");

    // reset
    imgEl.classList.add("hidden");
    vidEl.classList.add("hidden");
    vidEl.pause();
    vidEl.removeAttribute("src");
    vidEl.load();

    if (type === "video") {
      vidEl.src = src;
      vidEl.classList.remove("hidden");
      vidEl.load();
      vidEl.play().catch(() => {});
    } else {
      imgEl.src = src;
      imgEl.alt = alt || "Preview";
      imgEl.classList.remove("hidden");
    }
  };

  const close = () => {
    box.classList.add("hidden");
    box.classList.remove("flex");
    box.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("overflow-hidden");

    vidEl.pause();
    vidEl.removeAttribute("src");
    vidEl.load();
    imgEl.removeAttribute("src");
  };

  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-lightbox]");
    if (!target) return;

    const type =
      target.dataset.type || (target.tagName === "VIDEO" ? "video" : "image");
    const src = target.getAttribute("src") || target.currentSrc;
    const alt = target.getAttribute("alt") || "";
    if (!src) return;

    open(src, type, alt);
  });

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// Footer year
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Mobile menu dropdown (animated)
(() => {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  const openClasses = ["opacity-100", "translate-y-0", "scale-100"];
  const closedClasses = [
    "opacity-0",
    "-translate-y-2",
    "scale-[0.98]",
    "pointer-events-none",
  ];

  const openMenu = () => {
    menu.classList.remove(...closedClasses);
    menu.classList.add(...openClasses);
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menu.classList.add(...closedClasses);
    menu.classList.remove(...openClasses);
    btn.setAttribute("aria-expanded", "false");
  };

  // Ensure closed on load
  closeMenu();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  menu.addEventListener("click", (e) => e.stopPropagation());

  // Close after clicking a link
  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  // Close on outside click
  document.addEventListener("click", closeMenu);

  // Close on Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();


const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const charCount = document.getElementById("charCount");
const msg = document.getElementById("message");

const ENDPOINT = "https://pixxivo-contact.krishaeo-code.workers.dev";

if (msg && charCount) {
  const updateCount = () => {
    const n = msg.value.length;
    charCount.textContent = `${n} / 1200`;
  };
  msg.addEventListener("input", updateCount);
  updateCount();
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check (bots fill hidden fields)
    const trap = form.querySelector("#company");
    if (trap && trap.value.trim().length > 0) return;

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      intent: form.intent?.value || "general",
      message: form.message.value.trim(),
    };

    if (!data.name || !data.email || !data.message) {
      status.textContent = "Please fill all fields.";
      return;
    }

    status.textContent = "Sending…";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      status.textContent = "Message sent ✅";
      form.reset();
      if (msg && charCount) charCount.textContent = "0 / 1200";
    } catch (err) {
      console.error(err);
      status.textContent = "Failed ❌ Try again";
    }
  });
}
