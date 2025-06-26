//Libraries
import { useState } from 'react';
import { User, Lock, Loader} from 'lucide-react';

//Constants
import {BACKEND_URL} from '../utils/backendEndpoint';

//CSSFiles
import './AuthForm.css';

//i18n
import { getLangFromUrl, useTranslations } from '../i18n/utils';

function LoginHandler({url}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  const login = async (e) => {
    e.preventDefault();

    if(username.trim() === '' || password.trim() === '') {
      setError('Username and password cannot be empty');
      return; 
    }

    setIsLoading(true);
    console.log(username);
    console.log(password);
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    setIsLoading(false);

    if (res.ok) {
      window.location.href = `/${lang}/${t("Path.Home")}`;
      localStorage.setItem('token', data.token);
    } else {
      setError(data.error || 'Error while trying to login');
    }
  };

  const goToRegister = () => {
    window.location.href = `/${lang}/${t("Path.Sign-up")}`;
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title light-color">{t("Login.Title")}</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={login} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">{t("Login.Username")}</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("Login.Password")}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? <Loader/> : t("Login.LoginButton")}
          </button>
        </form>

        <div className="auth-actions">
          <button onClick={goToRegister} className="secondary-button">{t("Login.GoSignUpText")}</button>
          <button onClick={goBack} className="secondary-button">{t("Login.GoBack")}</button>
        </div>
      </div>
    </div>
  );
}

export default LoginHandler;