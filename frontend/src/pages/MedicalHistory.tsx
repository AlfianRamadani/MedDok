import React, { useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { basicInfoFields, listFields, vitalSignFields } from '../../mockData';
import { useAuth } from '../hooks/UseAuth';
import { Patient } from '../../../src/declarations/backend/backend.did';

export default function MedicalHistory() {
  const { user, updatePatient } = useAuth();
  const [listInputs, setListInputs] = useState({
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
  });

  const [record, setRecord] = useState({
    name: user?.patient?.name || '',
    dateOfBirth: user?.patient?.dateOfBirth || '',
    bloodType: user?.patient?.bloodType || '',
    allergies: user?.patient?.allergies || [],
    currentMedications: user?.patient?.currentMedications || [],
    chronicConditions: user?.patient?.chronicConditions || [],
    bloodPressure: user?.patient?.bloodPressure || '',
    heartRate: user?.patient?.heartRate || '',
    temperature: user?.patient?.temperature || '',
    weight: user?.patient?.weight || '',
    height: user?.patient?.height || '',
    notes: user?.patient?.notes || '',
    status: user?.patient?.status || '',
    updated_at: user?.patient?.updatedAt || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRecord(prev => ({
        ...prev,
        [parent]: {
          ...prev,
          [child]: value,
        },
      }));
    } else {
      setRecord(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleListInputChange = (name: string, value: string) => {
    setListInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(record);
  const addItem = (type: keyof typeof listInputs) => {
    const value = listInputs[type];
    if (!value.trim()) return;

    setRecord(prev => ({
      ...prev,
      [type]: [...(prev[type as keyof Patient] as string[]), value],
    }));

    setListInputs(prev => ({
      ...prev,
      [type]: '',
    }));
  };

  const removeItem = (type: 'allergies' | 'currentMedications' | 'chronicConditions', index: number) => {
    setRecord(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = window.confirm('Are you sure you want to submit the medical records? This action cannot be undone.');
    if (!result) return;
    try {
      updatePatient({
        ...record,
        status: 'non-editable',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>Medical Record</h1>
        {record?.updated_at && <h2>Last Updated at: {record?.updated_at}</h2>}
      </div>

      <form onSubmit={handleSubmit} className='glass-effect rounded-2xl p-8 space-y-6'>
        {/* Basic Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {basicInfoFields.map(field => (
            <>
              <div key={field.name} className='space-y-2'>
                <label className='flex items-center space-x-2 text-gray-300'>
                  <field.icon className='w-4 h-4' />
                  <span>{field.label}</span>
                </label>
                {field.type === 'select' ? (
                  <select name={field.name} value={record[field.name as keyof Patient] as string} onChange={handleInputChange} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100'>
                    <option value=''>Select blood type</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input type={field.type} name={field.name} value={record[field.name as keyof Patient] as string} onChange={handleInputChange} placeholder={field.placeholder} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' />
                  </>
                )}
              </div>
            </>
          ))}
        </div>

        {/* Lists Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {listFields.map(field => (
            <div key={field.name} className='space-y-2'>
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
                {Array.isArray(record[field.name as keyof Patient]) &&
                  (record[field.name as keyof Patient] as string[]).map((item: string, index: number) => (
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
            {vitalSignFields.map(field => (
              <div key={field.name} className='space-y-2'>
                <label className='text-gray-300'>
                  {field.label} ({field.unit})
                </label>
                <input type='text' name={field.name} value={String(record[field.name as keyof Patient] || '')} onChange={handleInputChange} placeholder={field.placeholder} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' />
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
          <textarea name='notes' value={record.notes} onChange={handleInputChange} rows={4} className='w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-100' placeholder='Enter any additional notes or observations' />
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-4'>
          {record.status !== 'non-editable' && (
            <button type='submit' className='px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300'>
              Save Medical Record
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
