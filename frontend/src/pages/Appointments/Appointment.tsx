import { Calendar, Search, Plus, Stethoscope, MapPin, Phone, Check, X, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { useEffect, useState } from 'react';
import useActor from '../../hooks/useActor';
import type { Appointment, Patient, Doctor } from '../../../../src/declarations/backend/backend.did';
import { Principal } from '@dfinity/principal';

interface AppointmentData extends Appointment {
  doctorData: Doctor | null;
  patientData: Patient | null;
}

export default function AppointmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const actor = useActor();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await actor.getAllAppointments();
      const formattedData = data.map(([id, appointment, doctorData, patientData]) => ({
        ...appointment,
        id: id.toString(),
        doctorData: doctorData && doctorData.length > 0 ? doctorData[0] : null,
        patientData: patientData && patientData.length > 0 ? patientData[0] : null,
      })) as AppointmentData[];
      setAppointments(formattedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string, appointmentId: string, patientId?: Principal) => {
    switch (action) {
      case 'complete':
        actor.markAppointmentAsComplete(appointmentId).then(() => {
          alert('Appointment marked as completed');
          fetchAppointments();
        });
        break;
      case 'cancel':
        actor.markAppointmentAsCancelled(appointmentId).then(() => {
          alert('Appointment marked as cancelled');
          fetchAppointments();
        });
        break;
      case 'edit':
        navigate(`/dashboard/medical-history?patientId=${patientId}`);
        break;
      default:
        break;
    }
  };

  const PatientSkeleton = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[1, 2, 3].map(index => (
        <div key={index} className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='h-8 bg-gray-200 animate-pulse'></div>
          <div className='p-6 space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='h-5 w-32 bg-gray-200 rounded animate-pulse'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
            </div>
            <div className='space-y-2 pt-2 border-t border-gray-100'>
              <div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 w-1/2 bg-gray-200 rounded animate-pulse'></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const DoctorSkeleton = () => (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead>
          <tr>
            <th className='px-6 py-3 bg-gray-200 animate-pulse'></th>
            <th className='px-6 py-3 bg-gray-200 animate-pulse'></th>
            <th className='px-6 py-3 bg-gray-200 animate-pulse'></th>
            <th className='px-6 py-3 bg-gray-200 animate-pulse'></th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map(index => (
            <tr key={index}>
              <td className='px-6 py-4'>
                <div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
              </td>
              <td className='px-6 py-4'>
                <div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
              </td>
              <td className='px-6 py-4'>
                <div className='h-4 w-20 bg-gray-200 rounded animate-pulse'></div>
              </td>
              <td className='px-6 py-4'>
                <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <h1 className='text-4xl mb-4 font-semibold'>Appointment Page</h1>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
        {user?.role === 'patient' && (
          <Link to={'/dashboard/appointments/doctor-list'} className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            <Plus className='h-5 w-5 mr-2' />
            New Appointment
          </Link>
        )}
      </div>

      {loading ? (
        user?.role === 'patient' ? (
          <PatientSkeleton />
        ) : (
          <DoctorSkeleton />
        )
      ) : user?.role === 'patient' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div key={index} className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
                <div className={`px-4 py-2 text-sm font-semibold text-white ${appointment.appointmentStatus === 'upcoming' ? 'bg-blue-600' : appointment.appointmentStatus === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>{appointment.appointmentStatus.charAt(0).toUpperCase() + appointment.appointmentStatus.slice(1)}</div>
                <div className='p-6 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Calendar className='h-5 w-5 text-blue-600' />
                      <span className='text-gray-700 font-medium'>{new Date(appointment.appointmentDate).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Stethoscope className='h-5 w-5 text-blue-600' />
                      <div>
                        <p className='font-semibold text-gray-900'>{appointment?.doctorData?.name}</p>
                        <p className='text-sm text-gray-600'>{appointment?.doctorData?.specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2 pt-2 border-t border-gray-100'>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <MapPin className='h-4 w-4' />
                      <span>{appointment?.doctorData?.hospitalAffiliation}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <Phone className='h-4 w-4' />
                      <span>{appointment?.doctorData?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='bg-white rounded-lg text-center col-span-3 shadow overflow-hidden p-6'>
              <p className='text-gray-700'>No appointments found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow overflow-hidden glass-effect'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Patient</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Date & Time</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Reason</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-white'>{appointment?.patientData?.name}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-white'>{new Date(appointment?.appointmentDate).toLocaleString()}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-white'>{appointment?.appointmentReason}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.appointmentStatus === 'upcoming' ? 'bg-green-100 text-green-800' : appointment.appointmentStatus === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{appointment.appointmentStatus.charAt(0).toUpperCase() + appointment.appointmentStatus.slice(1)}</span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex items-center space-x-2'>
                        {appointment.appointmentStatus !== 'completed' && appointment.appointmentStatus !== 'cancelled' && (
                          <button onClick={() => handleActionClick('complete', appointment.appointmentId)} className='p-1 text-green-600 hover:bg-green-100 rounded' title='Mark as Complete'>
                            <Check className='h-5 w-5' />
                          </button>
                        )}
                        {appointment.appointmentStatus == 'pending' && (
                          <>
                            <button onClick={() => handleActionClick('edit', appointment.appointmentId, appointment.patientId)} className='p-1 text-yellow-600 hover:bg-yellow-100 rounded' title='Edit Details'>
                              <Edit className='h-5 w-5' />
                            </button>

                            <button onClick={() => handleActionClick('cancel', appointment.appointmentId)} className='p-1 text-red-600 hover:bg-red-100 rounded' title='Cancel Appointment'>
                              <X className='h-5 w-5' />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='px-6 py-4 text-center text-gray-500'>
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
