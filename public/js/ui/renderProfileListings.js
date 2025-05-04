export function renderProfileListings(items, tab, container) {
  if (!items.length) {
    container.innerHTML = `<p class="text-primary">No ${tab} yet.</p>`;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const listing = (tab === "bids" || tab === "wins") ? item.listing || {} : item;

      return `
        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
          <img src="${listing.media?.[0]?.url || "images/placeholder.svg"}"
               alt="${listing.title}" class="rounded-lg h-40 w-full object-cover mb-3" />
          <h3 class="text-primary font-semibold">${listing.title || "Untitled"}</h3>
          <p class="text-sm text-gray-600">${listing.description || "No description"}</p>
          <a href="/item.html?id=${listing.id}" class="bg-secondary text-white text-center mt-4 py-2 px-4 rounded hover:bg-primary">View Details</a>
          <button class="delete-btn bg-red-600 text-white mt-2 py-2 px-4 rounded hover:bg-red-700" data-id="${listing.id}">
            Delete
          </button>
        </div>`;
    })
    .join("");
}