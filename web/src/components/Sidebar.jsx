import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Users, Landmark, FileText, Bell, User, MoreHorizontal, Heart } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Search Blood', icon: <Search size={20} />, path: '/search' },
    { name: 'Donors', icon: <Users size={20} />, path: '/donors' },
    { name: 'Blood Banks', icon: <Landmark size={20} />, path: '/blood-banks' },
    { name: 'Requests', icon: <FileText size={20} />, path: '/requests' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'More', icon: <MoreHorizontal size={20} />, path: '/more' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[#BC1C24] rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
           <DropletIcon />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#BC1C24] leading-none">BloodLink</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Give Blood, Save Life</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive
                ? 'bg-[#BC1C24] text-white shadow-lg shadow-red-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#BC1C24]'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="bg-red-50 p-6 rounded-[2rem] text-center border border-red-100">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Heart className="text-[#BC1C24]" size={20} fill="#BC1C24" />
          </div>
          <p className="text-[10px] font-black text-[#BC1C24] uppercase mb-1">Be a Hero</p>
          <p className="text-xs font-bold text-gray-700 mb-4">Donate Blood</p>
          <button className="w-full bg-[#BC1C24] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
            Register Now
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center py-2">
           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
             <Phone size={14} className="text-gray-400" />
           </div>
           <p className="text-[10px] font-bold text-gray-400 uppercase">Need Help?</p>
           <button className="text-[10px] font-black text-gray-700 hover:text-[#BC1C24]">Contact Support</button>
        </div>
      </div>
    </aside>
  );
};

const DropletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22Z" fill="currentColor"/>
  </svg>
);

const Phone = ({size, className}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default Sidebar;
