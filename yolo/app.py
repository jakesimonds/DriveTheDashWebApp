from fastapi import FastAPI
from fastapi.responses import FileResponse
import cv2
import torch
from ultralytics import YOLO
import cv2

app = FastAPI()



'''
THIS WILL BE A FASTAPI app that has one method, as I say that I wonder if I could fold it into llama app....





'''



@app.post("/process")
def process():
    print("in process block")
    # get photo 
    cap = cv2.imread("photo.jpg")
    ret, frame = cap.read()
    target = 'person'  # Replace with the target class name you want to detect
    model = YOLO('yolov8s.pt')
    # Perform inference
    results = model(frame)
    
    # Iterate over the results to find the target
    for result in results:
        # Access the boxes attribute which contains detected objects
        if result.boxes is not None:
            boxes = result.boxes
            for box in boxes:
                # Extract details from the box object
                x1, y1, x2, y2 = box.xyxy[0]  # Coordinates
                xMid = (x1 + x2) / 2
                confidence = box.conf[0].item()  # Confidence score, convert tensor to float
                class_id = box.cls[0].item()  # Class ID, convert tensor to float
                class_name = result.names[int(class_id)]
                
                # Check if the detected class matches the target
                if class_name == target:
                    print(f"Detected {target} with confidence {confidence:.2f} at coordinates ({x1:.2f}, {y1:.2f}), ({x2:.2f}, {y2:.2f})")
                    return {"mid": f"xmid was: {xMid}"}  # Return the x coordinates of the detected target
    
    print(f"{target} not detected.")
    return {"mid": None}

    # Example usage with webcam image

    mid = look_for(frame, target)
    print("Mid x: ", mid)

    # Release the webcam
    #cap.release()
    cv2.destroyAllWindows()
    
    
    print("local change")
    photo_path = capture_photo()
    if photo_path:
        return FileResponse(photo_path, media_type='image/jpeg', filename='webcam_photo.jpg')
    else:
        return {"error": "Could not capture photo"}