import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import ConnectionStatus from './ConnectionStatus';


const Main = () => {
  const { isLoggedIn } = useAuth();

  const handleButtonClick = (action: any) => {
    console.log(action);
    fetch('/' + action)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('Connecting...');

    try {
      const response = await axios.get('/connect');
      
      setConnectionStatus(`Connected!`);
    } catch (error) {
      console.error('Error connecting to robot:', error);
      setConnectionStatus('Failed to connect to robot :(');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(false);
    setConnectionStatus('Disconnected!');

    try {
      const response = await axios.get('/disconnect');
    } catch (error) {
      console.error('Error disconnecting to robot:', error);
      setConnectionStatus('Problem disconnecting :( ');
    } finally {
      setIsConnecting(false);
    }
  };


  const handleKeyPress = (event: any) => {
    if (!isLoggedIn) {
      return;
    }
    switch (event.key) {
      case 'w':
        handleButtonClick('forward');
        break;
      case 'a':
        handleButtonClick('left');
        break;
      case 's':
        handleButtonClick('back');
        break;
      case 'd':
        handleButtonClick('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isLoggedIn]);


  return (
    <div className="content-container">
            {isLoggedIn ? (
        <>


        <ul className="robot">
                  {/* <li><button onClick={() => handleButtonClick('connect')}>Connect</button></li> */}
                  <div>
                    <button onClick={handleConnect} disabled={isConnecting}>
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                    <p>{connectionStatus}</p>
                  </div>
                  <li><button onClick={() => handleButtonClick('forward')}>Forward</button></li>
                  <li><button onClick={() => handleButtonClick('right')}>Right</button></li>
                  <li><button onClick={() => handleButtonClick('left')}>Left</button></li>
                  <li><button onClick={() => handleButtonClick('back')}>Back</button></li>
                  <div>
                    <button onClick={handleDisconnect} disabled={isConnecting}>
                      {isConnecting ? 'Disconnecting...' : 'Disconnect'}
                    </button>

                  </div>
              </ul>
              
              <div className='box'>
        <p> Directions: 
              <li> Press 'Connect', wait for it to (hopefully!) connect</li>
              <li> Drive with the buttons or the W-A-S-D keys</li>
              <li> Press 'Disconnect' when you're done!</li>
              <li> Troubleshooting within the website is...limited. Best bet is to relaunch whole thing (including rebooting Dash!)</li>

        </p>
        </div>
              </>

              

    )  : (
      <>
      <div className='grid-container'>
      <div className='box'>
            <p> (This website really only is worth bothering with if you have a Dash Robot! You can buy a new one from directly Wonder Workshop or get a used on on Ebay!) </p>
          </div>
          <div className='box'>
              <p> Welcome, stranger! This is a website that lets you connect to and Drive a Dash Robot, to get started make an account (or do whatever you feel like doing)</p>
            </div>
            </div>
            <div className='box full-width'>
              <img src='/dash.webp' alt='dash robot' />
            </div>
            <div className="challenge">
          <p className='challenge-title' >Purple Boxes Contain Challenges!</p>
          <p>
            Look out for purple boxes as you browse the site, they contain challenges (which are really just pointers towards interesting features of this and many other websites). It's so hard to gauge difficulty, so don't get discouraged if they're tricky (or too cocky if they're easy)!
          </p>
        </div>
            <div className='box'>
                <p>
                  "If I have seen further it is by standing on the shoulders of Giants." - Sir Isaac Newton
                </p>
                <p>
                  Links and resources that made this possible: 
                  <li> <a href='https://github.com/playi/WonderPy'>Wonder Workshop</a> Official API for the Dash</li>
                  <li> <a href='https://github.com/IlyaSukhanov/morseapi'>https://github.com/IlyaSukhanov/morseapi</a> Excellent unofficial API</li>
                  <li> <a href='https://github.com/mewmix/bleak-dash'>https://github.com/mewmix/bleak-dash</a> Another Excellent Unofficial API</li>
                  <li> <a href='https://github.com/burkeholland/express-react-starter'>https://github.com/burkeholland/express-react-starter</a> I am lazy</li>
                </p>
              </div>

            </>
            
    )
}

              <div className='box'>
                <p>
                  The web is a social technology! Is something not working? Reach out on github! Happy driving!
                </p>
              </div>



    </div>

  );
};

export default Main;
