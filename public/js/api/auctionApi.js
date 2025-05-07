import { API_BASE, API_LISTINGS } from "../utils/constants.js";
import { headers } from "./headers.js";
import { getAuthToken } from "../utils/authStorage.js";

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