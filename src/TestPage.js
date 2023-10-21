import React, { useState } from 'react';

// Components
import Stopwatch from './components/Stopwatch';
import AddStopWatch from './components/AddStopWatch';
import DeleteAllModal from './components/DeleteAllModal';

import './App.css';

const createUniqueId = () => {
  return Math.random().toString();
}

function TestPage() {
  const [stopwatches, setStopwatches] = useState([{
    "id": createUniqueId(),
    "name": "STOPWATCH",
    "color": "#008E97",
    "time": 0,
    "date": "Today"
  }]);

  const [addStopwatch, setAddStopwatch] = useState(false) 
  const [deleteAllAlert, setDeleteAllAlert] = useState(false)

  const addStopWatchHandler = async (stopwatch) =>{
    stopwatch = {
      id: createUniqueId(),
      ...stopwatch,
    }

    stopwatches.push(stopwatch)
    setAddStopwatch(false);
  }

  const handleOnPause = async (id, newTime) => {
  }

  const handleOnReset = async (id) => {
   
  }

  const handleOnDelete = async (id) => {
    setStopwatches(stopwatches.filter(stopwatch => {
      return stopwatch.id !==id
    }))
  }

  const handleNewName = async (id, newName) => {
    const updatedStopwatches = stopwatches.map(stopwatch => {
      if (stopwatch.id === id) {
        return {
          ...stopwatch,
          name: newName,
        };
      }
      return stopwatch;
    });
  
    setStopwatches(updatedStopwatches);
  }

  const handleNewTime = async (id, amountToAdd) => {
    const amountInMs = amountToAdd * 60000; 
    const existingTime = Number(localStorage.getItem(`stopwatch-${id}-elapsedTime`));
    const updatedTime = existingTime + amountInMs;

    const updatedStopwatches = stopwatches.map(stopwatch => {
      if (stopwatch.id === id) {
        return {
          ...stopwatch,
          time: updatedTime,
        };
      }
      return stopwatch;
    })
    setStopwatches(updatedStopwatches);
    localStorage.setItem(`stopwatch-${id}-elapsedTime`, updatedTime)
  }

  const handleAddStopwatchModal = () => {
    setAddStopwatch(true);
  }

  const closeModal = () => {
    setAddStopwatch(false);
    setDeleteAllAlert(false);
  }

  const handleDeleteAll = () => {
    setDeleteAllAlert(true)
  }
  
  const deleteAll = async () => {
    //clear LocalStorage
    stopwatches.forEach(stopwatch => {
      localStorage.removeItem(`stopwatch-${stopwatch.id}-startTime`);
      localStorage.removeItem(`stopwatch-${stopwatch.id}-elapsedTime`);
    })

    setStopwatches([]);
    setDeleteAllAlert(false);
  }

  const autoSaveTime = async (id, newTime) => {}

  return (
    <div className="container">
      {stopwatches.length === 0 && <p>Create your first Stopwatch!</p>}
      {stopwatches.length >= 1 &&
        <div className="stopwatch-list">
          {stopwatches.map((stopwatch) => (
            <div className="stopwatch-container" key={stopwatch.id} style={{border: `2px solid ${stopwatch.color}`}}>
              <Stopwatch
                id={stopwatch.id}
                name={stopwatch.name}
                date={stopwatch.date}
                time={stopwatch.time}
                color={stopwatch.color}
                handleOnPause={handleOnPause}
                handleOnReset={handleOnReset}
                handleOnDelete={handleOnDelete}
                handleNewName={handleNewName}
                handleNewTime={handleNewTime}
                autoSaveTime={autoSaveTime}
              />
            </div>
          ))}
        </div>
      }
      <button className="button" onClick={handleAddStopwatchModal}>Add StopWatch</button>
      {addStopwatch && <AddStopWatch onAddStopWatch={addStopWatchHandler} closeModal={closeModal}/>}
      <button className="button delete-all-button" onClick={handleDeleteAll}>Delete All</button> 
      {deleteAllAlert && <DeleteAllModal deleteAll={deleteAll} closeModal={closeModal}/>}
    </div>
  );
}

export default TestPage;
