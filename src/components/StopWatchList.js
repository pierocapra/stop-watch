import React from 'react';
import Stopwatch from './Stopwatch';

function StopwatchList({ stopwatches, onReset, onUpdate, onRemove }) {
  return (
    <div className="stopwatch-list">
      {stopwatches.map((stopwatch) => (
        <div className="stopwatch-container" key={stopwatch.id}>
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
