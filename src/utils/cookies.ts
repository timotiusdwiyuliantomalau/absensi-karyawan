// src/cookieUtils.js
import Cookies from "js-cookie";

// Set a cookie
export const setCookie = (key:string, value:string) => {
  Cookies.set(key, value, { expires: 30 });
};

// Get a cookie
export const getCookie = (key:string) => {
  return Cookies.get(key);
};

// Remove a cookie
export const removeCookie = (key:string) => {
  Cookies.remove(key);
};
