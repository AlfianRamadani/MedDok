import { Calendar, Clock, Search, Plus, MoreVertical, ChevronRight, Stethoscope, MapPin, Phone, Edit, Ban, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { useEffect, useState } from 'react';
import useActor from '../../hooks/useActor';
import type { Appointment } from '../../types';

export default function Appointment() {
  const { user } = useAuth();
  const actor = useActor();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    actor.getAllAppointments().then(data => {
      const formattedData = data.map(([id, appointment, doctorData]) => ({
        ...appointment,
        id: id.toString(),
        doctorData: doctorData.length > 0 ? doctorData[0] : null,
      }));
      setAppointments(formattedData);
    });
  });
  console.log(appointments);
  const handleMenuClick = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleActionClick = (action: string, appointmentId: number) => {
    console.log(`${action} appointment ${appointmentId}`);
    setOpenMenuId(null);
  };

  return (
    <>
      {/* Stats */}
      <h1 className='text-4xl mb-4 font-semibold '>Appointment Page</h1>
      {/* Actions */}
      <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
        <div className='relative w-full sm:w-96'>
          <input type='text' placeholder='Search appointments...' className='w-full pl-10 pr-4 py-2 border border-gray-300 glass-effect rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>
        {user?.role === 'patient' && (
          <Link to={'/dashboard/appointments/doctor-list'} className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            <Plus className='h-5 w-5 mr-2' />
            New Appointment
          </Link>
        )}
      </div>

      {/* Appointments Table */}
      {user?.role === 'patient' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {appointmentsPatient.map(appointment => (
            <div key={appointment.id} className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
              {/* Status Banner */}
              <div className={`px-4 py-2 text-sm font-semibold text-white ${appointment.status === 'upcoming' ? 'bg-blue-600' : appointment.status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</div>

              {/* Card Content */}
              <div className='p-6 space-y-4'>
                {/* Date and Time */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='h-5 w-5 text-blue-600' />
                    <span className='text-gray-700 font-medium'>{appointment.date}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-5 w-5 text-blue-600' />
                    <span className='text-gray-700'>{appointment.time}</span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <Stethoscope className='h-5 w-5 text-blue-600' />
                    <div>
                      <p className='font-semibold text-gray-900'>{appointment.doctorName}</p>
                      <p className='text-sm text-gray-600'>{appointment.doctorSpecialty}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Type */}
                <div className='inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>{appointment.type}</div>

                {/* Location and Contact */}
                <div className='space-y-2 pt-2 border-t border-gray-100'>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <MapPin className='h-4 w-4' />
                    <span>{appointment.location}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <Phone className='h-4 w-4' />
                    <span>{appointment.contactNumber}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex justify-end space-x-2 pt-4'>
                  <button className='p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100' onClick={() => handleActionClick('view', appointment.id)}>
                    <ChevronRight className='h-5 w-5' />
                  </button>
                  <div className='relative inline-block'>
                    <button className={`p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg ${openMenuId === appointment.id ? 'bg-gray-100' : 'hover:bg-gray-100'}`} onClick={() => handleMenuClick(appointment.id)}>
                      <MoreVertical className='h-5 w-5' />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === appointment.id && (
                      <div className='absolute right-0 bottom-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200'>
                        <button className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2' onClick={() => handleActionClick('edit', appointment.id)}>
                          <Edit className='h-4 w-4' />
                          <span>Edit Appointment</span>
                        </button>
                        <button className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2' onClick={() => handleActionClick('cancel', appointment.id)}>
                          <Ban className='h-4 w-4' />
                          <span>Cancel Appointment</span>
                        </button>
                        <button className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2' onClick={() => handleActionClick('delete', appointment.id)}>
                          <Trash2 className='h-4 w-4' />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden glass-effect'>
          <table className='min-w-full divide-y divide-gray-200 '>
            <thead className=''>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Patient</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Date & Time</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Type</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {appointments.map(appointment => (
                <tr key={appointment.id} className=''>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-white'>{appointment.patientName}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-white'>{appointment.date}</div>
                    <div className='text-sm text-gray-500'>{appointment.time}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-white'>{appointment.type}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${appointment.status === 'upcoming' ? 'bg-green-100 text-green-800' : appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex items-center space-x-4'>
                      <button className='text-gray-600 '>
                        <ChevronRight className='h-5 w-5' />
                      </button>
                      <button className='text-gray-600 '>
                        <MoreVertical className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
