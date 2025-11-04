$(document).ready(function () {
  console.log("contact-jquery.js loaded");

  // Добавляем скрытое поле для промокода в форму
  $("#contactForm").prepend('<input type="hidden" id="promo" name="promo" value="">');

  // Task 7: Notification system (toast)
  function showToast(msg, type = "success") {
    const toast = $(`
      <div class="toast-msg ${type}">
        ${msg}
      </div>
    `).appendTo("body");
    toast.fadeIn(300);
    setTimeout(() => toast.fadeOut(500, () => toast.remove()), 3000);
  }

  // Функция валидации формы
  function validateForm() {
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val();
    const confirm = $("#confirm").val();
    const errorDiv = $(".form-error");
    
    // Очищаем предыдущие ошибки
    errorDiv.hide().text("");
    $("input").removeClass("error");

    // Проверка имени
    if (name.length === 0) {
      errorDiv.text("Пожалуйста, введите ваше имя").show();
      $("#name").addClass("error");
      return false;
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorDiv.text("Пожалуйста, введите корректный email").show();
      $("#email").addClass("error");
      return false;
    }

    // Проверка пароля (минимум 6 символов)
    if (password.length < 6) {
      errorDiv.text("Пароль должен содержать минимум 6 символов").show();
      $("#password").addClass("error");
      return false;
    }

    // Проверка совпадения паролей
    if (password !== confirm) {
      errorDiv.text("Пароли не совпадают").show();
      $("#password, #confirm").addClass("error");
      return false;
    }

    return true;
  }

  // Task 6: Loading spinner on submit
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    // Проверяем валидацию перед отправкой
    if (!validateForm()) {
      return false;
    }

    const btn = $(this).find("button[type=submit]");
    const successDiv = $(".form-success");
    
    btn
      .prop("disabled", true)
      .html(
        `<span class="spinner-border spinner-border-sm"></span> Пожалуйста, подождите...`
      );

    // Симуляция отправки формы
    setTimeout(() => {
      btn.prop("disabled", false).text("Отправить");
      
      // Показываем сообщение об успехе
      showToast("✅ Форма успешно отправлена!");
      successDiv.text("Спасибо! Ваша заявка успешно отправлена.").show();
      
      // Очищаем форму
      $("#contactForm")[0].reset();
      
      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => successDiv.fadeOut(), 5000);
    }, 1500);
  });

  // Убираем ошибки при вводе
  $("#contactForm input").on("input", function() {
    $(this).removeClass("error");
    $(".form-error").hide();
  });

  // Task 8: Copy to clipboard


  $("#copyBtn").on("click", function () {
    const promoCode = "MANGA2025";
    
    navigator.clipboard.writeText(promoCode).then(() => {
      $(this).text("Скопировано! ✅");
      showToast("Промокод скопирован!");
      
      $("#promo").val(promoCode);
      
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