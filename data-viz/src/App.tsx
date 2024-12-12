import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './authContext/AuthContext'
import LoginPage from './pages/login/page'
import ForgetPasswordPage from './pages/login/forgetPassword'
import PasswordResetPage from './pages/login/resetPassword'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './authContext/ProtectedRoute'

import NotFound from './pages/NotFound'
import i18n from './i18n'
import './index.css';
import {  ThemeProvider as StyledThemeProvider } from 'styled-components'
import { register } from './registerServiceWorker';
import LandingPage from './pages/LandingPage'

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <StyledThemeProvider theme={{ language: i18n.language }}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgetPasswordPage />} />
                <Route path="/reset-password" element={<PasswordResetPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/:sector/:district" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/:sector/:district/:cardKey" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </StyledThemeProvider>
    </I18nextProvider>
  )
}

export default App

register();
