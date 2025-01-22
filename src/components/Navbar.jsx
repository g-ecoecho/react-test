import { Link } from 'react-router-dom'
import './Navbar.css' // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/my-tasks">My Tasks</Link>
        </li>
        <li>
          <Link to="/create-task">Create Task</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
