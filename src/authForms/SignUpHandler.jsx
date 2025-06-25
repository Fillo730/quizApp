//Libraries
import { useState } from 'react';
import { User, Lock, BadgePlus, UserPlus, Loader} from 'lucide-react';

//Functions
import { checkPassword, checkUsername, checkName} from '../utils/checkPasswordUsername';

//Constants
import BACKEND_URL from '../utils/backendEndpoint';

//CSSFiles
import './AuthForm.css';

//i18n
import { getLangFromUrl, useTranslations } from '../i18n/utils';

function SignUpHandler({url}) {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();

    const usernameCheck = checkUsername(form.username);
    if(!usernameCheck.valid) {
      setError(usernameCheck.message);
      return;
    }

    const firstNameCheck = checkName(form.firstName);
    const lastNameCheck = checkName(form.lastName);
    if(!firstNameCheck.valid || !lastNameCheck.valid) {
      setError(firstNameCheck.message || lastNameCheck.message);
      return;
    }

    const passwordCheck = checkPassword(form.password);
    if(!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t("SignUp.ErrorPasswordNoMatch"));
      return;
    }

    setIsLoading(true);

    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setIsLoading(false);

    if (res.ok) {
      window.location.href = `/${lang}/${t("Path.Login")}`;
    } else {
      setError(data.error || t("SignUp.RegistrationFailed"));
    }
  };

  const goToLogin = () => {
    window.location.href = `/${lang}/${t("Path.Login")}`;
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title light-color">{t("SignUp.SignUp")}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={register} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{t("SignUp.Username")}</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">{t("SignUp.Firstname")}</label>
            <div className="input-wrapper">
              <UserPlus className="input-icon" />
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">{t("SignUp.Lastname")}</label>
            <div className="input-wrapper">
              <BadgePlus className="input-icon" />
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("SignUp.Password")}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t("SignUp.ConfirmPassword")}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? <Loader/> : t("SignUp.SignUp")}
          </button>
        </form>

        <div className="auth-actions">
          <button onClick={goToLogin} className="secondary-button">{t("SignUp.Login")}</button>
          <button onClick={goBack} className="secondary-button">{t("SignUp.GoBack")}</button>
        </div>
      </div>
    </div>
  );
}

export default SignUpHandler;