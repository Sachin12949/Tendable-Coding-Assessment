import React, { useState } from "react";
import { QUESTIONS } from "./questions";
import "./App.css"; 
const App = () => {
  const [responses, setResponses] = useState({});
  const [roundScores, setRoundScores] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResponse = (questionNumber, response) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionNumber]: response === "Yes",
    }));
  };

  const calculateScore = () => {
    const numQuestions = Object.keys(QUESTIONS).length;
    const numYesAnswers = Object.values(responses).filter(Boolean).length;
    return (numYesAnswers / numQuestions) * 100;
  };
const calculateTotalScore = () => {
  if (roundScores.length === 0) return 0;
  const totalScore = roundScores.reduce((total, score) => total + score, 0);
  return (totalScore / roundScores.length).toFixed(2);
};

const handleRetry = () => {
  window.location.reload();
};


  const handleCalculate = () => {
    if (Object.keys(responses).length !== Object.keys(QUESTIONS).length) {
      setErrorMessage("Please answer all questions before calculating.");
      return;
    }
    const score = calculateScore();
    setCurrentScore(score.toFixed(2));
    setRoundScores((prevRoundScores) => [...prevRoundScores, parseFloat(score)]);
    setErrorMessage("");
    setResponses({});
  };

  const handleFinalSubmit = () => {
    if (Object.keys(responses).length !== Object.keys(QUESTIONS).length) {
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }
    
    const score = calculateScore();
    if (!isNaN(score)) {
      setRoundScores((prevRoundScores) => [...prevRoundScores, parseFloat(score)]);
      setRoundCount((prevRoundCount) => prevRoundCount + 1);
      setCurrentScore(0);
      setResponses({});
      setErrorMessage("");
    } else {
      setErrorMessage("Error calculating score. Please try again.");
    }
  };
  

  
  return (
    <div className="container">
      <h1 className="title">Questionnaire</h1>
      <div className="score-box">
        {roundScores.map((score, index) => (
          <p key={index} className="score">Round {index + 1}: {score.toFixed(2)}%</p>
        ))}
      </div>
      {Object.entries(QUESTIONS).map(([questionNumber, question]) => (
        <div key={questionNumber} className="question-container">
          <p className="question">{question}</p>
          <div className="button-container">
            <button
              className={responses[questionNumber] === true ? "selected" : ""}
              onClick={() => handleResponse(questionNumber, "Yes")}
            >
              Yes
            </button>
            <button
              className={responses[questionNumber] === false ? "selected" : ""}
              onClick={() => handleResponse(questionNumber, "No")}
            >
              No
            </button>
          </div>
        </div>
      ))}{errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="action-buttons">
        <button onClick={handleRetry}>Retry</button>
        <button onClick={handleCalculate}>Calculate</button>
        <button onClick={handleFinalSubmit}>Final Submit</button>
      </div>
      
      {currentScore !== 0 && <p className="score">Current Score: {currentScore}%</p>}
      {roundCount > 0 && <p className="score-card">Total Score all rounds: {calculateTotalScore()}%</p>}
    </div>
  );
};

export default App;
