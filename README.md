# LUPIN - LLM Security Testing Platform

🔒 **Jailbreak Agent and PIE Tracker for LLM Security Testing**

## Project Vision

LUPIN is an AI security testing platform designed to help researchers and security professionals evaluate the robustness of large language models against various prompt injection and jailbreak attempts. Our goal is to create a comprehensive tool that automates the process of testing LLM defenses while providing clear insights into potential vulnerabilities.

We envision a system similar to a CVE database but specifically for prompt injection exploits, where security researchers can catalog known vulnerabilities, assign severity ratings, and run regression tests to measure model safety improvements over time.

## Features

- 📊 **PIE Tracker** - Prompt Injection Exploit database for cataloging vulnerabilities
- 🤖 **Lupin Agent** - Autonomous AI agent for automated LLM security testing
- 🧪 **Test LLM** - Manual testing interface for external model evaluation
- ⚙️ **Settings** - API key management and theme customization
- 📜 **Terms & Policies** - Comprehensive legal and ethical guidelines

## Project Structure

```
lupin-barebones/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.tsx       # Main application
│   │   ├── App.css       # Component styles
│   │   └── index.css     # Global styles & design system
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── backend/              # Python + Flask API (placeholder)
│   ├── src/             # Source code
│   ├── tests/           # Unit tests
│   ├── server.py        # Main server file
│   └── requirements.txt # Python dependencies
│
└── README.md            # This file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+ (for backend, optional)
- A modern web browser

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown (usually `http://localhost:5173`)

### Backend Setup (Optional - Under Development)

The backend is currently a placeholder for future development.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python server.py
   ```

## Development

### Frontend Development

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with CSS variables for theming
- **Features**:
  - Dark/Light theme support
  - Responsive design
  - Modal-based Terms & Conditions
  - Tab-based navigation

### Backend Development (Planned)

- **Framework**: Flask (Python)
- **Database**: SQLite
- **API Integrations**:
  - OpenRouter (GLM model)
  - Hugging Face (exploit discovery)
  - Perplexity (web research)

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

### Deployment

The frontend can be deployed to:
- Vercel (configured via repository-level `vercel.json` to build from `frontend/` and ship `frontend/dist`)
- Netlify
- GitHub Pages
- Any static hosting service

The backend will require:
- Python hosting (Heroku, Railway, etc.)
- Environment variables for API keys

## Configuration

- Frontend builds read `VITE_API_BASE` (see `frontend/.env.example`) to know which backend URL to call. Set this to your deployed API when building on Vercel.
- Backend deployments read `CORS_ALLOW_ORIGINS` (see `backend/.env.example`) to decide which origins may call the API. Include your Vercel domain so browser requests succeed.

## API Keys

LUPIN integrates with external services. Get your API keys from:

- **OpenRouter**: https://openrouter.ai/keys
- **Hugging Face**: https://huggingface.co/settings/tokens
- **Perplexity**: https://www.perplexity.ai/settings/api

Add your keys in the Settings tab of the application.

## Legal & Ethics

LUPIN is a **defensive security tool** for authorized research and testing only. Before using:

1. Read the Terms of Service
2. Review the Acceptable Use Policy
3. Understand Responsible Disclosure practices
4. Follow Ethics Guidelines

Access these documents by clicking "ETHICAL USE • TERMS • DISCLOSURE POLICY" in the application banner.

## Team

Built with passion for AI safety and security research by **CrakHaus**.

## License

This project is for educational and research purposes. See the Terms of Service in the application for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For security vulnerabilities, please follow our Responsible Disclosure Policy (accessible in the app).

## Roadmap

- [x] Frontend UI/UX design
- [x] Terms & Conditions implementation
- [x] Theme switching
- [ ] Backend API implementation
- [ ] Database integration
- [ ] OpenRouter API integration
- [ ] Autonomous agent implementation
- [ ] Test result tracking
- [ ] Export functionality

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the team through our repository

---

**⚠️ IMPORTANT**: LUPIN is designed for ethical security research only. Unauthorized testing of systems you don't own is illegal and violates our Terms of Service.
