import React, { useState } from 'react';
import Stopwatch from './components/Stopwatch';
import './App.css';

function App() {
  const [stopwatches, setStopwatches] = useState([{ id: 1, name: 'Stopwatch 1', time: 0 }]);

  const handleAddStopwatch = () => {
    const newStopwatch = {
      id: Date.now(),
      name: `Stopwatch ${stopwatches.length + 1}`,
      time: 0,
    };
    setStopwatches([...stopwatches, newStopwatch]);
  };

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
          <div className="stopwatch-container" key={stopwatch.id}>
            <Stopwatch
              id={stopwatch.id}
              name={stopwatch.name}
              time={stopwatch.time}
              onReset={handleResetStopwatch}
              onUpdate={handleUpdateStopwatch}
              onRemove={handleRemoveStopwatch}
            />
          </div>
        ))}
      </div>
      <button onClick={handleAddStopwatch}>Add Stopwatch</button>
    </div>
  );
}

export default App;
