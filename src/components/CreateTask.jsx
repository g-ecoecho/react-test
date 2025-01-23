import { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Import the CSS file

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
      const userIds = [userId]; // Convert userId to an array
      console.log(`Sending POST request to ${import.meta.env.VITE_API_BASE_URL}/api/tasks with:`, { title, description, userIds });
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, 
        { title, description, userIds, status: 'to pend' }, // Ensure status is 'to pend'
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
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Create Task</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter task description"></textarea>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="form-button">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;
