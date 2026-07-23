import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { push, ref, set } from "firebase/database";
import { Plus, X, AlertCircle } from 'lucide-react';

const EmergencyRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'A+',
    hospitalName: '',
    location: '',
    units: '1',
    urgency: 'HIGH'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestsRef = ref(db, 'requests');
      const newRequestRef = push(requestsRef);
      const requestId = newRequestRef.key;

      const requestData = {
        ...formData,
        id: requestId,
        status: 'Pending',
        timestamp: Date.now()
      };

      await set(newRequestRef, requestData);
      navigate('/success', { state: { request: requestData } });
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Emergency Request</h2>
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <p className="text-gray-500 mb-10 leading-relaxed">Fill in the details below to initiate an urgent blood supply request. This will notify all nearby donors and blood banks immediately.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Patient Details */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">0. Patient Details</h3>
            <input
              required
              className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none focus:ring-2 focus:ring-[#BC1C24]/20 transition-all font-medium"
              placeholder="Patient Full Name"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
            />
          </div>

          {/* Blood Group */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">1. Select Blood Group</h3>
            <div className="grid grid-cols-4 gap-4">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(group => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setFormData({...formData, bloodGroup: group})}
                  className={`py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 ${formData.bloodGroup === group ? 'bg-[#BC1C24] text-white shadow-lg shadow-red-100' : 'bg-[#F2F4F7] text-gray-700 hover:bg-gray-200'}`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Hospital Details */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">2. Hospital & Units</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  required
                  className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none pr-12 font-medium"
                  placeholder="Enter hospital name"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                />
                <Plus size={20} className="absolute right-5 top-5.5 text-gray-400" />
              </div>
              <input
                required
                className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none font-medium"
                placeholder="Hospital Location / Address"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
              <input
                required
                className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none font-medium"
                placeholder="Units Required"
                type="number"
                min="1"
                value={formData.units}
                onChange={(e) => setFormData({...formData, units: e.target.value})}
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">3. Urgency Level</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'LOW', time: 'Within 24h' },
                { id: 'MEDIUM', time: 'Within 6h' },
                { id: 'HIGH', time: 'Immediate' },
              ].map(level => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData({...formData, urgency: level.id})}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${formData.urgency === level.id ? 'border-[#BC1C24] bg-[#BC1C24] text-white' : 'border-gray-200 bg-white text-gray-600'}`}
                >
                  <div className="font-bold text-sm">{level.id}</div>
                  <div className={`text-[10px] ${formData.urgency === level.id ? 'text-white/70' : 'text-gray-400'}`}>{level.time}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#BC1C24] text-white py-5 rounded-3xl font-black text-xl hover:opacity-95 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirm & Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyRequest;
