import React, { useState , useEffect, useCallback} from 'react';
import Stopwatch from './components/Stopwatch';
import AddStopWatch from './components/AddStopWatch';
import './App.css';

function App() {
  const [stopwatches, setStopwatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  // const handleAddStopwatch = () => {
  //   const newStopwatch = {
  //     id: Date.now(),
  //     name: `Stopwatch ${stopwatches.length + 1}`,
  //     time: 0,
  //   };
  //   setStopwatches([...stopwatches, newStopwatch]);
  // };

  const addStopWatchHandler = async (stopwatch) =>{
      const response = await fetch('https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch.json',{
        method:'POST',
        body: JSON.stringify(stopwatch),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
  }

  const fetchStopWatchHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      console.log(data);
      const loadedStopWatches = [];

      for (const key in data) {
        loadedStopWatches.push({
          id:key,
          name: data[key].name,
          color: data[key].color
        })
      }

      setStopwatches(loadedStopWatches);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStopWatchHandler();
  }, [fetchStopWatchHandler]);

  const handleRemoveStopwatch = (id) => {
    const filteredStopwatches = stopwatches.filter((stopwatch) => stopwatch.id !== id);
    setStopwatches(filteredStopwatches);
  };

  const handleResetStopwatch = (id) => {
    const updatedStopwatches = stopwatches.map((stopwatch) => {
      if (stopwatch.id === id) {
        return { ...stopwatch, time: 0 };
      }
      return stopwatch;
    });
    setStopwatches(updatedStopwatches);
  };

  const handleUpdateStopwatch = (id, time) => {
    const updatedStopwatches = stopwatches.map((stopwatch) => {
      if (stopwatch.id === id) {
        return { ...stopwatch, time };
      }
      return stopwatch;
    });
    setStopwatches(updatedStopwatches);
  };

  return (
    <div className="app">
      <h1>Multiple Stopwatches</h1>
      <div className="stopwatch-list">
        {stopwatches.map((stopwatch) => (
          <div className="stopwatch-container" key={stopwatch.id} style={{border: `2px solid ${stopwatch.color}`}}>
            <Stopwatch
              id={stopwatch.id}
              name={stopwatch.name}
              time={stopwatch.time}
              color={stopwatch.color}
              onReset={handleResetStopwatch}
              onUpdate={handleUpdateStopwatch}
              onRemove={handleRemoveStopwatch}
            />
          </div>
        ))}
      </div>
      <AddStopWatch onAddStopWatch={addStopWatchHandler}/>
      {/* <button onClick={handleAddStopwatch}>Add Stopwatch</button> */}
    </div>
  );
}

export default App;
