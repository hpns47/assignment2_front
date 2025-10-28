$(document).ready(function () {
  // Task 1 Live filter
  $("#searchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    $(".row.g-4 .col").each(function () {
      const hay = $(this).text().toLowerCase();
      $(this).toggle(hay.indexOf(value) > -1);
    });
  });

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
      .forEach((s) => list.append(`<li>${s}</li>`));
  });
  $("#suggestions").on("click", "li", function () {
    $("#searchInput").val($(this).text());
    $("#suggestions").empty();
  });

  // Task 3 Highlight matches
  $("#highlightBtn").on("click", function () {
    const term = $("#highlightInput").val();
    if (!term) return;
    const regex = new RegExp(`(${term})`, "gi");
    $(".faq-item").each(function () {
      const html = $(this).text().replace(regex, "<mark>$1</mark>");
      $(this).html(html);
    });
  });
});
