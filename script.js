document.addEventListener("DOMContentLoaded", () => {
  setupClock(); // Task 5
  setupBgControls(); // Task 4
  setupAccordion(); // Task 2
  setupPopup(); // Task 3
  setupRegisterValidation(); // Task 1
});
console.log("ahahahaah");

function setupClock() {
  const clockEl = document.getElementById("clock");
  const btnSync = document.getElementById("btn-sync-time");
  if (!clockEl) return;

  const formatNow = () => {
    const now = new Date();

    const dateStr = now.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    clockEl.textContent = dateStr;
  };

  formatNow();
  const timer = setInterval(formatNow, 1000);

  if (btnSync) {
    btnSync.addEventListener("click", formatNow);
  }

  window.addEventListener("beforeunload", () => clearInterval(timer));
}

function setupBgControls() {
  const randomBtn = document.getElementById("btn-random-bg");
  const pickButtons = document.querySelectorAll(".color-pick");

  function setBg(color) {
    document.body.classList.remove("bg-light");
    document.body.style.backgroundColor = color;
  }
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const hue = Math.floor(Math.random() * 360);
      const sat = 70;
      const light = 92;
      const color = `hsl(${hue} ${sat}% ${light}%)`;
      setBg(color);
    });
  }
  pickButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      setBg(color);
    });
  });
}

function setupAccordion() {
  const acc = document.getElementById("faq-accordion");
  if (!acc) return;

  const setMaxHeight = (contentEl) => {
    const prev = contentEl.style.maxHeight;
    contentEl.style.maxHeight = "none";
    const full = contentEl.scrollHeight + "px";
    contentEl.style.maxHeight = prev;
    contentEl.offsetHeight;
    contentEl.style.maxHeight = full;
  };

  acc.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-toggle");
    if (!btn) return;

    const item = btn.parentElement;
    const content = item.querySelector(".content");

    if (item.classList.contains("open")) {
      item.classList.remove("open");
      content.style.maxHeight = "0";
    } else {
      acc.querySelectorAll(".item.open .content").forEach((c) => {
        c.style.maxHeight = "0";
      });
      acc
        .querySelectorAll(".item.open")
        .forEach((i) => i.classList.remove("open"));

      item.classList.add("open");
      setMaxHeight(content);
    }
  });
}

function setupPopup() {
  const overlay = document.getElementById("overlay");
  const openBtn = document.getElementById("open-popup");
  const closeBtn = document.getElementById("close-popup");
  if (!overlay || !openBtn) return;

  const closeX = overlay.querySelector(".close-x");
  const form = document.getElementById("subscription-form");

  const open = () => {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      const first = overlay.querySelector("input,button,select,textarea");
      first && first.focus();
    }, 50);
  };
  const close = () => {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", open);
  closeBtn && closeBtn.addEventListener("click", close);
  closeX && closeX.addEventListener("click", close);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("#subEmail");
      const errEmail = form.querySelector('[data-for="subEmail"]');
      errEmail.textContent = "";

      if (!email.value.trim()) {
        errEmail.textContent = "Укажите email";
        email.focus();
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        errEmail.textContent = "Неверный формат email";
        email.focus();
        return;
      }

      alert("Спасибо! Вы подписаны");
      form.reset();
      close();
    });
  }
}

function setupRegisterValidation() {
  const form = document.getElementById("register-form");
  if (!form) return;

  const fields = {
    firstName: form.querySelector("#firstName"),
    lastName: form.querySelector("#lastName"),
    email: form.querySelector("#email"),
    password: form.querySelector("#password"),
    confirm: form.querySelector("#confirm"),
    terms: form.querySelector("#terms"),
  };

  const errors = {
    firstName: form.querySelector('[data-for="firstName"]'),
    lastName: form.querySelector('[data-for="lastName"]'),
    email: form.querySelector('[data-for="email"]'),
    password: form.querySelector('[data-for="password"]'),
    confirm: form.querySelector('[data-for="confirm"]'),
    terms: form.querySelector('[data-for="terms"]'),
  };

  const clearErrors = () =>
    Object.values(errors).forEach((el) => (el.textContent = ""));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    let ok = true;

    // Имя/Фамилия
    if (!fields.firstName.value.trim()) {
      errors.firstName.textContent = "Укажите имя";
      ok = false;
    }
    if (!fields.lastName.value.trim()) {
      errors.lastName.textContent = "Укажите фамилию";
      ok = false;
    }

    // Email
    const email = fields.email.value.trim();
    if (!email) {
      errors.email.textContent = "Укажите email";
      ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email.textContent = "Неверный формат email";
      ok = false;
    }

    // Пароль
    const pwd = fields.password.value;
    if (!pwd) {
      errors.password.textContent = "Придумайте пароль";
      ok = false;
    } else if (pwd.length < 6) {
      errors.password.textContent = "Минимальная длина пароля — 6 символов";
      ok = false;
    }

    // Подтверждение
    if (!fields.confirm.value) {
      errors.confirm.textContent = "Подтвердите пароль";
      ok = false;
    } else if (fields.confirm.value !== pwd) {
      errors.confirm.textContent = "Пароли не совпадают";
      ok = false;
    }

    // Условия
    if (!fields.terms.checked) {
      errors.terms.textContent = "Подтвердите согласие с условиями";
      ok = false;
    }

    if (!ok) return;

    // Имитируем успешную отправку
    alert("Регистрация прошла успешно ");
    form.reset();
  });

  ["input", "change"].forEach((evt) => {
    form.addEventListener(evt, (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;

      for (const [key, field] of Object.entries(fields)) {
        if (t === field && errors[key]) errors[key].textContent = "";
      }
    });
  });
}
