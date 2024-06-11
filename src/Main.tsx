import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import ConnectionStatus from './ConnectionStatus';
import LlamaInput from './llamaInput';

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

  const [sendingToLlama, setSendingToLlama] = useState(false);
  const [llamaStatus, setLlamaStatus] = useState('');

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


  const handleLlamaSubmit = (text: any) => {
    // Submit the text to another service
    setSendingToLlama(true);
    setLlamaStatus('Sending...');

    fetch('http://localhost:3000/llama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    setSendingToLlama(false);
  };


  const handleKeyPress = (event: any) => {
    if (!isLoggedIn) {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
        handleButtonClick('forward');
        break;
      case 'ArrowLeft':
        handleButtonClick('left');
        break;
      case 'ArrowDown':
        handleButtonClick('back');
        break;
      case 'ArrowRight':
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
                      <div className='box'>
        <p> Directions: 
              <li> There are two ways to control the robot: buttons or the Llama Llama text interface </li>
              <li> You must be connected to the robot for anything to work! Button or Llama Llama to connect</li>
              <li> Have fun!</li>

        </p>
        </div>

        <div className='llama-arrows'>
        <div className="robot">
                  {/* <div className="grid-container"> */}
                  <div className="arrow-keys">
                  <div>
                    <button className="connect" onClick={handleConnect} disabled={isConnecting}>
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                    <p>{connectionStatus}</p>
                  </div>
                  <div className="forward"><button onClick={() => handleButtonClick('forward')}>Forward</button></div>
                  <div className="right"><button onClick={() => handleButtonClick('right')}>Right</button></div>
                  <div className="left"><button onClick={() => handleButtonClick('left')}>Left</button></div>
                  <div className="back"><button onClick={() => handleButtonClick('back')}>Back</button></div>
                  <p>(Arrow keys on your keyboard also work!)</p>
                  </div>
                  {/* </div> */}
        </div>


                  <div>
                    <div className='box'>
                    <div><LlamaInput onSubmit={handleLlamaSubmit} /></div>
                    <p></p>
                    </div>
                  </div>
              
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
