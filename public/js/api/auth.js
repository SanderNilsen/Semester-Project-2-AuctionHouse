import { authFetch } from "../utils/authFetch.js";

export async function loginUser(email, password) {
  return authFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name, email, password) {
  return authFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}