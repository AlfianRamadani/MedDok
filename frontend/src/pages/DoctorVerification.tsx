import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, GraduationCap, FileText, BadgeCheck, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';
import useActor from '../hooks/useActor';
import { VerificationForm } from '../types';

export default function DoctorVerification() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser, updateDoctor } = useAuth();
  const actor = useActor();
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationForm, string>>>({});
  const [form, setForm] = useState<VerificationForm>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    address: '',
    documents: null,
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof VerificationForm, string>> = {};

    if (!form.name) newErrors.name = 'Full name is required';
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(form.phone)) {
      newErrors.phone = 'Invalid phone number format, example: +1000000000';
    }
    if (!form.specialization) newErrors.specialization = 'Specialization is required';
    if (!form.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!form.hospitalAffiliation) newErrors.hospitalAffiliation = 'Hospital affiliation is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.documents || form.documents.length === 0) {
      newErrors.documents = 'At least one document is required';
    } else {
      const invalidFiles = Array.from(form.documents).filter(file => {
        const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
        const isValidSize = file.size <= 3 * 1024 * 1024; // 3MB
        return !isValidType || !isValidSize;
      });

      if (invalidFiles.length > 0) {
        newErrors.documents = 'Invalid file(s). Only PDF, JPEG, and PNG files under 3MB are allowed';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof VerificationForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(prev => ({
        ...prev,
        documents: e.target.files,
      }));
      if (errors.documents) {
        setErrors(prev => ({
          ...prev,
          documents: undefined,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!form.documents) return;

      const files = Array.from(form.documents);
      await Promise.all(
        files.map(async file => {
          if (await actor.checkFileExists(file.name)) {
            alert(`File "${file.name}" already exists. Please choose a different file name.`);
            return;
          }

          const fileContent = await readFileAsArrayBuffer(file);
          if (!fileContent) {
            alert(`Failed to read file: ${file.name}`);
            return;
          }

          const content = new Uint8Array(fileContent);
          const chunkSize = 1024 * 1024; // 1MB chunks
          const totalChunks = Math.ceil(content.length / chunkSize);

          try {
            for (let i = 0; i < totalChunks; i++) {
              const start = i * chunkSize;
              const end = Math.min(start + chunkSize, content.length);
              const chunk = content.slice(start, end);
              await actor.uploadFileChunk(file.name, chunk, BigInt(i), file.type, content.length.toString());
            }
          } catch (error) {
            console.error(`Upload failed for ${file.name}:`, error);
            return;
          }
        })
      );

      updateDoctor(form);
      updateUser({ role: 'doctor' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during verification:', error);
      alert('An error occurred during verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(null);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className=' min-h-screen py-8 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 '>
      <div className='max-w-4xl mx-auto space-y-6'>
        <button onClick={() => navigate(-1)} className='flex items-center text-gray-400 hover:text-white mb-8 transition-colors'>
          <ArrowLeft className='w-5 h-5 mr-2' />
          Back
        </button>

        <div className='glass-effect rounded-2xl p-8 space-y-6'>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Doctor Verification</h1>
            <p className='text-gray-400 mt-2'>Please provide your professional information for verification. All data will be kept confidential.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Personal Information */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <BadgeCheck className='w-5 h-5 mr-2 text-indigo-400' />
                Personal Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block  text-sm font-medium text-gray-300 mb-1'>Full Name</label>
                  <input type='text' name='name' value={form.name} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Dr. John Doe' />
                  {errors.name && <p className='text-red-400 text-sm mt-1'>{errors.name}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    <Mail className='w-4 h-4 inline mr-1' />
                    Email
                  </label>
                  <input type='email' name='email' value={form.email} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='doctor@example.com' />
                  {errors.email && <p className='text-red-400 text-sm mt-1'>{errors.email}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    <Phone className='w-4 h-4 inline mr-1' />
                    Phone Number
                  </label>
                  <input type='tel' name='phone' value={form.phone} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='+1 (555) 000-0000' />
                  {errors.phone && <p className='text-red-400 text-sm mt-1'>{errors.phone}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>Specialization</label>
                  <input type='text' name='specialization' value={form.specialization} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='e.g., Cardiology' />
                  {errors.specialization && <p className='text-red-400 text-sm mt-1'>{errors.specialization}</p>}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <GraduationCap className='w-5 h-5 mr-2 text-purple-400' />
                Professional Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>License Number</label>
                  <input type='text' name='licenseNumber' value={form.licenseNumber} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Medical License Number' />
                  {errors.licenseNumber && <p className='text-red-400 text-sm mt-1'>{errors.licenseNumber}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>Hospital Affiliation</label>
                  <input type='text' name='hospitalAffiliation' value={form.hospitalAffiliation} onChange={handleChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Current Hospital/Clinic' />
                  {errors.hospitalAffiliation && <p className='text-red-400 text-sm mt-1'>{errors.hospitalAffiliation}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300 mb-1'>
                <MapPin className='w-4 h-4 inline mr-1' />
                Practice Address
              </label>
              <textarea name='address' value={form.address} onChange={handleChange} rows={3} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Full address of your practice' />
              {errors.address && <p className='text-red-400 text-sm mt-1'>{errors.address}</p>}
            </div>

            {/* Document Upload */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300 mb-1'>
                <FileText className='w-4 h-4 inline mr-1' />
                Supporting Documents
              </label>
              <div className='relative'>
                <input type='file' onChange={handleFileChange} multiple className='hidden' id='documents' accept='.pdf,.jpg,.jpeg,.png' />
                <label htmlFor='documents' className='flex items-center justify-center w-full p-4 border-2 border-dashed border-indigo-500/30 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors'>
                  <div className='text-center'>
                    <Upload className='w-8 h-8 mx-auto text-indigo-400 mb-2' />
                    <p className='text-sm text-gray-300'>Upload your medical license, certificates, and other relevant documents</p>
                    <p className='text-xs text-gray-500 mt-1'>PDF, JPG, or PNG files (Max 3MB each)</p>
                  </div>
                </label>
                {form.documents && <p className='mt-2 text-sm text-gray-400'>{form.documents.length} file(s) selected</p>}
                {errors.documents && <p className='text-red-400 text-sm mt-1'>{errors.documents}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end pt-6'>
              <button type='submit' disabled={isSubmitting} className='px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'>
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  'Submit for Verification'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
