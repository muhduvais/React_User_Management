import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import profile_pic from '../../public/profile_pic.png';
import customAxios from '../utils/apiClient';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editDetails, setEditDetails] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const clearEditDetails = () => setEditDetails(null);

    // Fetch users function
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await customAxios.get('/api/admin/users');
            if (response.status === 200) {
                setUsers(response.data.users);
            } else {
                navigate('/login')
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    }


    // Delete user
    const deleteUser = async () => {
        try {
            console.log('User Id: ', deleteId)
            const response = await customAxios.delete(`/api/admin/deleteUser/${deleteId}`);
            if (response.status === 200) {
                setIsDeleteModalOpen(false);
                fetchUsers();
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Failed to delete the user:", error);
        }
    }

    return (
    <div className='relative w-screen h-screen'>
        <div className={`w-screen h-screen bg-[#222222] flex flex-col items-center text-[#ddd5d5] p-5 ${isAddModalOpen || isEditModalOpen || isDeleteModalOpen ? 'blur-sm' : ''}`}>
            <div className="header flex items-center gap-x-2">
                <h2 className="text-5xl font-extrabold mb-5">Users List</h2>
                <div className="btns flex items-center justify-center ml-5">
                    <div className='add-btn items-center justify-center gap-x-1 cursor-pointer flex pl-2 bg-[#343434] hover:bg-[#404040] font-bold px-3 py-1 mx-1 rounded-md transition-all duration-300'
                    onClick={() => setIsAddModalOpen(true)}>
                        <AiOutlineUserAdd />
                        <h2>Add User</h2>
                    </div>
                    <div className='add-btn items-center justify-center gap-x-1 cursor-pointer flex pl-2 bg-[#343434] hover:bg-[#6a1f1f] font-bold px-3 py-1 mx-1 rounded-md transition-all duration-300'
                    onClick={handleLogout}>
                        <IoLogOut />
                        <h2>Logout</h2>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl h-[80%] overflow-y-auto bg-[#292929] rounded-xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {users.length < 1 && <h2 className='text-3xl text-center'>No users found!</h2>}
                    {users.map(user => (
                        <div key={user._id} className="relative group flex flex-col items-center justify-center bg-[#373737] rounded-lg p-5">
                            <div className="absolute top-3 right-12 bg-[#72716f25] hover:bg-[#c6c2bc25] cursor-pointer p-1 rounded transition-all duration-300"
                            onClick={() => {
                                setIsEditModalOpen(true);
                                setEditDetails({
                                    userId: user._id,
                                    name: user.name,
                                    email: user.email,
                                    image: user.image
                                })
                            }}>
                                <MdEdit size={20} />
                            </div>
                            <button className="absolute top-3 right-3 bg-[#72716f25] hover:bg-[#6a1f1f] p-1 rounded transition-all duration-300"
                            onClick={() => {
                                setIsDeleteModalOpen(true);
                                console.log('User: ', user);
                                setDeleteId(user._id);
                            }}>
                                <MdDelete size={20} />
                            </button>
                            <img src={user?.image || profile_pic} alt="profile picture" className="w-24 h-24 rounded-full mb-4" />
                            <div className="text-center">
                                <h3 className="text-xl font-semibold"><span className='text-[#7f7f7f]'>Name: </span>{user ? user.name : 'Guest'}</h3>
                                <p className="text-lg text-[#7f7f7f]">Email: {user ? user.email : 'Email'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {isAddModalOpen && (
            <AddUserModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                fetchUsers={fetchUsers}
            />
        )}

        {isEditModalOpen && (
            <EditUserModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                fetchUsers={fetchUsers}
                editDetails={editDetails}
                clearEditDetails={clearEditDetails}
            />
        )}

        {isDeleteModalOpen && (
            <div className="flex flex-col shadow-md delete-confirmation absolute top-20 left-[50%] translate-x-[-50%] p-5 rounded-lg text-[#DDD8D5] border-[5px] border-[#ddd8d525] bg-[#222222]">
                <p className='text-base'>Are you sure you want to delete the user?</p>
                <div className="btns flex items-center justify-end pt-3 gap-x-1">
                    <button className='rounded-md px-3 py-1 bg-[#363636] hover:bg-[#484848] transition-all duration-300' onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                    <button className='px-3 py-1 bg-[#363636] rounded-md hover:text-red-400 transition-all duration-300' onClick={deleteUser}>Delete</button>
                </div>
            </div>
        )}
    </div>
    );
};

export default AdminDashboard;
