import { useState } from 'react'
import Nav from './Components/nav/Nav'
import reactLogo from './assets/react.svg'
import './App.css'
import Display from './Components/display/Display'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Nav />
      <Display/>
    </div>
  )
}

export default App
