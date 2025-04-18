const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export function saveAuthData(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

