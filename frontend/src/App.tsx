import { useState, useEffect } from 'react'
import './App.css'
import PoliciesModal from './components/PoliciesModal'
import Settings from './components/Settings'
import ExploitsTracker from './components/ExploitsTracker'

type Tab = 'exploits' | 'lupin' | 'test' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('exploits')
  const [showPoliciesModal, setShowPoliciesModal] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="app">
      <div className="ethical-banner">
        <button
          className="banner-link"
          type="button"
          onClick={() => setShowPoliciesModal(true)}
        >
          ETHICAL USE • TERMS • DISCLOSURE POLICY
        </button>
      </div>

      <div className="header">
        <div className="header-content">
          <svg className="logo" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B9D" />
                <stop offset="25%" stopColor="#C44569" />
                <stop offset="50%" stopColor="#A06CD5" />
                <stop offset="75%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#4834DF" />
              </linearGradient>
            </defs>
            <path className="hood-outline"
              d="M 24 8
                 C 22.8 8.1, 21.5 8.3, 20.3 8.9
                 C 18.2 9.8, 16.4 11.2, 15 13
                 C 13.3 15.2, 12.1 17.8, 11.5 20.5
                 C 11.2 21.8, 11 23.2, 11 24.5
                 L 11 32
                 C 11.1 32.8, 11.5 33.5, 12.2 33.8
                 L 16 35.5
                 L 16 38
                 C 16 38.9, 16.4 39.7, 17.1 40.2
                 L 24 44
                 L 30.9 40.2
                 C 31.6 39.7, 32 38.9, 32 38
                 L 32 35.5
                 L 35.8 33.8
                 C 36.5 33.5, 36.9 32.8, 37 32
                 L 37 24.5
                 C 37 23.2, 36.8 21.8, 36.5 20.5
                 C 35.9 17.8, 34.7 15.2, 33 13
                 C 31.6 11.2, 29.8 9.8, 27.7 8.9
                 C 26.5 8.3, 25.2 8.1, 24 8 Z"
              stroke="url(#logo-gradient)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path className="eye-left"
              d="M 19.8 20.5
                 C 19.3 20.4, 18.8 20.7, 18.6 21.2
                 C 18.4 21.6, 18.4 22.1, 18.7 22.5
                 C 19 22.9, 19.5 23.1, 20 23
                 C 20.5 22.9, 20.9 22.5, 21 22
                 C 21.1 21.4, 20.8 20.8, 20.2 20.6
                 C 20.1 20.5, 19.9 20.5, 19.8 20.5 Z"
              fill="url(#logo-gradient)"
            />
            <path className="eye-right"
              d="M 28.2 20.5
                 C 27.7 20.5, 27.3 20.8, 27.1 21.3
                 C 26.9 21.7, 27 22.2, 27.3 22.6
                 C 27.6 23, 28.1 23.2, 28.6 23
                 C 29.1 22.8, 29.4 22.3, 29.4 21.8
                 C 29.4 21.2, 29 20.7, 28.4 20.5
                 C 28.3 20.5, 28.2 20.5, 28.2 20.5 Z"
              fill="url(#logo-gradient)"
            />
          </svg>

          <div className="header-text">
            <h1>LUPIN</h1>
            <div className="subtitle">Jailbreak Agent and PIE Tracker</div>
          </div>
        </div>
        <div className="header-credit">Made with love by the CrakHaus</div>
      </div>

      <div className="tab-bar">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'exploits' ? 'active' : ''}`}
            onClick={() => setActiveTab('exploits')}
          >
            Exploits Tracker
          </button>
          <button
            className={`tab-button ${activeTab === 'lupin' ? 'active' : ''}`}
            onClick={() => setActiveTab('lupin')}
          >
            Lupin Agent
          </button>
          <button
            className={`tab-button ${activeTab === 'test' ? 'active' : ''}`}
            onClick={() => setActiveTab('test')}
          >
            Test LLM
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Exploits Tab */}
      <div className={`tab-content ${activeTab === 'exploits' ? 'active' : ''}`}>
        <ExploitsTracker />
      </div>

      {/* Lupin Agent Tab */}
      <div className={`tab-content ${activeTab === 'lupin' ? 'active' : ''}`}>
        <div className="placeholder-content">
          <h2>Lupin Agent</h2>
          <p>Autonomous AI agent for testing LLM safety guardrails.</p>
          <p>Agent interface coming soon...</p>
        </div>
      </div>

      {/* Test LLM Tab */}
      <div className={`tab-content ${activeTab === 'test' ? 'active' : ''}`}>
        <div className="placeholder-content">
          <h2>Test LLM</h2>
          <p>Manual testing interface for LLM security evaluation and external model testing.</p>
          <p>Testing interface coming soon...</p>
        </div>
      </div>

      {/* Settings Tab */}
      <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
        <Settings theme={theme} onThemeChange={handleThemeChange} />
      </div>

      {showPoliciesModal && (
        <PoliciesModal onClose={() => setShowPoliciesModal(false)} />
      )}
    </div>
  )
}

export default App
