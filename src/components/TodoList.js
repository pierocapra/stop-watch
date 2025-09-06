import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Auth';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [notesPopupTodo, setNotesPopupTodo] = useState(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const { currentUser } = useAuth();

  // Fetch todos from Firebase
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/todos.json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const loadedTodos = [];

      // Handle case where data is null (no todos yet)
      if (data) {
        for (const key in data) {
          loadedTodos.push({
            id: key,
            text: data[key].text,
            completed: data[key].completed,
            createdAt: data[key].createdAt,
            notes: data[key].notes || '',
          });
        }
      }

      setTodos(
        loadedTodos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [currentUser.uid]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    const todo = {
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/todos.json`,
        {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setNewTodo('');
      setIsAddFormExpanded(false);
      fetchTodos();
    } catch (error) {
      setError(error.message);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, currentCompleted) => {
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/todos/${id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ completed: !currentCompleted }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !currentCompleted } : todo
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/todos/${id}.json`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  // Drag and Drop handlers
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

  const saveEdit = async () => {
    if (!editingText.trim() || !editingTodo) return;

    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/todos/${editingTodo}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ text: editingText.trim() }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo ? { ...todo, text: editingText.trim() } : todo
        )
      );
      cancelEditing();
    } catch (error) {
      setError(error.message);
    }
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

  const saveNotes = async () => {
    if (!notesPopupTodo) return;

    try {
      const response = await fetch(
        `https://stopwatch-7c6c4-default-rtdb.europe-west1.firebasedatabase.app/stopwatch/${currentUser.uid}/todos/${notesPopupTodo.id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ notes: currentNotes }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setTodos(
        todos.map((todo) =>
          todo.id === notesPopupTodo.id
            ? { ...todo, notes: currentNotes }
            : todo
        )
      );
      closeNotesPopup();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="todo-section">
      <div className="todo-header">
        <h2>Todo List</h2>
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

      {isLoading && <p>Loading todos...</p>}
      {error && <p className="error-message">Error loading todos</p>}

      {todos.length === 0 && !isLoading && (
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
}

export default TodoList;
