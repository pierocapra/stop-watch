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
    const storedStartTime = localStorage.getItem(`stopwatch-${props.id}-startTime`);
    const storedElapsedTime = props.time
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
    localStorage.removeItem(`stopwatch-${props.id}-startTime`);
    localStorage.removeItem(`stopwatch-${props.id}-elapsedTime`);
  };

  const handleEditName = () => {
    setEditName(true);
    setTimeout(() => {
      nameRef.current.focus();
    }, 1);
  }
  const submitNewName = (event) => {
    event.preventDefault();
    setEditName(false);
    
    props.handleNewName(props.id, nameRef.current.value.toUpperCase());
  }
  const handleEditTime = () => {
    if (!isRunning) setEditTime(true);
  }

  const submitNewTime = (event) => {
    event.preventDefault();
    setEditTime(false);

    props.handleNewTime(props.id, timeRef.current.value);
  }
  
  useEffect(()=>{
    function handleClickOutside(event) {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setEditName(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        if (timeSubmitRef.current && !timeSubmitRef.current.contains(event.target)){
          setEditTime(false);
        }
      }
    }
    if (editName || editTime){
      // Add event listener on mousedown to document object
      document.addEventListener('mousedown', handleClickOutside);
    }
  }, [editName, editTime])
  
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
          props.autoSaveTime(props.id, elapsedTime + (currentTime - lastRenderTime));
          setLastRenderTime(currentTime);
        }
      }, 1000); // Check every 1 second
    }
  
    return () => {
      clearInterval(interval); // Clean up the interval on component unmount or when isRunning changes to false
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, lastRenderTime]); 

  return (
    <div className="stopwatch">
      <div className="stopwatch-info">
        <h2 onClick={handleEditName}>
          {!editName && props.name}
          {editName && <form onSubmit={submitNewName}>
              <input className="stopwatch-edit-name" type="text" placeholder={props.name} value={nameValue} onChange={handleNameChange} ref={nameRef}/>
            </form>}
        </h2>
        <p>{props.date}</p>
      </div>
      <div className="stopwatch-time" onClick={handleEditTime}>
        {!editTime && <span className={ isRunning ? "stopwatch-time-not-clickable": "stopwatch-time-clickable"}>{formatTime(elapsedTime)}</span>}
        {editTime && !isRunning&& (
            <form className="stopwatch-edit-time" onSubmit={submitNewTime}>
              <input  type="number" step="5" ref={timeRef} id="edit-time"/>
              <label htmlFor="edit-time">minutes</label>
              <button className="button"  ref={timeSubmitRef}>go</button>
            </form>
            )}
        </div>
      <div className="stopwatch-controls">
        <div className="buttons-left">
          {!isRunning && <button className="button" onClick={handleStart}>Start</button>}
          {isRunning && <button className="button pause-button" onClick={handlePause}>Pause</button>}
          <button className="button" onClick={handleReset}>Reset</button>
        </div>
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
  date: PropTypes.string,
  handleOnPause: PropTypes.func.isRequired,
  handleOnReset: PropTypes.func.isRequired,
  handleOnDelete: PropTypes.func.isRequired,
  handleNewName: PropTypes.func,
  autoSaveTime: PropTypes.func
};

export default Stopwatch;
