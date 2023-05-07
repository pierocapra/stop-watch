import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Stopwatch = (props) => {
  const [startTime, setStartTime] = useState(props.time);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedStartTime = localStorage.getItem(`stopwatch-${props.id}-startTime`);
    const storedElapsedTime = localStorage.getItem(`stopwatch-${props.id}-elapsedTime`);
    if (storedStartTime !== null) {
      setStartTime(parseInt(storedStartTime));
    }
    if (storedElapsedTime !== null) {
      setElapsedTime(parseInt(storedElapsedTime));
    }
  }, [props.id]);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsedTime);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      localStorage.setItem(`stopwatch-${props.id}-startTime`, startTime);
      localStorage.setItem(`stopwatch-${props.id}-elapsedTime`, elapsedTime);
      setIsRunning(false);
      props.handleOnPause(props.id, elapsedTime)
    }
  };

  const handleReset = () => {
    setElapsedTime(0);
    setIsRunning(false);
    localStorage.removeItem(`stopwatch-${props.id}-startTime`);
    localStorage.removeItem(`stopwatch-${props.id}-elapsedTime`);
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
    const milliseconds = date.getUTCMilliseconds().toString().padStart(2, '0').slice(-2);
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div className="stopwatch">
      <h2>{props.name}</h2>
      <div className="stopwatch-time">{formatTime(elapsedTime)}</div>
      <div className="stopwatch-controls">
        {!isRunning && <button className="button" onClick={handleStart}>Start</button>}
        {isRunning && <button className="button" onClick={handlePause}>Pause</button>}
        <button className="button" onClick={handleReset}>Reset</button>
        <button className="button remove-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

Stopwatch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  handleOnPause: PropTypes.func.isRequired,
  handleOnReset: PropTypes.func.isRequired,
  handleOnDelete: PropTypes.func.isRequired,
};

export default Stopwatch;
