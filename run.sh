#!/bin/bash

start_servers() {
    # Start frontend
    npm run start &

    # Start server
    cd server 
    npm install
    npm run start &



    echo "Hopefully it worked? Navigate to localhost:3001!"
}



start_servers
