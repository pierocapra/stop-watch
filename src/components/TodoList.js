import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Auth';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  return (
    <div className="todo-section">
      <h2>Todo List</h2>

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

      {isLoading && <p>Loading todos...</p>}
      {error && <p className="error-message">Error loading todos</p>}

      {todos.length === 0 && !isLoading && (
        <p className="no-todos">No tasks yet. Add one above!</p>
      )}

      {todos.length > 0 && (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="button remove-button todo-delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
