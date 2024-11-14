import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import cloudinary from 'cloudinary';
import multer from 'multer';

cloudinary.v2.config({
    cloud_name: 'dq7kramm9', // Change it
    api_key: '166253346469816',
    api_secret: 'KL3TNbaCxAAiIzx1vXj2aI15o1g',
});

interface EditRequest {
    name: string;
    email: string;
}

// Edit user
export const editUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const decodedUser = req.user;
        const { name, email }: EditRequest = req.body;

        const user: IUser | null = await User.findByIdAndUpdate(decodedUser.userId, { name, email });

        if (!user) {
            res.status(404).json({ message: 'User not found!' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;;
        const file = req.file as Express.Multer.File;

        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
            public_id: `profile-pictures/${userId}`,
            secure: true,
        });

        const imageUrl = uploadResponse.secure_url;
        await User.findByIdAndUpdate(userId, { image: imageUrl });

        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ message: 'Error updating profile picture' });
    }
};

// const saveProfilePicture = async (file: Express.Multer.File, userId: string): Promise<string> => {
//     try {
//         const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
//             public_id: `profile-pictures/${userId}`,
//             secure: true,
//         });

//         return uploadResponse.secure_url;
//     } catch (error) {
//         console.error('Error uploading profile picture to Cloudinary:', error);
//         throw error;
//     }
// };