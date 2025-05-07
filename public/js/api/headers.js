import { API_KEY } from "../utils/constants.js";

export function headers(token, hasBody = false) {
  const headers = new Headers();

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  if (hasBody) {
    headers.append("Content-Type", "application/json");
  }

  return headers;
}