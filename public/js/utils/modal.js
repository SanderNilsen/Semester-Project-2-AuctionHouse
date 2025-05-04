import { createListing } from "../api/auctionApi.js";

export function setupNewListingModal() {
  const modal = document.getElementById("new-listing-modal");
  const openButtons = document.querySelectorAll("#new-listing-btn, #list-item-btn");
  const cancelButton = document.getElementById("cancel-listing");
  const form = document.getElementById("new-listing-form");

  if (!modal || !form || !cancelButton) {
    console.error("New listing modal elements missing!");
    return;
  }

  openButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  });

  cancelButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    form.reset();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("listing-title").value.trim();
    const description = document.getElementById("listing-description").value.trim();
    const media = document.getElementById("listing-image").value.trim();
    const endsAtRaw = document.getElementById("listing-endsAt").value;

    if (!endsAtRaw) {
      alert("Please select an end date.");
      return;
    }

    const endsAt = new Date(endsAtRaw).toISOString(); 

    try {
      await createListing({ title, description, media, endsAt });
      alert("🎉 Listing created!");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      form.reset();
      window.location.reload();
    } catch (error) {
      console.error("Error creating listing:", error);
      alert(` ${error.message}`);
    }
  });
}