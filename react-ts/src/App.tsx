import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Routes from './router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Link to="/">layout</Link>
      <Link to="/home">home</Link>
      <Link to="/page1">page1</Link>
      <Link to="/page2">page2</Link>
      <Routes/>
    </>
  )
}

export default App
