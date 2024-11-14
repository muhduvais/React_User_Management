import React, { useEffect, useState } from 'react'
import customAxios from '../utils/apiClient';
import './AddUserModal.css'
import profile_pic from '../../public/profile_pic.png'
import { MdOutlineModeEdit } from "react-icons/md";
import { AxiosError } from 'axios';

const EditUserModal = ({ isOpen, onClose, fetchUsers, editDetails, clearEditDetails}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [nameMessage, setNameMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
      setEditId(editDetails.userId);
      setName(editDetails.name);
      setEmail(editDetails.email);
      setImageUrl(editDetails.image || profile_pic);
    }, [])

    // Handle profile change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setNewImageUrl(previewUrl);
      }
    };

    const handleEditUser = async (e: React.FormEvent) => {
      e.preventDefault();

      setIsFormLoading(true);
    
      const validateEmail = (email: string) => (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email);
      const validateName = (name: string) => (/^[a-zA-Z .'-]+$/).test(name);
    
      setName(name.trim());
      setEmail(email.trim());
      const nameValue = name.trim();
      const emailValue = email.trim();
    
      let isValid = true;
    
      if (!nameValue) {
        setNameMessage('Please enter your name');
        isValid = false;
      } else if (!validateName(nameValue)) {
        setNameMessage('Please enter a valid name');
        isValid = false;
      } else {
        setNameMessage('');
      }
    
      if (!emailValue) {
        setEmailMessage('Please enter the email');
        isValid = false;
      } else if (!validateEmail(emailValue)) {
        setEmailMessage('Please enter a valid email');
        isValid = false;
      } else {
        setEmailMessage('');
      }
    
      if (!isValid) return;
    
      let uploadedImageUrl = imageUrl;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const uploadResponse = await customAxios.post('/api/user/profilePicture', formData);
          uploadedImageUrl = uploadResponse.data.imageUrl;
        } catch (error) {
          setErrorMessage('Failed to upload profile picture');
          return;
        }
      }
    
      try {
        const response = await customAxios.put(`/api/admin/editUser/${editId}`, {
          name,
          email,
          image: uploadedImageUrl,
        });
    
        if (response.status === 200) {
          setName('');
          setEmail('');
          fetchUsers();
          clearEditDetails();
          setEditId(null);
          onClose();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          setErrorMessage(errorMessage);
        } else {
          console.error('Edit failed:', error);
          setErrorMessage('An unexpected error occurred');
        }
      } finally {
        setIsFormLoading(false);
      }
    };    

  return (
    <>
    <div className="modal main-container w-screen h-screen flex items-center justify-center text-[#DDD8D5]">
      <div className="login-form border-[5px] bg-[#222222] border-[#ddd8d525] transition-all duration-300 rounded-xl max-w-xl w-[400px] p-3">
      <h2 className='p-4 pb-8 text-5xl font-bold'>Edit User</h2>
      {errorMessage && <span className='p-3 opacity-75 font-semibold text-red-400'>{errorMessage}</span>}
      <hr className='opacity-20'/>
        <form onSubmit={handleEditUser} className='py-5'>

                    <div className="profile-picture-wrapper rounded-full w-36 h-36 overflow-hidden bg-[#222222] border-2 border-[#ddd8d525] mx-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center text-gray-500">Updating...</div>
                        ) : (
                            <img src={newImageUrl || imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="bg-[#53525125] hover:bg-transparent cursor-pointer p-1 rounded border-2 border-transparent hover:border-[#4cc98843] transition-all duration-300 m-3 flex items-center justify-center">
                        <MdOutlineModeEdit size="25" color='#4cc9887d' />
                    </label>

        <div className="input-field flex flex-col p-3 gap-y-2">
            {nameMessage ? <label htmlFor="name" className='opacity-75 font-semibold text-red-400'>{nameMessage}</label>
            : <label htmlFor="name" className='opacity-75 font-semibold' >name</label>}
            <input 
            type="text" 
            name="name" 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`transition-all duration-300 bg-[#242424] px-3 py-1 text-xl font-semibold border-b-[3px] ${nameMessage ? 'border-red-400' : 'border-[#DDD8D5]'} border-opacity-20 focus:border-opacity-75 outline-none`}/>
          </div>

          <div className="input-field flex flex-col p-3 gap-y-2">
            {emailMessage ? <label htmlFor="email" className='opacity-75 font-semibold text-red-400'>{emailMessage}</label>
            : <label htmlFor="email" className='opacity-75 font-semibold'>Email</label>}
            <input 
            type="text" 
            name="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`transition-all duration-300 bg-[#242424] px-3 py-1 text-xl font-semibold border-b-[3px] ${emailMessage ? 'border-red-400' : 'border-[#DDD8D5]'} border-opacity-20 focus:border-opacity-75 outline-none`}/>
          </div>
          <div className="btns flex items-center justify-end gap-x-2 mx-3 mb-2 mt-5">
            <button type='button' className='px-4 transition-all duration-300 py-1 text-xl text-[#ddd8d591] hover:text-[#ddd8d5cd] active:text-[#4cc9887d] active:border-[#ddd8d556] font-bold rounded-md border-[3px] border-[#ddd8d531] hover:border-[#ddd8d58d]'
            onClick={onClose}>Cancel</button>
            <button type='submit' className='px-4 transition-all duration-300 py-1 text-xl text-[#4CC988] active:text-[#4cc9887d] active:border-[#ddd8d556] font-bold rounded-md border-[3px] border-[#ddd8d556] hover:border-[#ddd8d58d]'>{isFormLoading ? 'Updating...' : 'Edit User'}</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default EditUserModal;