import './App.css'
import { AuthCard } from '@/components/AuthCard'
import Dashboard from './components/Dashboard'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'

function AppContent() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className='flex h-screen flex-col items-center justify-center' >
          <AuthCard onLoginSuccess={handleLoginSuccess} />
        </div>
      } />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
