import React from 'react';
import Stopwatch from './Stopwatch';

function StopwatchList({ stopwatches, onReset, onUpdate, onRemove }) {
  const colors = ["#205E78", "#203278", "#3A2078", "#662078","#78205E", "#782032"]

  const randomIndex = Math.floor(Math.random() * array.length);
  let randomColour = colors[randomIndex];

  return (
    <div className="stopwatch-list">
      {stopwatches.map((stopwatch) => (
        <div className="stopwatch-container" key={stopwatch.id} style={{backgroundColor: randomColour}}>
          <Stopwatch
            id={stopwatch.id}
            name={stopwatch.name}
            time={stopwatch.time}
            onReset={onReset}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  );
}

export default StopwatchList;
