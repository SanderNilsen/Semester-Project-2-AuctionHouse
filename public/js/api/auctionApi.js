import { authFetch } from "../utils/authFetch.js";
import { API_BASE, API_LISTINGS } from "../utils/constants.js";
import { getAuthToken } from "../utils/authStorage.js";

export async function createListing({ title, description, media, endsAt }) {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const body = { title, description, media: [{ url: media, alt: title }], endsAt };

  return await authFetch("/auction/listings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export async function fetchAuctions() {
  const response = await fetch(`${API_BASE}${API_LISTINGS}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const { data } = await response.json();
  return data;
}
