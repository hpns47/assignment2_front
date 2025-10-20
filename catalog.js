console.log("catalog.js loaded");

//  динамические стили при наведении
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".card");
  if (card) card.style.transform = "scale(1.03)";
});
document.addEventListener("mouseout", (e) => {
  const card = e.target.closest(".card");
  if (card) card.style.transform = "";
});

// раскрытие описания
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-primary")) {
    const p = e.target.closest(".card").querySelector(".card-text");
    if (!p.dataset.full) p.dataset.full = p.textContent.trim();
    const expanded = p.classList.toggle("expanded");
    p.textContent = expanded
      ? p.dataset.full + "  (нажмите ещё раз, чтобы свернуть)"
      : p.dataset.full.split(".")[0] + ".";
  }
});

//  кнопка "Показать ещё"
const btnMore = document.getElementById("loadMore");
if (btnMore) {
  btnMore.addEventListener("click", () => {
    addExtraCards();
  });
}

// массив с дополнительными карточками
const extraMangas = [
  {
    title: "Attack on Titan",
    img: "https://upload.wikimedia.org/wikipedia/en/7/7e/Shingeki_no_Kyojin_manga_volume_1.jpg",
    desc: "Человечество сражается с гигантами за выживание.",
  },
  {
    title: "Death Note",
    img: "https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg",
    desc: "Школьник находит тетрадь, убивающую по имени.",
  },
  {
    title: "Berserk",
    img: "https://upload.wikimedia.org/wikipedia/en/0/0c/Berserk_vol01.png",
    desc: "История Гатса — воина, борющегося с судьбой и демонами.",
  },
];

let added = false;
function addExtraCards() {
  if (added) return; // чтобы не дублировать
  const row = document.querySelector(".row.g-4");
  extraMangas.forEach((manga) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card h-100 shadow-sm animate-in">
        <img src="${manga.img}" class="card-img-top" alt="${manga.title}">
        <div class="card-body">
          <h5 class="card-title">${manga.title}</h5>
          <p class="card-text">${manga.desc}</p>
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-primary btn-sm">Читать</button>
        </div>
      </div>`;
    row.appendChild(col);
  });
  added = true;
  btnMore.disabled = true;
  animateNewCards();
}

// анимации при появлении
function animateNewCards() {
  document.querySelectorAll(".animate-in").forEach((el, i) => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, 100 * i);
  });
}
