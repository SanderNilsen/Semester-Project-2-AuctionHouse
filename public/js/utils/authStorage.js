const KEYS = {
  TOKEN: "authToken",
  USER: "authUser",
};

export function saveAuthData(token, user) {
  localStorage.setItem(KEYS.TOKEN, token);
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function getAuthToken() {
  return localStorage.getItem(KEYS.TOKEN);
}

export function getAuthUser() {
  return JSON.parse(localStorage.getItem(KEYS.USER));
}

export function logout() {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER);
}