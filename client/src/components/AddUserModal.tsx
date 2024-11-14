import React, { useState } from 'react'
import axios from '../utils/urlProxy';
import './AddUserModal.css'
import { AxiosError } from 'axios';

interface AddUserModalProps {
  isOpen: () => boolean;
  onClose: () => void;
  fetchUsers: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, fetchUsers}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const validateEmail = (email: string) => {
          return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email);
        };

        const validateName = (name: string) => {
            return (/^[a-zA-Z .'-]+$/).test(name);
        }
    
        setName(name.trim());
        setEmail(email.trim());
        const nameValue = name.trim();
        const emailValue = email.trim();
        const passwordValue = password.trim();

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
    
        if (!passwordValue) {
          setPasswordMessage('Please enter the password');
          isValid = false;
        } else if (passwordValue.length < 6) {
          setPasswordMessage('Minimum 6 characters');
          isValid = false;
        } else {
          setPasswordMessage('');
        }

        if (!isValid) return;

        if (!nameMessage && !emailMessage && !passwordMessage) {
            try {
               await axios.post('/api/auth/register', { name, email, password });
               alert('Created user successfully.');
               setName('');
               setEmail('');
               setPassword('');
               fetchUsers();
               onClose();
            } catch (error) {
                if (error instanceof AxiosError) {
                    const errorMessage = error.response?.data?.message || 'An error occurred';
                    setErrorMessage(errorMessage);
                  } else {
                    console.error('Login failed:', error);
                    setErrorMessage('An unexpected error occurred');
                  }
            }
        }
      }

  return (
    <>
    <div className="modal main-container w-screen h-screen flex items-center justify-center text-[#DDD8D5]">
      <div className="login-form border-[5px] bg-[#222222] border-[#ddd8d525] transition-all duration-300 rounded-xl max-w-xl w-[400px] p-3">
      <h2 className='p-4 pb-8 text-5xl font-bold'>Add User</h2>
      {errorMessage && <span className='p-3 opacity-75 font-semibold text-red-400'>{errorMessage}</span>}
      <hr className='opacity-20'/>
        <form onSubmit={handleAddUser} className='py-5'>
        <div className="input-field flex flex-col p-3 gap-y-2">
            {nameMessage ? <label htmlFor="name" className='opacity-75 font-semibold text-red-400'>{nameMessage}</label>
            : <label htmlFor="name" className='opacity-75 font-semibold'>name</label>}
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
          <div className="input-field flex flex-col p-3 gap-y-2">
            {passwordMessage ? <label htmlFor="password" className='opacity-75 font-semibold text-red-400'>{passwordMessage}</label>
            : <label htmlFor="password" className='opacity-75 font-semibold'>Password</label>}
            <input 
            type="password" 
            name="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`transition-all duration-300 bg-[#242424] px-3 py-1 text-xl font-semibold border-b-[3px] ${passwordMessage ? 'border-red-400' : 'border-[#DDD8D5]'} border-opacity-20 focus:border-opacity-75 outline-none`}/>
          </div>
          <div className="btns flex items-center justify-end gap-x-2 mx-3 mb-2 mt-5">
            <button type='button' className='px-4 transition-all duration-300 py-1 text-xl text-[#ddd8d591] hover:text-[#ddd8d5cd] active:text-[#4cc9887d] active:border-[#ddd8d556] font-bold rounded-md border-[3px] border-[#ddd8d531] hover:border-[#ddd8d58d]'
            onClick={onClose}>Cancel</button>
            <button type='submit' className='px-4 transition-all duration-300 py-1 text-xl text-[#4CC988] active:text-[#4cc9887d] active:border-[#ddd8d556] font-bold rounded-md border-[3px] border-[#ddd8d556] hover:border-[#ddd8d58d]'>Add User</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default AddUserModal;