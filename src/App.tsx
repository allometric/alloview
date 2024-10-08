import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Models from './pages/Models'
import Publications from './pages/Publications'
import {Navbar} from './components/Navbar'


const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Models />}/>
        <Route path="/" element={<Publications />}/>
      </Routes>
    </Router>
  )
}

export default App
