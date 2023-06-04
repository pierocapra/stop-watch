import React, { useState , useEffect, useCallback} from 'react';
import { useAuth } from './Auth';

// Components
import Stopwatch from './components/Stopwatch';
import AddStopWatch from './components/AddStopWatch';

import './App.css';

function Main() {
  const [stopwatches, setStopwatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addStopwatch, setAddStopwatch] = useState(false) 

  const {currentUser}  = useAuth()

  console.log(currentUser.uid);
  
  const fetchStopWatchHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}.json`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedStopWatches = [];

      for (const key in data) {
        loadedStopWatches.push({
          id:key,
          name: data[key].name,
          color: data[key].color,
          time: data[key].time,
          date: data[key].date
        })
      }

      setStopwatches(loadedStopWatches);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [currentUser.uid]);

  useEffect(() => {
    fetchStopWatchHandler();
  }, [fetchStopWatchHandler]);

  const addStopWatchHandler = async (stopwatch) =>{
    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}.json`,{
        method:'POST',
        body: JSON.stringify(stopwatch),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      
    } catch (error) {
      setError(error.message);
    }
    fetchStopWatchHandler();
    setAddStopwatch(false)
  }

  const handleOnPause = async (id, newTime) => {
    // Update data on pause
    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/${id}.json`,{
        method:'PATCH',
        body: JSON.stringify({ time: newTime }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

    } catch (error) {
      setError(error.message);
    }
  }

  const handleOnReset = async (id) => {
    // Zero time on reset
    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/${id}.json`,{
        method:'PATCH',
        body: JSON.stringify({ time: 0 }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

    } catch (error) {
      setError(error.message);
    }
  }

  const handleOnDelete = async (id) => {
    // Delete timer on reset
    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/${id}.json`,{
        method:'DELETE'
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

    } catch (error) {
      setError(error.message);
    }
    fetchStopWatchHandler();
  }

  const handleNewName = async (id, newName) => {
    // Change Name
    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/${id}.json`,{
        method:'PATCH',
        body: JSON.stringify({ name: newName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

    } catch (error) {
      setError(error.message);
    }
    fetchStopWatchHandler();
  }

  const handleNewTime = async (id, amountToAdd) => {
    // Add or subtract minutes from current in steps of 5
    const amountInMs = amountToAdd * 60000;

    try {
      const response = await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/${id}.json`)
      
      const data = await response.json();
      const existingTime = data.time;
      const updatedTime = existingTime + amountInMs;
      
      await fetch(`https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/${id}.json`,{
        method:'PATCH',
        body: JSON.stringify({ time: updatedTime }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      setError(error.message);
    }
    fetchStopWatchHandler();
  }


  const handleAddStopwatchModal = () => {
    setAddStopwatch(true);
  }

  const closeModal = () => {
    setAddStopwatch(false);
  }

  return (
    <div className="container">
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>Something got wrong</p>}
      {!isLoading && stopwatches.length === 0 && <p>Create your first Stopwatch!</p>}
      {!isLoading && stopwatches.length >= 1 &&
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
              />
            </div>
          ))}
        </div>
      }
      <button className="button" onClick={handleAddStopwatchModal}>Add StopWatch</button>
      {addStopwatch && <AddStopWatch onAddStopWatch={addStopWatchHandler} closeModal={closeModal}/>}<br/>
    </div>
  );
}

export default Main;
