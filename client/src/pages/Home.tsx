import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";
import Navbar from '../components/Navbar';
import customAxios from '../utils/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import profile_pic from '../../public/profile_pic.png'

const Home = () => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await customAxios.get('/api/auth/user');
                if (response.status === 200) {
                  setUser(response.data);
                } else {
                  navigate('/login');
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                navigate('/login');
            }
        };

        fetchUser();
    }, []);

    console.log(user)

  return (
    <>
    <Navbar />
    <div className="main-container w-screen h-screen flex items-start justify-center bg-[#222222] text-[#DDD8D5]">
      <div className="info-container relative group flex flex-col gap-y-5 items-center justify-center w-[40%] h-[60%] border-[5px] border-[#ddd8d525] rounded-xl p-5 mt-[10%]">
        <Link to="/profile" className="edit-btn flex items-center justify-center rounded absolute top-3 right-3 bg-[#72716f25] hover:bg-[#c6c2bc25] cursor-pointer transition-all duration-300 h-[30px] w-[30px]">
          <MdEdit size={20} />
        </Link>
        <div className="profile-pic rounded-full w-36 h-36 overflow-hidden bg-[#222222]">
          <img
            src={user?.image || profile_pic}
            alt="profile picture"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className='text-4xl font-bold'>
          {user ? `Hello, ${user.name}` : 'Hello, Guest'}
          <span className='inline-block pl-2 group-hover:animate-wave hover:animate-wave transition-transform duration-1000 cursor-default'>👋</span>
        </h2>
        <p className='text-lg text-[#7f7f7f] font-semibold'>{user ? user.email : 'email'}</p>
      </div>
    </div>
    </>
  )
}

export default Home