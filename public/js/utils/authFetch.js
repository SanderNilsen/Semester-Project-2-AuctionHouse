import { API_BASE } from "./constants.js";
import { headers } from "../api/headers.js";
import { getAuthToken } from "./authStorage.js";

export async function authFetch(url, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: headers(token, options.body !== undefined),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "API request failed");
  }

  return data;
}