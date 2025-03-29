import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { basicInfoFields, listFields, vitalSignFields } from '../../mockData';
import { useAuth } from '../hooks/UseAuth';
import { User } from '../types';
import useActor from '../hooks/useActor';
import { Principal } from '@dfinity/principal';

export default function MedicalHistory() {
  const [params] = useState(new URLSearchParams(window.location.search));
  const actor = useActor();
  const { user, updatePatient } = useAuth();
  const [listInputs, setListInputs] = useState({
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
  });

  const [record, setRecord] = useState<User['patient'] | null>(null);
  useEffect(() => {
    if (params.get('patientId')) {
      const patientId = params.get('patientId');
      if (!patientId) return;
      actor
        .getPatient(Principal.fromText(patientId))
        .then(data => {
          setRecord({
            name: data[0]?.name ?? '',
            dateOfBirth: data[0]?.dateOfBirth ?? '',
            bloodType: data[0]?.bloodType ?? '',
            allergies: data[0]?.allergies ?? [],
            currentMedications: data[0]?.currentMedications ?? [],
            chronicConditions: data[0]?.chronicConditions ?? [],
            bloodPressure: data[0]?.bloodPressure ?? '',
            heartRate: data[0]?.heartRate ?? '',
            temperature: data[0]?.temperature ?? '',
            weight: data[0]?.weight ?? '',
            height: data[0]?.height ?? '',
            notes: data[0]?.notes ?? '',
            status: 'editable',
            updatedAt: user?.patient?.updatedAt
              ? (() => {
                  try {
                    const nanoTimestamp = typeof user.patient.updatedAt === 'bigint' ? user.patient.updatedAt : BigInt(0); // Ensure it's a bigint
                    const milliTimestamp = Number(nanoTimestamp / BigInt(1_000_000)); // Convert to milliseconds
                    return new Date(milliTimestamp); // Buat `Date`
                  } catch (error) {
                    console.error('Error converting timestamp:', error);
                    return undefined;
                  }
                })()
              : undefined,
          });
        })
        .catch(error => {
          console.error(error);
          alert('Error fetching patient data');
        });
    } else {
      setRecord({
        name: user?.patient?.name ?? '',
        dateOfBirth: user?.patient?.dateOfBirth ?? '',
        bloodType: user?.patient?.bloodType ?? '',
        allergies: user?.patient?.allergies ?? [],
        currentMedications: user?.patient?.currentMedications ?? [],
        chronicConditions: user?.patient?.chronicConditions ?? [],
        bloodPressure: user?.patient?.bloodPressure ?? '',
        heartRate: user?.patient?.heartRate ?? '',
        temperature: user?.patient?.temperature ?? '',
        weight: user?.patient?.weight ?? '',
        height: user?.patient?.height ?? '',
        notes: user?.patient?.notes ?? '',
        status: user?.patient?.status ?? '',
        updatedAt: user?.patient?.updatedAt
          ? (() => {
              try {
                const nanoTimestamp = typeof user.patient.updatedAt === 'bigint' ? user.patient.updatedAt : BigInt(0);
                const milliTimestamp = Number(nanoTimestamp / BigInt(1_000_000));
                return new Date(milliTimestamp);
              } catch (error) {
                console.error('Error converting timestamp:', error);
                return undefined;
              }
            })()
          : undefined,
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecord(prev => {
      if (!prev) return prev; // Handle the case where prev is null
      return {
        ...prev,
        [name]: value || '', // Ensure no undefined values
      };
    });
  };

  const handleListInputChange = (name: string, value: string) => {
    setListInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = (type: keyof typeof listInputs) => {
    const value = listInputs[type];
    if (!value.trim()) return;

    setRecord(prev => {
      if (!prev) return prev; // Handle the case where prev is null or undefined
      return {
        ...prev,
        [type]: [...(prev[type as keyof typeof record] as string[]), value],
      };
    });

    setListInputs(prev => ({
      ...prev,
      [type]: '',
    }));
  };

  const removeItem = (type: 'allergies' | 'currentMedications' | 'chronicConditions', index: number) => {
    setRecord(prev => {
      if (!prev) return prev; // Handle the case where prev is null or undefined
      return {
        ...prev,
        [type]: (prev[type] as string[]).filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = window.confirm('Are you sure you want to submit the medical records? This action cannot be undone.');
    if (!result) return;
    try {
      updatePatient(
        {
          ...record,
          status: 'non-editable',
        },
        params.get('patientId') ?? undefined
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Medical Record</h1>
        {<h2>Last Updated at: {record?.updatedAt ? record?.updatedAt?.toLocaleString() : 'N/A'}</h2>}
      </div>

      <form onSubmit={handleSubmit} className='glass-effect rounded-2xl p-8 space-y-6'>
        {/* Basic Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {basicInfoFields.map((field, index) => (
            <div key={index} className='space-y-2'>
              <label className='flex items-center space-x-2 text-gray-300'>
                <field.icon className='w-4 h-4' />
                <span>{field.label}</span>
              </label>
              {field.type === 'select' ? (
                <select name={field.name} value={String(record?.[field.name as keyof User['patient']] || '')} onChange={handleInputChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100'>
                  <option value=''>Select blood type</option>
                  {field.options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input type={field.type} name={field.name} value={String(record?.[field.name as keyof User['patient']] || '')} onChange={handleInputChange} placeholder={field.placeholder} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Lists Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listFields.map((field, index) => (
            <div key={index} className='space-y-2'>
              <label className='flex items-center space-x-2 text-gray-300'>
                <field.icon className='w-4 h-4' />
                <span>{field.label}</span>
              </label>
              <div className='flex space-x-2'>
                <input type='text' value={listInputs[field.name as keyof typeof listInputs]} onChange={e => handleListInputChange(field.name, e.target.value)} className='flex-1 bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder={field.placeholder} />
                <button type='button' onClick={() => addItem(field.name as keyof typeof listInputs)} className='p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'>
                  <Plus className='w-5 h-5' />
                </button>
              </div>
              <div className='space-y-2'>
                {Array.isArray(record?.[field.name as keyof User['patient']]) &&
                  (record[field.name as keyof User['patient']] as string[]).map((item: string, index) => (
                    <div key={index} className='flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2'>
                      <span className='text-gray-300'>{item}</span>
                      <button type='button' onClick={() => removeItem(field.name as 'allergies' | 'currentMedications' | 'chronicConditions', index)} className='text-red-400 hover:text-red-300'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Vital Signs */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-200'>Vital Signs</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {vitalSignFields.map((field, index) => (
              <div key={index} className='space-y-2'>
                <label className='text-gray-300'>
                  {field.label} ({field.unit})
                </label>
                <input type='text' name={field.name} value={String(record?.[field.name as keyof User['patient']] || '')} onChange={handleInputChange} placeholder={field.placeholder} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' />
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className='space-y-2'>
          <label className='flex items-center space-x-2 text-gray-300'>
            <FileText className='w-4 h-4' />
            <span>Additional Notes</span>
          </label>
          <textarea name='notes' value={record?.notes} onChange={handleInputChange} rows={4} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Enter any additional notes or observations' />
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-4'>
          {record?.status !== 'non-editable' && (
            <button type='submit' className='px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300'>
              Save Medical Record
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
