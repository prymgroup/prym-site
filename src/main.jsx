import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import PasswordGate from './components/PasswordGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PasswordGate>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </PasswordGate>
    </ThemeProvider>
  </StrictMode>,
)
