import DashboardCard from '../components/DashboardCard';
import TodaysTasks from '../components/TodaysTasks';
import { UserRole } from '../constants/userRole';
import useActor from '../hooks/useActor';
import { useAuth } from '../hooks/UseAuth';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<any>([]);
  const { user } = useAuth();
  const actor = useActor();
  useEffect(() => {
    actor.getUpcomingAppointments().then(data => {
      setUpcomingAppointments(data);
    });
  }, []);
  console.log(upcomingAppointments);

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        {user?.role === UserRole.PATIENT && (
          <>
            <DashboardCard className='col-span-full' title='Upcoming Appointments'>
              <div className='space-y-6'>
                {upcomingAppointments.map((appointment: any, index: number) => (
                  <div key={index} className='glass-effect p-6 rounded-xl hover-glow transition-all duration-300'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>{appointment[3].name}</p>
                        <p className='text-sm text-gray-400 mt-1'>{appointment[3].specialization}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-gray-200'>{new Date(appointment[1].appointmentDate).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </>
        )}
        {user?.role === UserRole.DOCTOR && (
          <DashboardCard className='col-span-full' title='Your Patients'>
            <div className='space-y-6'>
              <div className='glass-effect p-6 rounded-xl hover-glow transition-all duration-300'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'>John Doe</p>
                    <p className='text-sm text-gray-400 mt-1'>General Checkup</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-gray-200'>Next Appointment: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        )}
      </div>
    </>
  );
}
