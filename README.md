# ChefKnight Encyclopedia Platform

ChefKnight is a lightweight Git-driven encyclopedia/wiki platform designed for an animated series story universe. It provides a modern web interface to create, organize, and explore lore — kingdoms, characters, regions, items, foods, continents, abilities, weapons, armour, races, religions, and more — while keeping all content in plain Markdown files with YAML frontmatter that are version-controlled via Git.

## ✨ Architecture

* **Separate Content Repository** - Content is stored in a dedicated Git repository ([ChefKnight-Encyclopedia](https://github.com/JoshuaHoare/ChefKnight-Encyclopedia)) managed as a subrepo/submodule.
* **FastAPI Backend** - RESTful API that serves content and manages Git operations.
* **Static Frontend** - Currently a placeholder (will be implemented with React in the future).
* **Docker Containerization** - Easy deployment with Docker Compose.
* **Git Integration** - Pull/push operations to sync content with remote repository.

## 📁 Project Structure

```
ChefKnight/               # Main repository
├── backend/              # Python backend
│   ├── app/              # Application code
│   │   ├── main.py       # FastAPI application
│   │   └── __init__.py
│   └── requirements.txt  # Python dependencies
├── static/               # Frontend assets (placeholder)
├── data/                 # Content repository (Git subrepo)
│   ├── kingdoms/         # Kingdom entries
│   ├── characters/       # Character entries
│   └── ... (other content)
├── docker-compose.yml    # Docker configuration
└── Dockerfile           # Docker build instructions
```

## 🚀 Key Features

* **Markdown + YAML Content** - All content is stored as Markdown files with YAML frontmatter metadata.
* **Git-Powered Version Control** - Track changes, collaborate with multiple editors.
* **API Endpoints** - `/api/status`, `/api/pull`, `/api/push` for Git operations.
* **Content Organization** - Structured by category (kingdoms, characters, etc.)

## 🛠️ Setup Instructions

### Prerequisites

- Git
- Docker and Docker Compose

### Step 1: Clone the main repository

```bash
git clone https://github.com/JoshuaHoare/ChefKnight.git
cd ChefKnight
```

### Step 2: Clone the content repository

```bash
git clone https://github.com/JoshuaHoare/ChefKnight-Encyclopedia.git data
```

### Step 3: Build and start the Docker containers

```bash
docker compose up -d --build
```

### Step 4: Access the application

- API: http://localhost:8000/api/status
- Frontend: http://localhost:8000/

### Step 5: Making content changes

1. Edit/add Markdown files in the `data/` directory
2. Commit changes to the content repository:
   ```bash
   cd data
   git add .
   git commit -m "Add new content"
   git push origin main
   ```
3. Pull changes from the API:
   ```bash
   curl -X POST http://localhost:8000/api/pull
   ```

## 📝 API Documentation

### GET /api/status
Returns information about the content repository state.

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0",
  "folders": ["kingdoms", "characters", ...],
  "content": {
    "kingdoms": ["aldoria"],
    "characters": ["chef_brandish"],
    ...
  },
  "git": {
    "branch": "main",
    "commit": "f65aa16",
    "dirty": false,
    "empty": false
  },
  "timestamp": 1750577526.345382
}
```

### POST /api/pull
Pulls the latest content from the remote repository.

### POST /api/push
Commits changes and pushes them to the remote repository.

**Request Body:**
```json
{
  "msg": "Update content via UI"
}
```

## 🚀 Next Steps

1. ✅ Set up main repository and content subrepo structure
2. ✅ Implement FastAPI backend with Git operations
3. ✅ Create Docker containerization
4. ⬜ Develop React frontend for browsing content
5. ⬜ Add content editing capabilities to the UI
6. ⬜ Implement search functionality
7. ⬜ Add user authentication and access control
8. ⬜ Create content templates and wizards
