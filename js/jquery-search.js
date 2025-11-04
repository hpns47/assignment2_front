$(document).ready(function () {
  // Task 1 Live filter + Highlight
  $("#searchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    const searchTerm = $(this).val().trim();

    $(".row.g-4 .col").each(function () {
      const hay = $(this).text().toLowerCase();
      const isVisible = hay.indexOf(value) > -1;
      $(this).toggle(isVisible);

      // Highlight matching text если есть что искать
      if (isVisible && searchTerm.length > 0) {
        highlightText($(this), searchTerm);
      } else {
        // Убираем highlight если поиск пустой
        removeHighlight($(this));
      }
    });
  });

  // Функция для подсветки текста
  function highlightText(element, searchTerm) {
    // Находим заголовок манги (обычно это h5 или h3)
    const title = element.find("h5, h3, .card-title");

    if (title.length > 0) {
      // Сохраняем оригинальный текст если ещё не сохранён
      if (!title.data("original-text")) {
        title.data("original-text", title.text());
      }

      // Получаем оригинальный текст
      const originalText = title.data("original-text");

      // Создаём регулярное выражение для поиска (игнорируя регистр)
      const regex = new RegExp(`(${escapeRegex(searchTerm)})`, "gi");

      // Заменяем совпадения на подсвеченный текст
      const highlightedText = originalText.replace(regex, "<mark>$1</mark>");

      // Обновляем HTML
      title.html(highlightedText);
    }
  }

  // Функция для удаления подсветки
  function removeHighlight(element) {
    const title = element.find("h5, h3, .card-title");

    if (title.length > 0 && title.data("original-text")) {
      title.text(title.data("original-text"));
    }
  }

  // Функция для экранирования спецсимволов в regex
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Task 2 Simple autocomplete
  const suggestions = [
    "Naruto",
    "One Piece",
    "Bleach",
    "Berserk",
    "Attack on Titan",
  ];

  $("#searchInput").on("input", function () {
    const val = $(this).val().toLowerCase();
    const list = $("#suggestions").empty();
    if (val.length < 1) return;

    suggestions
      .filter((s) => s.toLowerCase().includes(val))
      .forEach((s) => {
        // Подсвечиваем совпадения в автокомплите
        const regex = new RegExp(`(${escapeRegex(val)})`, "gi");
        const highlighted = s.replace(regex, "<mark>$1</mark>");
        list.append(`<li>${highlighted}</li>`);
      });
  });

  $("#suggestions").on("click", "li", function () {
    // Берём текст без HTML тегов
    $("#searchInput").val($(this).text());
    $("#suggestions").empty();
    // Запускаем поиск с подсветкой
    $("#searchInput").trigger("keyup");
  });

  // Task 3 Highlight matches в FAQ
  $("#highlightBtn").on("click", function () {
    const term = $("#highlightInput").val();
    if (!term) return;

    const regex = new RegExp(`(${escapeRegex(term)})`, "gi");

    $(".faq-item").each(function () {
      // Сохраняем оригинальный текст
      if (!$(this).data("original-html")) {
        $(this).data("original-html", $(this).html());
      }

      const originalHtml = $(this).data("original-html");
      const highlighted = originalHtml.replace(regex, "<mark>$1</mark>");
      $(this).html(highlighted);
    });
  });

  // Кнопка для сброса подсветки в FAQ
  $("#clearHighlightBtn").on("click", function () {
    $(".faq-item").each(function () {
      if ($(this).data("original-html")) {
        $(this).html($(this).data("original-html"));
      }
    });
    $("#highlightInput").val("");
  });
});
