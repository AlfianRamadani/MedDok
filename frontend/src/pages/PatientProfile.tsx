import React, { useState, useRef } from 'react';
import { Edit, Camera, X } from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';

export default function PatientProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="glow-effect rounded-full p-1">
              <img src={imagePreview} alt="Patient Profile" className="md:w-48 md:h-48 rounded-full object-cover ring-2 ring-indigo-500/50" />
            </div>
            {isEditing ? (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>

                <button onClick={() => setIsEditing(false)} className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.patient?.name}</h1>
            <p className="text-gray-400 mt-1">Patient ID: {user?.principal?.toString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
