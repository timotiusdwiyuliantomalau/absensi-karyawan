// src/cookieUtils.js

// Set a cookie
export const setCookie = (key:string, value:string) => {
  localStorage.setItem(key, value);
};

// Get a cookie
export const getCookie = (key:string) => {
  return localStorage.getItem(key);
};

// Remove a cookie
export const removeCookie = (key:string) => {
  localStorage.removeItem(key);
};
