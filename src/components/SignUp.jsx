import { useState } from 'react';
import axios from 'axios';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup form submitted with:', { email, password, role });
    try {
      console.log('Sending POST request to http://localhost:3112/api/auth/register');
      const response = await axios.post('http://localhost:3112/api/auth/register', { email, password, role });
      console.log('Signup response:', response.data);
      console.log('Checking if token is present in response...');
      console.log('Full response data:', response.data); // Log the entire response data
      if (response.data.token) {
        console.log('Token found:', response.data.token);
        localStorage.setItem('token', response.data.token); // Store JWT in localStorage
        console.log('Token stored in localStorage:', response.data.token);
      } else {
        console.error('Token is undefined');
      }
      setError('');
      // Redirect or update UI as needed
    } catch (err) {
      console.error('Signup error:', err);
      setError('Error registering user');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <label>
          Role:
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <br />
        {error && <p>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
