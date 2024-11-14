import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({isAdmin: false});

        if (!users) {
            res.status(404).json({ message: 'Users not found!' });
            console.log('No users were found');
            return;
        }

        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};

export const editUser = async  (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { name, email, image } =  req.body;

        const response = await User.findByIdAndUpdate(userId, { name, email, image });
        res.status(200).json({message: 'Updated user successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Failed to update the user', error });
    }
}

export const deleteUser = async  (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const response = await User.findByIdAndDelete(userId);
        res.status(200).json({message: 'Deleted user successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the user', error });
    }
}