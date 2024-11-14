import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface AuthResponse {
    name: string;
    email: string;
    isAdmin?: boolean;
    token?: string;
    refreshToken?: string;
}

// Get user
export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const decodedUser = req.user;
        const user = await User.findById(decodedUser.userId).select('name email image');

        if (!user) {
            res.status(404).json({ message: 'User not found!' });
            console.log('No user was found');
            return;
        }

        console.log('User in controller: ', user);

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user', error });
    }
};

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password }: RegisterRequest = req.body;
        console.log("Register request:", { name, email });

        // Check if user already exists
        const existingUser: IUser | null = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);

        // Create new user
        const newUser: IUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log('User registered:', newUser);

        const responseData: AuthResponse = {
            name: newUser.name,
            email: newUser.email
        };

        res.status(201).json(responseData);

    } catch (error) {
        console.error('Registration error:', error instanceof Error ? error.message : error);
        res.status(500).json({
            message: 'Error registering user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password }: LoginRequest = req.body;

        const user: IUser | null = await User.findOne({ email }).select('name email password isAdmin');

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate tokens
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '1h' });

        const responseData: AuthResponse = {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: accessToken,
            refreshToken: refreshToken,
        };

        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Login error:', error instanceof Error ? error.message : error);
        res.status(500).json({
            message: 'Error logging in',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        console.log('Cleared cookies, user logged out!')
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error during logout' });
    }
};

// Refresh token end-point
export const refreshToken = (req: Request, res: Response): void => {
    const { refreshToken } = req.body;

    console.log('refreshToken: ', refreshToken)
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token not found' });
        console.log('refresh token: ', refreshToken);
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }
        console.log('Refresh token verified!')

        const userId = (decoded as jwt.JwtPayload).userId;

        const newAccessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });
        console.log('New access token created!')

        res.status(200).json({ token: newAccessToken });
    });
};