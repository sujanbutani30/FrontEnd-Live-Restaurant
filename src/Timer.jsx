import React, { useState, useEffect } from "react";

const Timer = () => {
  const initialTime = 60; // Initial timer value (in seconds)
  const [timeLeft, setTimeLeft] = useState(
    () => parseInt(localStorage.getItem("timer")) || initialTime
  );

  useEffect(() => {
    // Save the timer value in localStorage on every change
    localStorage.setItem("timer", timeLeft);

    // Stop the timer if it reaches 0
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [timeLeft]);

  useEffect(() => {
    // Cleanup localStorage when the timer reaches 0
    if (timeLeft === 0) {
      localStorage.removeItem("timer");
    }
  }, [timeLeft]);

  return (
    <div>
      <h1>Time Left: {timeLeft} seconds</h1>
    </div>
  );
};

export default Timer;
