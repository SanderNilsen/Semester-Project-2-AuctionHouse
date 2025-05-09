import { fetchAuctions } from "./api/auctionApi.js";
import { renderAuctions } from "./ui/renderListings.js";
import { setupHeader } from "./ui/setupHeader.js";
import { getAuthToken } from "./utils/authStorage.js";
import { setupListingModal } from "./utils/modal.js";

let auctions = [];
let currentCount = 10;
let currentSort = "newest";

document.addEventListener("DOMContentLoaded", async () => {
  setupHeader(); 
  setupListingModal(); 
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const auctionList = document.getElementById("auction-list");
  const spinner = document.getElementById("spinner");
  const sortSelect = document.getElementById("sort-select");
  const loadMoreBtn = document.getElementById("load-more");
  const startBiddingBtn = document.getElementById("start-bidding-btn");
  const listingsSection = document.getElementById("listings");

  startBiddingBtn?.addEventListener("click", () => {
    listingsSection?.scrollIntoView({ behavior: "smooth" });
  });

  /**
   * Handles the search functionality for auction listings.
   * Filters the auctions based on the search input and updates the UI.
   *
   * @function handleSearch
   * @throws {Error} Logs an error if filtering or rendering fails.
   */
  function handleSearch() {
    const term = searchInput.value.trim().toLowerCase();
    spinner.classList.remove("hidden");
    try {
      const filtered = auctions.filter(a => a.title.toLowerCase().includes(term));
      renderAuctions(filtered, auctionList, currentSort, currentCount);
      loadMoreBtn.classList.toggle("hidden", filtered.length <= currentCount);
    } catch (err) {
      console.error("Search error:", err);
      auctionList.innerHTML = `<p class=\"text-red-500\">Search failed.</p>`;
    } finally {
      spinner.classList.add("hidden");
    }
  }

  if (searchButton) searchButton.addEventListener("click", handleSearch);
  if (searchInput) {
    searchInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearch();
      }
    });
  }
  if (!auctionList || !spinner || !loadMoreBtn) {
    console.error("Missing required elements");
    return;
  }

  spinner.classList.remove("hidden");

  try {
    auctions = await fetchAuctions();
    renderAuctions(auctions, auctionList, currentSort, currentCount);

    if (auctions.length > currentCount) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
    }
  } catch (error) {
    console.error("Error fetching auctions:", error);
    auctionList.innerHTML = `<p class="text-red-500">Failed to load auctions.</p>`;
  } finally {
    spinner.classList.add("hidden");
  }

  sortSelect?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentCount = 10; 
    renderAuctions(auctions, auctionList, currentSort, currentCount);

    if (auctions.length > currentCount) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
    }
  });

  loadMoreBtn?.addEventListener("click", () => {
    currentCount += 10;
    renderAuctions(auctions, auctionList, currentSort, currentCount);

    if (currentCount >= auctions.length) {
      loadMoreBtn.classList.add("hidden");
    }
  });

  document.addEventListener("click", (event) => {
    const bidBtn = event.target.closest("button[data-id]");
    if (!bidBtn) return;

    const auctionId = bidBtn.getAttribute("data-id");
    const isLoggedIn = !!getAuthToken();

    if (!auctionId) {
      console.error("Auction ID missing from button");
      return;
    }

    if (!isLoggedIn) {
      alert("You need to log in to place a bid.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/index.html";
      return;
    }

    window.location.href = `/item.html?id=${auctionId}`;
  });
});