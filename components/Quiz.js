"use client"; // This file is a client component

import { useState, useEffect } from "react";
import quizData from "../data/quizData.json";

// Helper function: randomly shuffles an array using the Fisher–Yates algorithm.
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export default function Quiz() {
  // State variables for quiz data, progress, scores, feedback, and answer correctness.
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  // When the component mounts, shuffle the quiz data and select 20 questions.
  useEffect(() => {
    const randomQuestions = shuffle([...quizData]).slice(0, 20);
    setQuestions(randomQuestions);
  }, []);

  // Add a keydown event listener so that if the user presses "Enter" (and an answer has been chosen),
  // the quiz moves to the next question.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && feedback) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [feedback]);

  // While questions haven't loaded, display a loading message.
  if (questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  // When the quiz is completed, show the final result.
  if (currentIndex >= questions.length) {
    const win = correctCount >= 15;
    return (
      <div className="quiz-container">
        <h1>Quiz Completed!</h1>
        <p>
          Final Score - Correct: {correctCount}, Wrong: {wrongCount}
        </p>
        <h2>{win ? "You win!" : "You lose :("}</h2>
        <img
          src={win ? "/stonk.png" : "/not stonk.jpeg"}
          alt={win ? "Stonk" : "Not Stonk"}
          style={{ width: "200px", height: "auto" }}
        />
        <style jsx>{`
          .quiz-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  // Get the current question.
  const currentQuestion = questions[currentIndex];

  // Function to handle when the user selects an answer.
  const handleAnswer = (selectedTag) => {
    if (!currentQuestion) return;
    setButtonsDisabled(true); // Prevent multiple clicks.
    if (selectedTag === currentQuestion.tag) {
      setFeedback("Correct!");
      setCorrectCount((prev) => prev + 1);
      setIsAnswerCorrect(true);
    } else {
      setFeedback(`Wrong! It is ${currentQuestion.tag}.`);
      setWrongCount((prev) => prev + 1);
      setIsAnswerCorrect(false);
    }
  };

  // Function to move to the next question.
  const handleNext = () => {
    setFeedback("");
    setButtonsDisabled(false);
    setIsAnswerCorrect(null);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="quiz-container">
      <h1>Is it an AWS EC2 Instance or a US Visa?</h1>
      <br></br>
      <p>
        honestly idk why I created this web, I was just studying for my solutions architect certification while working on my visa status lmao
      </p>
      <br></br>
      <p>
        Correct: {correctCount} | Wrong: {wrongCount}
      </p>
      <div className="question">
        <h2>{currentQuestion.type}</h2>
        {/* Show the description only after an answer is chosen */}
        {feedback && <p>{currentQuestion.desc}</p>}
      </div>
      <div className="buttons">
        <button
          className="choice-button"
          onClick={() => handleAnswer("AWS")}
          disabled={buttonsDisabled}
        >
          AWS EC2
        </button>
        <button
          className="choice-button"
          onClick={() => handleAnswer("VISA")}
          disabled={buttonsDisabled}
        >
          US Visa
        </button>
      </div>
      {/* If feedback exists, show it along with the corresponding image */}
      {feedback && (
        <div className="result">
          <p className="feedback">{feedback}</p>
          <img
            src={isAnswerCorrect ? "/stonk.png" : "/not stonk.jpeg"}
            alt={isAnswerCorrect ? "Stonk" : "Not Stonk"}
            style={{ width: "150px", height: "auto" }}
          />
        </div>
      )}
      {/* The "Next" button now uses the same CSS class as the choice buttons */}
      <button
        className="choice-button next-button"
        onClick={handleNext}
        disabled={!feedback}
      >
        Next
      </button>
      <style jsx>{`
        .quiz-container {
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .buttons {
          margin: 20px 0;
        }
        /* Both choice buttons and the next button share this style */
        .choice-button {
          margin: 0 10px;
          padding: 10px 20px;
          font-size: 1em;
          cursor: pointer;
        }
        .feedback {
          font-weight: bold;
          margin: 15px 0;
        }
      `}</style>
    </div>
  );
}
