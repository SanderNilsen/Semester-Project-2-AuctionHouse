export function renderItem(auction) {
  document.title = `${auction.title} | Auction House`;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", auction.description || "Discover great auctions on Auction House.");
  }

  const listingSection = document.getElementById("item");
  const imageUrl = auction.media?.[0]?.url || "images/placeholder.svg";
  const sellerName = auction.seller?.name || "Unknown Seller";
  const createdDate = new Date(auction.created).toLocaleDateString();
  const endsDate = new Date(auction.endsAt).toLocaleString();
  const description = auction.description || "No description provided.";
  const bids = (auction.bids || []).sort((a, b) => b.amount - a.amount);
  const highestBid = bids.length > 0 ? bids[0] : null;

  listingSection.innerHTML = `
    <div class="bg-tertiary p-4 rounded-lg shadow-lg">
      <img src="${imageUrl}" alt="Listing image" class="w-full h-40 object-cover rounded-lg" />
      <div class="mt-4 flex justify-between items-center">
        <div>
          <h3 class="text-primary text-lg font-bold">${auction.title}</h3>
          <p class="text-sm font-light">By: <span class="text-secondary">${sellerName}</span></p>
        </div>
        <div class="text-right">
          <p class="text-sm font-light">Created: ${createdDate}</p>
          <p class="text-sm font-light">Ends: ${endsDate}</p>
        </div>
      </div>
      <hr class="my-4 border-gray-300" />
      <p class="text-primary">${description}</p>
      <hr class="my-4 border-gray-300" />
      <div class="flex justify-between items-center">
        <div>
          <p class="text-primary">Total bids:</p>
          <p class="text-primary">Highest bid:</p>
        </div>
        <div class="text-right">
          <p class="text-primary">${bids.length}</p>
          <p class="text-primary">
            ${highestBid ? `${highestBid.bidder?.name || "Unknown"}, ${highestBid.amount} Credits` : "No bids yet"}
          </p>
        </div>
      </div>
      <hr class="my-4 border-gray-300" />
      <div>
        <h2 class="text-primary text-lg font-bold">Bid History</h2>
        <ul class="list-disc list-inside text-primary mt-2">
          ${bids.length > 0 
            ? bids.map(bid => `
              <li class="flex justify-between">
                <span>${bid.bidder?.name || "Unknown"}</span>
                <span>${bid.amount} Credits</span>
              </li>
            `).join("")
            : "<li>No bids yet</li>"
          }
        </ul>
      </div>
      <hr class="my-4 border-gray-300" />
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
    </div>
  `;
}