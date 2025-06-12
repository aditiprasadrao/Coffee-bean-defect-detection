from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from loguru import logger
import shutil
import os
import uuid

app = FastAPI()

# Mount the uploads directory to serve static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model = YOLO("best.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Generate unique filename
    unique_id = uuid.uuid4().hex
    original_filename = file.filename
    temp_filename = f"temp_{unique_id}.jpg"
    upload_path = f"uploads/predicted_{unique_id}.jpg"

    # Save uploaded file temporarily
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run inference
    results = model.predict(temp_filename, conf=0.25, save=True, save_txt=False)

    # Save annotated image to uploads folder
    if results and results[0].save_dir:
        saved_image_path = os.path.join(results[0].save_dir, os.path.basename(temp_filename))
        shutil.move(saved_image_path, upload_path)

    # Count predictions
    class_counts = {}
    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]
            class_counts[name] = class_counts.get(name, 0) + 1

    # Clean up temp
    os.remove(temp_filename)

    logger.info(f"Predicted classes: {class_counts}")

    return JSONResponse(content={
        "counts": class_counts,
        "annotated_image_path": f"/uploads/predicted_{unique_id}.jpg"
    })
