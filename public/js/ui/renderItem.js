export function renderItem(auction) {
  setPageMeta(auction);
  const listingSection = document.getElementById('item');

  const {
    title = 'Untitled',
    media = [],
    seller = {},
    created,
    endsAt,
    description = 'No description provided.',
    bids = []
  } = auction;

  const imageUrl = media[0]?.url || 'images/placeholder.svg';
  const sellerName = seller.name || 'Unknown Seller';
  const sellerAvatar = seller.avatar?.url || 'images/avatar-placeholder.png';
  const createdDate = new Date(created).toLocaleDateString();
  const endsDate = new Date(endsAt).toLocaleString();
  const sortedBids = bids.slice().sort((a, b) => b.amount - a.amount);
  const highestBid = sortedBids[0] || null;

  listingSection.innerHTML = `
    <div class="bg-tertiary p-4 rounded-lg shadow-lg">
      <img
        src="${imageUrl}"
        alt="${title}"
        class="w-full h-80 object-cover rounded-lg"
      />
      <div class="mt-4 flex justify-between items-center">
        <div>
          <h3 class="text-primary uppercase text-lg font-bold">${title}</h3>
          <a
            href="profile.html?user=${(sellerName)}"
            class="text-sm font-light flex items-center mt-1"
          >
          <img
            src="${sellerAvatar}"
            alt="${sellerName}"
            class="w-8 h-8 rounded-full mr-2"
          />
          <p class="text-secondary hover:text-primary">${sellerName}</p>
          </a>
        </div>
        <div class="text-right">
          <p class="text-sm font-light">Created: ${createdDate}</p>
          <p class="text-sm font-light">Ends: ${endsDate}</p>
        </div>
      </div>
      <hr class="my-4 border-gray-300" />
      <p class="text-primary">${description}</p>
      <hr class="my-4 border-gray-300" />
      ${renderStats(sortedBids, highestBid)}
      <hr class="my-4 border-gray-300" />
      ${renderBidHistory(sortedBids)}
      <hr class="my-4 border-gray-300" />
      ${renderBidForm()}
    </div>
  `;
}

function renderStats(bids, highestBid) {
  return `
    <div class="flex justify-between items-center">
      <div>
        <p class="text-primary">Total bids:</p>
        <p class="text-primary">Highest bid:</p>
      </div>
      <div class="text-right">
        <p class="text-primary">${bids.length}</p>
        <p class="text-primary">
          ${highestBid ? `${highestBid.bidder?.name || 'Unknown'}, ${highestBid.amount} Credits` : 'No bids yet'}
        </p>
      </div>
    </div>
  `;
}

function renderBidHistory(bids) {
  if (!bids.length) {
    return `
      <div>
        <h2 class="text-primary text-lg font-bold">Bid History</h2>
        <ul class="list-disc list-inside text-primary mt-2">
          <li>No bids yet</li>
        </ul>
      </div>
    `;
  }
  const items = bids.map(bid => `
    <li class="flex justify-between">
      <span>${bid.bidder?.name || 'Unknown'}</span>
      <span>${bid.amount} Credits</span>
    </li>
  `).join('');
  return `
    <div>
      <h2 class="text-primary text-lg font-bold">Bid History</h2>
      <ul class="list-disc list-inside text-primary mt-2">
        ${items}
      </ul>
    </div>
  `;
}

function renderBidForm() {
  return `
    <div>
      <h2 class="text-primary text-lg font-bold">Place Bid</h2>
      <div class="flex gap-3 mt-2">
        <input
          type="number"
          placeholder="Enter bid amount..."
          class="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
          aria-label="Enter bid amount"
        />
      </div>
      <button
        class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary cursor-pointer mt-2 w-full"
        aria-label="Place bid"
      >
        Bid
      </button>
    </div>
  `;
}

function setPageMeta({ title, description }) {
  document.title = `${title} | Auction House`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description || 'Discover great auctions on Auction House.');
  }
}