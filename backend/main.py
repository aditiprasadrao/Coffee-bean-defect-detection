from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from detect import run_detection
from loguru_config import logger
import shutil
import os

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    logger.info(f"Received image: {file.filename}")

    result = run_detection(file_location)
    logger.info(f"Detection result: {result}")

    return {"filename": file.filename, "result": result}
