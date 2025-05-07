export function renderAuctions(auctions, container, sortBy = 'newest', visibleCount = 10) {
  if (!Array.isArray(auctions)) {
    container.innerHTML = `<p class="text-red-500">No auctions available.</p>`;
    return;
  }

  const sortedAuctions = sortAuctions(auctions, sortBy);
  const listingItems = sortedAuctions.slice(0, visibleCount);
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  container.innerHTML = listingItems
    .map(auction => renderAuctionCard(auction, isLoggedIn))
    .join('');
}

function sortAuctions(auctions, sortBy) {
  return [...auctions].sort((a, b) => {
    switch (sortBy) {
      case 'endingSoon':
        return new Date(a.endsAt) - new Date(b.endsAt);
      case 'mostBids':
        return (b._count?.bids || 0) - (a._count?.bids || 0);
      case 'newest':
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });
}

function renderAuctionCard(auction, isLoggedIn) {
  const {
    id,
    title = 'Untitled',
    created,
    endsAt,
    media = [],
    seller = {},
    description = 'No description available',
    _count = {}
  } = auction;

  const imageUrl = media[0]?.url || 'images/placeholder.svg';
  const sellerName = seller.name || 'Unknown Seller';
  const sellerAvatar = seller.avatar?.url || 'images/avatar-placeholder.png';
  const createdDate = formatDate(created);
  const endsDate = formatDate(endsAt);

  return `
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <div class="relative">
        <img
          src="${imageUrl}"
          alt="${title}"
          class="w-full h-40 object-cover rounded-lg"
        />
        <div class="absolute top-2 left-2 bg-secondary/50 text-white px-2 py-1 rounded">
          Bids: ${_count.bids || 0}
        </div>
        <div class="absolute bottom-2 left-2 bg-secondary/50 text-white px-2 py-1 rounded">
          Ends: ${endsDate}
        </div>
      </div>
      <h3 class="text-primary uppercase truncate text-lg font-bold mt-2">
        ${title}
      </h3>
      <p class="text-sm font-light">Created: ${createdDate}</p>
      <div class="flex items-center mt-3">
        <img
          src="${sellerAvatar}"
          alt="${sellerName}"
          class="w-8 h-8 rounded-full mr-2"
        />
        <p class="text-sm font-light">${sellerName}</p>
      </div>
      <p class="text-primary truncate mt-2">${description}</p>
      <button
        class="bg-secondary text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-primary ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}"
        ${!isLoggedIn ? 'disabled' : ''}
        data-id="${id}"
      >
        ${isLoggedIn ? 'View Details / Bid' : 'Login to Bid'}
      </button>
    </div>
  `;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}
