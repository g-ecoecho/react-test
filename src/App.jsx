import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Navbar from './components/Navbar'
import MyTasks from './components/MyTasks' // Import MyTasks component

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-tasks" element={<MyTasks />} /> {/* Add MyTasks route */}
      </Routes>
    </>
  )
}

export default App
