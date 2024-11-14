import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/registerPage'
import Home from './pages/Home'
import Profile from './pages/Profile'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard'

function App() {

  return (
    <>
      <Router>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Provider>
      </Router>
    </>
  )
}

export default App;