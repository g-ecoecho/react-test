import { useState, useEffect } from 'react';
import axios from 'axios';

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          return;
        }
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

  const halfIndex = Math.ceil(tasks.length / 2);
  const firstHalfTasks = tasks.slice(0, halfIndex);
  const secondHalfTasks = tasks.slice(halfIndex);

  return (
    <div>
      <h1>My Tasks</h1>
      {error && <p>{error}</p>}
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '20px' }}>
          <h2>First Half</h2>
          <ul>
            {firstHalfTasks.map((task) => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Second Half</h2>
          <ul>
            {secondHalfTasks.map((task) => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyTasks;
