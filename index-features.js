console.log("script.js loaded");

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

document.addEventListener("DOMContentLoaded", () => {
  initGlobal();

  // Роутинг по странице
  const page = document.body.dataset.page;
  switch (page) {
    case "index":
      initIndexPage();
      break;

    default:
      // ничего
      break;
  }
});

function initGlobal() {
  // Клавиатурная навигация по меню
  const nav = qs("#mainNav");
  if (nav) {
    on(nav, "keydown", (e) => {
      const links = qsa(".nav-link", nav);
      if (!links.length) return;
      const idx = links.indexOf(document.activeElement);

      // Только если фокус уже на одном из пунктов
      if (idx === -1) return;

      let next = idx;
      switch (e.key) {
        case "ArrowRight":
          next = (idx + 1) % links.length;
          e.preventDefault();
          break;
        case "ArrowLeft":
          next = (idx - 1 + links.length) % links.length;
          e.preventDefault();
          break;
        case "Home":
          next = 0;
          e.preventDefault();
          break;
        case "End":
          next = links.length - 1;
          e.preventDefault();
          break;
      }
      links[next]?.focus();
    });
  }

  window.playUi = () => {
    const audio = qs("#uiSound");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
}
document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupI18nSwitch();
});

function initIndexPage() {
  setupGalleryHero(); // Превью большой постер
  setupScrollAnimations(); // Плавный въезд карточек
}

// Улучшенная функция переключения тем
function setupThemeToggle() {
  const btn = document.querySelector("#themeToggle");
  if (!btn) return;

  // Загружаем сохранённую тему
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  btn.addEventListener("click", () => {
    const current = document.body.classList.contains("theme-dark") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
    if (window.playUi) window.playUi();
  });

  function applyTheme(mode) {
    const isDark = mode === "dark";

    // Применяем класс к body
    document.body.classList.toggle("theme-dark", isDark);
    
    // Обновляем кнопку
    btn.setAttribute("aria-pressed", String(isDark));
    btn.innerHTML = isDark ? "☀️ Светлая" : "🌙 Тёмная";

    // Navbar
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      if (isDark) {
        navbar.classList.remove("bg-light", "navbar-light");
        navbar.classList.add("bg-dark", "navbar-dark");
      } else {
        navbar.classList.remove("bg-dark", "navbar-dark");
        navbar.classList.add("bg-light", "navbar-light");
      }
    }

    // Footer
    const footer = document.querySelector("footer");
    if (footer) {
      if (isDark) {
        footer.classList.remove("bg-light");
        footer.classList.add("bg-dark", "text-white");
      } else {
        footer.classList.remove("bg-dark", "text-white");
        footer.classList.add("bg-light");
      }
    }

    // Main content areas
    const mainElements = document.querySelectorAll("main, section");
    mainElements.forEach(el => {
      if (isDark) {
        el.classList.remove("bg-light");
        el.classList.add("bg-dark", "text-light");
      } else {
        el.classList.remove("bg-dark", "text-light");
        el.classList.add("bg-light");
      }
    });

    // Cards
    document.querySelectorAll(".card").forEach(card => {
      if (isDark) {
        card.classList.add("bg-dark", "text-light", "border-secondary");
      } else {
        card.classList.remove("bg-dark", "text-light", "border-secondary");
      }
    });

    // Forms
    document.querySelectorAll(".form-control, .form-select").forEach(input => {
      if (isDark) {
        input.classList.add("bg-dark", "text-light", "border-secondary");
        input.style.color = "#fff";
      } else {
        input.classList.remove("bg-dark", "text-light", "border-secondary");
        input.style.color = "";
      }
    });

    // Buttons
    document.querySelectorAll(".btn-primary, .btn-outline-primary").forEach(button => {
      if (isDark) {
        button.classList.add("btn-outline-light");
        button.classList.remove("btn-primary", "btn-outline-primary");
      } else {
        button.classList.remove("btn-outline-light");
        if (button.textContent.includes("Читать") || button.textContent.includes("Отправить")) {
          button.classList.add("btn-primary");
        } else {
          button.classList.add("btn-outline-primary");
        }
      }
    });

    // Contact form section
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      if (isDark) {
        contactForm.classList.add("bg-dark", "text-light");
      } else {
        contactForm.classList.remove("bg-dark", "text-light");
      }
    }

    // Review cards
    document.querySelectorAll(".review-card").forEach(card => {
      if (isDark) {
        card.classList.add("bg-dark", "text-light", "border-secondary");
        card.style.backgroundColor = "#2b2b2b";
      } else {
        card.classList.remove("bg-dark", "text-light", "border-secondary");
        card.style.backgroundColor = "";
      }
    });

    // Accordion items
    document.querySelectorAll(".accordion-vjs .item").forEach(item => {
      const content = item.querySelector(".content");
      if (content) {
        if (isDark) {
          content.classList.add("bg-dark", "text-light");
        } else {
          content.classList.remove("bg-dark", "text-light");
        }
      }
    });

    // Overlay and popup
    const popup = document.querySelector(".popup");
    if (popup) {
      if (isDark) {
        popup.classList.add("bg-dark", "text-light");
        popup.style.backgroundColor = "#2b2b2b";
      } else {
        popup.classList.remove("bg-dark", "text-light");
        popup.style.backgroundColor = "";
      }
    }

    // Body background
    if (isDark) {
      document.body.style.backgroundColor = "#1a1a1a";
      document.body.style.color = "#e0e0e0";
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }

    // Containers
    document.querySelectorAll(".container").forEach(container => {
      if (isDark) {
        container.style.color = "#e0e0e0";
      } else {
        container.style.color = "";
      }
    });

    // Text elements
    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, label").forEach(el => {
      if (isDark && !el.closest(".card, .navbar, footer")) {
        el.style.color = "#e0e0e0";
      } else if (!isDark) {
        el.style.color = "";
      }
    });
  }
}



function setupI18nSwitch() {
  const select = qs("#langSelect");
  if (!select) return;

  // Тексты для RU/EN/KZ
  const I18N = {
    ru: {
      "i18n-whatIsTitle": "Что такое MangaLib?",
      "i18n-whatIsSubtitle": "MangaLib — это ваша онлайн-библиотека манги.",
      "i18n-whyTitle": "Почему выбирают MangaLib?",
      "i18n-card1Title": "Большая коллекция",
      "i18n-card1Text":
        "Доступ к сотням популярных и редких манг на русском и английском языках.",
      "i18n-card1Cta": "Перейти",
      "i18n-card2Title": "Регулярные обновления",
      "i18n-card2Text":
        "Новые главы добавляются каждую неделю — следи за любимыми историями.",
      "i18n-card2Cta": "Читать",
      "i18n-card3Title": "Активное сообщество",
      "i18n-card3Text":
        "Обсуждай мангу с другими читателями и оставляй свои отзывы.",
      "i18n-card3Cta": "Отзывы",
    },
    en: {
      "i18n-whatIsTitle": "What is MangaLib?",
      "i18n-whatIsSubtitle": "MangaLib is your online manga library.",
      "i18n-whyTitle": "Why choose MangaLib?",
      "i18n-card1Title": "Large collection",
      "i18n-card1Text":
        "Access hundreds of popular and rare manga in Russian and English.",
      "i18n-card1Cta": "Explore",
      "i18n-card2Title": "Regular updates",
      "i18n-card2Text":
        "New chapters every week — follow your favorite stories.",
      "i18n-card2Cta": "Read",
      "i18n-card3Title": "Active community",
      "i18n-card3Text": "Discuss manga with readers and leave your reviews.",
      "i18n-card3Cta": "Reviews",
    },
    kz: {
      "i18n-whatIsTitle": "MangaLib деген не?",
      "i18n-whatIsSubtitle": "MangaLib — сіздің онлайн манга кітапханаңыз.",
      "i18n-whyTitle": "Неге MangaLib?",
      "i18n-card1Title": "Үлкен жинақ",
      "i18n-card1Text":
        "Танымал және сирек мандарының жүздегеніне қолжеткізу (қазақ/орыс/ағыл.).",
      "i18n-card1Cta": "Ашу",
      "i18n-card2Title": "Жиі жаңарту",
      "i18n-card2Text": "Жаңа тараулар әр аптада — сүйікті әңгімені бақылаңыз.",
      "i18n-card2Cta": "Оқу",
      "i18n-card3Title": "Белсенді қауымдастық",
      "i18n-card3Text": "Оқырмандармен талқылап, пікір қалдырыңыз.",
      "i18n-card3Cta": "Пікірлер",
    },
  };

  const saved = localStorage.getItem("lang") || "ru";
  select.value = saved;
  applyLanguage(saved);

  on(select, "change", () => {
    const lang = select.value;
    switch (lang) {
      case "ru":
      case "en":
      case "kz":
        localStorage.setItem("lang", lang);
        applyLanguage(lang);
        playUi();
        break;
      default:
        localStorage.setItem("lang", "ru");
        applyLanguage("ru");
        break;
    }
  });

  function applyLanguage(lang) {
    const map = I18N[lang] || I18N.ru;
    for (const id in map) {
      const node = document.getElementById(id);
      if (node) node.textContent = map[id];
    }
  }
}

function setupGalleryHero() {
  const hero = qs("#heroImage");
  const container = hero?.closest("section") || document;
  if (!hero) return;

  on(container, "click", (e) => {
    const img = e.target.closest("img.thumb");
    if (!img) return;

    const full = img.dataset.full || img.src;
    hero.src = full;

    // небольшая анимация по замене
    hero.style.transition = "transform 200ms ease";
    hero.style.transform = "scale(0.98)";
    setTimeout(() => (hero.style.transform = "scale(1)"), 0);

    playUi();
  });
}
