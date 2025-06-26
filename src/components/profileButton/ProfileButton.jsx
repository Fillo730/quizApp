//Libraries
import { useEffect, useState } from "react";

//Utils
import { isLoggedIn as checkIsLoggedIn, getUsername } from "../../utils/loginFunctions";

//i18n
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

//CSSFiles
import "./ProfileButton.css";


function ProfileButton({url}) {
  const [isVisible, setIsVisible] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  useEffect(() => {
    setIsVisible(window.location.pathname !== `/${lang}/${t("Path.Profile")}`);
    setLoggedIn(checkIsLoggedIn());
  }, []);

  function handleClick() {
    if (!loggedIn) {
      window.location.href = `/${lang}/${t("Path.Sign-up")}`;
    } else {
      window.location.href = `/${lang}/${t("Path.Profile")}`;
    }
  }

  

  return (
    <>
      {isVisible && (
        <div className="profile-button-container" onClick={handleClick}>
          <button className="btn">
            {loggedIn ? "Hello " + getUsername().toUpperCase() : "You are not logged in"}
          </button>
        </div>
      )}
    </>
  );
}

export default ProfileButton;