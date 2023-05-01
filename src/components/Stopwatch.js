import React, { useState, useEffect } from 'react';

function Stopwatch(props) {
  const [elapsedTime, setElapsedTime] = useState(props.time);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 10);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    props.handleOnPause(props.id, elapsedTime)
  };

  const handleReset = () => {
    setElapsedTime(0);
    props.handleOnReset(props.id)
  };

  const handleDelete = () => {
    props.handleOnDelete(props.id)
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="stopwatch">
      <h2>{props.name}</h2>
      <div className="time">{formatTime(elapsedTime)}</div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button>
      <button className="remove-button" onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Stopwatch;