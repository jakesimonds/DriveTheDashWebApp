from ultralytics import YOLO
import cv2

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama  # Ensure you have the correct import for your model
import json
import httpx
import os
from dotenv import load_dotenv
from pathlib import Path
import asyncio

env_path = Path(__file__).resolve().parent.parent / '.env'  # Adjust the path as necessary
load_dotenv(dotenv_path=env_path)


IP_ADDRESS = os.getenv('IP_ADDRESS')
#PHOTO_SERVER_ADDRESS = IP_ADDRESS
PHOTO_SERVER_ADDRESS = '192.168.1.91'
#print(f"IPppp_ADDRESS: {IP_ADDRESS}")
CONFIDENCE_THRESHOLD = 0.4


app = FastAPI()

# NOTE: working right now, am not addressing that I send data to another computer
origins = [
    "http://localhost:3000",  # frontend
    "http://localhost:3001"   # backend
    "http://localhost:5000"   # llama
    "http://localhost:5555"   # ????
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test")
async def test(request: Request):
    print("HIT /test in fastAPI llama server")
    return {"message": "Hello World"}



'''


2.5 YOLO!!!!

3. give cat(USER_REQUEST, LLAVA_DESCRIPTION) to llama custom model

4. get back command from llama custom model

5. send command to robot

'''

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


async def capture_photo():
    async with httpx.AsyncClient() as client:
        response = await client.get(f'http://{PHOTO_SERVER_ADDRESS}:8000/photo')
        if response.status_code == 200:
            with open('photo.jpg', 'wb') as file:  # Save as 'photo.jpg'
                file.write(response.content)
    return 'success'


@app.get("/llava")
async def llava(request: Request):
    await capture_photo()
    file_path = '/Users/jake.simonds/Desktop/self-study/DriveTheDashWebApp/llama/photo.jpg'
    prompt = 'You are the eyes of a robot. Briefly describe objects and their relative positions as you see them in the image.'
    photo_description = ollama.generate(model='llava', prompt=prompt, images=[file_path], stream=True)
    res = ''
    for chunk in photo_description:
        res = res + chunk['response']
    return {'status_code': 200, 'photo_description': res}



@app.post("/submit")
async def submit_text(request: Request):
    # One command
    data = await request.json()
    
    
    
    
    text = data.get("text")
    print(f" /submit on fastAPI llama server recieved as data.get(text): {text} ")
    
    
    if text:
        try:
            await capture_photo()
            yolo_res = await yolo()
            print("yolo_res: ", yolo_res)
            result = ollama.chat(model='JuneRobot', messages=[{'role': 'user', 'content': text}])
            print("Model response:", result)
            
            message = result["message"]
            
            #content_dict = json.loads(message["content"])
            command_text = message["content"]
            print(f"command_text: {command_text}")
            
        except Exception as e:
            return {"Error from fastAPI llama server :", str(e)}
    
    #return {"command": "dummyValFromllamaFastAPI /submit"}
    return {"command": command_text }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)




'''
FUTURE: 

- calibrate turning to specific objects if possible

- make a descriminator custom llama that decides if the 'job' is done




'''