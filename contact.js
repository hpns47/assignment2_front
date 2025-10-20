console.log("contact.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const errorBox = document.querySelector(".form-error");
  const successBox = document.querySelector(".form-success");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.style.display = "none";
    successBox.style.display = "none";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();

    if (!name || !email || !password || !confirm) {
      return showError("Заполните все поля!");
    }
    if (!email.includes("@") || !email.includes(".")) {
      return showError("Введите корректный email!");
    }
    if (password.length < 6) {
      return showError("Пароль должен быть не меньше 6 символов.");
    }
    if (password !== confirm) {
      return showError("Пароли не совпадают!");
    }

    try {
      const response = await fakePostData({
        name,
        email,
        password,
      });

      if (response.success) {
        showSuccess("Форма успешно отправлена!");
        form.reset();
      } else {
        showError("Ошибка при отправке, попробуйте позже.");
      }
    } catch (err) {
      showError("Произошла ошибка при соединении.");
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
    errorBox.style.color = "#d93025";
  }

  function showSuccess(msg) {
    successBox.textContent = msg;
    successBox.style.display = "block";
  }

  function fakePostData(data) {
    console.log("Отправляем данные:", data);

    return new Promise((resolve) => {
      // имитируем сетевой запрос
      setTimeout(() => {
        switch (data.name.toLowerCase()) {
          case "admin":
            resolve({ success: false, message: "Имя занято" });
            break;
          default:
            resolve({ success: true });
        }
      }, 1200);
    });
  }
});
