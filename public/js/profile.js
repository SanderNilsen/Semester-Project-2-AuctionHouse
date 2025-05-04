import { getAuthUser, getAuthToken } from "./utils/authStorage.js";
import { setupHeader } from "./utils/header.js";
import { API_BASE, API_KEY } from "./utils/constants.js";
import { renderProfileListings } from "./ui/renderProfileListings.js";
import { setupNewListingModal } from "./utils/modal.js";

setupHeader();

document.addEventListener("DOMContentLoaded", () => {
  const user = getAuthUser();

  if (!user) {
    window.location.href = "/index.html";
    return;
  }

  setupNewListingModal();
  populateProfile(user);
  loadTab("listings");

  const tabButtons = document.querySelectorAll(".tab-link");
  tabButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelector(".tab-link.active")?.classList.remove("active");
      btn.classList.add("active");

      const tab = btn.getAttribute("data-tab");
      loadTab(tab);
    })
  );

  document.addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (!deleteBtn) return;

    const listingId = deleteBtn.getAttribute("data-id");

    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.errors?.[0]?.message || "Failed to delete listing");
      }

      alert("Listing deleted!");
      loadTab("listings"); 
    } catch (error) {
      console.error("Delete failed:", error);
      alert(` ${error.message}`);
    }
  });
});

function populateProfile(user) {
  document.getElementById("profile-avatar").src = user.avatar?.url || "images/avatar-placeholder.png";
  document.getElementById("profile-name").textContent = user.name || "Unnamed";
  document.getElementById("profile-email").textContent = user.email || "Not available";
  document.getElementById("profile-bio").textContent = user.bio || "Bio description";
}

async function loadTab(tab) {
  const container = document.getElementById("profile-content");
  container.innerHTML = "<p class='text-primary'>Loading...</p>";

  try {
    const user = getAuthUser();
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE}/auction/profiles/${user.name}/${tab}?_listings=true&_bids=true&_wins=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to load profile data");

    const data = await response.json();
    renderProfileListings(data.data || [], tab, container);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="text-red-500">Error loading ${tab}.</p>`;
  }
}