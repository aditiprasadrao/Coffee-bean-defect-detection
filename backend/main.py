# backend/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import shutil
from loguru import logger
import os
import uuid

app = FastAPI()

# Allow frontend to call backend (adjust origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use actual domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model
model = YOLO("best.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model.predict(temp_filename, conf=0.25)
    
    class_counts = {}
    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]
            class_counts[name] = class_counts.get(name, 0) + 1
    
    os.remove(temp_filename)
    logger.info(f"Predicted classes: {class_counts}")
    return JSONResponse(content={"counts": class_counts})
