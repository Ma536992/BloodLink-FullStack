import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Droplets, ShieldCheck, ArrowRight, Phone, MessageCircle, Heart, MapPin, Activity, Users, ClipboardCheck, AlertTriangle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 pb-24 lg:pb-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#BC1C24] via-[#D32F2F] to-[#E53935] rounded-[3rem] overflow-hidden p-8 md:p-16 mb-12 shadow-2xl shadow-red-200/50 group">
        <div className="md:w-3/5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
             </span>
             Live Emergency Assistance
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">Need Blood <br/><span className="text-white/80">Urgently?</span></h2>
          <p className="text-white/70 text-xl mb-12 max-w-md font-medium leading-relaxed">Find nearby donors and blood banks near you instantly. Every second counts in saving a life.</p>
          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => navigate('/emergency')}
              className="bg-white text-[#BC1C24] px-10 py-5 rounded-[1.5rem] font-black text-lg flex items-center gap-3 hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
            >
              <DropletIcon size={24} color="#BC1C24" />
              Request Blood
            </button>
            <button className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg flex items-center gap-3 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
              <Search size={24} />
              Search Blood
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-[-40px] top-[-20px] opacity-10 hidden lg:block group-hover:rotate-12 transition-transform duration-1000">
           <svg width="500" height="500" viewBox="0 0 200 200" fill="none">
             <path d="M100 20C80 20 60 35 60 70V140C60 170 80 180 100 180C120 180 140 170 140 140V70C140 35 120 20 100 20Z" fill="white" />
           </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-16">

          {/* Blood Availability Grid */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-[#101828] tracking-tight">Blood Availability</h3>
              <button className="text-[#BC1C24] font-black text-sm uppercase tracking-widest hover:bg-red-50 px-6 py-3 rounded-2xl transition-all border border-transparent hover:border-red-100">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { group: 'A+', count: 120, color: 'text-red-600', bg: 'bg-red-50', icon: <DropletIcon size={28} color="#DC2626" /> },
                { group: 'B+', count: 85, color: 'text-blue-600', bg: 'bg-blue-50', icon: <DropletIcon size={28} color="#2563EB" /> },
                { group: 'O+', count: 150, color: 'text-green-600', bg: 'bg-green-50', icon: <DropletIcon size={28} color="#16A34A" /> },
                { group: 'AB+', count: 45, color: 'text-purple-600', bg: 'bg-purple-50', icon: <DropletIcon size={28} color="#9333EA" /> },
              ].map((item) => (
                <div key={item.group} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-center group cursor-pointer relative overflow-hidden">
                  <div className={`w-16 h-16 ${item.bg} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all shadow-sm`}>
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-1">{item.group}</h4>
                  <p className="text-3xl font-black text-gray-800 mb-2">{item.count}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-6">Units Available</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 group-hover:bg-green-50 text-gray-400 group-hover:text-green-700 rounded-2xl text-[10px] font-black uppercase transition-colors">
                    <div className="w-2 h-2 bg-gray-300 group-hover:bg-green-500 rounded-full animate-pulse"></div>
                    Available
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Blood Banks Section */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-[#101828] tracking-tight">Nearby Blood Banks</h3>
              <button className="text-[#BC1C24] font-black text-sm uppercase tracking-widest hover:bg-red-50 px-6 py-3 rounded-2xl transition-all border border-transparent hover:border-red-100">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { name: 'Apollo Blood Bank', info: 'A+, B+, O+, AB+ Available', dist: '2.3 km away', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200' },
                { name: 'City Blood Center', info: 'O+, A+, B+ Available', dist: '3.1 km away', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=200' },
              ].map((bank) => (
                <div key={bank.name} className="bg-white p-8 rounded-[3rem] border border-gray-100 flex flex-col hover:shadow-2xl hover:border-red-100 transition-all group">
                  <div className="flex items-center gap-6 mb-8">
                    <img src={bank.img} className="w-20 h-20 rounded-3xl object-cover shadow-xl group-hover:scale-110 transition-transform" alt="" />
                    <div className="flex-1">
                      <h4 className="font-black text-xl text-gray-900 leading-tight mb-1">{bank.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{bank.info}</p>
                      <p className="text-xs text-[#BC1C24] font-black mt-2 flex items-center gap-1">
                        <MapPin size={14} fill="#FEE2E2" /> {bank.dist}
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-[#F9FAFB] text-gray-700 py-4 rounded-[1.25rem] text-sm font-black uppercase tracking-widest hover:bg-[#BC1C24] hover:text-white transition-all shadow-inner">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-12">

          {/* Emergency Assistant Card */}
          <div className="bg-[#FFF1F0] rounded-[3rem] p-10 border border-[#FFCCC7] relative overflow-hidden shadow-xl shadow-red-50 group">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#BC1C24] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200 animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <span className="text-[#BC1C24] font-black text-xs uppercase tracking-[0.2em]">Emergency Assistant</span>
            </div>
            <h4 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Need blood <br/>immediately?</h4>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed text-lg">Send a priority request to all nearby heroes. We find matches in <span className="text-[#BC1C24] font-black">under 5 minutes</span>.</p>

            <button
              onClick={() => navigate('/emergency')}
              className="w-full bg-[#BC1C24] text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:bg-[#A3181F] transition-all shadow-2xl shadow-red-200 transform group-hover:scale-105 active:scale-95"
            >
              Request Now
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="absolute right-[-20px] bottom-20 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
               <span className="text-[12rem]">🚑</span>
            </div>
          </div>

          {/* Donors Card */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/30">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-[#101828]">Nearby Donors</h3>
              <button onClick={() => navigate('/donors')} className="text-[#BC1C24] font-black text-xs uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { name: 'Rahul Sharma', group: 'O+', dist: '1.2 km', img: 'https://i.pravatar.cc/150?u=1' },
                { name: 'Priya Verma', group: 'A+', dist: '2.0 km', img: 'https://i.pravatar.cc/150?u=2' },
                { name: 'Amit Patil', group: 'B+', dist: '2.5 km', img: 'https://i.pravatar.cc/150?u=3' },
              ].map((donor) => (
                <div key={donor.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-[1.5rem] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={donor.img} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white transition-transform group-hover:scale-110" alt="" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div>
                      <h5 className="font-black text-sm text-gray-900 mb-1">{donor.name}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#BC1C24] bg-red-50 px-2 py-0.5 rounded-lg uppercase tracking-tight">{donor.group}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{donor.dist}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                      <Phone size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Impact section */}
          <section className="bg-[#101828] p-10 rounded-[3rem] text-white">
             <h3 className="text-xl font-black mb-8 text-center uppercase tracking-widest text-white/50">Our Impact</h3>
             <div className="space-y-8">
                <div className="flex items-center gap-6">
                   <div className="text-4xl">❤️</div>
                   <div>
                      <p className="text-2xl font-black">2,500+</p>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Lives Saved</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-4xl">🤝</div>
                   <div>
                      <p className="text-2xl font-black">10,000+</p>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Happy Donors</p>
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const DropletIcon = ({size = 20, color = "currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22Z" fill={color}/>
    <path d="M12 18C13.6569 18 15 16.6569 15 15C15 12 12 9 12 9C12 9 9 12 9 15C9 16.6569 10.3431 18 12 18Z" fill="white" fillOpacity="0.4"/>
  </svg>
);

export default Home;
