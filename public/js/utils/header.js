import { getAuthUser, logout } from "./authStorage.js";

export function setupHeader() {
  const profileImg = document.getElementById("profile-avatar");
  const profileMenu = document.getElementById("profile-menu");
  const profileContainer = document.getElementById("profile-container");
  const logoutBtn = document.getElementById("logout-button");
  const creditsText = document.getElementById("credits-text");

  const user = getAuthUser();
  const avatarUrl = user?.avatar?.url;

  if (profileImg) {
    profileImg.src = avatarUrl || "images/avatar-placeholder.png";
  }

  if (user) {
    if (creditsText) {
      creditsText.textContent = `Credits: ${user.credits || "Undefined"}`;
    }

    profileImg?.addEventListener("click", () => {
      profileMenu?.classList.toggle("hidden");
    });

    logoutBtn?.addEventListener("click", () => {
      logout();
      window.location.href = "/public/index.html";
    });

    document.addEventListener("click", (e) => {
      if (
        profileContainer &&
        !profileContainer.contains(e.target) &&
        !profileMenu.classList.contains("hidden")
      ) {
        profileMenu.classList.add("hidden");
      }
    });
  } else {
    if (creditsText) {
      creditsText.textContent = "Register to receive 1000 credits";
    }

    profileImg?.addEventListener("click", () => {
      window.location.href = "/public/index.html";
    });
  }
}
