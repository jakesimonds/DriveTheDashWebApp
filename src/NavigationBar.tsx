import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import {AuthContext, AuthContextType, useAuth } from './AuthContext';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//const history = useHistory();



const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  //const { isLoggedIn } = React.useContext<AuthContextType>(useAuth);
  const { isLoggedIn } = useAuth();

  const HandleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Logout successful');
        logout();
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div>
      <Navbar className="navbar" fixed="top">
      <Navbar.Brand href="/" className="navbar-brand-custom">
          Drive The Dash!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="ms-auto">
                <Button className="navbar-button" href="/api" style={{ marginLeft: '10px' }}>Dev Portal</Button>
                <Button className="navbar-button" href="/leaderboard" style={{ marginLeft: '10px' }}>Leaderboard</Button>
            {isLoggedIn ? (
              <>
                {/* Items to show when user is logged in */}
                <Button className="navbar-button" href='/' style={{ marginLeft: '10px' }} onClick={HandleLogout}>Logout</Button>
              </>
            ) : (
              <>
                {/* Items to show when user is logged out */}

                <Button className="navbar-button" href="/register" style={{ marginLeft: '10px' }}>Register</Button>
                <Button className="navbar-button" href="/login" style={{ marginLeft: '10px' }}>Log In</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );


}

export default NavigationBar;
