from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import pathlib
import os
import sys
import time
from typing import Optional
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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


# Will implement proper Git integration later
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
    "religion": "Deities and belief systems"
}




@app.get("/api/status")
def status() -> Dict:
    try:
        # Simple response for now - we'll add real Git status later
        data_folders = [d.name for d in DATA_DIR.iterdir() if d.is_dir()]
        missing_folders = [k for k in DIR_STRUCTURE.keys() if k not in data_folders]
        
        # Create any missing folders
        for folder in missing_folders:
            (DATA_DIR / folder).mkdir(exist_ok=True)
            
        return {
            "status": "ok",
            "version": "0.1.0",
            "folders": data_folders,
            "timestamp": time.time()
        }
    except Exception as e:
        print(f"Error in status: {e}")
        return {"status": "error", "message": str(e)}


@app.post("/api/pull")
def git_pull():
    # Mock implementation for now
    return {"ok": True, "message": "Pull not yet implemented"}


@app.post("/api/push")
def git_push(msg: str = "Update via UI"):
    # Mock implementation for now
    return {"ok": True, "message": "Push not yet implemented"}

# ---------------- Static Files -----------------
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

    @app.get("/")
    def root():
        return FileResponse(STATIC_DIR / "index.html")
