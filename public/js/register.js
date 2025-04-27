import { registerUser } from "./api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const errorMsg = document.getElementById("error-msg");
  const spinner = document.getElementById("spinner");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMsg.textContent = "";
    spinner.classList.remove("hidden");

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await registerUser(username, email, password);
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Registration failed:", error);
      errorMsg.textContent = error.message;
    } finally {
      spinner.classList.add("hidden");
    }
  });
});
