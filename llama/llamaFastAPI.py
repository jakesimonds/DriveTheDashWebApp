
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
print(f"IPppp_ADDRESS: {IP_ADDRESS}")



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
            result = ollama.chat(model='JuneRobot', messages=[{'role': 'user', 'content': text}])
            #result = ollama.chat(model='Robottest', messages=[{'role': 'user', 'content': text}])
            print("Model response:", result)
            command = result["message"].get("content")
            print("Command:", command)
            
            async with httpx.AsyncClient() as client:
                #response = await client.post('http://localhost:5555/llama', json={"command": command})
                response = await client.post(f'http://{IP_ADDRESS}:5555/llama', json={"command": command})
            if response.status_code == 200:
                print(f"{command} forwarded successfully")
            else:
                print(f"Failed to forward {command}: {response.status_code}")
            
            
        except Exception as e:
            print("Error from fastAPI llama server :", str(e))
    
    return {"status": "success", "command": command}
    #return {"command": command }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
