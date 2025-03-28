import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Award, Clock, Star, Edit, GraduationCap, Users, Activity, FileText, Check, X, Building2 } from 'lucide-react';
import { DoctorData, DoctorProfileProps } from '../types';
import useActor from '../hooks/useActor';

export default function DoctorProfile({ isEditable }: DoctorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [doctorData, setDoctorData] = useState<Partial<DoctorData>>();
  const actor = useActor();

  useEffect(() => {
    const getDoctorData = async () => {
      actor.getUserDoctorData().then(data => {
        if (data[0]) {
          setDoctorData({
            name: data[0].fullName || '',
            specializations: [data[0].specialization],
            email: data[0].email || '',
            phone: data[0].phone || '',
            address: data[0].address || '',
            hospitalAffiliation: data[0].hospitalAffiliation || '',
          });
        }
      });
    };
    getDoctorData();
  });

  const stats = [
    { icon: Users, label: 'Patients', value: '500+' },
    { icon: Star, label: 'Rating', value: '4.9' },
    { icon: Activity, label: 'Consultations', value: '1,200+' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setDoctorData(prev => ({
        ...prev,
        specializations: prev?.specializations ? [...prev.specializations, newSpecialization.trim()] : [newSpecialization.trim()],
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    if (!doctorData?.specializations) return;
    setDoctorData(prev => {
      if (!prev || !prev.specializations) return prev;
      return {
        ...prev,
        specializations: prev.specializations.filter((_, i) => i !== index),
      };
    });
  };

  const handleSave = () => {
    setIsEditing(false);
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
                    <input type='text' name='name' value={doctorData?.name} onChange={handleInputChange} className='bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-2xl font-bold text-white w-full' />
                    <input type='text' name='specialty' value={doctorData?.specialty} onChange={handleInputChange} className='bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-gray-300 w-full' />
                  </div>
                ) : (
                  <>
                    <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>{doctorData?.name}</h1>
                    <p className='text-gray-400 mt-1'>{doctorData?.specialty}</p>
                  </>
                )}
              </div>
              <div className='flex items-center space-x-2'>
                <span className='px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium'>Verified</span>
                <span className='px-4 py-1.5 bg-green-500/20 text-green-300 rounded-full text-sm font-medium'>Available</span>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
              {stats.map((stat, index) => (
                <div key={index} className='glass-effect rounded-xl p-4 text-center'>
                  <stat.icon className='w-6 h-6 mx-auto text-indigo-400 mb-2' />
                  <p className='text-2xl font-bold text-white'>{stat.value}</p>
                  <p className='text-gray-400 text-sm'>{stat.label}</p>
                </div>
              ))}
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
            {isEditing ? <textarea name='about' value={doctorData?.about} onChange={handleInputChange} rows={4} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 text-gray-300' /> : <p className='text-gray-300 leading-relaxed'>{doctorData?.about}</p>}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-white flex items-center'>
                  <Award className='w-5 h-5 mr-2 text-purple-400' />
                  Specializations
                </h3>
                {isEditing && (
                  <div className='flex space-x-2'>
                    <input type='text' value={newSpecialization} onChange={e => setNewSpecialization(e.target.value)} className='flex-1 bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-gray-300' placeholder='Add specialization' />
                    <button onClick={addSpecialization} className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'>
                      Add
                    </button>
                  </div>
                )}
                <ul className='space-y-2'>
                  {doctorData?.specializations?.map((item, index) => (
                    <li key={index} className='flex items-center justify-between text-gray-300'>
                      <div className='flex items-center'>
                        <span className='w-2 h-2 bg-indigo-400 rounded-full mr-2'></span>
                        {item}
                      </div>
                      {isEditing && (
                        <button onClick={() => removeSpecialization(index)} className='text-red-400 hover:text-red-300'>
                          <X className='w-4 h-4' />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='glass-effect rounded-2xl p-8 space-y-6'>
            <h2 className='text-xl font-semibold text-white flex items-center'>
              <GraduationCap className='w-5 h-5 mr-2 text-indigo-400' />
              Education & Experience
            </h2>
            <div className='space-y-6'>
              {doctorData?.education?.map((item, index) => (
                <div key={index} className='flex items-start space-x-4'>
                  <div className='p-2 bg-indigo-500/20 rounded-lg'>{index === 0 ? <GraduationCap className='w-5 h-5 text-indigo-400' /> : <Building2 className='w-5 h-5 text-indigo-400' />}</div>
                  {isEditing ? (
                    <div className='flex-1 space-y-2'>
                      <input
                        type='text'
                        value={item.title}
                        onChange={e => {
                          const newEducation = [...(doctorData.education || [])];
                          newEducation[index] = { ...item, title: e.target.value };
                          setDoctorData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-white'
                      />
                      <input
                        type='text'
                        value={item.role}
                        onChange={e => {
                          const newEducation = [...(doctorData.education || [])];
                          newEducation[index] = { ...item, role: e.target.value };
                          setDoctorData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-gray-300'
                      />
                      <input
                        type='text'
                        value={item.year}
                        onChange={e => {
                          const newEducation = [...(doctorData.education || [])];
                          newEducation[index] = { ...item, year: e.target.value };
                          setDoctorData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-indigo-400'
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className='text-lg font-medium text-white'>{item.title}</h3>
                      <p className='text-gray-400'>{item.role}</p>
                      <p className='text-sm text-indigo-400 mt-1'>{item.year}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                { icon: Clock, label: 'Working Hours', name: 'workingHours', value: doctorData?.workingHours },
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
