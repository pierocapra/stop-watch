import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Stopwatch = (props) => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(props.time);
  const [isRunning, setIsRunning] = useState(false);
  const [editName, setEditName] = useState(false);
  const nameRef = useRef('');
  const [editTime, setEditTime] = useState(false);
  const timeRef = useRef('');
  const timeSubmitRef = useRef('');
  const [nameValue, setNameValue] = useState(props.name);

  useEffect(() => {
    const storedStartTime = localStorage.getItem(
      `stopwatch-${props.id}-startTime`
    );
    const storedElapsedTime = props.time;
    if (storedStartTime !== null) {
      setStartTime(parseInt(storedStartTime));
    }
    if (storedElapsedTime !== null) {
      setElapsedTime(parseInt(storedElapsedTime));
    }
  }, [props.id, props.time]);

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
      if (props.isDayStopwatch) {
        props.handleOnPause(elapsedTime);
      } else {
        props.handleOnPause(props.id, elapsedTime);
      }
    }
  };

  const handleReset = () => {
    setElapsedTime(0);
    setIsRunning(false);
    localStorage.removeItem(`stopwatch-${props.id}-startTime`);
    localStorage.removeItem(`stopwatch-${props.id}-elapsedTime`);
    if (props.isDayStopwatch) {
      props.handleOnReset();
    } else {
      props.handleOnReset(props.id);
    }
  };

  const handleDelete = () => {
    props.handleOnDelete(props.id);
    localStorage.removeItem(`stopwatch-${props.id}-startTime`);
    localStorage.removeItem(`stopwatch-${props.id}-elapsedTime`);
  };

  const handleEditName = () => {
    setEditName(true);
    setTimeout(() => {
      nameRef.current.focus();
    }, 1);
  };
  const submitNewName = (event) => {
    event.preventDefault();
    setEditName(false);

    if (props.isDayStopwatch) {
      props.handleNewName(nameRef.current.value.toUpperCase());
    } else {
      props.handleNewName(props.id, nameRef.current.value.toUpperCase());
    }
  };
  const handleEditTime = () => {
    if (!isRunning) setEditTime(true);
  };

  const submitNewTime = (event) => {
    event.preventDefault();
    setEditTime(false);

    if (props.isDayStopwatch) {
      props.handleNewTime(timeRef.current.value);
    } else {
      props.handleNewTime(props.id, timeRef.current.value);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setEditName(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        if (
          timeSubmitRef.current &&
          !timeSubmitRef.current.contains(event.target)
        ) {
          setEditTime(false);
        }
      }
    }
    if (editName || editTime) {
      // Add event listener on mousedown to document object
      document.addEventListener('mousedown', handleClickOutside);
    }
  }, [editName, editTime]);

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };

  // Autosave time every 30 sec
  const [lastRenderTime, setLastRenderTime] = useState(Date.now());

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastRenderTime >= 30000) {
          // Call your function here
          if (props.isDayStopwatch) {
            props.autoSaveTime(elapsedTime + (currentTime - lastRenderTime));
          } else {
            props.autoSaveTime(
              props.id,
              elapsedTime + (currentTime - lastRenderTime)
            );
          }
          setLastRenderTime(currentTime);
        }
      }, 1000); // Check every 1 second
    }

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount or when isRunning changes to false
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, lastRenderTime]);

  // Calculate progress for day stopwatch
  const getProgressData = () => {
    const maxTime = 7.5 * 60 * 60 * 1000; // 7.5 hours in ms
    const percentage = Math.min((elapsedTime / maxTime) * 100, 100);
    const overTime = elapsedTime > maxTime;

    let progressClass = 'normal';
    if (overTime) {
      progressClass = 'overtime';
    }

    // Calculate overtime data
    const overtimeTime = overTime ? elapsedTime - maxTime : 0;
    const maxOvertimeDisplay = 2 * 60 * 60 * 1000; // Show up to 2 hours of overtime
    const overtimePercentage = overTime
      ? Math.min((overtimeTime / maxOvertimeDisplay) * 100, 100)
      : 0;

    const hours = Math.floor(elapsedTime / (60 * 60 * 1000));
    const minutes = Math.floor((elapsedTime % (60 * 60 * 1000)) / (60 * 1000));

    let progressText;
    if (overTime) {
      const overtimeHours = Math.floor(overtimeTime / (60 * 60 * 1000));
      const overtimeMinutes = Math.floor(
        (overtimeTime % (60 * 60 * 1000)) / (60 * 1000)
      );
      progressText = `${hours}h ${minutes}m / 7h 30m (+${overtimeHours}h ${overtimeMinutes}m)`;
    } else {
      progressText = `${hours}h ${minutes}m / 7h 30m`;
    }

    return {
      percentage: overTime ? 100 : percentage,
      progressClass,
      progressText,
      hasOvertime: overTime,
      overtimePercentage,
    };
  };

  if (props.isDayStopwatch) {
    const progressData = getProgressData();

    return (
      <div className="stopwatch">
        <div className="day-stopwatch-timer-row">
          <div className="stopwatch-time" onClick={handleEditTime}>
            {!editTime && (
              <span
                className={
                  isRunning
                    ? 'stopwatch-time-not-clickable'
                    : 'stopwatch-time-clickable'
                }
              >
                {formatTime(elapsedTime)}
              </span>
            )}
            {editTime && !isRunning && (
              <form className="stopwatch-edit-time" onSubmit={submitNewTime}>
                <input type="number" step="5" ref={timeRef} id="edit-time" />
                <label htmlFor="edit-time">minutes</label>
                <button className="button" ref={timeSubmitRef}>
                  go
                </button>
              </form>
            )}
          </div>
          <div className="stopwatch-controls">
            <div className="buttons-left">
              {!isRunning && (
                <button className="button" onClick={handleStart}>
                  Start
                </button>
              )}
              {isRunning && (
                <button className="button pause-button" onClick={handlePause}>
                  Pause
                </button>
              )}
              <button className="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
        <div
          className={`day-progress-bar ${
            progressData.hasOvertime ? 'has-overtime' : ''
          }`}
        >
          <div
            className={`day-progress-fill ${progressData.progressClass}`}
            style={{ width: `${progressData.percentage}%` }}
          />
        </div>
        <div
          className={`day-overtime-bar ${
            progressData.hasOvertime ? 'show' : ''
          }`}
        >
          <div
            className="day-overtime-fill"
            style={{ width: `${progressData.overtimePercentage}%` }}
          />
        </div>
        <div className="day-progress-bottom">
          <div className="day-progress-title" onClick={handleEditName}>
            {!editName && props.name}
            {editName && (
              <form onSubmit={submitNewName}>
                <input
                  className="stopwatch-edit-name"
                  type="text"
                  placeholder={props.name}
                  value={nameValue}
                  onChange={handleNameChange}
                  ref={nameRef}
                />
              </form>
            )}
          </div>
          <div className="day-progress-text">{progressData.progressText}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stopwatch">
      <div className="stopwatch-info">
        <h2 onClick={handleEditName}>
          {!editName && props.name}
          {editName && (
            <form onSubmit={submitNewName}>
              <input
                className="stopwatch-edit-name"
                type="text"
                placeholder={props.name}
                value={nameValue}
                onChange={handleNameChange}
                ref={nameRef}
              />
            </form>
          )}
        </h2>
        <p>{props.date}</p>
      </div>
      <div className="stopwatch-time" onClick={handleEditTime}>
        {!editTime && (
          <span
            className={
              isRunning
                ? 'stopwatch-time-not-clickable'
                : 'stopwatch-time-clickable'
            }
          >
            {formatTime(elapsedTime)}
          </span>
        )}
        {editTime && !isRunning && (
          <form className="stopwatch-edit-time" onSubmit={submitNewTime}>
            <input type="number" step="5" ref={timeRef} id="edit-time" />
            <label htmlFor="edit-time">minutes</label>
            <button className="button" ref={timeSubmitRef}>
              go
            </button>
          </form>
        )}
      </div>
      <div className="stopwatch-controls">
        <div className="buttons-left">
          {!isRunning && (
            <button className="button" onClick={handleStart}>
              Start
            </button>
          )}
          {isRunning && (
            <button className="button pause-button" onClick={handlePause}>
              Pause
            </button>
          )}
          <button className="button" onClick={handleReset}>
            Reset
          </button>
        </div>
        {!props.isDayStopwatch && (
          <button className="button remove-button" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

Stopwatch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  date: PropTypes.string,
  handleOnPause: PropTypes.func.isRequired,
  handleOnReset: PropTypes.func.isRequired,
  handleOnDelete: PropTypes.func.isRequired,
  handleNewName: PropTypes.func,
  autoSaveTime: PropTypes.func,
  isDayStopwatch: PropTypes.bool,
};

export default Stopwatch;
