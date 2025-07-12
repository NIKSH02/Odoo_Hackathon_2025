
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Authentication from './pages/Authentication'
import AddItemForm from './pages/AddItemForm'
import ReWearUserDashboard from './pages/RewearUserDashboard'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/auth' replace />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/list' element={<AddItemForm />} />
          <Route path='/UserDashboard' element={<ReWearUserDashboard />} /> 
        </Routes>
      </Router>
    </>
  )
}

export default App