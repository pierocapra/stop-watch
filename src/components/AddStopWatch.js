import React, { useRef, useState } from 'react';

function AddStopWatch(props) {

  // Pick random color for the border  
  const colors = ["#205E78", "#203278", "#3A2078", "#662078","#78205E", "#782032", "#7CB9E8", "#00308F", "#72A0C1", "#89CFF0", "#0066b2", "#4B9CD3", "#318CE7", "#5072A7", "#6699CC", "#5F9EA0", "#2a52be", "#6495ED", "#0E3386", "#008E97", "#1877F2", "#15f4ee", "#0071c5", "#5A4FCF", "#545AA7", "#4D4DFF"]

  const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * colors.length));
  let randomColor = colors[randomIndex];

  const nameRef = useRef('');

  const date = () => {
    const currentDate = new Date();
    const options = {year: "2-digit", month: 'numeric', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-UK', options);
    return formattedDate;
  }

  function submitHandler(event) {
    event.preventDefault();
    
    // Randomize border color
    setRandomIndex(Math.floor(Math.random() * colors.length))
    randomColor = colors[randomIndex];

    // could add validation here...

    const stopwatch = {
      name: nameRef.current.value.toUpperCase(),
      color: randomColor,
      time: 0,
      date: date()
    };

    // Run function from to props to submit the object
    props.onAddStopWatch(stopwatch);

    // Reset the form input values
    event.target.reset();
  }

  return (
    <div className="modal">
        <div className="modal-overlay" onClick={props.closeModal}></div>
        <div className="modal-container add-stopwatch">
          <button className="add-stopwatch__close" onClick={props.closeModal}>X</button>
          <form onSubmit={submitHandler}>
            <div className="control">
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' ref={nameRef} required/>
            </div>
            <button className="button control-button">Add Stopwatch</button>
            <p><strong>Note: </strong>Your stopwatches will stop when submit</p>
          </form>
        </div>
    </div>
  );
}

export default AddStopWatch;