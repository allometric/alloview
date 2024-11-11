import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Models from './pages/Models'
import Publications from './pages/Publications'
import ModelDetails from './pages/ModelDetails'
import {Navbar} from './components/Navbar'
import { useEffect } from 'react'


const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if(redirect) navigate(redirect, {replace: true})
  }, [navigate])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Models />}/>
        <Route path="/" element={<Publications />}/>
        <Route path="/model/:id" element={<ModelDetails />}/>
      </Routes>
    </>
  )
}

export default App
