import { getAuthUser, getAuthToken, logout } from "../utils/authStorage.js";
import { API_BASE, API_KEY } from "../utils/constants.js";

async function fetchProfileData(username, token) {
  const response = await fetch(`${API_BASE}/auction/profiles/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  if (!response.ok) throw new Error("Could not fetch latest profile");
  const { data } = await response.json();
  return data;
}

export async function setupHeader() {
  const profileImg = document.getElementById("profile-avatar");
  const signInBtn = document.getElementById("sign-in-button");
  const profileMenu = document.getElementById("profile-menu");
  const profileContainer = document.getElementById("profile-container");
  const logoutBtn = document.getElementById("logout-button");
  const creditsText = document.getElementById("credits-text");
  const promoMessage = document.getElementById("promo-message");
  const userCreditsBox = document.getElementById("user-credits");

  const user = getAuthUser();
  const token = getAuthToken();

  if (!user || !token) {
    signInBtn?.classList.remove("hidden");
    profileImg?.classList.add("hidden");
    creditsText?.classList.add("hidden");
    userCreditsBox?.classList.add("hidden");
    if (promoMessage) promoMessage.textContent = "Register to receive 1000 credits";

    signInBtn?.addEventListener("click", () => {
      window.location.href = "/index.html";
    });
    return;
  }

  signInBtn?.classList.add("hidden");
  userCreditsBox?.classList.remove("hidden");
  if (promoMessage) promoMessage.textContent = "Discover Bid Own";

  try {
    const data = await fetchProfileData(user.name, token);
    if (profileImg) {
      profileImg.src = data.avatar?.url || "images/avatar-placeholder.png";
      profileImg.classList.remove("hidden");
    }
    if (creditsText) creditsText.textContent = `Credits: ${data.credits ?? "Undefined"}`;
  } catch (error) {
    console.error("Failed to fetch latest profile:", error);
    if (profileImg) {
      profileImg.src = user.avatar?.url || "images/avatar-placeholder.png";
      profileImg.classList.remove("hidden");
    }
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
      profileMenu &&
      !profileMenu.classList.contains("hidden")
    ) {
      profileMenu.classList.add("hidden");
    }
  });
}