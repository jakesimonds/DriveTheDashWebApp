import session from 'express-session';

//import "express-session";

declare module 'express-session' {
  interface SessionData {
    userId?: number; // Adjust the type according to your actual usage
    isLoggedIn?: boolean;
    username?: string;
  }
}

