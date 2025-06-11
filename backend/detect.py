from ultralytics import YOLO
from PIL import Image
import torch
import os

# Load once
model = YOLO("best.pt") 

def run_detection(image_path):
    results = model.predict(image_path, conf=0.25, save=False)
    bean_counts = {}

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]
            bean_counts[name] = bean_counts.get(name, 0) + 1

    return bean_counts
