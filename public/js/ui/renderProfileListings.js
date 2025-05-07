const urlParams = new URLSearchParams(window.location.search);
const profileToView = urlParams.get('user');
const isOwnProfile = !profileToView;

export function renderProfileListings(items, tab, container) {
  if (!items.length) {
    container.innerHTML = `<p class="text-primary">No ${tab} yet.</p>`;
    return;
  }

  const html = items.map(renderItem).join("");
  container.innerHTML = html;

  function renderItem(item) {
    const listing = tab === "bids" ? item.listing || {} : item;
    const {
      id,
      title = "Untitled",
      description = "No description",
      media = []
    } = listing;
    const imageUrl = media[0]?.url || "images/placeholder.svg";

    return (
      `<div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
        <img
          src="${imageUrl}"
          alt="${title}"
          class="rounded-lg h-40 w-full object-cover mb-3"
        />
        <h3 class="text-primary uppercase font-semibold flex justify-between items-center">
          ${title}
          ${tab === "listings" && isOwnProfile ? editButton(id) : ""}
        </h3>
        <p class="text-sm text-gray-600">${description}</p>
        <a
          href="/item.html?id=${id}"
          class="bg-secondary text-white text-center mt-4 py-2 px-4 rounded hover:bg-primary"
        >
          View Details
        </a>
      </div>`
    );
  }

  function editButton(listingId) {
    return (
      `<div class="flex gap-2">
        <button
          data-id="${listingId}"
          class="edit-btn bg-white border text-secondary text-xs px-2 py-1 rounded hover:bg-secondary hover:text-white cursor-pointer"
        >
          Edit
        </button>
      </div>`
    );
  }
}