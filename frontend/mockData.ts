import { Activity, AlertCircle, Calendar, Heart, Pill, User } from 'lucide-react';
import { DailyActivity, Appointment } from './src/types';

export const dailyActivity: DailyActivity = {
  steps: 8432,
  calories: 2150,
  distance: 6.2,
  activeMinutes: 45,
};
export const todaysTasks = [
  {
    id: 1,
    patientName: 'Hanna Westervelt',
    task: 'Reach out to patient',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    patientName: 'Cooper Franci',
    task: 'Review Check-Ins',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    patientName: 'Jocelyn Vetrovs',
    task: 'Assign new CCM devices',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    patientName: 'Ryan Westervelt',
  task: 'Reach out to patient',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 5,
    patientName: 'John Rhiel Madsen',
    task: 'Check Alerts',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Chen',
    specialty: 'Cardiologist',
    date: '2024-03-15',
    time: '10:30 AM',
    status: 'upcoming',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Rodriguez',
    specialty: 'General Practitioner',
    date: '2024-03-20',
    time: '2:15 PM',
    status: 'upcoming',
  },
];

export const basicInfoFields = [
  {
    name: 'name',
    label: 'Patient Name',
    type: 'text',
    icon: User,
    placeholder: 'Enter patient name',
  },
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    icon: Calendar,
  },
  {
    name: 'bloodType',
    label: 'Blood Type',
    type: 'select',
    icon: Heart,
    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
];

export const listFields = [
  {
    name: 'allergies',
    label: 'Allergies',
    icon: AlertCircle,
    placeholder: 'Add allergy',
  },
  {
    name: 'currentMedications',
    label: 'Current Medications',
    icon: Pill,
    placeholder: 'Add medication',
  },
  {
    name: 'chronicConditions',
    label: 'Chronic Conditions',
    icon: Activity,
    placeholder: 'Add condition',
  },
];

export const vitalSignFields = [
  {
    name: 'bloodPressure',
    label: 'Blood Pressure',
    placeholder: '120/80',
    unit: 'mmHg',
  },
  {
    name: 'heartRate',
    label: 'Heart Rate',
    placeholder: '72',
    unit: 'bpm',
  },
  {
    name: 'temperature',
    label: 'Temperature',
    placeholder: '37.0',
    unit: '°C',
  },
  {
    name: 'weight',
    label: 'Weight',
    placeholder: '70',
    unit: 'kg',
  },
  {
    name: 'height',
    label: 'Height',
    placeholder: '170',
    unit: 'cm',
  },
];
