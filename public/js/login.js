import { loginUser } from "./api/index.js";
import { saveAuthData } from "./utils/authStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-msg");
  const spinner = document.getElementById("spinner");

  if (!form || !errorMsg || !spinner) {
    console.error("Login form, error message, or spinner element not found");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMsg.textContent = "";
    spinner.classList.remove("hidden");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const { accessToken, name, email: userEmail } = await loginUser(email, password);
      saveAuthData(accessToken, { name, email: userEmail });
      window.location.href = "/public/listings.html";
    } catch (error) {
      console.error("Login failed:", error);
      errorMsg.textContent = error.message;
    } finally {
      spinner.classList.add("hidden");
    }
  });
});
