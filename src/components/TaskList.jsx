import { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css'; // Import the CSS file

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const backendUrl = 'https://react-test-n0jb.onrender.com'; // Use the provided backend URL
        console.log(`Sending GET request to ${backendUrl}/api/tasks`);
        const response = await axios.get(`${backendUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Tasks fetched:', response.data);
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Error fetching tasks');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="task-list-container">
      <h2>Task List</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
