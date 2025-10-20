console.log("script.js loaded");

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
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
  const nav = $("#mainNav");
  if (nav) {
    on(nav, "keydown", (e) => {
      const links = $$(".nav-link", nav);
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
    const audio = $("#uiSound");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
}


function initIndexPage() {
  setupThemeToggle(); // День/Ночь
  setupI18nSwitch(); // Язык
  setupGalleryHero(); // Превью большой постер
  setupScrollAnimations(); // Плавный въезд карточек
}

function setupThemeToggle() {
  const btn = $("#themeToggle");
  if (!btn) return;

  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);

  on(btn, "click", () => {
    const isDark = document.body.classList.toggle("theme-dark");
    const next = isDark ? "dark" : "light";
    localStorage.setItem("theme", next);
    btn.setAttribute("aria-pressed", String(isDark));
    playUi();
  });

  function applyTheme(mode) {
    const isDark = mode === "dark";
    document.body.classList.toggle("theme-dark", isDark);
    btn.setAttribute("aria-pressed", String(isDark));
    btn.textContent = isDark ? "🌞 Тема" : "🌙 Тема";
  }
}

function setupI18nSwitch() {
  const select = $("#langSelect");
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
  const hero = $("#heroImage");
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
