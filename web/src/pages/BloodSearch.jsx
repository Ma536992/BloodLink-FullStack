import React, { useState } from 'react';
import { Search, MapPin, ChevronRight, Droplets, Filter } from 'lucide-react';

const BloodSearch = () => {
  const [selectedGroup, setSelectedGroup] = useState('A+');

  const results = [
    { id: 1, name: 'Apollo Speciality Hospital', location: 'Poonamallee, Chennai', stock: '24 Units', urgency: '10 Mins away', status: 'Available' },
    { id: 2, name: 'MIOT International', location: 'Manapakkam, Chennai', stock: '18 Units', urgency: '20 Mins away', status: 'Available' },
    { id: 3, name: 'Billroth Hospital', location: 'Shenoy Nagar, Chennai', stock: '05 Units', urgency: 'Urgent Need', status: 'Low Stock' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pb-24 lg:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Search Blood</h2>
          <p className="text-gray-500 font-medium">Find availability in nearby hospitals and blood banks.</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 pr-6">
              <div className="w-10 h-10 bg-red-50 text-[#BC1C24] rounded-xl flex items-center justify-center font-black">📍</div>
              <span className="text-sm font-bold text-gray-700">Chennai</span>
           </div>
        </div>
      </div>

      {/* Blood Group Selector */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-100/50 mb-12 overflow-x-auto">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Select Required Blood Group</h3>
        <div className="flex gap-4 min-w-max">
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`w-20 h-20 rounded-3xl font-black text-xl flex flex-col items-center justify-center gap-1 transition-all transform active:scale-95 ${
                selectedGroup === group
                ? 'bg-[#BC1C24] text-white shadow-xl shadow-red-200'
                : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{group}</span>
              <Droplets size={14} className={selectedGroup === group ? 'opacity-50' : 'text-gray-400'} />
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
           <h3 className="text-xl font-black text-gray-900">Nearby Results</h3>
           <button className="flex items-center gap-2 text-gray-500 font-bold text-sm">
             <Filter size={16} /> Sort by distance
           </button>
        </div>

        {results.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all group flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl group-hover:bg-red-50 transition-colors">🏥</div>

            <div className="flex-1">
               <div className="flex items-center gap-3 mb-2">
                 <h4 className="text-2xl font-black text-gray-900">{item.name}</h4>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   item.status === 'Available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                 }`}>
                   {item.status}
                 </span>
               </div>
               <div className="flex flex-wrap gap-6 text-gray-500 font-bold text-sm">
                 <span className="flex items-center gap-2"><MapPin size={16} className="text-[#BC1C24]" /> {item.location}</span>
                 <span className="flex items-center gap-2">🕒 {item.urgency}</span>
               </div>
            </div>

            <div className="flex flex-col items-center justify-center px-8 border-x border-gray-50">
               <span className="text-3xl font-black text-[#BC1C24]">{item.stock}</span>
               <span className="text-[10px] text-gray-400 font-bold uppercase">Current Stock</span>
            </div>

            <button className="bg-[#BC1C24] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-lg shadow-red-100 flex items-center gap-2 group">
              Book Appointment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodSearch;
