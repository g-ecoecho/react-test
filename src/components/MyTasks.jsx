import { useState, useEffect } from 'react';
import axios from 'axios';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3112/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Error fetching tasks');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>My Tasks</h1>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyTasks;
