## What is it?  

DEMO: [2-min functionality demo](https://youtu.be/4DF0minFRTY?si=VUnZnfDxk-GtGXOp)

`Drive The Dash` is an experimental website that is designed to be cloned & run locally over wifi & allow people with a Wonder Workshop Dash robot to have fun driving their robot over the web, and learn however much they want to learn about web development. 

For instance, a teacher could clone and run the site locally, and a classroom of students could take turns connecting to the robot, but also exploring the Dev Portal, doing the challenges on each page, etc. 

## Directions to run locally

### The easy way
Open a terminal, clone this repo, cd into it, and run './run.sh'. Assumes you have pip and npm. 

Downside to this is that if anything goes wrong it will be a pain to end all the processes manually (`lsof -i :<ports (3000,3001,5555)>` & then manually `kill <pid>` for each process is how I've gotten out of it).
### The hard way
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
npm start # start the  back end
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

## Tech Stack
- Typescript
    - Express backend
    - React front-end
- SQLite database
- Also:
	- Swagger auto-generated docs from .yaml file
	- Ant.design table
	- Flask app supporting Bleak (bluetooth protocol) Dash Robot API

## External Resources
- [https://github.com/IlyaSukhanov/morseapi](https://github.com/IlyaSukhanov/morseapi)
	- really amazing API, was what I started with, but how I did it at least it needs linux + python2.7
- [https://github.com/mewmix/bleak-dash](https://github.com/mewmix/bleak-dash) 
	- Built on the above I think? Gained cross-platform portability & ease of boot-up. 
- [https://github.com/burkeholland/express-react-starter](https://github.com/burkeholland/express-react-starter) 
	- Pro:
		- gave me boilerplate I didn't want to write & connected front and backend for me
		- made some architecture decisions (that I didn't have strong opinions on anyways & would have been anxious to make myself) for me 
	- Con: 
		- Added bloat of files I don't totally understand
			- Ex: webpack warnings I can't seem to get rid of
		- stuck with architecture decisions I didn't even make!
- Dash Robot
	- Really can't complain, this was a pretty big risk to incorporate something so out of left field. It definitely introduced complications & even now I don't handle all the errors from the device itself completely gracefully but it did make the project fun
	- pretty cool device overall, would recommend 10/10 (they're ~$40 on ebay)

## Things cut from scope
- Webcam
	- Would be cool, but just didn't get to it
- Deploying
	- Scope of project shifted to making something designed to be pulled down and run locally

## Things that went well
- Very fun exploring open source Wonder Workshops Dash ecosystem
- Gained familiarity with all the technologies (all pretty new to me)
- Actually implementing things like middleware and authorization were useful exercises & reinforced my limited understanding
- Focusing on the use-case of potentially making something a teacher could use in a lesson was a really helpful framework that helped me narrow the scope and get this finished. 

## Next time I'll do differently
- css: pick one strategy and stick to it! 
	- I deferred making decisions on how I would style things, but then as I built I accumulated different styles of css from the template app I started from, chatGPT suggestions, and my own naive messing around. It was no fun. 
- Separation of content from code
	- I tried at one point to make it so you could write .md files and then basically feed them into react, but I had already started doing things more naively (just with raw text) and it was a little harder than I thought, so I gave up. Next time I do anything like this I'll make sure I have that functionality
- make a website you can actually put on the web
	- This was fun, and I hope someday someone with a Dash finds it and uses it and learns something. It does feel a little stupid to have made a website that pretty much couldn't possibly be deployed without being a huge pain in the butt. 

## To Do:
- [ ] finish the Dev Portal
	- [ ] research into existing unofficial APIs 
- [ ] get robot to turn both ways (currently only turns one way...)
- [ ] Complementary static webpage for project?



