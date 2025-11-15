# LUPIN Backend

## Overview

This directory contains the backend server for the LUPIN LLM Security Testing Platform.

## Tech Stack

- **Python 3.9+**
- **Flask** - Lightweight web framework
- **SQLite** - Local database for exploits and test results
- **OpenRouter API** - For GLM model integration
- **Hugging Face API** - For exploit discovery
- **Perplexity API** - For web-based vulnerability research

## Project Structure

```
backend/
├── src/
│   ├── api/           # API route handlers
│   ├── models/        # Database models
│   ├── services/      # Business logic
│   └── utils/         # Helper functions
├── tests/             # Unit and integration tests
├── requirements.txt   # Python dependencies
└── server.py          # Main application entry point
```

## Getting Started

### Installation

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
python server.py
```

The server will start on `http://localhost:5000`

## API Endpoints (Planned)

### Exploits
- `GET /api/exploits` - List all exploits
- `POST /api/exploits` - Create new exploit
- `GET /api/exploits/:id` - Get exploit details
- `PUT /api/exploits/:id` - Update exploit
- `DELETE /api/exploits/:id` - Delete exploit

### Testing
- `POST /api/test` - Run LLM test
- `GET /api/test/:id` - Get test results
- `GET /api/tests` - List all test runs

### Agent
- `POST /api/agent/run` - Start autonomous testing agent
- `GET /api/agent/status` - Get agent status
- `POST /api/agent/stop` - Stop running agent

## Environment Variables

Create a `.env` file in the backend directory:

```
OPENROUTER_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
DATABASE_PATH=./lupin.db
```

## Database Schema

The SQLite database will include tables for:
- **exploits** - PIE (Prompt Injection Exploits) database
- **test_runs** - Test execution history
- **models** - Tested LLM models
- **results** - Test results and metrics

## Development Status

🚧 **Under Construction** - This backend is a placeholder for future development.

Current priority: Frontend implementation and UI/UX refinement.
