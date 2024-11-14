import React, { useEffect, useState, useRef, useTransition } from 'react';
import { MdEdit, MdDone, MdEmail } from "react-icons/md";
import { BiDotsHorizontal } from "react-icons/bi";
import Navbar from '../components/Navbar';
import { AxiosError } from 'axios';
import customAxios from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import './Home.css';

const Home = () => {

  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (editName && nameRef.current) {
        nameRef.current.focus();
    }
    if (editEmail && emailRef.current) {
        emailRef.current.focus();
    }
  }, [editName, editEmail]);


    useEffect(() => {

        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await customAxios.get('/api/auth/user');
                if (response.status === 200) {
                  setUser(response.data);
                  setUserName(response.data.name);
                  setEmail(response.data.email);
                } else {
                  navigate('/login');
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [nameLoading, emailLoading]);

    const editUser = async (type: string) => {
        type === 'name' ? setNameLoading(true) : setEmailLoading(true);

        setErrorMessage('');

        const validateEmail = (email: string) => {
            return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email);
          };
  
          const validateName = (name: string) => {
              return (/^[a-zA-Z .'-]+$/).test(name);
          }

          let valid = true;

          if (type === 'name') {
            const nameValue = userName.trim();
            if (!nameValue) {
                setErrorMessage('Please enter your name');
                valid = false;
                nameRef.current.focus()
            } else if (!validateName(nameValue)) {
                setErrorMessage('Please enter a valid name');
                valid = false;
                nameRef.current.focus()
            }
          } else {
            const emailValue = email.trim();
            if (!emailValue) {
                setErrorMessage('Please enter the email');
                valid = false;
                emailRef.current.focus()
            } else if (!validateEmail(emailValue)) {
                setErrorMessage('Please enter a valid email');
                valid = false;
                emailRef.current.focus()
            }
          }

          if (!valid) {
            setNameLoading(false);
            setEmailLoading(false);
            return;
          }

        const userInfo = {
            name: type === 'name' ? userName.trim() : user.name,
            email: type === 'email' ? email.trim() : user.email,
        }

        try {
            const response = await customAxios.put('/api/user/editUser', userInfo);
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'An error occurred';
                alert(errorMessage);
              } else {
                console.error('updation failed:', error);
                alert('An unexpected error occurred');
              }
        } finally {
            if (type === 'name') {
                setEditName(false);
                setNameLoading(false);
            } else {
                setEditEmail(false);
                setEmailLoading(false);
            }
        }
    }

    const handleProfilePictureUpload = (imageUrl: string) => {
        setUser((prevUser) => ({
          ...prevUser,
          image: imageUrl,
        }));
      };

  return (
    <>
    <Navbar />
    <div className="main-container w-screen h-screen flex items-start justify-center bg-[#222222] text-[#DDD8D5]">
      <div className="info-container flex flex-col gap-y-5 items-start justify-center w-[40%] h-[60%] border-[5px] border-[#ddd8d525] rounded-xl pt-5 pb-1 px-1 mt-[10%]">
        <div className="img-container flex items-start justify-center w-full h-[50%]">
            <ProfilePicture user={user} onUploadComplete={handleProfilePictureUpload} />
        </div>
        {errorMessage && <p className='text-red-400 px-3 font-semibold'>{errorMessage}</p>}
        <div className="info bg-[#5c5a5925] w-full h-[50%] p-3 rounded flex flex-col gap-y-5 items-center justify-start">

            <div className='name-div w-full flex items-center justify-between'>
                {editName ? 
                <>
                <div className='text-4xl font-bold'>
                    <span className='text-xl text-[#7f7f7f] font-bold'>Name: </span>
                    <input 
                    className='outline-none bg-transparent text-2xl border-b-2 pb-1 border-[#ddd8d525]'
                    type="text" 
                    name="name" 
                    id="name"
                    ref={nameRef}
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}/>
                </div>
                <div className="actions flex items-center justify-center rounded bg-[#98959025] hover:bg-[#c6c2bc25] cursor-pointer transition-all duration-300 h-[30px] w-[30px]"
                onClick={() => editUser('name')}>
                    {nameLoading ? <BiDotsHorizontal size={20} color={'#4CC988'} /> : <MdDone size={20} color={'#4CC988'} />}
                </div>
                </>
                :
                <>
                <h2 className='text-3xl font-bold'>
                    <span className='text-2xl text-[#7f7f7f] font-bold'>Name: </span>
                    {user ? user.name : 'Guest'}
                </h2>
                <div className="actions flex items-center justify-center rounded hover:bg-[#c6c2bc25] cursor-pointer transition-all duration-300 h-[30px] w-[30px]"
                onClick={() => setEditName((prev) => !prev)}>
                    <MdEdit size={20} />
                </div>
                </>
                }
            </div>

            {/* Email /////////////////////// */}
            <div className='email-div w-full flex items-center justify-between'>
            {editEmail ? 
                <>
                <div className='text-3xl font-bold'>
                    <span className='text-xl text-[#7f7f7f] font-bold'>Email: </span>
                    <input 
                    className='outline-none bg-transparent text-2xl border-b-2 pb-1 border-[#ddd8d525]'
                    type="text" 
                    name="name" 
                    id="name"
                    ref={emailRef}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="actions flex items-center justify-center rounded bg-[#98959025] hover:bg-[#c6c2bc25] cursor-pointer transition-all duration-300 h-[30px] w-[30px]"
                onClick={() => editUser('email')}>
                    {emailLoading ? <BiDotsHorizontal size={20} color={'#4CC988'} /> : <MdDone size={20} color={'#4CC988'} />}
                </div>
                </>
                :
                <>
                <div className='text-3xl font-bold'>
                    <span className='text-2xl text-[#7f7f7f] font-bold'>Email: </span>
                    {user ? user.email : 'email'}
                </div>
                <div className="actions flex items-center justify-center rounded hover:bg-[#c6c2bc25] cursor-pointer transition-all duration-300 h-[30px] w-[30px]"
                onClick={() => setEditEmail((prev) => !prev)}>
                    <MdEdit size={20} />
                </div>
                </>
                }
            </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home