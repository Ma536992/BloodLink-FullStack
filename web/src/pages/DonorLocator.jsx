import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Search, Filter, Navigation } from 'lucide-react';

const DonorLocator = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const donors = [
    { id: 1, name: 'James Wilson', group: 'O+ POSITIVE', dist: '1.2 km away', status: 'Active Now', img: 'https://i.pravatar.cc/150?u=james' },
    { id: 2, name: 'Elena Rodriguez', group: 'A- NEGATIVE', dist: '0.8 km away', status: 'Available', img: 'https://i.pravatar.cc/150?u=elena' },
    { id: 3, name: 'Marcus Chen', group: 'B+ POSITIVE', dist: '2.5 km away', status: 'Active Now', img: 'https://i.pravatar.cc/150?u=marcus' },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full lg:w-[450px] bg-white border-r border-gray-100 flex flex-col h-full">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Nearby Donors</h2>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full bg-[#F2F4F7] pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#BC1C24]/10 transition-all font-bold"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{donors.length} Matching Donors</p>
            <button className="flex items-center gap-2 text-[#BC1C24] font-black text-xs uppercase tracking-widest">
               <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
          {donors.map((donor) => (
            <div key={donor.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all group cursor-pointer">
              <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                  <img src={donor.img} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-md group-hover:scale-105 transition-transform" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-gray-900 leading-tight mb-1">{donor.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#BC1C24] bg-red-50 px-2 py-1 rounded-lg uppercase tracking-tight">{donor.group}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
                      <MapPin size={10} /> {donor.dist}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest">{donor.status}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-50 text-gray-700 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                  <Phone size={16} /> Call
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#BC1C24] text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-red-100">
                  <MessageCircle size={16} /> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative bg-gray-200 overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-[#E5E7EB] flex items-center justify-center">
          <div className="text-gray-400 flex flex-col items-center gap-4">
            <Navigation size={64} className="animate-bounce" />
            <p className="font-black uppercase tracking-[0.3em] text-sm">Google Maps Live Integration</p>
          </div>
          {/* Mock Markers */}
          <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-[#BC1C24] rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white animate-pulse">🩸</div>
          <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">🏥</div>
          <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-[#BC1C24] rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white">🩸</div>
        </div>

        {/* Map Controls */}
        <div className="absolute right-8 bottom-8 flex flex-col gap-4">
          <button className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-700 hover:text-[#BC1C24] transition-all active:scale-95">
            <Navigation size={24} />
          </button>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-100">
            <button className="w-14 h-14 flex items-center justify-center text-xl font-black text-gray-700 hover:bg-gray-50 border-b border-gray-100">+</button>
            <button className="w-14 h-14 flex items-center justify-center text-xl font-black text-gray-700 hover:bg-gray-50">−</button>
          </div>
        </div>

        {/* Floating User Info Overlay */}
        <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white/40 shadow-2xl max-w-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#BC1C24] rounded-2xl flex items-center justify-center text-white shadow-lg">📍</div>
              <div>
                <p className="text-[10px] font-black text-[#BC1C24] uppercase tracking-widest mb-0.5">Current Location</p>
                <h5 className="font-black text-sm text-gray-900 leading-tight">Chennai, Tamil Nadu</h5>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DonorLocator;
