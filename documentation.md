## 1. Goals
See [proposal](proposal/proposal.md).
   

## 2. Plan

See [plan](proposal/plan.md). 
Scope narrowed as the project progressed, and I did not get to everything in v0.3, but I did complete everything up to that point and the final push to get the project finished had to do with styling, which I had neglected in my plan but was important. 
  

## 3. Design Decisions

### Starting with Starter repo
[https://github.com/burkeholland/express-react-starter](https://github.com/burkeholland/express-react-starter) 
- Pro:
	- gave me boilerplate I didn't want to write & connected front and backend for me
	- made some architecture decisions (that I didn't have strong opinions on anyways & would have been anxious to make myself) for me
- Con:
	- Added bloat of files I don't totally understand
	- Ex: webpack warnings I can't seem to get rid of
	- stuck with architecture decisions I didn't even make!
### Swapping out Dash APIs
I started the project with a feature-full but fussy-to-boot (at least in how I set it up I needed python2.7, linux, and the bluetooth bot address hardcoded) API (https://github.com/IlyaSukhanov/morseapi). I swapped this out for an in progress API (https://github.com/mewmix/bleak-dash) that was less feature-full, but was a breeze to connect. 
Pro: 
- Made my project potentially easier for future users to clone down and run
Con: 
- Idea for API portal was based on features I couldn't find in the new repo

Overall, happy with my decision. Plus, it was nice to support the second API which is in progress actively. 

### Narrowing Scope
I started with notions that I could potentially deploy on my own hardware, and that there would be a webcam to support people driving the robot from anywhere. That didn't happen. 
Pro: 
- Narrowing the scope allowed me to focus on what was working, which was making something cool for people in one room on one wifi connection to enjoy
Con: 
- would have been cool to do more

## 4. Accomplishments
- Very fun exploring open source Wonder Workshops Dash ecosystem
- Gained familiarity with all the technologies (all pretty new to me)
- Actually implementing things like middleware and authorization were useful exercises & reinforced my limited understanding
- Focusing on the use-case of potentially making something a teacher could use in a lesson was a really helpful framework that helped me narrow the scope and get this finished.
- Contributed something novel to the Dash robot ecosystem
  

## 5. User Guidelines

### What is it?

`Drive The Dash` is an experimental website that is designed to be cloned & run locally over wifi & allow people with a Wonder Workshop Dash robot to have fun driving their robot over the web, and learn however much they want to learn about web development.
  
For instance, a teacher could clone and run the site locally, and a classroom of students could take turns connecting to the robot, but also exploring the Dev Portal, doing the challenges on each page, etc.

### Directions to run locally

#### The easy way
Open a terminal, clone this repo, cd into it, and run './run.sh'. Assumes you have pip and npm.

(Downside to this is that if anything goes wrong it will be a pain to end all the processes manually (`lsof -i :<ports (3000,3001,5555)>` & then manually `kill <pid>` for each process is how I've gotten out of it))
#### The hard way

0
  
clone this repo, cd into it

1

```

npm install

npm start # start the front end

```


2

```

cd server # I often make a new terminal so I then have two terminal instances

```

3

```

npm install

npm start # start the back end

```

4.

```

cd ..

cd bleak-dash # I often make a new terminal instance...

```

5

```

# conda create --name RobotEnv python=3.10 # Optional step (3.8 & above should be fine I use 3.10)

# conda activate RobotEnv

pip install -r requirements.txt

python app.py

```

Finally, launch a browser & go to youripaddress:3001. In a group setting, you can find the ipaddress of the host (`ifconfig en0 | grep inet`

on mac) and then others should be able to connect (unless security things I don't understand prevents you)

### Tech Stack

- Typescript
- Express backend
- React front-end
- SQLite database
- Also:
	- Swagger auto-generated docs from .yaml file
	- Ant.design table
	- Flask app supporting Bleak (bluetooth protocol) Dash Robot API

## 6. Lessons Learned
- CSS indecision is ill-advised
	- I deferred making decisions on how I would style things, but then as I built I accumulated different styles of css from the template app I started from, chatGPT suggestions, and my own naive messing around. It was no fun.
- Separation of content from code was missed
	- I tried at one point to make it so you could write .md files and then basically feed them into react, but I had already started doing things more naively (just with raw text) and it was a little harder than I thought, so I gave up. Next time I do anything like this I'll make sure I have that functionality
- There's a lot of moving pieces in a web app
	- Things like user authentication, nav bars, database integration, and just basic separations of concerns between front and back end took a lot longer than I imagined it would. Since I had seen examples of all these things before, and felt I had a good conceptual grasp of them, I thought they would go pretty smoothly. This being the first time I've ever done this, though, it took a while. 

## 7. References

- [https://github.com/IlyaSukhanov/morseapi](https://github.com/IlyaSukhanov/morseapi)
- [https://github.com/mewmix/bleak-dash](https://github.com/mewmix/bleak-dash) 
- [https://github.com/burkeholland/express-react-starter](https://github.com/burkeholland/express-react-starter)
- https://ant.design