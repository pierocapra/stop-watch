import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './Auth';

// Components
import Stopwatch from './components/Stopwatch';
import AddStopWatch from './components/AddStopWatch';
import DeleteAllModal from './components/DeleteAllModal';
import Header from './components/Header';
import TodoList from './components/TodoList';

import './App.css';

function Main() {
  const [stopwatches, setStopwatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addStopwatch, setAddStopwatch] = useState(false);
  const [deleteAllAlert, setDeleteAllAlert] = useState(false);

  const { currentUser } = useAuth();

  const fetchStopWatchHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch.json`
      );
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedStopWatches = []; // Create a new array for each fetch

      for (const key in data) {
        loadedStopWatches.push({
          id: key,
          name: data[key].name,
          color: data[key].color,
          time: data[key].time,
          date: data[key].date,
        });
      }

      setStopwatches(loadedStopWatches);
      console.log(loadedStopWatches);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [currentUser.uid]);

  useEffect(() => {
    fetchStopWatchHandler();
  }, [fetchStopWatchHandler]);

  const addStopWatchHandler = async (stopwatch) => {
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch.json`,
        {
          method: 'POST',
          body: JSON.stringify(stopwatch),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      setError(error.message);
    }
    fetchStopWatchHandler();
    setAddStopwatch(false);
  };

  const handleOnPause = async (id, newTime) => {
    // Update data on pause
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ time: newTime }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOnReset = async (id) => {
    // Zero time on reset
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ time: 0 }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOnDelete = async (id) => {
    // Delete timer on reset
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      } else {
        setStopwatches(
          stopwatches.filter((stopwatch) => {
            return stopwatch.id !== id;
          })
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewName = async (id, newName) => {
    // Change Name
    // Reset content of current array
    // Upload result to db
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ name: newName }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      } else {
        const updatedStopwatches = stopwatches.map((stopwatch) => {
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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewTime = async (id, amountToAdd) => {
    // Add or subtract minutes from current in steps of 5
    const amountInMs = amountToAdd * 60000;

    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`
      );

      const data = await response.json();
      const existingTime = data.time;
      const updatedTime = existingTime + amountInMs;

      // Upload result to db
      await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ time: updatedTime }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      } else {
        // Reset content of current array
        const updatedStopwatches = stopwatches.map((stopwatch) => {
          if (stopwatch.id === id) {
            return {
              ...stopwatch,
              time: updatedTime,
            };
          }
          return stopwatch;
        });
        setStopwatches(updatedStopwatches);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddStopwatchModal = () => {
    setAddStopwatch(true);
  };

  const closeModal = () => {
    setAddStopwatch(false);
    setDeleteAllAlert(false);
  };

  // Auto save time
  const autoSaveTime = async (id, newTime) => {
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ time: newTime }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAll = () => {
    setDeleteAllAlert(true);
  };

  const deleteAll = async () => {
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/stopwatch.json`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      //clear LocalStorage
      stopwatches.forEach((stopwatch) => {
        localStorage.removeItem(`stopwatch-${stopwatch.id}-startTime`);
        localStorage.removeItem(`stopwatch-${stopwatch.id}-elapsedTime`);
      });

      setStopwatches([]);
      setDeleteAllAlert(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="container">
        <div
          className={`messages-area ${
            isLoading || error || stopwatches.length === 0 ? 'has-messages' : ''
          }`}
        >
          {isLoading && <p>Loading...</p>}
          {!isLoading && error && <p>Something got wrong</p>}
          {!isLoading && stopwatches.length === 0 && (
            <p>Create your first Stopwatch!</p>
          )}
        </div>
        <div className="stopwatch-section">
          {!isLoading && stopwatches.length >= 1 && (
            <div className="stopwatch-list">
              {stopwatches.map((stopwatch) => (
                <div
                  className="stopwatch-container"
                  key={stopwatch.id}
                  style={{ border: `2px solid ${stopwatch.color}` }}
                >
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
          )}

          <div className="stopwatch-buttons">
            <button className="button" onClick={handleAddStopwatchModal}>
              Add StopWatch
            </button>
            {stopwatches.length >= 1 && (
              <button
                className="button delete-all-button"
                onClick={handleDeleteAll}
              >
                Delete All
              </button>
            )}
          </div>
        </div>

        {addStopwatch && (
          <AddStopWatch
            onAddStopWatch={addStopWatchHandler}
            closeModal={closeModal}
          />
        )}
        {deleteAllAlert && (
          <DeleteAllModal deleteAll={deleteAll} closeModal={closeModal} />
        )}

        <TodoList />
      </div>
    </div>
  );
}

export default Main;
