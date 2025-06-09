from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import requests
import os

app = FastAPI()

# Mount static files directory
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

def fetch_pokemon_data(id_or_name: str):
    try:
        response = requests.get(f"https://pokeapi.co/api/v2/pokemon/{id_or_name}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=404, detail=str(e))

# API endpoint
@app.get("/api/pokemon/{id_or_name}")
def get_pokemon(id_or_name: str):
    data = fetch_pokemon_data(id_or_name)
    return {
        "name": data.get("name"),
        "id": data.get("id"),
        "types": [t["type"]["name"] for t in data.get("types", [])],
        "abilities": [a["ability"]["name"] for a in data.get("abilities", [])],
        "front_image": data.get("sprites", {}).get("front_default"),
        "back_image": data.get("sprites", {}).get("back_default")
    }

# Frontend route
@app.get("/")
async def serve_react():
    return FileResponse(os.path.join("static", "index.html"))
