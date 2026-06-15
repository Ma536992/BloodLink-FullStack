import React from 'react';
import { Bell, MapPin, ChevronDown } from 'lucide-react';
import { auth } from '../firebase';

const Navbar = () => {
  const user = auth.currentUser;

  return (
    <header className="bg-white/80 backdrop-blur-md px-8 py-4 sticky top-0 z-40 flex items-center justify-between border-b border-gray-50 lg:border-none">
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center gap-2">
        <div className="w-8 h-8 bg-[#BC1C24] rounded-lg flex items-center justify-center text-white">
          <span className="text-xl">🩸</span>
        </div>
        <h1 className="text-xl font-bold text-[#BC1C24]">BloodLink</h1>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-2xl transition-all">
        <MapPin size={18} className="text-[#BC1C24]" />
        <span className="text-sm font-bold">Mumbai, Maharashtra</span>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      <div className="flex items-center gap-6">
        <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-2xl relative transition-all">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-5 h-5 bg-[#BC1C24] rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-black">3</span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-gray-900 leading-none mb-1">M Surya Mahesh</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin</p>
          </div>
          <div className="relative">
            <img
              src={user?.photoURL || "https://i.pravatar.cc/150?u=mahesh"}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
              alt="Profile"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown size={16} className="text-gray-400 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
