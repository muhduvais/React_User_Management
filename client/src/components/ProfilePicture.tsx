import React, { useState, useEffect } from 'react';
import axios from '../utils/apiClient';
import { MdOutlineModeEdit } from "react-icons/md";
import profile_pic from '../../public/profile_pic.png'


interface ProfilePictureProps {
  user: {
    name: string;
    email: string;
    image?: string;
  } | null;
  onUploadComplete: (imageUrl: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, onUploadComplete }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('User: ', user);
    if (user) {
      setImageUrl(user.image || profile_pic);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadProfilePicture(selectedFile);
    }
  };

  const uploadProfilePicture = async (file: File) => {

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/user/profilePicture', formData);
      setImageUrl(response.data.imageUrl);
      onUploadComplete(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-picture-container flex flex-col items-center">
      <div className="profile-picture-wrapper rounded-full w-36 h-36 overflow-hidden bg-[#222222] border-2 border-[#ddd8d525]">
        {isLoading && <div className="w-full h-full flex items-center justify-center text-gray-500">
            Updating...
        </div>}
        {!isLoading && imageUrl ? (
          <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Profile Picture
          </div>
        )}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-[#72716f25] hover:bg-[#c6c2bc25] cursor-pointer p-1 rounded transition-all duration-300 m-3"
      >
        <MdOutlineModeEdit size="25" color='#4cc9887d' />
      </label>
    </div>
  );
};

export default ProfilePicture;
