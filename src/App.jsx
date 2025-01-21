import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Navbar from './components/Navbar'
import MyTasks from './components/MyTasks'
import CreateTask from './components/CreateTask' // Import CreateTask component

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/create-task" element={<CreateTask />} /> {/* Add CreateTask route */}
      </Routes>
    </>
  )
}

export default App
