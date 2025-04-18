import { API_BASE, API_LISTINGS } from "../utils/constants.js";

export async function fetchAuctions() {
  const response = await fetch(`${API_BASE}${API_LISTINGS}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const { data } = await response.json();
  return data;
}
