import React, { useState, useEffect } from 'react';

// Components
import Stopwatch from './components/Stopwatch';
import AddStopWatch from './components/AddStopWatch';
import DeleteAllModal from './components/DeleteAllModal';
import Header from './components/Header';

import './App.css';

// Test TodoList Component (localStorage version)
const TestTodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [notesPopupTodo, setNotesPopupTodo] = useState(null);
  const [currentNotes, setCurrentNotes] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('test-todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('test-todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    const todo = {
      id: Math.random().toString(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
      notes: '',
    };

    setTodos((prevTodos) => [todo, ...prevTodos]);
    setNewTodo('');
    setIsAddFormExpanded(false);
  };

  // Toggle todo completion
  const toggleTodo = (id, currentCompleted) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !currentCompleted } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Drag and Drop handlers (same as original)
  const handleDragStart = (e, todo) => {
    setDraggedItem(todo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, todoId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(todoId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e, dropTodo) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === dropTodo.id) {
      setDraggedItem(null);
      setDraggedOver(null);
      return;
    }

    const draggedIndex = todos.findIndex((todo) => todo.id === draggedItem.id);
    const droppedIndex = todos.findIndex((todo) => todo.id === dropTodo.id);

    const newTodos = [...todos];
    const draggedTodo = newTodos.splice(draggedIndex, 1)[0];
    newTodos.splice(droppedIndex, 0, draggedTodo);

    setTodos(newTodos);
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOver(null);
  };

  // Edit handlers
  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditingText(todo.text);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditingText('');
  };

  const saveEdit = () => {
    if (!editingText.trim() || !editingTodo) return;

    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo ? { ...todo, text: editingText.trim() } : todo
      )
    );
    cancelEditing();
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Notes functionality
  const openNotesPopup = (todo) => {
    setNotesPopupTodo(todo);
    setCurrentNotes(todo.notes || '');
  };

  const closeNotesPopup = () => {
    setNotesPopupTodo(null);
    setCurrentNotes('');
  };

  const saveNotes = () => {
    if (!notesPopupTodo) return;

    setTodos(
      todos.map((todo) =>
        todo.id === notesPopupTodo.id ? { ...todo, notes: currentNotes } : todo
      )
    );
    closeNotesPopup();
  };

  return (
    <div className="todo-section">
      <div className="todo-header">
        <h2>Todo List (Test Mode)</h2>
        <button
          onClick={() => setIsAddFormExpanded(!isAddFormExpanded)}
          className="button todo-toggle-button"
          title={
            isAddFormExpanded ? 'Hide add task form' : 'Show add task form'
          }
        >
          {isAddFormExpanded ? '−' : '+'}
        </button>
      </div>

      {isAddFormExpanded && (
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="button todo-add-button">
            Add Task
          </button>
        </form>
      )}

      {todos.length === 0 && (
        <p className="no-todos">
          No tasks yet.{' '}
          {isAddFormExpanded ? 'Add one above!' : 'Click + to add one!'}
        </p>
      )}

      {todos.length > 0 && (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${
                draggedItem?.id === todo.id ? 'dragging' : ''
              } ${draggedOver === todo.id ? 'drag-over' : ''}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, todo)}
              onDragOver={(e) => handleDragOver(e, todo.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, todo)}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle" title="Drag to reorder">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="todo-checkbox"
                />
                {editingTodo === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleEditKeyPress}
                    className="todo-edit-input"
                    autoFocus
                  />
                ) : (
                  <span
                    className="todo-text"
                    onDoubleClick={() => startEditing(todo)}
                    title="Double-click to edit"
                  >
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => openNotesPopup(todo)}
                  className="button todo-notes-button"
                  title={`${todo.notes ? 'Edit notes' : 'Add notes'}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  {todo.notes && <span className="notes-indicator">●</span>}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="button remove-button todo-delete-button"
                  title="Delete task"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2 0,0 1-2,2H7a2,2 0,0 1-2-2V6m3,0V4a2,2 0,0 1,2-2h4a2,2 0,0 1,2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Notes Popup Modal */}
      {notesPopupTodo && (
        <div className="notes-modal-overlay" onClick={closeNotesPopup}>
          <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h3>Notes for: "{notesPopupTodo.text}"</h3>
              <button
                onClick={closeNotesPopup}
                className="notes-close-button"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="notes-modal-body">
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="notes-textarea"
                rows="12"
                autoFocus
              />
            </div>
            <div className="notes-modal-footer">
              <button
                onClick={closeNotesPopup}
                className="button notes-cancel-button"
              >
                Cancel
              </button>
              <button onClick={saveNotes} className="button notes-save-button">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const createUniqueId = () => {
  return Math.random().toString();
};

function TestPage() {
  const [stopwatches, setStopwatches] = useState([]);
  const [dayStopwatch, setDayStopwatch] = useState(null);
  const [addStopwatch, setAddStopwatch] = useState(false);
  const [deleteAllAlert, setDeleteAllAlert] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load regular stopwatches
    const storedStopwatches = localStorage.getItem('test-stopwatches');
    if (storedStopwatches) {
      setStopwatches(JSON.parse(storedStopwatches));
    } else {
      // Default stopwatch for test
      const defaultStopwatch = {
        id: createUniqueId(),
        name: 'STOPWATCH',
        color: '#008E97',
        time: 0,
        date: 'Today',
      };
      setStopwatches([defaultStopwatch]);
      localStorage.setItem(
        'test-stopwatches',
        JSON.stringify([defaultStopwatch])
      );
    }

    // Load day stopwatch
    const storedDayStopwatch = localStorage.getItem('test-day-stopwatch');
    if (storedDayStopwatch) {
      setDayStopwatch(JSON.parse(storedDayStopwatch));
    } else {
      // Create default day stopwatch
      const defaultDayStopwatch = {
        name: 'Day Tracker (Test)',
        color: '#2a6a87',
        time: 0,
      };
      setDayStopwatch(defaultDayStopwatch);
      localStorage.setItem(
        'test-day-stopwatch',
        JSON.stringify(defaultDayStopwatch)
      );
    }
  }, []);

  // Save stopwatches to localStorage whenever they change
  useEffect(() => {
    if (stopwatches.length > 0) {
      localStorage.setItem('test-stopwatches', JSON.stringify(stopwatches));
    }
  }, [stopwatches]);

  // Save day stopwatch to localStorage whenever it changes
  useEffect(() => {
    if (dayStopwatch) {
      localStorage.setItem('test-day-stopwatch', JSON.stringify(dayStopwatch));
    }
  }, [dayStopwatch]);

  const addStopWatchHandler = async (stopwatch) => {
    stopwatch = {
      id: createUniqueId(),
      ...stopwatch,
    };

    const newStopwatches = [...stopwatches, stopwatch];
    setStopwatches(newStopwatches);
    setAddStopwatch(false);
  };

  const handleOnPause = async (id, newTime) => {
    // Update the stopwatch time in localStorage
    localStorage.setItem(`stopwatch-${id}-elapsedTime`, newTime);
  };

  const handleOnReset = async (id) => {
    // Clear localStorage and reset time to 0
    localStorage.removeItem(`stopwatch-${id}-startTime`);
    localStorage.removeItem(`stopwatch-${id}-elapsedTime`);

    const updatedStopwatches = stopwatches.map((stopwatch) => {
      if (stopwatch.id === id) {
        return { ...stopwatch, time: 0 };
      }
      return stopwatch;
    });
    setStopwatches(updatedStopwatches);
  };

  const handleOnDelete = async (id) => {
    // Clear localStorage for this stopwatch
    localStorage.removeItem(`stopwatch-${id}-startTime`);
    localStorage.removeItem(`stopwatch-${id}-elapsedTime`);

    setStopwatches(stopwatches.filter((stopwatch) => stopwatch.id !== id));
  };

  const handleNewName = async (id, newName) => {
    const updatedStopwatches = stopwatches.map((stopwatch) => {
      if (stopwatch.id === id) {
        return { ...stopwatch, name: newName };
      }
      return stopwatch;
    });
    setStopwatches(updatedStopwatches);
  };

  const handleNewTime = async (id, amountToAdd) => {
    const amountInMs = amountToAdd * 60000;
    const existingTime =
      Number(localStorage.getItem(`stopwatch-${id}-elapsedTime`)) || 0;
    const updatedTime = existingTime + amountInMs;

    const updatedStopwatches = stopwatches.map((stopwatch) => {
      if (stopwatch.id === id) {
        return { ...stopwatch, time: updatedTime };
      }
      return stopwatch;
    });
    setStopwatches(updatedStopwatches);
    localStorage.setItem(`stopwatch-${id}-elapsedTime`, updatedTime);
  };

  // Day stopwatch handlers
  const handleDayOnPause = async (newTime) => {
    setDayStopwatch((prev) => ({ ...prev, time: newTime }));
    localStorage.setItem('day-stopwatch-elapsedTime', newTime);
  };

  const handleDayOnReset = async () => {
    localStorage.removeItem('day-stopwatch-startTime');
    localStorage.removeItem('day-stopwatch-elapsedTime');
    setDayStopwatch((prev) => ({ ...prev, time: 0 }));
  };

  const handleDayNewName = async (newName) => {
    setDayStopwatch((prev) => ({ ...prev, name: newName }));
  };

  const handleDayNewTime = async (amountToAdd) => {
    const amountInMs = amountToAdd * 60000;
    const existingTime =
      Number(localStorage.getItem('day-stopwatch-elapsedTime')) || 0;
    const updatedTime = existingTime + amountInMs;

    setDayStopwatch((prev) => ({ ...prev, time: updatedTime }));
    localStorage.setItem('day-stopwatch-elapsedTime', updatedTime);
  };

  const autoDaySaveTime = async (newTime) => {
    localStorage.setItem('day-stopwatch-elapsedTime', newTime);
  };

  const handleAddStopwatchModal = () => {
    setAddStopwatch(true);
  };

  const closeModal = () => {
    setAddStopwatch(false);
    setDeleteAllAlert(false);
  };

  const handleDeleteAll = () => {
    setDeleteAllAlert(true);
  };

  const deleteAll = async () => {
    // Clear localStorage
    stopwatches.forEach((stopwatch) => {
      localStorage.removeItem(`stopwatch-${stopwatch.id}-startTime`);
      localStorage.removeItem(`stopwatch-${stopwatch.id}-elapsedTime`);
    });

    setStopwatches([]);
    localStorage.removeItem('test-stopwatches');
    setDeleteAllAlert(false);
  };

  const autoSaveTime = async (id, newTime) => {
    localStorage.setItem(`stopwatch-${id}-elapsedTime`, newTime);
  };

  return (
    <div className="app">
      <Header isTestPage />

      {/* Day Stopwatch Section */}
      <div className="day-stopwatch-section">
        {dayStopwatch ? (
          <div className="day-stopwatch-container">
            <Stopwatch
              id="day-stopwatch"
              name={dayStopwatch.name}
              time={dayStopwatch.time}
              color={dayStopwatch.color}
              handleOnPause={handleDayOnPause}
              handleOnReset={handleDayOnReset}
              handleOnDelete={() => {}} // No delete for day stopwatch
              handleNewName={handleDayNewName}
              handleNewTime={handleDayNewTime}
              autoSaveTime={autoDaySaveTime}
              isDayStopwatch={true}
            />
          </div>
        ) : (
          <div className="day-stopwatch-container">
            <p style={{ color: 'white', textAlign: 'center' }}>
              Loading day tracker...
            </p>
          </div>
        )}
      </div>

      <div className="container">
        <div
          className={`messages-area ${
            stopwatches.length === 0 ? 'has-messages' : ''
          }`}
        >
          {stopwatches.length === 0 && <p>Create your first Stopwatch!</p>}
        </div>

        <div className="stopwatch-section">
          {stopwatches.length >= 1 && (
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

        <div className="todo-section-with-buttons">
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
          <TestTodoList />
        </div>
      </div>
    </div>
  );
}

export default TestPage;
