import { API_BASE, API_LISTINGS } from "../utils/constants.js";
import { headers } from "./headers.js";
import { getAuthToken } from "../utils/authStorage.js";

/**
 * Creates a new auction listing.
 *
 * @async
 * @function createListing
 * @param {Object} listing - The listing details.
 * @param {string} listing.title - The title of the auction listing.
 * @param {string} listing.description - The description of the auction listing.
 * @param {string} listing.media - The URL of the media image.
 * @param {string} listing.endsAt - The end date/time of the auction in ISO format.
 * @returns {Promise<Object>} The created listing data from the API.
 * @throws {Error} If the API request fails, throws an error with the message from the response or a default error message.
 */
export async function createListing({ title, description, media, endsAt }) {
  const token = getAuthToken();
  const body = { title, description, media: [{ url: media, alt: title }], endsAt };

  const response = await fetch(`${API_BASE}/auction/listings`, {
    method: "POST",
    headers: headers(token, true),
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to create listing");
  }
  return data;
}

export async function fetchAuctions() {
  const response = await fetch(`${API_BASE}${API_LISTINGS}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const { data } = await response.json();
  return data;
}

export async function updateListing(id, updatedData) {
  const token = getAuthToken();
  const body = {
    title: updatedData.title,
    description: updatedData.description,
    media: [{ url: updatedData.media, alt: updatedData.title }],
    endsAt: updatedData.endsAt,
  };

  const response = await fetch(`${API_BASE}/auction/listings/${id}`, {
    method: "PUT",
    headers: headers(token, true),
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Failed to update listing");
  }
  return data;
}

export async function deleteListing(id) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/auction/listings/${id}`, {
    method: "DELETE",
    headers: headers(token),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.errors?.[0]?.message || "Failed to delete listing");
  }
  return true;
}