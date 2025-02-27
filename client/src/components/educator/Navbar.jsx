import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';
import favicon from './favicon.svg'
const Navbar = ({ bgColor }) => {

  const { isEducator } = useContext(AppContext)
  const { user } = useUser()

  return isEducator && user && (
    <div className={`flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 ${bgColor}`}>
      <Link to="/">
        <div className="flex items-center justify-between gap-2">
                          <img src={favicon} alt="logo" />
                          <h1 className='text-black text-2xl font-bold'>NextLearn</h1>
                          </div>
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user.fullName}</p>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;