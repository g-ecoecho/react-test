import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <ul>
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
          <Link to="/my-tasks">My Tasks</Link> {/* Add link to My Tasks */}
        </li>
        <li>
          <Link to="/create-task">Create Task</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
