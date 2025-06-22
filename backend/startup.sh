#!/bin/bash

echo "Starting Coffee Bean Detection FastAPI Server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload