import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, GraduationCap, FileText, BadgeCheck, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/UseAuth';
import useActor from '../hooks/useActor';

const verificationFormSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  specialization: z.string().min(1, 'Specialization is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  hospitalAffiliation: z.string().min(1, 'Hospital affiliation is required'),
  address: z.string().min(1, 'Address is required'),
  documents: z
    .custom<FileList | undefined>()
    .refine(files => files && files.length > 0, 'At least one document is required')
    .refine(files => files && files.length <= 5, 'You can upload a maximum of 5 files')
    .refine(files => files && Array.from(files).every(file => file.size <= 3 * 1024 * 1024), 'Each file must be less than 3MB')
    .refine(files => files && Array.from(files).every(file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)), 'Only PDF, JPEG, and PNG files are allowed'),
});

type VerificationForm = z.infer<typeof verificationFormSchema>;

export default function DoctorVerification() {
  const { updateUser, updateDoctor } = useAuth();
  const actor = useActor();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialization: '',
      licenseNumber: '',
      hospitalAffiliation: '',
      address: '',
      documents: undefined,
    },
  });
  const documents = watch('documents');

  const onSubmit: SubmitHandler<VerificationForm> = async (data: VerificationForm) => {
    try {
      const files = Array.from(documents as FileList);
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
          const chunkSize = 1024 * 1024;
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
      )
        .then(() => updateDoctor(data))
        .catch(error => {
          console.error('Error verify:', error);
          return;
        })
        .finally(async () => {
          updateUser({ role: 'doctor' });
          navigate('/dashboard');
        });
      async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(null);
          reader.readAsArrayBuffer(file);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='py-8 px-4 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900'>
      <div className='glass-effect max-w-4xl rounded-2xl p-8 mx-auto space-y-6'>
        <button onClick={() => navigate(-1)} className='flex items-center text-gray-400 hover:text-white mb-8 transition-colors'>
          <ArrowLeft className='w-5 h-5 mr-2' />
          Back
        </button>

        <div>
          <div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Doctor Verification</h1>
            <p className='text-gray-400 mt-2'>Please provide your professional information for verification. All data will be kept confidential.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Personal Information */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <BadgeCheck className='w-5 h-5 mr-2 text-indigo-400' />
                Personal Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>Full Name</label>
                  <input {...register('name')} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Dr. John Doe' />
                  {errors.name && <p className='text-red-400 text-sm mt-1'>{errors.name.message}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    <Mail className='w-4 h-4 inline mr-1' />
                    Email
                  </label>
                  <input type='email' {...register('email')} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='doctor@example.com' />
                  {errors.email && <p className='text-red-400 text-sm mt-1'>{errors.email.message}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    <Phone className='w-4 h-4 inline mr-1' />
                    Phone Number
                  </label>
                  <input type='tel' {...register('phone')} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='+1 (555) 000-0000' />
                  {errors.phone && <p className='text-red-400 text-sm mt-1'>{errors.phone.message}</p>}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>Specialization</label>
                  <input {...register('specialization')} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='e.g., Cardiology' />
                  {errors.specialization && <p className='text-red-400 text-sm mt-1'>{errors.specialization.message}</p>}
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
                  <input {...register('licenseNumber')} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Medical License Number' />
                  {errors.licenseNumber && <p className='text-red-400 text-sm mt-1'>{errors.licenseNumber.message}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>Hospital Affiliation</label>
                  <input {...register('hospitalAffiliation')} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Current Hospital/Clinic' />
                  {errors.hospitalAffiliation && <p className='text-red-400 text-sm mt-1'>{errors.hospitalAffiliation.message}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300 mb-1'>
                <MapPin className='w-4 h-4 inline mr-1' />
                Practice Address
              </label>
              <textarea {...register('address')} rows={3} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Full address of your practice' />
              {errors.address && <p className='text-red-400 text-sm mt-1'>{errors.address.message}</p>}
            </div>

            {/* Document Upload */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300 mb-1'>
                <FileText className='w-4 h-4 inline mr-1' />
                Supporting Documents
              </label>
              <div className='relative'>
                <input type='file' id='documents' accept='.pdf,.jpg,.jpeg,.png' multiple className='hidden' onChange={e => setValue('documents', e.target.files as FileList)} />
                <label htmlFor='documents' className='flex items-center justify-center w-full p-4 border-2 border-dashed border-indigo-500/30 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors'>
                  <div className='text-center'>
                    <Upload className='w-8 h-8 mx-auto text-indigo-400 mb-2' />
                    <p className='text-sm text-gray-300'>Upload your medical license, certificates, and other relevant documents</p>
                    <p className='text-xs text-gray-500 mt-1'>PDF, JPG, or PNG files (Max 10MB each)</p>
                  </div>
                </label>
                <div className='relative group'>
                  <p className='text-gray-400 mt-2 cursor-pointer text-sm '>
                    <span className='border-2 border-gray-400 rounded-full px-1 text-gray-400 '>?</span> <span className='hover:last:underline'>How to add multiple documents</span>
                  </p>
                  <div className='absolute bottom-full left-10 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg'>Hold down the Ctrl (Windows) or Command (Mac) key while selecting files to upload multiple documents.</div>
                </div>
                {documents && documents.length > 0 && <p className='mt-2 text-sm text-gray-400'>{documents.length} file(s) selected</p>}
                {errors.documents && <p className='text-red-400 text-sm mt-1'>{errors.documents.message}</p>}
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
