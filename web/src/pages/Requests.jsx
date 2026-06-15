import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Loader2, MapPin, Clock } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestsRef = ref(db, 'requests');
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setRequests(list);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#BC1C24]" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-black text-gray-900 mb-10">Live Requests</h2>
      <div className="space-y-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-6">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex flex-col items-center justify-center text-[#BC1C24]">
              <span className="text-lg font-black">{req.bloodGroup}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xl text-gray-900">{req.hospitalName}</h4>
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${req.urgency === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                  {req.urgency}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} /> {req.location}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(req.timestamp).toLocaleTimeString()}</span>
                <span>Units: <b>{req.units}</b></span>
              </div>
              <p className="mt-4 text-gray-600 text-sm">Patient: <b>{req.patientName}</b> • Status: <span className="text-blue-600 font-bold underline cursor-pointer">{req.status}</span></p>
            </div>
            <button className="bg-[#BC1C24] text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90">Respond</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
