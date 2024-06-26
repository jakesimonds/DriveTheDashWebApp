#!/bin/bash

start_servers() {
    # Start frontend
    npm install
    npm start &

    # Start server
    cd server 
    npm install
    npm start &

    # Start bleak-dash
    cd ../bleak-dash_
    pip install -r requirements.txt
    python3 app.py &

    echo "Hopefully it worked? Navigate to localhost:3001!"
}



start_servers
