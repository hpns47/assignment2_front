$(document).ready(function () {
  console.log("contact-jquery.js loaded");

  //  Task 6: Loading spinner on submit 
  $("#contactForm").on("submit", function () {
    const btn = $(this).find("button[type=submit]");
    btn
      .prop("disabled", true)
      .html(
        `<span class="spinner-border spinner-border-sm"></span> Пожалуйста, подождите...`
      );

    setTimeout(() => {
      btn.prop("disabled", false).text("Отправить");
    }, 1500);
  });

  //  Task 7: Notification system (toast) 
  function showToast(msg, type = "success") {
    const toast = $(`
      <div class="toast-msg ${type}">
        ${msg}
      </div>
    `).appendTo("body");

    toast.fadeIn(300);
    setTimeout(() => toast.fadeOut(500, () => toast.remove()), 3000);
  }

  // показываем уведомление при успешной отправке
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    setTimeout(() => showToast("✅ Форма успешно отправлена!"), 1500);
  });

  //  Task 8: Copy to clipboard 
  // создадим пример блока с текстом и кнопкой
  const copyBlock = $(`
    <div class="copy-block container my-4">
      <p id="promoText" class="mb-2">Промокод: <strong>MANGA2025</strong></p>
      <button id="copyBtn" class="btn btn-outline-primary btn-sm">Скопировать</button>
    </div>
  `);
  $(".contact-form").after(copyBlock);

  $("#copyBtn").on("click", function () {
    const text = $("#promoText").text();
    navigator.clipboard.writeText(text).then(() => {
      $(this).text("Скопировано! ✅");
      showToast("Промокод скопирован!");
      setTimeout(() => $(this).text("Скопировать"), 2000);
    });
  });

  // Task 9: Lazy loading for images 
  $("img[data-src]").each(function () {
    const img = $(this);
    const src = img.data("src");
    function loadIfVisible() {
      const top = img.offset().top;
      const scroll = $(window).scrollTop();
      const height = $(window).height();
      if (top < scroll + height) {
        img.attr("src", src).removeAttr("data-src");
        $(window).off("scroll", loadIfVisible);
      }
    }
    $(window).on("scroll", loadIfVisible);
    loadIfVisible();
  });
});
