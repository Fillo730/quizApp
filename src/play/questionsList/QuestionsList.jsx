// Libraries
import { useEffect, useState } from 'react';
import _ from 'lodash';

// Components
import { CustomButton } from '../../components/ComponentsDepencencies';

// i18n
import { useTranslations, getLangFromUrl } from '../../i18n/utils';

// Constants
import { BACKEND_URL } from '../../utils/backendEndpoint';

//utils
import { isLoggedIn } from '../../utils/loginFunctions';

// CSS Files
import './QuestionsList.css';

function QuestionsList({ url, questions, category }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswersCounter, setCorrectAnswersCounter] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  const currentQuestion = questions[currentIndex] || {};

  useEffect(() => {
    const shuffleQuestions = () => {
      const array = [];
      questions.forEach((question) => {
        const allAnswers = [...question.incorrectAnswers, question.correctAnswer];
        array.push(_.shuffle(allAnswers));
      });
      return array;
    };

    setShuffledQuestions(shuffleQuestions());
  }, [questions]);

  useEffect(() => {
    if (history[currentIndex]) {
      setSelectedAnswer(history[currentIndex].selectedAnswer);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentIndex, history]);

  useEffect(() => {
    if (!quizFinished) return;
    if(!isLoggedIn) return;

    const saveData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/save`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: category.backendsync,
            questionsNumber: history.length,
            correctQuestions: correctAnswersCounter,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save stats');
        }
      } catch (error) {
        console.error('Error saving stats:', error);
      }
    };

    saveData();
  }, [quizFinished, history.length, correctAnswersCounter, category.backendsync]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    setHistory((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
      },
    ]);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswersCounter((prev) => prev + 1);
    }

    setSelectedAnswer(null);

    if (currentIndex + 1 >= questions.length) {
      setQuizFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleGoBackPlaySection = () => {
    window.location.href = `/${lang}/${t("Path.Play")}`;
  }

  if (quizFinished) {
    return (
      <div className="display-vertical">
        <h1 className="title light-color">{t('Play.SummaryTitle')}</h1>
        <h1 className="medium-title light-color">
          {correctAnswersCounter}/{history.length}
        </h1>
        <ul className="summary-list">
          {history.map(({ question, selectedAnswer, correctAnswer }, i) => (
            <li key={i} className="summary-item">
              <p>
                <strong>
                  {i + 1}. {question}
                </strong>
              </p>
              <p className={selectedAnswer === correctAnswer ? 'correct' : 'incorrect'}>
                {t('Play.YourAnswerLabel')}: {selectedAnswer}
              </p>
              {selectedAnswer !== correctAnswer && (
                <p className="correct-answer">
                  {t('Play.CorrectAnswerLabel')}: {correctAnswer}
                </p>
              )}
            </li>
          ))}
        </ul>
        <div className='display-horizontal'>
          <CustomButton
            text={t('Play.GoToPlaySectionButtonText')}
            handleClick={handleGoBackPlaySection}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="medium-title light-color">
        {currentIndex + 1}° {t('Play.QuestionsIndexLabel')}: {currentQuestion.question}
      </h1>
      <ul className="answers-list">
        {shuffledQuestions[currentIndex]?.map((answer, index) => (
          <li
            key={index}
            className={`answer-item ${selectedAnswer === answer ? 'selected' : ''}`}
            onClick={() => handleAnswerClick(answer)}
          >
            {answer}
          </li>
        ))}
      </ul>
      <div className="display-horizontal">
        <CustomButton
          text={t('Play.BackButtonText')}
          handleClick={handleBack}
          disabled={currentIndex === 0}
        />
        <CustomButton
          text={(currentIndex+1 >= questions.length) ? t("Play.CompleteQuizText") : t('Play.NextQuestionButtonText')}
          handleClick={handleNext}
          disabled={selectedAnswer === null}
        />
      </div>
    </div>
  );
}

export default QuestionsList;