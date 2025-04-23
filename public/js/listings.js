import { fetchAuctions } from "./api/index.js";
import { renderAuctions } from "./ui/renderListings.js";
import {
  getAuthToken,
  getAuthUser,
  logout,
} from "./utils/authStorage.js";

let auctions = [];
let currentCount = 10;
let currentSort = "newest";

document.addEventListener("DOMContentLoaded", async () => {
  const profileImg = document.getElementById("profile-avatar");
  const profileMenu = document.getElementById("profile-menu");
  const profileContainer = document.getElementById("profile-container");
  const logoutBtn = document.getElementById("logout-button");
  const creditsText = document.getElementById("credits-text");

  const auctionList = document.getElementById("auction-list");
  const spinner = document.getElementById("spinner");
  const sortSelect = document.getElementById("sort-select");

  const user = getAuthUser();
  const avatarUrl = user?.avatar?.url;

  const loadMoreBtn = document.getElementById("load-more");
  loadMoreBtn?.addEventListener("click", () => {
    currentCount += 10;
    renderAuctions(auctions, auctionList, currentSort, currentCount);

    if (currentCount >= auctions.length) {
    loadMoreBtn.classList.add("hidden");
  }
});

  // Set avatar image
  if (profileImg) {
    profileImg.src = avatarUrl || "images/avatar-placeholder.png";
  }

  // Handle header content based on login status
  if (user) {
    if (creditsText) {
      creditsText.textContent = `Credits: ${user.credits || "1,000"}`;
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
        !profileContainer.contains(e.target) &&
        !profileMenu.classList.contains("hidden")
      ) {
        profileMenu.classList.add("hidden");
      }
    });
  } else {
    profileImg?.addEventListener("click", () => {
      window.location.href = "/public/register.html";
    });

    if (creditsText) {
      creditsText.textContent = "Register to receive 1000 credits";
    }
  }

  // Store fetched auctions for sorting
  let auctions = [];

  // Fetch and render listings
  if (!auctionList || !spinner) {
    console.error("Missing auction list or spinner element");
    return;
  }

  spinner.classList.remove("hidden");

  try {
    auctions = await fetchAuctions();
    renderAuctions(auctions, auctionList, currentSort, currentCount);  
    const loadMoreBtn = document.getElementById("load-more");
  if (auctions.length > currentCount) {
    loadMoreBtn.classList.remove("hidden");
  } 
  } catch (error) {
    auctionList.innerHTML = `<p class="text-red-500">Failed to load auctions.</p>`;
  } finally {
    spinner.classList.add("hidden");
  }

  sortSelect?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentCount = 10; 
    renderAuctions(auctions, auctionList, currentSort, currentCount);

    const loadMoreBtn = document.getElementById("load-more");
    if (auctions.length > currentCount) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
    }
  });

  // Handle bid/view button clicks
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

    // Placeholder: handle bid or details
    console.log("User clicked to view/bid on auction ID:", auctionId);
  });
});
