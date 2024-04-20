import React, {useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios('/api/leaderboard');
        setData(result.data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'sessionID',
      dataIndex: 'sessionID',
      key: 'sessionID',
    },
  ];


  return (
    <div style={{ padding: '20px' }}>
      <div className="boxes-container">
        <div className="box">
          <p>
          Welcome to the Leaderboard! Every time a user has a session with the Dash robot, the user session gets a 'score'. The score doesn't really mean anything, but it's also not totally random either. The top scores can be seen below in this table (which I didn't make! I imported it from <a href="https://ant.design">ant.design</a>).
          </p>
        </div>

      </div>
      <Table dataSource={data} columns={columns} />

      <div className="challenge">
          <p className='challenge-title' >Challenge:</p>
          <p>
            What's one thing you could tell someone to help them get a high score? (Hint: score is calculated in a file called 'app.ts' in /server)
          </p>
        </div>
    </div>
  );
};

export default Leaderboard;
