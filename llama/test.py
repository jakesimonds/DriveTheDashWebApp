from ultralytics import YOLO
import cv2
import httpx
import asyncio

print("hello")
PHOTO_SERVER_ADDRESS = '192.168.1.91'
CONFIDENCE_THRESHOLD = 0.5

async def capture_photo():
    async with httpx.AsyncClient() as client:
        response = await client.get(f'http://{PHOTO_SERVER_ADDRESS}:8000/photo')
        if response.status_code == 200:
            with open('photo.jpg', 'wb') as file:  # Save as 'photo.jpg'
                file.write(response.content)
                print("Photo saved successfully!")
    return 'success'


async def yolo():
    await capture_photo()
    
    model = YOLO('yolov8s.pt')
    photo = cv2.imread("./photo.jpg")
    results = model(photo)
    
    objects_dict = {}
    for result in results:
        if result.boxes:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                xMid = (x1 + x2) / 2
                confidence = box.conf[0].item()
                class_id = box.cls[0].item()
                class_name = result.names[int(class_id)]
                
                if confidence >= CONFIDENCE_THRESHOLD:
                    if class_name in objects_dict:
                        objects_dict[class_name].append(xMid.item())
                    else:
                        objects_dict[class_name] = [xMid.item()]
    return objects_dict


obj = asyncio.run(yolo())
print("obj: ", obj)



'''

IDEA:


Give llama:
command: string of the user telling you what they want
History: {} the previous classifier feedback and commands given to robot
yolo: json of relative positions of things

You can turn your head to see more. You are straight on with something when its at 300. 




'''