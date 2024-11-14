import React, { useState } from 'react'
import axios from '../utils/urlProxy'
import { useDispatch } from 'react-redux'
import { login } from '../redux/slices/authSlice'
import { Link } from 'react-router-dom';
import './LoginPage.css'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios';
import apiClient from '../utils/apiClient';
import Cookies from 'js-cookie';

const LoginPage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (e) => {
    const inputEmail = e.target.value.trim();
    setEmail(inputEmail);

    const validate = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    if ((emailMessage || errorMessage) && !validate(inputEmail)) {
      setEmailMessage('Please enter a valid email!');
    } else {
      setEmailMessage('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validate = (email: string) => {
      return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email);
    };

    const inputPassword = password.trim();

    setEmailMessage('');
    setPasswordMessage('');

    let isValid = true;

    if (!email) {
        setEmailMessage('Please enter the email');
        isValid = false;
    } else if (!validate(email)) {
      setEmailMessage('Please enter a valid email');
      isValid = false;
    }

    if (!inputPassword) {
        setPasswordMessage('Please enter the password');
        isValid = false;
    } else if (inputPassword.length < 6) {
        setPasswordMessage('Minimum 6 characters');
        isValid = false;
    }

    if (isValid) {

        try {
            const response = await axios.post('/api/auth/login', { 
                email, 
                password: inputPassword 
            });

            console.log('Response: ', response)

            if (response.status !== 200) {
                return setErrorMessage(response.data.message);
            }

            if (response.data) {
              const { token, refreshToken, name, email, isAdmin } = response.data;

              dispatch(login({ name, email, token, refreshToken }));
              if (isAdmin) {
                navigate('/admin/dashboard');
              } else {
                navigate('/home');
              }
            }
        } catch (error: unknown) {
          // setIsLoading(false);
          if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setErrorMessage(errorMessage);
          } else {
            console.error('Login failed:', error);
            setErrorMessage('An unexpected error occurred');
          }
        } finally {
          // setIsLoading(false);
        }
    }
};

  return (
    <>
    <div className="main-container w-screen h-screen flex items-center justify-center bg-[#222222] text-[#DDD8D5]">
      <div className="login-form border-[5px] border-[#ddd8d525] transition-all duration-300 rounded-xl max-w-xl w-[400px] p-3">
      <div className='login-title flex items-center justify-start gap-x-2 p-4 pb-8 text-5xl font-bold'>
        <h2>Login</h2> 
        {isLoading && <div className="tenor-gif-embed" data-postid="18368917" data-share-method="host" data-aspect-ratio="1" data-width="10%"></div>}
      </div>
      {errorMessage && <span className='p-3 opacity-75 font-semibold text-red-400'>{errorMessage}</span>}
      <hr className='opacity-20'/>
        <form onSubmit={handleLogin} className='py-5'>
          <div className="input-field flex flex-col p-3 gap-y-2">
            {emailMessage ? <label htmlFor="email" className='opacity-75 font-semibold text-red-400'>{emailMessage}</label>
            : <label htmlFor="email" className='opacity-75 font-semibold'>Email</label>}
            <input
            type="text" 
            name="email" 
            id="email" 
            value={email}
            onChange={validateEmail}
            className={`transition-all duration-300 bg-[#242424] px-3 py-1 text-xl font-semibold border-b-[3px] ${emailMessage || errorMessage ? 'border-red-400' : 'border-[#DDD8D5]'} border-opacity-20 focus:border-opacity-75 outline-none`}/>
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
            className={`transition-all duration-300 bg-[#242424] px-3 py-1  text-xl font-semibold border-b-[3px] ${passwordMessage || errorMessage ? 'border-red-400' : 'border-[#DDD8D5]'} border-opacity-20 focus:border-opacity-75 outline-none`}/>
          </div>
          <div className="btns flex items-center justify-between mx-3 mb-2 mt-5">
            <button type='submit' className='px-4 transition-all duration-300 py-1 text-xl text-[#4CC988] active:text-[#4cc9887d] active:border-[#ddd8d556] font-bold rounded-md border-[3px] border-[#ddd8d556] hover:border-[#ddd8d58d]'>Submit</button>
            <div className='new-user text-[13px]'><span className='opacity-60 pr-2'>Not Registered?</span><Link to="/register" className='text-[#4CC988] font-semibold pr-1 hover:underline'>Register Now</Link></div>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default LoginPage;