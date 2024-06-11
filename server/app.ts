import sqlite3 from "sqlite3";
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import axios from 'axios';
// ifconfig | grep inet
//const IP_ADDRESS = "194.168.1.174" // Artifact from when compatibility issues meant robot-flask-app was on linux machine, leaving for future flexibility
//require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const IP_ADDRESS = process.env.IP_ADDRESS;

var app = express();

const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const SQLiteStore = require('connect-sqlite3')(session);
import { checkLoggedIn } from './middleware';


const initDB = require('./initDB');



app.use(cors());

app.use
app.use(session({
  // store: new SQLiteStore(),
  secret: 'abcd',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
}
}));


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));


// Open the database
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// GLOBAL IS_CONNECTED
let isConnected = false;

//ROUTES

app.post('/register', async (req:any, res:any) => {
  console.log("hit post register")
  const { username, password } = req.body;

  const hashPassword = async (password: any) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  const hashed = await hashPassword(password);

  const query = `INSERT INTO user (username, ppassword) VALUES (?, ?)`;

  db.run(query, [username, hashed], function(err:any) {
    if (err) {
      res.status(500).send({ error: "Could not register user" });
    } else {
      res.status(200).send({ message: "User registered successfully!" });
    }
  });
});


app.post('/login', (req:any, res:any) => {
  const { username, password } = req.body;



  const login = async (password: any, hashedPassword: any) => {
    const result = await bcrypt.compare(password, hashedPassword);
    if (result) {
      req.session.isLoggedIn = true;
      console.log("Logged in!");
      return true;
    }
    else {
      console.log("Invalid username or password (line 99)");
      return false;
    }    
  };


  const query = `SELECT * FROM user WHERE username= ?`;

  db.get(query, username, async (err:any, row:any) => {
    if (err) {
      res.status(500).send({ error: "Couldn't login!" });
    } else {
      if (row) {
        console.log(password)
        console.log(row.ppassword)
        const result = await login(password, row.ppassword)
      if (result) {
      res.status(200).send({ message: "Logged in!", success: true });
      req.session.username = username;
      req.session.userID = row.id;
      req.session.isLoggedIn = true; 
      req.session.save();
      console.log("LOGGGED IN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      }
      else {
        res.status(401).send({ message: "Invalid username or password" });
      }
    }
    else {
      res.status(401).send({ message: "Invalid username or password" });
    }
  };
});

});

app.get('/logout', (req:any, res:any) => {
  req.session.isLoggedIn = false;
  console.log("LOGOUT HIT!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  req.session.save();
  res.send({ message: "Logged out successfully" });
});

app.get('/session', (req:any, res:any) => {
  if (req.session.isLoggedIn) {
    res.send({ isLoggedIn: true });
  } else {
    res.send({ isLoggedIn: false });
  }
});




// ROBOT ROUTES
app.get('/connect', async (req:any, res:any) => {
  console.log("Connecting...");
  const sessionQuery = 'INSERT INTO session (user_id, forwardCount, rightCount, leftCount, backCount, score) VALUES (?, 0, 0, 0, 0, 0) returning id;'
  try {
    const sessionID = db.run(sessionQuery, req.session.userID, function(err:any) {
      if (err) {
        res.status(500).send({ error: "Could not create session" });
      } else {
        console.log("Session created successfully, ID: ", this.lastID);
        req.session.sessionID = this.lastID;
        req.session.save();
      }
    });
    console.log("RIGHT BEFORE SENDING /connect to:")
    console.log(`http://${IP_ADDRESS}:5555/connect`)
    const response = await axios.get(`http://${IP_ADDRESS}:5555/connect`);
    console.log("sent it!")
    const data = response.data;
    console.log(data);
    res.send({ message: "Connected to robot: ", data: data });
    isConnected = true;
    console.log("Is connected: ", isConnected)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Failed to connect to robot :(" });
  }
});

app.get('/forward', async (req:any, res:any) => {
  console.log("hit get forward");
  try {
    db.run('UPDATE session SET forwardCount = forwardCount + 1, score = score + 1 WHERE id = ?', req.session.sessionID, function(err:any) {
    });
    const response = await axios.get(`http://${IP_ADDRESS}:5555/forward`);
    const data = response.data; 
    console.log(data);
    res.send({ message: "Forward robot", data: data }); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Failed to connect to robot :(" });
  }
});

app.get('/right', async (req:any, res:any) => {
  console.log("hit get right");
  try {
    db.run('UPDATE session SET rightCount = rightCount + 1, score = score + 1 WHERE id = ?', req.session.sessionID, function(err:any) {
    });
    const response = await axios.get(`http://${IP_ADDRESS}:5555/right`);
    const data = response.data; 
    console.log(data);
    res.send({ message: "right robot", data: data }); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Failed to connect to robot :(" });
  }
});

app.get('/left', async (req:any, res:any) => {
  console.log("hit get forward");
  try {
    db.run('UPDATE session SET leftCount = leftCount + 1, score = score + 1 WHERE id = ?', req.session.sessionID, function(err:any) {
    });
    // Use axios to make the HTTP GET request
    const response = await axios.get(`http://${IP_ADDRESS}:5555/left`);
    const data = response.data; // With axios, the response data is directly accessible
    console.log(data);
    res.send({ message: "left robot", data: data }); // Send back the data received from the axios call
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Failed to connect to robot :(" });
  }
});

app.get('/back', async (req:any, res:any) => {
  console.log("hit get forward");
  try {
    db.run('UPDATE session SET backCount = backCount + 1, score = score + 1 WHERE id = ?', req.session.sessionID, function(err:any) {
    });
    // Use axios to make the HTTP GET request
    const response = await axios.get(`http://${IP_ADDRESS}:5555/back`);
    const data = response.data; // With axios, the response data is directly accessible
    console.log(data);
    res.send({ message: "back robot", data: data }); // Send back the data received from the axios call
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Failed to connect to robot :(" });
  }
});



app.get('/disconnect', (req:any, res:any) => {
  console.log("hit get disconnect");
  const response = axios.get(`http://${IP_ADDRESS}:5555/disconnect`);
  isConnected = false;
  console.log("Is connected: ", isConnected)
  db.run('UPDATE session SET score = score * ? WHERE id = ?', req.session.username.length, req.session.sessionID, function(err:any) {
  });

  

  req.session.sessionID = null;
  req.session.save();
  console.log(req.session.sessionID)
  res.send({ message: "Disconnected from robot" });
});



app.post('/llama', async (req:any, res:any) => {
  console.log("app.ts /llama route hit...");
  try {
    const data = req.body;

    console.log("data from req body: ");
    console.log(data);

    
    //const response = await axios.post(`http://${IP_ADDRESS}:5000/submit`, data);
    // actually send locally to llama
    const response = await axios.post(`http://localhost:5000/submit`, data);
    
    const Resdata = response.data; 
    console.log("HERE COMES RESPONSE DATA LINE 277 app.ts");
    console.log(Resdata);
    res.send({ message: "success", data: Resdata }); // SENDING WHERE???
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: "Failed to connect to robot :(" });
  }
});



function getLeaderboardData() {
  return new Promise((resolve, reject) => {
    // Assuming 'id' is the column in the 'user' table, and 'user_id' links session to user
    const query = `SELECT user.username, session.id AS sessionID, session.score
                   FROM session
                   JOIN user ON session.user_id = user.id
                   ORDER BY session.score DESC
                   LIMIT 10`;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching leaderboard data:", err);
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(rows); // Resolve the promise with the fetched rows
        console.log(rows)
      }
    });
  });
}

app.get('/api/leaderboard', async (req:any, res:any) => {
  try {
    const leaderboardData = await getLeaderboardData();
    res.json(leaderboardData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching leaderboard data");
  }
});


// DEVELOPER PORTAL ENDPOINTS
app.get('/api/connected', (req:any, res:any) => {
  const connectedStatus = isConnected;
  res.json({ isConnected: connectedStatus });
})

module.exports = app;



