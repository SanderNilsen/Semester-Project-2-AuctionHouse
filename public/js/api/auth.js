import { authFetch } from "../utils/authFetch.js";

/**
 * Logs in a user with the provided email and password.
 *
 * @async
 * @function loginUser
 * @param {string} email - The email address of the user.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The authentication response data from the API.
 * @throws {Error} If the API request fails, throws an error with the message from the response or a default error message.
 */
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