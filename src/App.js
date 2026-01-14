import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const API_URL = 'YOUR_API_GATEWAY_URL'; // Replace later

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.log('Backend not ready yet');
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false
    };
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    setNewTask('');
    fetchTasks();
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const updatedTask = { ...task, completed: !task.completed };
    await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Serverless To-Do</h1>
        <p>Powered by AWS Amplify + Lambda + DynamoDB</p>
      </header>

      <main className="main">
        <div className="input-section">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="task-input"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask} className="add-btn">+ Add Task</button>
        </div>

        <div className="stats">
          <span>{tasks.filter(t => !t.completed).length} remaining</span>
          <span>{tasks.filter(t => t.completed).length} completed</span>
        </div>

        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </ul>
      </main>

      <footer className="footer">
        <small>Ready for backend integration</small>
      </footer>
    </div>
  );
}

const TaskItem = ({ task, onToggle, onDelete }) => (
  <li className={`task-item ${task.completed ? 'completed' : ''}`}>
    <div className="task-content">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="task-checkbox"
      />
      <span className="task-title">{task.title}</span>
    </div>
    <button onClick={onDelete} className="delete-btn">🗑️</button>
  </li>
);

export default App;