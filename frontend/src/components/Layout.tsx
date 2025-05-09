import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/UseAuth';

export default function Layout() {
  const [name, setName] = useState<string>('');
  const { user, updatePatient, updateDoctor } = useAuth();
  return (
    <>
      {user && user.actor && ((user.role === 'doctor' && (!user.doctor || !user.doctor.name)) || (user.role !== 'doctor' && (!user.patient || !user.patient.name))) && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Please Enter Your Name</h2>
              <input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your Name" />
              <button
                onClick={() => {
                  if (name.trim()) {
                    if (user.role === 'doctor') {
                      updateDoctor({ name });
                    } else {
                      updatePatient({ name, status: 'editable' });
                    }
                  } else {
                    alert('Name cannot be empty');
                  }
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md w-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
                Save
              </button>
            </div>
          </div>
        </>
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 text-gray-100">
        {/* Background Decoration */}
        <div className="fixed inset-0 space-gradient opacity-50"></div>
        {/* Sidebar */}
        <nav className="fixed left-0 top-0 h-full w-24 glass-effect border-r border-indigo-500/20 flex flex-col items-center py-12 z-40">
          <Sidebar />
        </nav>

        {/* Main Content */}
        <div className="ml-24">
          {/* Header */}
          <header className="glass-effect border-b border-indigo-500/20 p-6 sticky top-0 z-40">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <h1 className=" text-xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400  bg-clip-text text-transparent">Health Dashboard</h1>
              <div className="flex items-center space-x-6 relative">
                <div className="glow-effect rounded-full p-1 hover:scale-110 transition-transform duration-300">
                  <img src={user?.profilePicture} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-indigo-500/50" />
                </div>
              </div>
            </div>
          </header>
          <main className="p-12 max-w-7xl mx-auto relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
