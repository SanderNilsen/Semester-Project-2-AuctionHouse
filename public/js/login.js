import { loginUser } from "./api/auth.js";
import { saveAuthData } from "./utils/authStorage.js";
import { authFetch } from "./utils/authFetch.js"; 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-msg");
  const spinner = document.getElementById("spinner");

  if (!form || !errorMsg || !spinner) {
    console.error("Login form, error message, or spinner not found");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMsg.textContent = "";
    spinner.classList.remove("hidden");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const result = await loginUser(email, password);
      const { accessToken, name } = result.data;

      const profile = await authFetch(`/auction/profiles/${name}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      saveAuthData(accessToken, {
        name: profile.data.name,
        email: profile.data.email,
        avatar: profile.data.avatar,
        credits: profile.data.credits,
      });

      window.location.href = "/listings.html";
    } catch (error) {
      console.error("Login failed:", error);
      errorMsg.textContent = error.message;
    } finally {
      spinner.classList.add("hidden");
    }
  });
});