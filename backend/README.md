# CircleSearch Backend

This is a Go backend for the CircleSearch app that provides APIs for:
- App search using GitHub Marketplace API
- Translation services
- AI integration with GPT-4o

## Getting Started

1. Make sure you have Go 1.19+ installed
2. Install dependencies:
   ```
   go mod download
   ```
3. Run the server:
   ```
   go run main.go
   ```
   
The server will be available at http://localhost:8080

## API Endpoints

- `GET /api/search?q=query` - Search for apps
- `POST /api/translate` - Translate text
- `POST /api/ai` - AI integration with GPT-4o
- `GET /health` - Health check

## Environment Variables

Configure these in the `.env` file in the root directory:
- `GITHUB_TOKEN` - GitHub API token
- `AZURE_ENDPOINT` - Azure AI endpoint
- `AZURE_MODEL_NAME` - Azure model name (e.g., gpt-4o) 