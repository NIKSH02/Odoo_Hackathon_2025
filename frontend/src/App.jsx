
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Authentication from './pages/Authentication'
import AddItemForm from './pages/AddItemForm'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/auth' replace />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/list' element={<AddItemForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App