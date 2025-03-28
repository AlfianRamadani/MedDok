import { ActorSubclass } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import React from 'react';

export interface HealthMetric {
  date: string;
  value: number;
}

export interface DailyActivity {
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface HealthRecord {
  id: string;
  type: string;
  date: string;
  provider: string;
  description: string;
}
export interface ProtectedRouteProps {
  role?: string;
  children: React.ReactNode;
}

export interface User {
  actor: ActorSubclass<any> | undefined;
  authClient: AuthClient | undefined;
  isAuthenticated: boolean | undefined;
  principal: string | undefined;
  role?: string;
  name?: string;
  profilePicture?: string | undefined;
  patient?: {
    name: string;
    dateOfBirth: string;
    bloodType: string;
    allergies: string[];
    currentMedications: string[];
    chronicConditions: string[];
    bloodPressure: string;
      heartRate: string;
      temperature: string;
      weight: string;
      height: string;
      status: string;
      updatedAt: Date | undefined | bigint;
    notes: string;
  };
  doctor?: {
    name: string;
  };
}
export interface ButtonLoginProps {
  user: User | null;
  login: () => void;
  logout: () => void;
  provider: string;
  logo: React.ReactNode | string;
}

export interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (data: any) => void;
  updatePatient: (data: any) => void;
  updateDoctor: (data: any) => void;
}

// Definisi tipe untuk AuthProvider props
export interface AuthProviderProps {
  children: React.ReactNode;
}




export interface DoctorProfileProps {
  isEditable: boolean;
}

export interface AppointmentForm {
  doctorId: string;
  timestamp: string;
  description: string;
}
