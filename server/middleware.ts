
import { Request, Response, NextFunction } from 'express';


// is logged in

export const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        if (req.session && req.session.isLoggedIn == true ) { 
            next();
        } else {
            res.status(401).send({ loggedIn: false });
        }
    };




