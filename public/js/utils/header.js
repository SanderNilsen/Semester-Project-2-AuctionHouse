import { getAuthUser, logout } from "./authStorage.js";

export function setupHeader() {
  const profileImg = document.getElementById("profile-avatar");
  const signInBtn = document.getElementById("sign-in-button");
  const profileMenu = document.getElementById("profile-menu");
  const profileContainer = document.getElementById("profile-container");
  const logoutBtn = document.getElementById("logout-button");
  const creditsText = document.getElementById("credits-text");
  const promoMessage = document.getElementById("promo-message");
  const userCreditsBox = document.getElementById("user-credits");

  const user = getAuthUser();
  const avatarUrl = user?.avatar?.url;

  if (user) {
    if (profileImg) {
      profileImg.src = avatarUrl || "images/avatar-placeholder.png";
      profileImg.classList.remove("hidden");
    }
    if (signInBtn) {
      signInBtn.classList.add("hidden");
    }
    if (userCreditsBox) {
      userCreditsBox.classList.remove("hidden"); 
    }
    if (creditsText) {
      creditsText.classList.remove("hidden");
      creditsText.textContent = `Credits: ${user.credits || "Undefined"}`;
    }
    if (promoMessage) {
      promoMessage.textContent = "Discover Bid Own";
    }

    profileImg?.addEventListener("click", () => {
      profileMenu?.classList.toggle("hidden");
    });

    logoutBtn?.addEventListener("click", () => {
      logout();
      location.reload();
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
    if (profileImg) {
      profileImg.classList.add("hidden");
    }
    if (signInBtn) {
      signInBtn.classList.remove("hidden");
    }
    if (creditsText) {
      creditsText.classList.add("hidden");
    }
    if (userCreditsBox) {
      userCreditsBox.classList.add("hidden"); 
    }
    if (promoMessage) {
      promoMessage.textContent = "Register to receive 1000 credits";
    }

    signInBtn?.addEventListener("click", () => {
      window.location.href = "/index.html";
    });
  }
}