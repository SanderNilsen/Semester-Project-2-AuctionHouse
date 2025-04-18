import { fetchAuctions } from "./api/index.js";
import { renderAuctions } from "./ui/renderListings.js";
import {
  getAuthToken,
  getAuthUser,
  logout,
} from "./utils/authStorage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileImg = document.getElementById("profile-avatar");
  const profileMenu = document.getElementById("profile-menu");
  const profileContainer = document.getElementById("profile-container");
  const logoutBtn = document.getElementById("logout-button");
  const creditsText = document.getElementById("credits-text");

  const auctionList = document.getElementById("auction-list");
  const spinner = document.getElementById("spinner");

  const user = getAuthUser();
  const avatarUrl = user?.avatar?.url;

  // Set avatar image
  if (profileImg) {
    profileImg.src = avatarUrl || "images/avatar-placeholder.png";
  }

  // Handle header content based on login status
  if (user) {
    // Set credit text
    if (creditsText) {
      creditsText.textContent = `Credits: ${user.credits || "1,000"}`;
    }

    // Toggle dropdown menu
    profileImg?.addEventListener("click", () => {
      profileMenu?.classList.toggle("hidden");
    });

    logoutBtn?.addEventListener("click", () => {
      logout();
      window.location.href = "/public/index.html";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !profileContainer.contains(e.target) &&
        !profileMenu.classList.contains("hidden")
      ) {
        profileMenu.classList.add("hidden");
      }
    });
  } else {
    // Not logged in: redirect on avatar click
    profileImg?.addEventListener("click", () => {
      window.location.href = "/public/register.html";
    });

    // Show register promo
    if (creditsText) {
      creditsText.textContent = "Register to receive 1000 credits";
    }
  }

  // Fetch and render listings
  if (!auctionList || !spinner) {
    console.error("Missing auction list or spinner element");
    return;
  }

  spinner.classList.remove("hidden");

  try {
    const auctions = await fetchAuctions();
    renderAuctions(auctions, auctionList);
  } catch (error) {
    auctionList.innerHTML = `<p class="text-red-500">Failed to load auctions.</p>`;
  } finally {
    spinner.classList.add("hidden");
  }

  // Handle bid/view details button clicks
  document.addEventListener("click", (event) => {
    const bidBtn = event.target.closest("button[data-id]");
    if (!bidBtn) return;

    const auctionId = bidBtn.getAttribute("data-id");
    const isLoggedIn = !!getAuthToken();

    if (!isLoggedIn) {
      alert("You need to log in to place a bid.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/public/index.html";
      return;
    }
    // Proceed with bid or view details
    // Placeholder: open bid modal or view details
    console.log("User clicked to view/bid on auction ID:", auctionId);
  });
});
