//Libraries
import { useState } from 'react';
import axios from 'axios';

//Components
import QuestionsList from '../questionsList/QuestionsList';
import { CustomButton } from '../../components/ComponentsDepencencies';
import { getTranslatedCategories } from '../../CategoriesImages/Categories';

//Contants
import { SERVER_IMAGES_URL } from '../../utils/backendEndpoint';

//Utils
import { isLoggedIn } from '../../utils/loginFunctions';

//i18n
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

//CSSFiles
import './HandlePlayPage.css';

function HandlePlayPage({ url }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [numberQuestions, setNumberQuestions] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [isPlay, setIsPlay] = useState(false);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  const categories = getTranslatedCategories(t);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const selected = categories.find(cat => cat.fileNameBackEnd === value);
      setSelectedCategory(selected);
    } else if (name === 'inputNumber') {
      setNumberQuestions(value);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SERVER_IMAGES_URL}api/questions`, {
        params: {
          lang,
          categoryFileName: selectedCategory.fileNameBackEnd,
          numberQuestions
        }
      });
      setIsPlay(true);
      setQuestions(response.data);
    } catch (error) {
      console.error("Errore durante il fetch delle domande:", error);
    }
  };

  const handleClickButton = () => {
    if (selectedCategory && numberQuestions) {
      fetchData();
    }
  };

  return (
    <>
      {!isPlay &&
        <div className="display-vertical">
          <div className="custom-max-width">
            <h1 className="title light-color">
              {t("Play.HowToPlayTitle")}
            </h1>
            <p className="text">
              {t("Play.HowToPlayText")}
            </p>
            {!isLoggedIn() && <p className='text warning-color'>{t("Play.NotLoggedInWarningText")}</p>}
          </div>

          <div className="custom-max-width display-horizontal margin-top margin-bottom">
            <div>
              <h2 className="medium-title light-color">{t("Play.SelectCategoryTitle")}</h2>
              <p className="text">
                {t("Play.SelectCategoryText")}
              </p>
              <select className="category-select margin-top" name='category' onChange={handleChange}>
                <option value="">{t("Play.SelectCategoryOption")}</option>
                {
                  categories.map((category, index) => (
                    <option key={index} value={category.fileNameBackEnd}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <div>
              <h2 className="medium-title light-color">{t("Play.SelectNumberOfQuestionsTitle")}</h2>
              <p className="text">
                {t("Play.SelectNumberOfQuestionsText")}
              </p>
              <input
                name='inputNumber'
                type="number"
                className="selectNumberOfQuestions-input"
                min="1"
                max="50"
                value={numberQuestions}
                onChange={handleChange}
              />
            </div>

            <CustomButton handleClick={handleClickButton} text={t("Play.PlayButtonText")} />
          </div>
        </div>
      }

      {isPlay &&
        <QuestionsList
          url={url}
          questions={questions}
          category={selectedCategory}
        />
      }
    </>
  );
}

export default HandlePlayPage;