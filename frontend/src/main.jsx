import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import api from './services/api'

console.log('API_BASE_URL', api.defaults.baseURL)
console.log('PROD', import.meta.env.PROD)
console.log('VITE_API_URL', import.meta.env.VITE_API_URL)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
