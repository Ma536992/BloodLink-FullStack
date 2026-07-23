import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <h2 className="text-4xl font-black text-[#101828] mb-8">Join the Community</h2>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-4">
        <input className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none" placeholder="Full Name" />
        <input className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none" placeholder="Email Address" />
        <input className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none" type="password" placeholder="Password" />
        <button className="w-full bg-[#BC1C24] text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-red-100 mt-4">
          Create Account
        </button>
      </div>
      <p className="mt-10 text-gray-400 font-medium">Already have an account? <button onClick={() => navigate('/login')} className="text-[#BC1C24] font-black underline underline-offset-4">Login</button></p>
    </div>
  );
};

export default Signup;
