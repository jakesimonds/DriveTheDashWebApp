import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const ConnectionStatusBox: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get('/api/connected');
        console.log("RESPONSE DATAAAAAA");
        console.log(response.data);
        // Assume the response is a boolean directly, or adapt this line as needed
        setIsConnected(response.data === true);
      } catch (error) {
        console.error('Error fetching connection status', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkConnection();
  }, []);
  


  
  let boxClass = 'ConnnectionBox';
  let message = 'Checking...';

  if (!isLoading) {
    boxClass += isConnected ? ' red' : ' yellow';
    message = isConnected ? 'Robot Already Connected' : 'Robot Available to Connect';
  }

  return <div className={boxClass}>{message}</div>;
};

export default ConnectionStatusBox;
