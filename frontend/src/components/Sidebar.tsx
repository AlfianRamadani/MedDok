import { Activity, Calendar, FileText, LogOut, Settings, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { UserRole } from '../constants/userRole';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <>
      <Link to={'/dashboard'}>
        <div className='glow-effect bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-xl mb-12 hover:scale-110 transition-transform duration-300'>
          {/* logo patient */}
          {user?.role == UserRole.PATIENT && <Activity className='w-6 h-6 md:w-7 md:h-7' />}

          {/* logo doctor*/}
          {user?.role == UserRole.DOCTOR && <Stethoscope className='w-6 h-6 md:w-7 md:h-7' />}
        </div>
      </Link>
      <div className='flex flex-col items-center space-y-10'>
        {/* to manage .. */}
        <Link to={'/dashboard/appointments'} className='nav-button p-4 rounded-xl text-gray-400'>
          <Calendar className='w-7 h-7' />
        </Link>
        {user?.role == UserRole.PATIENT && (
          <Link to={'/dashboard/medical-history'} className='nav-button p-4 rounded-xl text-gray-400'>
            <FileText className='w-7 h-7' />
          </Link>
        )}
      </div>
      <div className='mt-auto flex flex-col items-center space-y-6'>
        <Link to={user?.role == 'doctor' ? '/dashboard/settings/doctor' : '/dashboard/settings/patient'} className='nav-button p-4 rounded-xl text-gray-100'>
          <Settings className='w-7 h-7' />
        </Link>
        <button onClick={logout} className='nav-button p-4 rounded-xl text-gray-400'>
          <LogOut className='w-7 h-7' />
        </button>
      </div>
    </>
  );
}
