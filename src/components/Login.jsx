import { useState } from 'react';
import axios from 'axios';
import './Form.css'; // Import the CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted with:', { email, password });
    try {
      console.log('Sending POST request to http://localhost:3112/api/auth/login');
      const response = await axios.post('http://localhost:3112/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data.token && response.data.userId) {
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
        localStorage.setItem('userId', response.data.userId); // Store userId in localStorage
        console.log('Token stored in localStorage:', response.data.token);
        console.log('UserId stored in localStorage:', response.data.userId);
      } else {
        console.error('Token or userId is undefined');
      }
      setError('');
      // Redirect or update UI as needed
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
