import { getAuthToken, getAuthUser, saveAuthData } from "./utils/authStorage.js";
import { API_BASE, API_KEY } from "./utils/constants.js";
import { setupHeader } from "./utils/header.js";
import { renderItem } from "./ui/renderItem.js";

document.addEventListener("DOMContentLoaded", async () => {
  setupHeader();

  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");
  const listingSection = document.getElementById("item");

  if (!listingSection) {
    console.error("Could not find #item section!");
    return;
  }

  if (!listingId) {
    listingSection.innerHTML = "<p class='text-red-500 text-center'>No listing ID provided.</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true&_seller=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const auction = await response.json();
    renderItem(auction.data);
    setupPlaceBid(listingId);
  } catch (error) {
    console.error("Error loading auction:", error);
    listingSection.innerHTML = "<p class='text-red-500 text-center'>Failed to load listing details.</p>";
  }
});

function setupPlaceBid(listingId) {
  const bidButton = document.querySelector("button[aria-label='Place bid']");
  const bidInput = document.querySelector("input[type='number']");

  if (!bidButton || !bidInput) return;

  bidButton.addEventListener("click", async () => {
    const amount = parseFloat(bidInput.value);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to place a bid.");
      window.location.href = "/public/index.html";
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || "Failed to place bid.");
      }

      alert("Bid placed successfully!");

      updateCreditsAfterBid(amount);

      window.location.reload();
    } catch (error) {
      console.error("Error placing bid:", error);
      alert(`${error.message}`);
    }
  });
}

function updateCreditsAfterBid(amountSpent) {
  const user = getAuthUser();

  if (!user) {
    console.error("No user data found when trying to update credits.");
    return;
  }

  user.credits = (user.credits || 1000) - amountSpent;
  if (user.credits < 0) user.credits = 0;

  saveAuthData(getAuthToken(), user);

  const creditsText = document.getElementById("credits-text");
  if (creditsText) {
    creditsText.textContent = `Credits: ${user.credits}`;
  }
}
