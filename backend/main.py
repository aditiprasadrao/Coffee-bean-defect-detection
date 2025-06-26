from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from loguru import logger
import shutil
import os
import json

app = FastAPI()

# Folders
BEFORE_DIR = "before"
AFTER_DIR = "after"
COUNTER_FILE = "counter.txt"

# Create required directories
os.makedirs(BEFORE_DIR, exist_ok=True)
os.makedirs(AFTER_DIR, exist_ok=True)

# Mount folders to serve static files via HTTP
app.mount("/before", StaticFiles(directory=BEFORE_DIR), name="before")
app.mount("/after", StaticFiles(directory=AFTER_DIR), name="after")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
model = YOLO("best.pt")

# Helper: get next available index
def get_next_index():
    if not os.path.exists(COUNTER_FILE):
        with open(COUNTER_FILE, "w") as f:
            f.write("1")
        return 1
    with open(COUNTER_FILE, "r") as f:
        index = int(f.read())
    with open(COUNTER_FILE, "w") as f:
        f.write(str(index + 1))
    return index

# Helper: format file names
def format_id(prefix, index):
    return f"{prefix}{index:05d}"

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    index = get_next_index()

    # Filenames
    b_name = format_id("b", index) + ".jpg"
    a_folder = format_id("a", index)
    a_img = a_folder + ".jpg"
    j_name = format_id("j", index) + ".json"

    # Paths
    before_path = os.path.join(BEFORE_DIR, b_name)
    after_subdir = os.path.join(AFTER_DIR, a_folder)
    os.makedirs(after_subdir, exist_ok=True)
    annotated_path = os.path.join(after_subdir, a_img)
    json_path = os.path.join(after_subdir, j_name)

    # Save original uploaded image
    with open(before_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run YOLO prediction
    results = model.predict(before_path, conf=0.25, save=True, save_txt=False)

    # Move predicted image to appropriate subfolder
    if results and results[0].save_dir:
        temp_annotated = os.path.join(results[0].save_dir, os.path.basename(before_path))
        shutil.move(temp_annotated, annotated_path)

    # Count predictions
    class_counts = {}
    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]
            class_counts[name] = class_counts.get(name, 0) + 1

    # Save result as JSON
    with open(json_path, "w") as f:
        json.dump(class_counts, f)

    logger.info(f"Saved input to {before_path}, output to {annotated_path}, json to {json_path}")

    return JSONResponse(content={
        "input_image": f"/before/{b_name}",
        "annotated_image": f"/after/{a_folder}/{a_img}",
        "result_json": f"/after/{a_folder}/{j_name}",
        "counts": class_counts
    })
