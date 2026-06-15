import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmergencyRequest from './pages/EmergencyRequest';
import Success from './pages/Success';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Requests from './pages/Requests';
import DonorLocator from './pages/DonorLocator';
import BloodSearch from './pages/BloodSearch';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <Navbar />
          <main className="flex-1 overflow-y-auto relative z-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/emergency" element={<EmergencyRequest />} />
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/donors" element={<DonorLocator />} />
              <Route path="/search" element={<BloodSearch />} />
              <Route path="/blood-banks" element={<BloodSearch />} />
            </Routes>
          </main>
          {/* Mobile Bottom Nav */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-around items-center z-50">
             <button onClick={() => window.location.href='/'} className="text-[#BC1C24] flex flex-col items-center gap-1"><span className="text-xl">🏠</span><span className="text-[10px] font-bold">Home</span></button>
             <button className="text-gray-400 flex flex-col items-center gap-1"><span className="text-xl">🔍</span><span className="text-[10px] font-bold">Search</span></button>
             <button onClick={() => window.location.href='/emergency'} className="bg-[#BC1C24] w-12 h-12 rounded-full flex items-center justify-center text-white -mt-10 shadow-lg shadow-red-200 border-4 border-white"><span className="text-2xl">🚨</span></button>
             <button onClick={() => window.location.href='/donors'} className="text-gray-400 flex flex-col items-center gap-1"><span className="text-xl">👥</span><span className="text-[10px] font-bold">Donors</span></button>
             <button className="text-gray-400 flex flex-col items-center gap-1"><span className="text-xl">👤</span><span className="text-[10px] font-bold">Profile</span></button>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
