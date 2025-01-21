import { useState } from 'react';
import axios from 'axios';

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('CreateTask form submitted with:', { title, description });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        console.log('No token found in localStorage');
        return;
      }
      const userId = localStorage.getItem('userId');
      console.log('Retrieved userId from localStorage:', userId);
      if (!userId) {
        setError('No user ID found. Please log in.');
        console.log('No userId found in localStorage');
        return;
      }
      console.log('Sending POST request to http://localhost:3112/api/tasks with:', { title, description, userId });
      const response = await axios.post('http://localhost:3112/api/tasks', 
        { title, description, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Task creation response:', response.data);
      setSuccess('Task created successfully!');
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Error creating task');
    }
  };

  return (
    <div>
      <h1>Create Task</h1>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;
