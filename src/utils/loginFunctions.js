//Functions to control the login status of the user
// and to get the username from the token

//Libraries
import { jwtDecode } from "jwt-decode";

//i18n
import { getLangFromUrl, useTranslations } from '../i18n/utils';

function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.username;
    } catch (error) {
        console.error("Token non valido:", error);
        return null;
    }
}

function isLoggedIn() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    const isValid = decoded.exp && decoded.exp > now;
    return isValid;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

function handleLogout(url) {
    const lang = getLangFromUrl(url);
    const t = useTranslations(lang);
    localStorage.removeItem('token');
    window.location.href = `/${lang}/${t("Path.Home")}`;
}

export { getUsername, isLoggedIn, handleLogout };