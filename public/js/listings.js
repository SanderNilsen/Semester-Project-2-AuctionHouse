document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://v2.api.noroff.dev/auction/listings?_seller=true";
  const auctionList = document.getElementById("auction-list");

  async function fetchAuctions() {
      try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          displayAuctions(data.data);
      } catch (error) {
          console.error("Error fetching auctions:", error);
          auctionList.innerHTML = `<p class="text-red-500">Failed to load auctions.</p>`;
      }
  }

  function displayAuctions(auctions) {
    auctionList.innerHTML = auctions
        .map((auction) => {
            const imageUrl =
                auction.media.length > 0 && auction.media[0].url
                    ? auction.media[0].url
                    : "images/placeholder.svg";
              
              const sellerName = auction.seller?.name || "Unknown Seller";        
              const sellerAvatar =
                auction.seller?.avatar?.url && auction.seller.avatar.url !== ""
                    ? auction.seller.avatar.url
                    : "images/avatar-placeholder.png";
              const listingDescription = auction.description || "No description available";   

            return `
          <div  class="bg-tertiary p-4 rounded-lg shadow-lg">
              <div class="relative">
                <img
                  src="${imageUrl}"
                  alt="Listing image"
                  class="w-full h-40 object-cover rounded-lg"
                />
                <div class="absolute top-2 left-2 bg-secondary/50 text-white px-2 py-1 rounded">
                  Bids: ${auction._count?.bids || 0}                
                </div>
                <div
                  class="absolute bottom-2 left-2 bg-secondary/50 text-white px-2 py-1 rounded">
                Ends: ${new Date(auction.endsAt).toLocaleDateString()}
                </div>
              </div>
              <h3 class="text-primary uppercase truncate text-lg font-bold mt-2">${auction.title}</h3>
              <p class="text-sm font-light">Created: ${auction.created}</p>
                <div class="flex items-center mt-3">
                    <img src="${sellerAvatar}" alt="${sellerName}" class="w-8 h-8 rounded-full mr-2">
                      <p class="text-sm font-light">${sellerName}</p>
                 </div>
              <p class="text-primary truncate mt-2">
                ${listingDescription}
              </p>
              <button
                class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary cursor-pointer mt-2 w-full">
                View Details
              </button>
            </div>
      `
  })
          .join("");
  }

  fetchAuctions();
});