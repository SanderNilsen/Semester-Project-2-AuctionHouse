import { createListing, updateListing } from "../api/auctionApi.js";
import { API_BASE } from "../utils/constants.js";
import { headers } from "../api/headers.js";
import { getAuthToken } from "./authStorage.js";

let editingListingId = null;

const modalElement = document.getElementById("new-listing-modal");
const formElement = document.getElementById("new-listing-form");
const titleInput = document.getElementById("listing-title");
const descriptionInput = document.getElementById("listing-description");
const imageInput = document.getElementById("listing-image");
const endsAtInput = document.getElementById("listing-endsAt");
const deleteButton = document.getElementById("delete-listing-button");
const cancelButton = document.getElementById("cancel-listing");
const openButtons = document.querySelectorAll("#new-listing-btn, #list-item-btn");

function openModal(isEdit = false, listing = {}) {
  editingListingId = isEdit ? listing.id : null;
  formElement.reset();
  titleInput.value = listing.title || "";
  descriptionInput.value = listing.description || "";
  imageInput.value = listing.media?.[0]?.url || "";
  modalElement.classList.remove("hidden");
  modalElement.classList.add("flex");
  document.getElementById("new-listing-modal-title").textContent = isEdit ? "Edit Listing" : "Create New Listing";
  deleteButton.classList.toggle("hidden", !isEdit);
}

function closeModal() {
  editingListingId = null;
  modalElement.classList.add("hidden");
  modalElement.classList.remove("flex");
  formElement.reset();
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const media = imageInput.value.trim();
  const endsAtRaw = endsAtInput.value;

  if (!endsAtRaw) {
    alert("Please select an end date.");
    return;
  }

  const endsAt = new Date(endsAtRaw).toISOString();
  try {
    if (editingListingId) {
      await updateListing(editingListingId, { title, description, media, endsAt });
      alert("Listing updated!");
    } else {
      await createListing({ title, description, media, endsAt });
      alert("Listing created!");
    }
    closeModal();
    window.location.reload();
  } catch (error) {
    console.error("Error saving listing:", error);
    alert(error.message);
  }
}

async function handleDelete() {
  if (!editingListingId) return;
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    const response = await fetch(`${API_BASE}/auction/listings/${editingListingId}`, {
      method: "DELETE",
      headers: headers(getAuthToken()),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.errors?.[0]?.message || "Failed to delete listing");
    }
    alert("Listing deleted!");
    closeModal();
    window.location.reload();
  } catch (error) {
    console.error("Error deleting listing:", error);
    alert(error.message);
  }
}

export function setupListingModal() {
  if (!modalElement || !formElement || !cancelButton) {
    console.error("Listing modal elements missing!");
    return;
  }

  openButtons.forEach(button =>
    button.addEventListener("click", () => openModal(false))
  );

  cancelButton.addEventListener("click", closeModal);
  formElement.addEventListener("submit", handleFormSubmit);
  deleteButton.addEventListener("click", handleDelete);
}

export function openCreateListingModal() {
  openModal(false);
}

export function openEditListingModal(listing) {
  openModal(true, listing);
}
