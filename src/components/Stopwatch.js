import React, { useState, useEffect } from 'react';

function Stopwatch(props) {
  const [label, setLabel] = useState(props.label);
  const [elapsedTime, setElapsedTime] = useState(0);
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

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setElapsedTime(0);
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
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
      <label>
        Label: 
        <input type="text" value={label} onChange={handleLabelChange} />
      </label>
      <div className="display">{formatTime(elapsedTime)}</div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Pause</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Stopwatch;

