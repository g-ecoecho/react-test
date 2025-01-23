import { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Import the CSS file

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup form submitted with:', { email, password, role });
    try {
      const backendUrl = 'https://react-test-n0jb.onrender.com'; // Use the provided backend URL
      console.log(`Sending POST request to ${backendUrl}/api/auth/register`);
      const response = await axios.post(`${backendUrl}/api/auth/register`, { email, password, role });
      console.log('Signup response:', response.data);
      if (response.data.token && response.data.userId) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
        localStorage.setItem('userId', response.data.userId); // Store userId in localStorage
      } else {
        console.error('Token or userId is undefined');
      }
      setError('');
      // Redirect or update UI as needed
    } catch (err) {
      console.error('Signup error:', err);
      setError('Error registering user');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Enter your role" />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="form-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
