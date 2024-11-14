import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        console.log('Logout successfully');
        navigate('/login');
    };

  return (
    <>
    <div className="navbar fixed flex items-center justify-center top-5 right-30 left-30 w-screen">
        <ul className='flex items-center justify-center gap-x-10 w-[40%] bg-[#323232] shadow-xl px-2 rounded'>
            <li className='text-xl text-[#4CC988] active:text-[#4cc9887d] font-semibold uppercase bg-[#292929] px-3 py-1'><Link to="/home">Home</Link></li>
            <li className='text-xl text-[#4CC988] active:text-[#4cc9887d] font-semibold uppercase bg-[#292929] px-3 py-1'><Link to="/profile">Profile</Link></li>
            <li className='text-xl text-[#4CC988] active:text-[#4cc9887d] font-semibold'><button className='uppercase bg-[#292929] px-3 py-1' onClick={handleLogout}>Logout</button></li>
        </ul>
    </div>
    </>
  )
}

export default Navbar;