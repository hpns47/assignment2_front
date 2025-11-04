$(document).ready(function () {
  console.log("manga-api.js loaded");

  const API_URL = "https://api.jikan.moe/v4/manga"; 
  let currentPage = 1;
  let isLoading = false;
  let allManga = [];

  async function loadMangaFromAPI(page = 1) {
    if (isLoading) return;

    isLoading = true;
    const loadMoreBtn = $("#loadMore");
    const originalText = loadMoreBtn.html();

    loadMoreBtn
      .prop("disabled", true)
      .html(
        '<span class="spinner-border spinner-border-sm me-2"></span>Загрузка...'
      );

    try {
      const response = await fetch(
        `${API_URL}?page=${page}&limit=9&order_by=popularity`
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }

      const data = await response.json();
      const mangaList = data.data;

      allManga = allManga.concat(mangaList);

      displayManga(mangaList);

      currentPage++;

      showToast(`✅ Загружено ${mangaList.length} манг`);
    } catch (error) {
      console.error("Ошибка:", error);
      showToast("❌ Ошибка при загрузке данных", "error");
    } finally {
      isLoading = false;
      loadMoreBtn.prop("disabled", false).html(originalText);
    }
  }

  function displayManga(mangaList) {
    const container = $(".row.g-4");

    mangaList.forEach((manga) => {
      const card = createMangaCard(manga);
      container.append(card);
    });

    $(".col").slice(-mangaList.length).hide().fadeIn(600);
  }

  function createMangaCard(manga) {
    const title = manga.title || "Без названия";
    const image =
      manga.images?.jpg?.large_image_url ||
      manga.images?.jpg?.image_url ||
      "https://via.placeholder.com/300x450?text=No+Image";
    const synopsis = manga.synopsis
      ? manga.synopsis.length > 120
        ? manga.synopsis.substring(0, 120) + "..."
        : manga.synopsis
      : "Описание отсутствует";
    const score = manga.score || "N/A";
    const chapters = manga.chapters || "?";
    const status = manga.status || "Неизвестно";
    const url = manga.url || "#";

    return $(`
      <div class="col">
        <div class="card h-100 shadow-sm manga-card" data-manga-id="${manga.mal_id}">
          <div class="position-relative">
            <img
              src="${image}"
              class="card-img-top"
              alt="${title}"
              loading="lazy"
              onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'"
            />
            <span class="badge bg-warning position-absolute top-0 end-0 m-2">
              ⭐ ${score}
            </span>
          </div>
          <div class="card-body">
            <h5 class="card-title text-truncate" title="${title}">${title}</h5>
            <p class="card-text small text-muted">${synopsis}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <small class="text-muted">📚 Главы: ${chapters}</small>
              <small class="badge bg-info">${status}</small>
            </div>
          </div>
          <div class="card-footer text-center bg-white border-top-0">
            <a href="${url}" target="_blank" class="btn btn-primary btn-sm w-100">
              Подробнее
            </a>
          </div>
        </div>
      </div>
    `);
  }

  function showToast(msg, type = "success") {
    const toast = $(`
      <div class="toast-msg ${type}">
        ${msg}
      </div>
    `).appendTo("body");

    toast.fadeIn(300);
    setTimeout(() => toast.fadeOut(500, () => toast.remove()), 3000);
  }

  $("#loadMore").on("click", function () {
    loadMangaFromAPI(currentPage);
  });

  let autoLoadEnabled = false;

  $(window).on("scroll", function () {
    if (!autoLoadEnabled) return;

    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const docHeight = $(document).height();

    if (scrollTop + windowHeight >= docHeight - 200 && !isLoading) {
      loadMangaFromAPI(currentPage);
    }
  });

  $("<button>")
    .text("🔄 Автозагрузка: ВЫКЛ")
    .addClass(
      "btn btn-sm btn-outline-secondary position-fixed bottom-0 end-0 m-3"
    )
    .attr("id", "autoLoadToggle")
    .insertAfter("footer")
    .on("click", function () {
      autoLoadEnabled = !autoLoadEnabled;
      $(this).text(
        autoLoadEnabled ? "🔄 Автозагрузка: ВКЛ" : "🔄 Автозагрузка: ВЫКЛ"
      );
      $(this).toggleClass("btn-outline-secondary btn-success");
      showToast(
        autoLoadEnabled ? "Автозагрузка включена" : "Автозагрузка выключена"
      );
    });

  $("#searchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase();

    $(".manga-card")
      .parent()
      .each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.indexOf(value) > -1);
      });

    const visibleCount = $(".manga-card").parent(":visible").length;
    if (value.length > 0) {
      showToast(`Найдено: ${visibleCount} манг`);
    }
  });

  console.log("Загружаем начальные данные...");
  loadMangaFromAPI(1);
});
