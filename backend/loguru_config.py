from loguru import logger
from datetime import datetime
import os

log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)

log_file = os.path.join(log_dir, f"{datetime.now().strftime('%Y-%m-%d')}.log")
logger.add(log_file, rotation="10 MB", retention="7 days", enqueue=True)
