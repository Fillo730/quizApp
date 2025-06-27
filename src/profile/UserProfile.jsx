// Libraries
import { useEffect, useState } from "react";

// Components
import { Modal, CustomButton, ProfileCategoryCard } from "../components/ComponentsDepencencies";

// Utils
import { getUsername, handleLogout } from "../utils/loginFunctions";
import { checkUsername, checkName } from "../utils/checkPasswordUsername";

// Constants
import {BACKEND_URL} from "../utils/backendEndpoint";
import { getTranslatedCategories } from "../CategoriesImages/Categories";

// i18n
import { getLangFromUrl, useTranslations } from '../i18n/utils';

function UserProfile({ url }) {
  const username = getUsername();
  const [userInformation, setUserInformation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: ""
  });
  const [error, setError] = useState(null);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);
  const categories = getTranslatedCategories(t);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setUserInformation(data);
        setFormData({
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  function handleEditProfile() {
    setFormData({
      username: userInformation.username,
      firstname: userInformation.firstname,
      lastname: userInformation.lastname,
    });
    setIsModalOpen(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setError(null);
  }

  async function handleSaveProfile() {
    const usernameCheck = checkUsername(formData.username);
    if (!usernameCheck.valid) {
      setError(usernameCheck.message);
      return;
    }

    const nameCheck = checkName(formData.firstname, formData.lastname);
    if (!nameCheck.valid) {
      setError(nameCheck.message);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      const updatedUser = await response.json();
      setUserInformation(updatedUser);
      setIsModalOpen(false);
      setError(null);
      localStorage.setItem("token", updatedUser.token);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="display-vertical">
      <div className="display-center-vertical-nogap">
        <h1 className="title light-color">{t("Profile.Greeting", { username: username.toUpperCase() })}</h1>
        <div className="normal-max-width">
          <p className="text custom-max-width">
            {t("Profile.Description")}
          </p>
        </div>
      </div>

      {userInformation ? (
        <div className="normal-max-width display-vertical">
          <p className="text custom-max-width">
            <label className="big-text light-color">{t("Profile.Username")} </label> {userInformation.username}<br />
            <label className="big-text light-color">{t("Profile.FirstName")} </label> {userInformation.firstname}<br />
            <label className="big-text light-color">{t("Profile.LastName")} </label> {userInformation.lastname}<br />
            <CustomButton text={t("Profile.EditProfile")} handleClick={handleEditProfile} />
          </p>

          <h1 className="medium-title light-color">{t("Profile.GamesPlayedTitle")}</h1>
          <div className="difficulty-container">
            {categories.map((category, index) => {
              const stats = userInformation.categories[category.backendsync];
              return (
                <ProfileCategoryCard
                  key={index}
                  frontTitle={category.name}
                  frontText={t("Profile.TotalQuestions", { total: stats.totalQuestions })}
                  backTitle={t("Profile.BackTitle")}
                  backText={`
                    ${t("Profile.CorrectAnswers", {
                      correct: stats.totalQuestions === 0 ? 0 : stats.correctAnswers
                    })}<br/>
                    ${t("Profile.WrongAnswers", {
                      wrong: stats.totalQuestions === 0
                        ? 0
                        : stats.totalQuestions - stats.correctAnswers
                    })}<br/>
                    ${t("Profile.Ratio", {
                      number: stats.totalQuestions === 0
                        ? 0
                        : ((stats.correctAnswers / stats.totalQuestions )*100).toFixed(2)
                    })}
                  `}
                />
              );
            })}
          </div>

          <CustomButton text={t("Profile.Logout")} handleClick={() => handleLogout(url)} />

          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <h2 className="medium-title light-color">{t("Profile.ModalTitle")}</h2>
            <p className="text custom-max-width margin-bottom">
              {t("Profile.ModalDescription")}
            </p>

            <div className="form-modal margin-bottom">
              <label className="big-text light-color label-width">{t("Profile.ModalUsername")}</label>
              <input
                type="text"
                name="username"
                className="input-field"
                value={formData.username}
                onChange={handleInputChange}
              /><br />
            </div>

            <div className="form-modal margin-bottom">
              <label className="big-text light-color label-width">{t("Profile.ModalFirstName")}</label>
              <input
                type="text"
                name="firstname"
                className="input-field"
                value={formData.firstname}
                onChange={handleInputChange}
              /><br />
            </div>

            <div className="form-modal margin-bottom">
              <label className="big-text light-color label-width">{t("Profile.ModalLastName")}</label>
              <input
                type="text"
                name="lastname"
                className="input-field"
                value={formData.lastname}
                onChange={handleInputChange}
              /><br />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="display-horizontal margin-top">
              <CustomButton text={t("Profile.ModalSave")} handleClick={handleSaveProfile} />
              <CustomButton text={t("Profile.ModalCancel")} handleClick={handleCloseModal} />
            </div>
          </Modal>
        </div>
      ) : (
        <div className="normal-max-width">{t("Profile.Loading")}</div>
      )}
    </div>
  );
}

export default UserProfile;