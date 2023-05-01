import React, { useRef, useState } from 'react';

import classes from './AddStopWatch.css';

function AddStopWatch(props) {

  // Pick random color for the border  
  const colors = ["#205E78", "#203278", "#3A2078", "#662078","#78205E", "#782032", "#7CB9E8", "#00308F", "#72A0C1", "#89CFF0", "#0066b2", "#4B9CD3", "#318CE7", "#5072A7", "#6699CC", "#5F9EA0", "#2a52be", "#6495ED", "#0E3386", "#008E97", "#1877F2", "#15f4ee", "#0071c5", "#5A4FCF", "#545AA7", "#4D4DFF"]

  const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * colors.length));
  let randomColor = colors[randomIndex];

  const nameRef = useRef('');

  function submitHandler(event) {
    event.preventDefault();
    
    setRandomIndex(Math.floor(Math.random() * colors.length))
    randomColor = colors[randomIndex];

    // could add validation here...

    const stopwatch = {
      name: nameRef.current.value,
      color: randomColor,
      time: 0
    };

    props.onAddStopWatch(stopwatch);
  }

  return (
    <form onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='name'>Name</label>
        <input type='text' id='name' ref={nameRef} />
      </div>
      <button>Add Stopwatch</button>
    </form>
  );
}

export default AddStopWatch;