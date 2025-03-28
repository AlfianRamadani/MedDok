import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Edit, FileText, Check } from 'lucide-react';
import { DoctorProfileProps } from '../types';
import useActor from '../hooks/useActor';
import { useAuth } from '../hooks/UseAuth';
import { Doctor } from '../../../src/declarations/backend/backend.did';

export default function DoctorProfile({ isEditable }: DoctorProfileProps) {
  const { updateDoctor } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState<Partial<Doctor>>({});
  const actor = useActor();

  useEffect(() => {
    const getDoctorData = async () => {
      actor.getUserDoctorData().then(data => {
        if (data[0]) {
          setDoctorData({
            name: data[0].name || '',
            specialization: data[0].specialization || '',
            email: data[0].email || '',
            phone: data[0].phone || '',
            address: data[0].address || '',
            hospitalAffiliation: data[0].hospitalAffiliation || '',
            description: data[0].description || '',
          });
        }
      });
    };
    getDoctorData();
  }, []);
  console.log(doctorData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    updateDoctor(doctorData);
  };

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='glass-effect rounded-2xl p-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-8'>
          <div className='relative'>
            <div className='glow-effect rounded-full p-1'>
              <img src='https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80' alt='Doctor Profile' className='w-32 h-32 rounded-full object-cover ring-2 ring-indigo-500/50' />
            </div>
            {isEditable && (
              <button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className='absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors'>
                {isEditing ? <Check className='w-4 h-4' /> : <Edit className='w-4 h-4' />}
              </button>
            )}
          </div>

          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                {isEditing ? (
                  <div className='space-y-2'>
                    <input type='text' name='name' placeholder='enter your name' value={doctorData?.name} onChange={handleInputChange} className='bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-2xl font-bold text-white w-full' />
                    <input type='text' placeholder='Enter your specialization' name='specializations' value={doctorData?.specialization} onChange={handleInputChange} className='bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-gray-300 w-full' />
                  </div>
                ) : (
                  <>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>{doctorData?.name}</h1>
                    <p className='text-gray-400 mt-1'>{doctorData?.specialization}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          <div className='glass-effect rounded-2xl p-8 space-y-6'>
            <h2 className='text-xl font-semibold text-white flex items-center'>
              <FileText className='w-5 h-5 mr-2 text-indigo-400' />
              About Me
            </h2>
            {isEditing ? <textarea name='description' placeholder='Fill your description' value={doctorData?.description} onChange={handleInputChange} rows={4} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 text-gray-300' /> : <p className='text-gray-300 leading-relaxed'>{doctorData?.description}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-8'>
          <div className='glass-effect rounded-2xl p-8 space-y-6'>
            <h2 className='text-xl font-semibold text-white'>Contact Information</h2>
            <div className='space-y-4'>
              {[
                { icon: Mail, label: 'Email', name: 'email', value: doctorData?.email },
                { icon: Phone, label: 'Phone', name: 'phone', value: doctorData?.phone },
                { icon: MapPin, label: 'Address', name: 'address', value: doctorData?.address },
              ].map((item, index) => (
                <div key={index} className='flex items-center space-x-3'>
                  <div className='p-2 bg-indigo-500/20 rounded-lg'>
                    <item.icon className='w-5 h-5 text-indigo-400' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-400'>{item.label}</p>
                    {isEditing ? <input type='text' name={item.name} value={item.value} onChange={handleInputChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-gray-200' /> : <p className='text-gray-200'>{item.value}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
