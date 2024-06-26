
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama  # Ensure you have the correct import for your model
import json
import httpx
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / '.env'  # Adjust the path as necessary
load_dotenv(dotenv_path=env_path)


#IP_ADDRESS = '10.244.208.173'
IP_ADDRESS = os.getenv('IP_ADDRESS')
PHOTO_SERVER_ADDRESS = IP_ADDRESS
#print(f"IPppp_ADDRESS: {IP_ADDRESS}")



app = FastAPI()

# NOTE: working right now, am not addressing that I send data to another computer
origins = [
    "http://localhost:3000",  # frontend
    "http://localhost:3001"   # backend
    "http://localhost:5000"   # llama
    "http://localhost:5555"   # bleak-dash
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


@app.post("/submit")
async def submit_text(request: Request):
    print(f"request: {request}")
    data = await request.json()
    print(f"data: {data}")
    
    text = data.get("text")
    print(f" /submit on fastAPI llama server recieved as data.get(text): {text} ")
    
    if text:
        try:
            command = 'dummyVal'
            # MAYBE TAKE A PICTURE HERE???? 
            print("Taking picture now...")
            async with httpx.AsyncClient() as client:
                response = await client.get(f'http://{PHOTO_SERVER_ADDRESS}:8888/process')
                if response.status_code == 200:
                    print(response.json())
            
            
            #result = ollama.chat(model='JuneRobot', messages=[{'role': 'user', 'content': text}])
            result = ollama.chat(model='vision', messages=[{'role': 'user', 'content': text}])
            #result = ollama.chat(model='Robottest', messages=[{'role': 'user', 'content': text}])
            print("Model response:", result)
            
            message = result["message"]
            content_dict = json.loads(message["content"])

            # Extract 'CommandType' and 'Command'
            command_type = content_dict["CommandType"]
            command_text = content_dict["Command"]

            # Print the extracted values
            print("CommandType:", command_type)
            print("Command:", command_text)
            
            
            # CommandType = command['CommandType']
            # #print("CommandType:", CommandType)
            # if CommandType == 'Picture':
            #     print("Taking picture now...")
            #     async with httpx.AsyncClient() as client:
            #         response = await client.get(f'http://{PHOTO_SERVER_ADDRESS}:8888/process')
            #         if response.status_code == 200:
            #             print(response.json())
            #         else:
            #             print("error")
            
            # async with httpx.AsyncClient() as client:
            #     #response = await client.post('http://localhost:5555/llama', json={"command": command})
            #     response = await client.post(f'http://{IP_ADDRESS}:5555/llama', json={"command": command})
            # if response.status_code == 200:
            #     print(f"{command} forwarded successfully")
            # else:
            #     print(f"Failed to forward {command}: {response.status_code}")
            
            
        except Exception as e:
            return {"Error from fastAPI llama server :", str(e)}
    
    return {"command": "dummyValFromllamaFastAPI /submit"}
    #return {"command": command }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
