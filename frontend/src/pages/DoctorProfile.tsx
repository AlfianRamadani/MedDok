import React, { useEffect, useState, useRef } from 'react';
import { Mail, Phone, MapPin, Edit, FileText, Check, Camera, X } from 'lucide-react';
import { DoctorProfileProps } from '../types';
import useActor from '../hooks/useActor';
import { useAuth } from '../hooks/UseAuth';
import { Doctor } from '../../../src/declarations/backend/backend.did';

export default function DoctorProfile({ isEditable }: DoctorProfileProps) {
  const { user, updateDoctor, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<Partial<Doctor>>({});
  const [imagePreview, setImagePreview] = useState(user?.profilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actor = useActor();

  useEffect(() => {
    const getDoctorData = async () => {
      try {
        const data = await actor.getUserDoctorData();
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
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      } finally {
        setLoading(false);
      }
    };
    getDoctorData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = window.confirm('Are you sure you want to change your profile picture?');
    if (!result) return;

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result as string);
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        updateUser({ profilePicture: uint8Array });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    updateDoctor(doctorData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className='space-y-8 animate-pulse'>
        {/* Header Section Skeleton */}
        <div className='glass-effect rounded-2xl p-8'>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-8'>
            <div className='relative'>
              <div className='w-32 h-32 rounded-full bg-gray-700'></div>
            </div>

            <div className='flex-1 space-y-4'>
              <div className='h-8 bg-gray-700 rounded-lg w-64'></div>
              <div className='h-4 bg-gray-700 rounded-lg w-48'></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column Skeleton */}
          <div className='lg:col-span-2 space-y-8'>
            <div className='glass-effect rounded-2xl p-8 space-y-6'>
              <div className='h-6 bg-gray-700 rounded-lg w-48'></div>
              <div className='space-y-3'>
                <div className='h-4 bg-gray-700 rounded-lg w-full'></div>
                <div className='h-4 bg-gray-700 rounded-lg w-5/6'></div>
                <div className='h-4 bg-gray-700 rounded-lg w-4/6'></div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className='space-y-8'>
            <div className='glass-effect rounded-2xl p-8 space-y-6'>
              <div className='h-6 bg-gray-700 rounded-lg w-48'></div>
              <div className='space-y-4'>
                {[1, 2, 3].map(index => (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className='p-2 bg-gray-700 rounded-lg w-9 h-9'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-3 bg-gray-700 rounded-lg w-20'></div>
                      <div className='h-4 bg-gray-700 rounded-lg w-full'></div>
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

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='glass-effect rounded-2xl p-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-8'>
          <div className='relative'>
            <div className='glow-effect rounded-full p-1'>
              <img src={imagePreview} alt='Doctor Profile' className='w-32 h-32 rounded-full object-cover ring-2 ring-indigo-500/50' />
            </div>
            {isEditable &&
              (isEditing ? (
                <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                  <button onClick={() => fileInputRef.current?.click()} className='p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors'>
                    <Camera className='w-5 h-5' />
                  </button>
                  <button onClick={handleSave} className='p-2 bg-green-600 rounded-full text-white hover:bg-green-700 transition-colors'>
                    <Check className='w-5 h-5' />
                  </button>
                  <button onClick={handleCancel} className='p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors'>
                    <X className='w-5 h-5' />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className='absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors'>
                  <Edit className='w-4 h-4' />
                </button>
              ))}
            <input type='file' ref={fileInputRef} onChange={handleImageChange} accept='image/*' className='hidden' />
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
                    {isEditing ? <input type='text' name={item.name} value={item.value} onChange={handleInputChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-gray-200' /> : <p className='text-gray-200 break-all'>{item.value}</p>}
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
