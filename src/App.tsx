// import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import NavigationBar from "./NavigationBar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import API from './API';
import Leaderboard from './Leaderboard';
import Login from './Login';
import Register from './Register';
import { AuthProvider } from './AuthContext';
import Main from './Main';
import Footer from './footer';









function App() {
  return (
    <AuthProvider>
    <Router>
        <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <div className='content'>
          <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/api" element={<API />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


          </Routes>

        </div>
        <Footer />
        </div>

    </Router>
    </AuthProvider>
  );
}

export default App;