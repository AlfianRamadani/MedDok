import React, { useEffect, useState } from 'react';
import { AppointmentForm } from '../../types';
import useActor from '../../hooks/useActor';
import { Calendar, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { Doctor } from '../../../../src/declarations/backend/backend.did';

export default function DoctorList() {
  interface DoctorDataWithId extends Doctor {
    id: string;
  }

  const [form, setForm] = useState<AppointmentForm>({
    doctorId: '',
    timestamp: '',
    description: '',
  });
  const { user } = useAuth();
  const [doctorList, setDoctorList] = useState<DoctorDataWithId[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const actor = useActor();

  useEffect(() => {
    actor.getAllDoctors().then(data => {
      const doctorDataArray = data.map(([principal, doctorData]) => ({
        ...doctorData,
        id: principal.toString(),
      }));
      setDoctorList(doctorDataArray);
      setLoading(false);
    });
  }, [actor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actor.addAppointment(Principal.fromText(form.doctorId), Principal.fromText(user?.principal?.toString() || ''), form.timestamp, form.description).then(() => {
      window.history.back();
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setForm(prev => ({
      ...prev,
      doctorId: doctorId,
    }));
  };

  // Array of professional doctor images from Unsplash
  const doctorImages = ['https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Create New Appointment</h2>
      </div>

      <div className='glass-effect rounded-2xl p-8 h-[35rem] overflow-scroll'>
        <h3 className='text-xl font-semibold text-white mb-6'>Select a Doctor</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='glass-effect rounded-xl p-6 animate-pulse'>
                  <div className='flex items-start space-x-4'>
                    <div className='flex-shrink-0'>
                      <div className='w-20 h-20 bg-gray-700 rounded-lg' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='h-4 bg-gray-700 rounded w-3/4 mb-2' />
                      <div className='h-3 bg-gray-700 rounded w-1/2' />
                      <div className='mt-4 space-y-2'>
                        <div className='h-3 bg-gray-700 rounded w-5/6' />
                        <div className='h-3 bg-gray-700 rounded w-4/6' />
                        <div className='h-3 bg-gray-700 rounded w-3/6' />
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 pt-4 border-t border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <div className='h-3 bg-gray-700 rounded w-5/6' />
                        <div className='h-3 bg-gray-700 rounded w-4/6' />
                      </div>
                      <div className='h-5 w-5 bg-gray-700 rounded-full' />
                    </div>
                  </div>
                </div>
              ))
            : doctorList.map((doctor, index) => (
                <div key={index} className={`glass-effect rounded-xl p-6 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${selectedDoctor === doctor.id ? 'ring-2 ring-indigo-500' : ''}`} onClick={() => handleDoctorSelect(doctor.id)}>
                  <div className='flex items-start space-x-4'>
                    <div className='flex-shrink-0'>
                      <img src={doctorImages} alt={doctor.name} className='w-20 h-20 rounded-lg object-cover ring-2 ring-indigo-500/30' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-lg font-semibold text-white truncate'>{doctor.name}</h4>
                      <p className='text-indigo-400 text-sm'>{doctor.specialization}</p>

                      <div className='mt-4 space-y-2'>
                        <div className='flex items-center text-gray-300 text-sm'>
                          <Building2 className='w-4 h-4 mr-2 text-indigo-400' />
                          <span className='truncate'>{doctor.hospitalAffiliation}</span>
                        </div>
                        <div className='flex items-center text-gray-300 text-sm'>
                          <MapPin className='w-4 h-4 mr-2 text-indigo-400' />
                          <span className='truncate'>{doctor.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 pt-4 border-t border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <div className='flex items-center text-gray-300 text-sm'>
                          <Mail className='w-4 h-4 mr-2 text-indigo-400' />
                          <span className='truncate'>{doctor.email}</span>
                        </div>
                        <div className='flex items-center text-gray-300 text-sm'>
                          <Phone className='w-4 h-4 mr-2 text-indigo-400' />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {selectedDoctor && (
        <div className='glass-effect rounded-2xl p-8 space-y-6'>
          <h3 className='text-xl font-semibold text-white flex items-center'>
            <Calendar className='w-5 h-5 mr-2 text-indigo-400' />
            Schedule Appointment
          </h3>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>Appointment Date & Time</label>
              <input type='datetime-local' name='timestamp' value={form.timestamp} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>Description / Reason for Visit</label>

              <textarea name='description' value={form.description} onChange={handleChange} rows={4} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Please describe your symptoms or reason for the appointment' />
            </div>

            <div className='flex justify-end'>
              <button type='submit' className='px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300'>
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
