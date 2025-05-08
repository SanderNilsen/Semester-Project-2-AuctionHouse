import { getAuthUser, getAuthToken } from "./utils/authStorage.js";
import { setupHeader } from "./ui/setupHeader.js";
import { API_BASE } from "./utils/constants.js";
import { renderProfileListings } from "./ui/renderProfileListings.js";
import { setupListingModal, openEditListingModal } from "./utils/modal.js";
import { headers } from "./api/headers.js";

const urlParams = new URLSearchParams(window.location.search);
const profileToView = urlParams.get("user");

setupHeader();
setupListingModal();

const avatarEl = document.getElementById("profile-avatar-main");
const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");
const bioEl = document.getElementById("profile-bio");
const contentEl = document.getElementById("profile-content");
const tabButtons = document.querySelectorAll(".tab-link");
const editProfileBtn = document.getElementById("edit-profile-btn");
const editModal = document.getElementById("edit-profile-modal");
const editForm = document.getElementById("edit-profile-form");
const cancelEditBtn = document.getElementById("cancel-profile-edit");

const loggedInUser = getAuthUser();
const token = getAuthToken();

const profileName  = profileToView || loggedInUser?.name;
const isOwnProfile = !profileToView;

if (!profileName) {
  window.location.href = "/index.html";
}

loadProfile();
loadTab("listings");

if (!isOwnProfile) {
  document.getElementById('edit-profile-btn')?.classList.add('hidden');
}


async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/auction/profiles/${profileName}`, {
      headers: headers(token),
    });
    
    if (!res.ok) throw new Error("Failed to fetch profile");

    const { data } = await res.json();
    avatarEl.src = data.avatar?.url || "images/avatar-placeholder.png";
    nameEl.textContent = data.name || "Unnamed";
    emailEl.textContent = data.email || "Not available";
    bioEl.textContent = data.bio || "No bio";
  } catch (err) {
    console.error(err);
    avatarEl.src = loggedInUser?.avatar?.url || "images/avatar-placeholder.png";
    nameEl.textContent = loggedInUser?.name || "Unnamed";
    emailEl.textContent = loggedInUser?.email || "Not available";
    bioEl.textContent = loggedInUser?.bio || "";
  }
}

export async function loadTab(tab) {
  contentEl.innerHTML = `
  <div class="flex justify-center">
    <div
     class="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin">
    </div>
  </div>`;
  
  const endpoint = `${API_BASE}/auction/profiles/${profileName}/${tab}${tab === "bids" ? "?_listings=true" : ""}`;

  try {
    const res = await fetch(endpoint, {
      headers: headers(token),
    });
    if (!res.ok) throw new Error(`Failed to load ${tab}`);

    const { data } = await res.json();
    renderProfileListings(data || [], tab, contentEl);
  } catch (err) {
    console.error(err);
    contentEl.innerHTML = `<p class="text-red-500">Error loading ${tab}.</p>`;
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab-link.active")?.classList.remove("active");
    btn.classList.add("active");
    loadTab(btn.dataset.tab);
  });
});

editProfileBtn?.addEventListener("click", () => {
  document.getElementById("edit-avatar-url").value = avatarEl.src;
  document.getElementById("edit-bio-text").value = bioEl.textContent;
  editModal.classList.remove("hidden");
  editModal.classList.add("flex");
});

cancelEditBtn?.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editModal.classList.remove("flex");
});

editForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_BASE}/auction/profiles/${profileName}`, {
      method: "PUT",
      headers: headers(token, true),
      body: JSON.stringify({
        avatar: { url: document.getElementById("edit-avatar-url").value, alt: "" },
        bio: document.getElementById("edit-bio-text").value,
      }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
      const { data } = await res.json();
      avatarEl.src = data.avatar?.url || "images/avatar-placeholder.png";
      bioEl.textContent = data.bio || "";
      editModal.classList.add("hidden");
      alert("Profile updated!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

document.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;
  const id = editBtn.dataset.id;
  try {
    const res = await fetch(`${API_BASE}/auction/listings/${id}`, {
      headers: headers(),
    });
    if (!res.ok) throw new Error("Failed to fetch listing");
    const { data: listing } = await res.json();
    openEditListingModal(listing);
  } catch (err) {
    console.error(err);
    alert(`Failed to load listing: ${err.message}`);
  }
});