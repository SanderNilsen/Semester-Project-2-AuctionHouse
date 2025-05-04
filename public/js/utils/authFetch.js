import { API_BASE, API_KEY } from "./constants.js";

export async function authFetch(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "API request failed");
  }

  return data;
}