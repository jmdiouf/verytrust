import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './i18n.js'
import { AuthProvider } from './hooks/useAuth'

const LandingPage     = lazy(() => import('./pages/LandingPage'))
const VerifyPage      = lazy(() => import('./pages/VerifyPage'))
const LoginPage       = lazy(() => import('./pages/LoginPage'))
const RegisterPage    = lazy(() => import('./pages/RegisterPage'))
const Dashboard       = lazy(() => import('./pages/Dashboard'))
const TwoFactorSetup  = lazy(() => import('./pages/TwoFactorSetup'))
const VerifyTwoFactor = lazy(() => import('./pages/VerifyTwoFactor'))
const Admin           = lazy(() => import('./pages/Admin'))
const ProfilePage     = lazy(() => import('./pages/ProfilePage'))

function PageLoader() {
  return (
    <div className="page-center">
      <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 32, height: 32 }} />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify/:id" element={<VerifyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/2fa-setup" element={<TwoFactorSetup />} />
            <Route path="/verify-2fa" element={<VerifyTwoFactor />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pro/:slug" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
