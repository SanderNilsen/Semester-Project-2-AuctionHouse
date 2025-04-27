import { loginUser } from "./api/index.js";
import { saveAuthData } from "./utils/authStorage.js";
import { API_BASE, API_KEY } from "./utils/constants.js";

async function fetchUserProfile(userName, accessToken) {
  const response = await fetch(`${API_BASE}/auction/profiles/${userName}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to fetch user profile.");
  }

  const profile = await response.json();
  return profile.data;
}

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
      const result = await loginUser(email, password);
      const { accessToken, name } = result.data;
    
      const userProfile = await fetchUserProfile(name, accessToken);
    
      saveAuthData(accessToken, {
        name: userProfile.name,
        email: userProfile.email,
        avatar: userProfile.avatar,
        credits: userProfile.credits,
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