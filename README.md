# Mesh AI
Ask your documents questions. Upload verified information ensuring accurate high quality AI responses.

[Try it now](https://meshai.happyrobotics.com/)

## Tech Stack
- TypeScript
- React.js
- Express.js
- Node.js
- Docker
- MongoDB
- GitHub Actions
- AWS EC2
- RAG (Retrieval Augmented Generation)
- OpenAI API
- Nebius Token Factory
- Caddy
- Vite

## Development
### Prerequisites
- Node.js (20+)
- Docker

### Steps
1. Clone the repository.
2. `cd ai-se_project_mesh-ai`
3. Create a `.env` file in the root directory
```bash
cp .env.example .env
```
4. Fill in environment variables in `.env`
5. From root directory run:
```bash
npm run dev
```
6. (Alternative) Test dockerized app:
```bash
docker compose up --build
```
7. Navigate to the homepage. For local development this is: http://localhost
- Choose "Accept risk and continue". This happens because the browser can't verify the local version's certificate.

## Environment Variables (.env)
| Variable | Description |
| --- | --- |
| `JWT_SECRET` | Secret key you generate which is used to sign authentication tokens |
| `NEBIUS_API_KEY` | Your personal API key for Nebius Token Factory API service |
| `MONGO_URI` | MongoDB connection string |
| `SITE_ADDRESS` | Domain name used by Caddy (production only) |