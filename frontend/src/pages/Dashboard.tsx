import DashboardCard from '../components/DashboardCard';
import { upcomingAppointments } from '../../mockData';
import TodaysTasks from '../components/TodaysTasks';
import { UserRole } from '../constants/userRole';
import { useAuth } from '../hooks/UseAuth';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        {user?.role === UserRole.PATIENT && (
          <>
            <DashboardCard className='col-span-full' title='Upcoming Appointments'>
              <div className='space-y-6'>
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className='glass-effect p-6 rounded-xl hover-glow transition-all duration-300'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>{appointment.doctorName}</p>
                        <p className='text-sm text-gray-400 mt-1'>{appointment.specialty}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-gray-200'>{appointment.date}</p>
                        <p className='text-sm text-gray-400 mt-1'>{appointment.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </>
        )}
        {user?.role === UserRole.DOCTOR && (
          <>
            <TodaysTasks />
          </>
        )}
      </div>
    </>
  );
}
