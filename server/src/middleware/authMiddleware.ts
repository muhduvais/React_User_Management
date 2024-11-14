import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'User not found!' });
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
        if (err) {
            console.log('JWT verify error:', err);
            
            if (err instanceof TokenExpiredError) {
                console.log('Access token expired');
                res.status(401).json({ message: 'Token expired' });
            } else {
                console.log('Token invalid:', err.message);
                res.status(403).json({ message: 'Token is invalid' });
            }
            return;
        }

        console.log('Token verified, storing user in request');
        req.user = decoded;
        next();
    });
};