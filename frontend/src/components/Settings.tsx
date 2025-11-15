import { useState, useEffect } from 'react'
import './Settings.css'

interface SettingsProps {
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
}

interface APIKeys {
  openrouter: string
  huggingface: string
  perplexity: string
}

const API_KEYS_STORAGE_KEY = 'lupin_api_keys'

export default function Settings({ theme, onThemeChange }: SettingsProps) {
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    openrouter: '',
    huggingface: '',
    perplexity: ''
  })

  const [showKeys, setShowKeys] = useState({
    openrouter: false,
    huggingface: false,
    perplexity: false
  })

  const [saveNotice, setSaveNotice] = useState(false)

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY)
    if (savedKeys) {
      try {
        const keys = JSON.parse(savedKeys)
        setApiKeys(keys)
      } catch (e) {
        console.error('Failed to load saved keys:', e)
      }
    }
  }, [])

  const handleKeyChange = (key: keyof APIKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }))
  }

  const toggleKeyVisibility = (key: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const maskKey = (key: string) => {
    if (!key) return ''
    if (key.length <= 8) return '•'.repeat(key.length)
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4)
  }

  const saveAPIKeys = () => {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys))
    setSaveNotice(true)
    setTimeout(() => setSaveNotice(false), 3000)
  }

  const clearAPIKeys = () => {
    if (confirm('Are you sure you want to clear all API keys?')) {
      setApiKeys({
        openrouter: '',
        huggingface: '',
        perplexity: ''
      })
      localStorage.removeItem(API_KEYS_STORAGE_KEY)
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>API KEY SETTINGS</h2>
        <p className="settings-subtitle">Configure your API keys for external services</p>
      </div>

      <div className="settings-content">
        {/* Theme Section */}
        <div className="settings-section theme-section">
          <div className="theme-info">
            <h3>Interface Theme</h3>
            <p>Switch between light and dark mode. Preference is stored locally.</p>
          </div>
          <div className="theme-toggle">
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              LIGHT
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              DARK
            </button>
          </div>
        </div>

        {/* OpenRouter API Key */}
        <div className="settings-section">
          <div className="key-info">
            <h3>OpenRouter API Key</h3>
            <p>Used for agent brain (GLM model) and LLM jailbreak testing</p>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="get-key-link"
            >
              Get your key →
            </a>
          </div>
          <div className="key-input-group">
            <input
              type={showKeys.openrouter ? 'text' : 'password'}
              value={apiKeys.openrouter}
              onChange={(e) => handleKeyChange('openrouter', e.target.value)}
              placeholder="sk-or-v1-..."
              className="key-input"
            />
            <button
              className="toggle-visibility"
              onClick={() => toggleKeyVisibility('openrouter')}
              title={showKeys.openrouter ? 'Hide key' : 'Show key'}
            >
              {showKeys.openrouter ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {!showKeys.openrouter && apiKeys.openrouter && (
            <div className="key-preview">{maskKey(apiKeys.openrouter)}</div>
          )}
        </div>

        {/* Hugging Face API Key */}
        <div className="settings-section">
          <div className="key-info">
            <h3>Hugging Face API Key</h3>
            <p>Used for LLM-based exploit discovery and searching</p>
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="get-key-link"
            >
              Get your key →
            </a>
          </div>
          <div className="key-input-group">
            <input
              type={showKeys.huggingface ? 'text' : 'password'}
              value={apiKeys.huggingface}
              onChange={(e) => handleKeyChange('huggingface', e.target.value)}
              placeholder="hf_..."
              className="key-input"
            />
            <button
              className="toggle-visibility"
              onClick={() => toggleKeyVisibility('huggingface')}
              title={showKeys.huggingface ? 'Hide key' : 'Show key'}
            >
              {showKeys.huggingface ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {!showKeys.huggingface && apiKeys.huggingface && (
            <div className="key-preview">{maskKey(apiKeys.huggingface)}</div>
          )}
        </div>

        {/* Perplexity API Key */}
        <div className="settings-section">
          <div className="key-info">
            <h3>Perplexity API Key</h3>
            <p>Used for web-based exploit discovery via Perplexity Sonar</p>
            <a
              href="https://www.perplexity.ai/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="get-key-link"
            >
              Get your key →
            </a>
          </div>
          <div className="key-input-group">
            <input
              type={showKeys.perplexity ? 'text' : 'password'}
              value={apiKeys.perplexity}
              onChange={(e) => handleKeyChange('perplexity', e.target.value)}
              placeholder="pplx-..."
              className="key-input"
            />
            <button
              className="toggle-visibility"
              onClick={() => toggleKeyVisibility('perplexity')}
              title={showKeys.perplexity ? 'Hide key' : 'Show key'}
            >
              {showKeys.perplexity ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {!showKeys.perplexity && apiKeys.perplexity && (
            <div className="key-preview">{maskKey(apiKeys.perplexity)}</div>
          )}
        </div>

        {/* Save/Clear Actions */}
        <div className="settings-actions">
          <button className="save-button" onClick={saveAPIKeys}>
            SAVE KEYS
          </button>
          <button className="clear-button" onClick={clearAPIKeys}>
            CLEAR ALL
          </button>
        </div>

        {/* Save Notice */}
        {saveNotice && (
          <div className="save-notice">
            API keys saved to browser storage
          </div>
        )}

        {/* Settings Note */}
        <div className="settings-note">
          <h4>Note:</h4>
          <ul>
            <li>Keys are stored locally in your browser (localStorage)</li>
            <li>Keys are never sent to any server except the APIs they're intended for</li>
            <li>You can clear your keys anytime from this page</li>
            <li>Some features may auto-fill these keys if detected</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
