import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-14 border border-gray-50 text-center">
        <div className="mb-12">
           <div className="w-20 h-20 bg-red-50 text-[#BC1C24] rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">💧</div>
           <h2 className="text-4xl font-black text-[#101828] mb-3 tracking-tight">Welcome Back</h2>
           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Give Blood, Save Life</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98] group"
          >
            <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-6 h-6 grayscale brightness-0 opacity-10 group-hover:opacity-30 transition-opacity" alt="" />
            <span className="font-black text-gray-700 uppercase tracking-widest text-xs">Continue with Google</span>
          </button>

          <div className="relative py-4 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-100"></div>
            <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Or login with</span>
            <div className="flex-1 border-t border-gray-100"></div>
          </div>

          <div className="space-y-4 text-left">
            <input className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold placeholder:text-gray-400 text-sm" placeholder="Email Address" />
            <input className="w-full bg-[#F2F4F7] p-5 rounded-2xl outline-none focus:ring-2 focus:ring-red-100 font-bold placeholder:text-gray-400 text-sm" type="password" placeholder="Password" />
          </div>

          <button className="w-full bg-[#BC1C24] text-white py-5 rounded-[1.5rem] font-black text-lg hover:opacity-95 transition-all shadow-xl shadow-red-100 mt-4 flex items-center justify-center gap-3">
            Login <ArrowRight size={20} />
          </button>
        </div>

        <p className="mt-12 text-gray-400 font-bold text-xs uppercase tracking-widest">
          New user? <button onClick={() => navigate('/signup')} className="text-[#BC1C24] font-black hover:underline underline-offset-4 ml-2">Create an account</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
