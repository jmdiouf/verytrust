import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './i18n.js'
import { AuthProvider } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import VerifyPage from './pages/VerifyPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import TwoFactorSetup from './pages/TwoFactorSetup'
import VerifyTwoFactor from './pages/VerifyTwoFactor'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify/:id" element={<VerifyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/2fa-setup" element={<TwoFactorSetup />} />
          <Route path="/verify-2fa" element={<VerifyTwoFactor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
