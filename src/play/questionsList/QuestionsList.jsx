import React, { useEffect, useState } from 'react';
import { CustomButton } from '../../components/ComponentsDepencencies';
import { useTranslations, getLangFromUrl } from '../../i18n/utils';
import './QuestionsList.css';

function QuestionsList({ url, questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  const currentQuestion = questions[currentIndex] || {};
  const allAnswers = currentQuestion.incorrectAnswers
    ? [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer]
    : [];

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
    setSelectedAnswer(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (history[currentIndex]) {
      setSelectedAnswer(history[currentIndex].selectedAnswer);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentIndex]);

  if (currentIndex >= questions.length) {
    const correctCount = history.filter(
      ({ selectedAnswer, correctAnswer }) => selectedAnswer === correctAnswer
    ).length;

    return (
      <div className='display-vertical'>
        <h1 className="title light-color">{t("Play.SummaryTitle")}</h1>
        <h1 className='medium-title light-color'>{correctCount}/{history.length}</h1>
        <ul className='summary-list'>
          {history.map(({ question, selectedAnswer, correctAnswer }, i) => (
            <li key={i} className="summary-item">
              <p><strong>{i + 1}. {question}</strong></p>
              <p className={selectedAnswer === correctAnswer ? 'correct' : 'incorrect'}>
                {t("Play.YourAnswerLabel")}: {selectedAnswer}
              </p>
              {selectedAnswer !== correctAnswer && (
                <p className="correct-answer">
                  {t("Play.CorrectAnswerLabel")}: {correctAnswer}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1 className="medium-title light-color">
        {currentIndex + 1}° {t("Play.QuestionsIndexLabel")}: {currentQuestion.question}
      </h1>
      <ul className="answers-list">
        {allAnswers.map((answer, index) => (
          <li
            key={index}
            className={`answer-item ${(selectedAnswer === answer) ? 'selected' : ''}`}
            onClick={() => handleAnswerClick(answer)}
          >
            {answer}
          </li>
        ))}
      </ul>
      <div className='display-horizontal'>
        <CustomButton
          text={t("Play.BackButtonText")}
          handleClick={handleBack}
          disabled={currentIndex === 0}
        />
        <CustomButton
          text={t("Play.NextQuestionButtonText")}
          handleClick={handleNext}
          disabled={selectedAnswer === null}
        />
      </div>
    </div>
  );
}

export default QuestionsList;