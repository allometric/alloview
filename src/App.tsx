import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Models from './pages/Models'
import Publications from './pages/Publications'
import ModelDetails from './pages/ModelDetails'
import {Navbar} from './components/Navbar'


const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Models />}/>
        <Route path="/" element={<Publications />}/>
        <Route path="/model/:id" element={<ModelDetails />}/>
      </Routes>
    </Router>
  )
}

export default App
