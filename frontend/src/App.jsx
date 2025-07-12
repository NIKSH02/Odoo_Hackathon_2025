
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Authentication from './pages/Authentication'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to='/auth' replace />} />
          <Route path='/auth' element={<Authentication />} />
        </Routes>
      </Router>
    </>
  )
}

export default App