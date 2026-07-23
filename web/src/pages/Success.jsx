import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Phone, ArrowRight, Loader2 } from 'lucide-react';

const Success = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const request = state?.request;

  if (!request) return <div className="p-12 text-center">No request data found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-gray-50 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
            <Check size={32} strokeWidth={4} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Emergency Request Submitted Successfully</h2>

        {/* Status Card */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-left space-y-4 border border-gray-100">
          <DetailRow label="Request ID" value={`#${request.id.slice(-6).toUpperCase()}`} isBold />
          <DetailRow label="Patient Name" value={request.patientName} />
          <DetailRow label="Blood Group" value={request.bloodGroup} color="text-red-600" />
          <DetailRow label="Hospital Name" value={request.hospitalName} />
          <DetailRow label="Location" value={request.location} />
          <DetailRow label="Units Required" value={request.units} />
          <DetailRow label="Emergency Level" value={request.urgency} color="text-red-600" />
          <DetailRow label="Date & Time" value={new Date(request.timestamp).toLocaleString()} />
        </div>

        {/* Animation Indicator */}
        <div className="flex flex-col items-center gap-4 py-8 border-y border-gray-100 mb-10">
          <div className="flex items-center gap-3 text-[#BC1C24] font-bold">
            <Loader2 className="animate-spin" size={24} />
            <span>Searching Nearby Donors</span>
          </div>
          <p className="text-sm text-gray-400">Estimated Response Time: <span className="font-bold text-gray-600">~15 mins</span></p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/requests')}
            className="w-full bg-[#BC1C24] text-white py-5 rounded-3xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-red-100"
          >
            Track Request
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all">
              <Phone size={18} /> Contact Support
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-4 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, isBold = false, color = "text-gray-900" }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">{label}</span>
    <span className={`${color} ${isBold ? 'font-black' : 'font-bold'}`}>{value}</span>
  </div>
);

export default Success;
