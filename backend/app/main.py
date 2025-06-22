from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional, List, Any
import pathlib
import os
import sys
import time
import git
from git import Repo
from git.exc import InvalidGitRepositoryError, NoSuchPathError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

print("Starting ChefKnight API...")
app = FastAPI(title="ChefKnight API", debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths configured for Docker image
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

# Content directories
KINGDOMS_DIR = DATA_DIR / "kingdoms"
CHARACTERS_DIR = DATA_DIR / "characters"
REGIONS_DIR = DATA_DIR / "regions"

# Ensure content directories exist
for directory in [KINGDOMS_DIR, CHARACTERS_DIR, REGIONS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)


# Content directory structure
DIR_STRUCTURE = {
    "kingdoms": "Top-level political entities",
    "characters": "Characters from the story",
    "regions": "Geographic areas",
    "continents": "Large landmasses",
    "races": "Sapient species",
    "foods": "Cuisine and ingredients",
    "abilities": "Powers and skills",
    "weapons": "Armaments",
    "armour": "Protective gear",
    "items": "Artifacts and objects",
    "religion": "Deities and belief systems",
    "assets": "Images and other media files"
}


def get_repo() -> git.Repo:
    """Get or initialize the Git repository"""
    try:
        logging.info(f"Attempting to open existing repository at {DATA_DIR}")
        repo = git.Repo(DATA_DIR)
        logging.info(f"Repository opened successfully")
        return repo
    except (InvalidGitRepositoryError, NoSuchPathError) as e:
        logging.warning(f"Could not open existing repo: {e}")
        logging.info(f"Initializing new repository at {DATA_DIR}")
        return git.Repo.init(DATA_DIR)




@app.get("/api/status")
def status() -> Dict[str, Any]:
    try:
        # Create missing folders
        data_folders = [d.name for d in DATA_DIR.iterdir() if d.is_dir()]
        missing_folders = [k for k in DIR_STRUCTURE.keys() if k not in data_folders]
        
        for folder in missing_folders:
            (DATA_DIR / folder).mkdir(exist_ok=True)
        
        # Map each folder to its content files
        content_structure = {}
        for folder in DIR_STRUCTURE.keys():
            folder_path = DATA_DIR / folder
            if folder_path.exists() and folder_path.is_dir():
                # Get markdown files in this folder, removing extension for cleaner output
                markdown_files = [f.stem for f in folder_path.glob("*.md")]
                content_structure[folder] = markdown_files
        
        # Get Git status information with proper error handling
        try:
            repo = get_repo()
            
            # Check if we have a valid repo with commits
            try:
                branch_name = repo.active_branch.name
                commit_hash = repo.head.commit.hexsha[:7]
                is_empty_repo = False
            except (ValueError, AttributeError):
                branch_name = "none"
                commit_hash = "none"
                is_empty_repo = True
            
            # Updated response with Git information and content structure
            return {
                "status": "ok",
                "version": "0.1.0",
                "folders": [d.name for d in DATA_DIR.iterdir() if d.is_dir() and not d.name.startswith('.')],
                "content": content_structure,
                "git": {
                    "branch": branch_name,
                    "commit": commit_hash,
                    "dirty": repo.is_dirty(),
                    "empty": is_empty_repo
                },
                "timestamp": time.time()
            }
        except Exception as git_error:
            logging.error(f"Git error in status: {git_error}")
            return {
                "status": "warning",
                "message": f"Git functionality limited: {str(git_error)}",
                "folders": [d.name for d in DATA_DIR.iterdir() if d.is_dir() and not d.name.startswith('.')],
                "content": content_structure,
                "timestamp": time.time()
            }
    except Exception as e:
        logging.error(f"Error in status endpoint: {e}")
        return {"status": "error", "message": str(e)}


@app.post("/api/pull")
def git_pull() -> Dict[str, Any]:
    try:
        repo = get_repo()
        
        # Check if the repo has a remote named 'origin'
        try:
            remote = repo.remote(name="origin")
            results = remote.pull()
            fetch_info = [{
                "commit": info.commit.hexsha[:7] if info.commit else "unknown",
                "flags": info.flags,
                "note": info.note,
                "old_commit": info.old_commit.hexsha[:7] if info.old_commit else "unknown"
            } for info in results]
            
            return {"ok": True, "message": "Pull completed", "result": fetch_info}
        except ValueError:
            return {"ok": False, "message": "No remote named 'origin' found"}
    except Exception as e:
        logging.error(f"Error during pull: {e}")
        return {"ok": False, "message": str(e)}


@app.post("/api/push")
def git_push(msg: str = "Update via UI") -> Dict[str, Any]:
    try:
        repo = get_repo()
        
        # Check if there are changes to commit
        repo.git.add(A=True)
        if not repo.is_dirty() and len(repo.untracked_files) == 0:
            return {"ok": True, "message": "No changes to push"}
            
        # Make a commit
        commit = repo.index.commit(msg)
        
        # Try to push if we have a remote
        try:
            remote = repo.remote(name="origin")
            push_info = remote.push()
            push_result = [{
                "flags": info.flags,
                "summary": info.summary
            } for info in push_info]
            
            return {
                "ok": True, 
                "message": "Changes pushed successfully",
                "commit": commit.hexsha[:7],
                "result": push_result
            }
        except ValueError:
            return {
                "ok": True,
                "message": "Changes committed but not pushed (no remote)", 
                "commit": commit.hexsha[:7]
            }
    except Exception as e:
        logging.error(f"Error during push: {e}")
        return {"ok": False, "message": str(e)}

# ---------------- Static Files -----------------
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

    @app.get("/")
    def root():
        return FileResponse(STATIC_DIR / "index.html")
