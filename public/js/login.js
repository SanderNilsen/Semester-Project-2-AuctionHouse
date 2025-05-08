import { loginUser } from "./api/auth.js";
import { saveAuthData, logout, getAuthToken } from "./utils/authStorage.js";
import { headers } from "./api/headers.js";
import { API_BASE } from "./utils/constants.js";

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
    spinner.classList.add("flex");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const result = await loginUser(email, password);
      const { accessToken, name } = result.data;

      const response = await fetch(`${API_BASE}/auction/profiles/${name}`, {
        headers: headers(accessToken),
      });
      const profile = await response.json();
      
      if (!response.ok) {
        throw new Error(profile.errors?.[0]?.message || "Failed to fetch profile");
      }

      saveAuthData(accessToken, {
        name: profile.data.name,
        email: profile.data.email,
        avatar: profile.data.avatar,
        credits: profile.data.credits,
      });

      window.location.href = "/listings.html";
    } catch (error) {
      console.error("Login failed:", error);
      if (error.message === "Email must be a valid email") {
        errorMsg.textContent = "Only a user with a stud.noroff.no email may register.";
      } else {
        errorMsg.textContent = error.message;
      }
    } finally {
      spinner.classList.add("hidden");
      spinner.classList.remove("flex");
    }
  });

  const guestBtn = document.getElementById("guest-btn");
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      logout();
      window.location.href = "/listings.html";
    });
  }
});