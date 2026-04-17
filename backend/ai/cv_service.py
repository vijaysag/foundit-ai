from ultralytics import YOLO
from PIL import Image
import numpy as np
import cv2
import os

class CVService:
    def __init__(self, model_name='yolov8n.pt'):
        # This will download the model automatically on first run
        self.model = YOLO(model_name)
    
    def analyze_image(self, image_path: str):
        """Analyze image to return categories, color and other tags."""
        results = self.model(image_path)
        
        detected_labels = []
        for result in results:
            for conf, cls in zip(result.boxes.conf, result.boxes.cls):
                if conf > 0.5:
                    label = self.model.names[int(cls)]
                    if label not in detected_labels:
                        detected_labels.append(label)
        
        # Color extraction (basic implementation using dominant color)
        color = self._extract_dominant_color(image_path)
        
        return {
            "labels": detected_labels,
            "color": color,
            "brand": "" # Simple logo detection could be a future enhancement
        }

    def _extract_dominant_color(self, image_path: str):
        """Extracts the dominant color name from the image."""
        img = cv2.imread(image_path)
        if img is None:
            return "unknown"
        
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (50, 50), interpolation=cv2.INTER_AREA)
        
        pixels = img.reshape(-1, 3)
        counts = np.bincount(pixels.sum(axis=1), minlength=256*3)
        # Simplified: pick a dominant hue-based color or just return simple RGB hex for UI
        # We'll return the hex color format
        dominant_color = np.mean(pixels, axis=0).astype(int)
        return '#{:02x}{:02x}{:02x}'.format(dominant_color[0], dominant_color[1], dominant_color[2])

cv_service = CVService()
