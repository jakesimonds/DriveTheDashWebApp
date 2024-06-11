
from flask import Flask, jsonify, request
#from morseapi import MorseRobot
import logging
import asyncio
from dash.robot import DashRobot, discover_and_connect
import asyncio

app = Flask(__name__)

global bot
bot_address = "C2:37:67:68:BD:38"

def get_robot():
    global bot
    if bot is None:
        bot = "dummy"
        #robot = MorseRobot(bot_address)
    return bot

@app.route('/connect')
async def connect():
    print("connect!")
    global bot
    try:

        bot = await discover_and_connect()
        print(bot)
        #await robot.move(100,100)
        if bot:
            return jsonify({"status": "Connected"})
        else:
            return jsonify({"status": "Failed to connect"}), 500
    except:
        return jsonify({"error": "Failed to connect"}), 500

'''
INFO:werkzeug:127.0.0.1 - - [25/Feb/2024 18:56:00] "GET /disconnect HTTP/1.1" 500 -
'''
# broken

@app.route('/disconnect')
def disconnect():
    print("disconnect!")
    global bot
    try:
        if bot is not None:
            print("ABOUT TO DISCONNECT...")
            bot.disconnect() # Method must be trash
            bot = None
            print("DISCONNECTED!!!")
            return jsonify({"status": "disconnected"})
    except:
        return jsonify({"error": "Failed to disconnect"}), 500

@app.route('/forward')
async def drive():
    print("forward")
    try:
        
        if bot is None:
            return jsonify({"error": "Robot not connected"}), 400
        await bot.drive(250)
        #await robot.move(300, 300)
        return jsonify({"status": "moved forward"})
    except:
        return jsonify({"error": "Failed to move"}), 500
    
@app.route('/right')
async def right():
    print("right")
    try:
        if bot is None:
            return jsonify({"error": "Robot not connected"}), 400
        #await bot.turn(-300) # goes left and stops 300 is close to 90
        await bot.spin(-200)
        return jsonify({"status": "right"})
    except:
        print("failing to turn right sadd sad ")
        return jsonify({"error": "Failed to turn right"}), 500

@app.route('/left')
async def left():
    print("left")
    try:
        if bot is None:
            return jsonify({"error": "Robot not connected"}), 400
        #await bot.turn(300) # goes left and stops
        await bot.spin(200)   # left goes left (keeps going)
        return jsonify({"status": "left"})
    except:
        return jsonify({"error": "Failed to turn left"}), 500


@app.route('/back')
async def back():
    print("back")
    try:
        if bot is None:
            return jsonify({"error": "Robot not connected"}), 400
        await bot.move(-200,300)
        return jsonify({"status": "moved forward"})
    except:
        return jsonify({"error": "Failed to move"}), 500


# @app.route('/llama', methods=['POST'])
# async def llama():
    
#     data = request.get_json()
#     print("llama")
#     print(data)
#     command = data.get("command")
#     print(f"Command: {command}")
#     try:
#         if bot is None:
#             return jsonify({"error": "Robot not connected"}), 400
#         print("Command: ", command)
#         command = command[4:]
#         print(f"Command: {command}")
#         await bot.command
#         return jsonify({f"status": "maybe did something? {command}"})
#     except:
#         return jsonify({"error": "llama error"}), 500


@app.route('/llama', methods=['POST'])
async def llama():
    data = request.get_json()
    print("llama")
    print(data)
    
    command = data.get("command")
    print(f"Command: {command}")
    
    try:
        if bot is None:
            return jsonify({"error": "Robot not connected"}), 400
        
        # Ensure the command is properly prefixed with 'await'
        full_command = f"await {command}"
        print(f"Full command: {full_command}"
              )
        # Use exec to execute the await command in an async function
        local_vars = {'bot': bot}
        exec(f"async def __temp_func():\n    {full_command}", globals(), local_vars)
        await local_vars['__temp_func']()
        
        return jsonify({"status": f"Executed command: {command}"})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": f"Failed to execute command: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(port=5555, debug=True)
