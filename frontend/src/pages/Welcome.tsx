import { useNavigate } from 'react-router-dom';
import { Stethoscope, UserCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';

export default function Welcome() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center space-y-12 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900'>
      <div className='text-center space-y-4 max-w-2xl'>
        <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Welcome to HealthCare Platform</h1>
        <p className='text-lg text-gray-300'>Thank you for joining us. Let&apos;s get started by selecting your role.</p>
      </div>

      <div className='grid md:grid-cols-2 gap-8 w-full max-w-4xl'>
        <button onClick={() => updateUser({ role: 'patient' })} className='group relative glass-effect rounded-2xl p-8 text-left space-y-4 hover:border-indigo-500/50 border-2 border-transparent transition-all duration-300'>
          <div className='absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
          <div className='p-3 bg-indigo-500/20 rounded-xl w-fit'>
            <UserCircle className='w-8 h-8 text-indigo-400' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-white'>I&apos;m a Patient</h2>
            <p className='text-gray-400 mt-2'>Access your medical records, book appointments, and manage your health journey</p>
          </div>
          <div className='flex items-center text-indigo-400 group-hover:text-indigo-300'>
            <span>Continue as Patient</span>
            <ArrowRight className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform' />
          </div>
        </button>

        <button onClick={() => navigate('/doctor-verification')} className='group relative glass-effect rounded-2xl p-8 text-left space-y-4 hover:border-indigo-500/50 border-2 border-transparent transition-all duration-300'>
          <div className='absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
          <div className='p-3 bg-purple-500/20 rounded-xl w-fit'>
            <Stethoscope className='w-8 h-8 text-purple-400' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-white'>I&apos;m a Doctor</h2>
            <p className='text-gray-400 mt-2'>Join our medical community, manage patients, and provide healthcare services</p>
          </div>
          <div className='flex items-center text-purple-400 group-hover:text-purple-300'>
            <span>Apply as Doctor</span>
            <ArrowRight className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform' />
          </div>
        </button>
      </div>

      <p className='text-gray-400 text-center max-w-2xl'>By continuing, you agree to our Terms of Service and Privacy Policy. Your data will be handled with utmost security and confidentiality.</p>
    </div>
  );
}
