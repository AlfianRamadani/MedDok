import { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import { canisterId, createActor } from '../../../src/declarations/backend';
import Loading from '../components/Loading';
import defaultImage from '../assets/img/default.png';
import { AuthContextType, AuthProviderProps, User } from '../types';
import { DoctorUpdate, PatientUpdate, UserUpdate } from '../../../src/declarations/backend/backend.did';
import { Principal } from '@dfinity/principal';

const network = import.meta.env.VITE_DFX_NETWORK;
const identityProvider = network === 'ic' ? 'https://identity.ic0.app' : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/`;
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>({ actor: undefined, authClient: undefined, isAuthenticated: false, principal: undefined });

  const handleProfilePicture = (pic?: Uint8Array[]) => (pic?.length ? URL.createObjectURL(new Blob([new Uint8Array(pic[0] || [])])) : defaultImage);

  const logout = async () => {
    if (user.authClient) {
      await user.authClient.logout();
      setUser({ actor: undefined, authClient: undefined, isAuthenticated: false, principal: 'Logged out' });
      navigate('/');
      window.location.reload();
    }
  };

  const updateUser = async (data: UserUpdate) => {
    try {
      setLoading(true);
      if (!user.isAuthenticated) return;
      const loggedUser = await user.actor?.updateUserField({ role: data.role ? [data.role] : [], profilePicture: data.profilePicture ? [data.profilePicture] : [] });
      if (loggedUser) setUser(prev => ({ ...prev, role: loggedUser[0]?.role, profilePicture: handleProfilePicture(loggedUser[0]?.profilePicture) }));
      if (data.role) navigate('/dashboard');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Error updating user profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (data: PatientUpdate, patientId?: string) => {
    const updateData = {
      name: data.name ? [data.name] : [],
      dateOfBirth: data.dateOfBirth ? [data.dateOfBirth] : [],
      bloodType: data.bloodType ? [data.bloodType] : [],
      allergies: data.allergies ? [data.allergies] : [],
      currentMedications: data.currentMedications ? [data.currentMedications] : [],
      chronicConditions: data.chronicConditions ? [data.chronicConditions] : [],
      bloodPressure: data.bloodPressure ? [data.bloodPressure] : [],
      heartRate: data.heartRate ? [data.heartRate] : [],
      temperature: data.temperature ? [data.temperature] : [],
      weight: data.weight ? [data.weight] : [],
      height: data.height ? [data.height] : [],
      notes: data.notes ? [data.notes] : [],
      status: patientId ? ['non-editable'] : data.status ? [data.status] : [],
      updatedAt: [],
    };

    try {
      setLoading(true);
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const actor = createActor(canisterId, { agentOptions: { identity } });
      const updatedPatient = patientId ? await actor.updatePatientField(updateData as PatientUpdate, [Principal.fromText(patientId)]) : await user.actor.updatePatientField(updateData as PatientUpdate, []);
      if (updatedPatient) setUser(prev => ({ ...prev, patient: updatedPatient[0] }));
    } catch (error) {
      console.error('Error updating patient profile:', error);
      alert('Error updating patient profile');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateDoctor = async (data: DoctorUpdate) => {
    const updateData = {
      name: data.name ? [data.name] : [],
      email: data.email ? [data.email] : [],
      phone: data.phone ? [data.phone] : [],
      specialization: data.specialization ? [data.specialization] : [],
      licenseNumber: data.licenseNumber ? [data.licenseNumber] : [],
      hospitalAffiliation: data.hospitalAffiliation ? [data.hospitalAffiliation] : [],
      address: data.address ? [data.address] : [],
      description: data.description ? [data.description] : [],
    };

    try {
      setLoading(true);
      if (!user.isAuthenticated) return;
      const updatedDoctor = await user.actor?.updateDoctorData(updateData);
      if (updatedDoctor) setUser(prev => ({ ...prev, doctor: updatedDoctor[0] }));
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      alert('Error updating doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const updateActor = async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const actor = createActor(canisterId, { agentOptions: { identity } });
      const isAuthenticated = await authClient.isAuthenticated();
      const principal = isAuthenticated ? identity.getPrincipal().toText() : 'Not Connected';
      if (isAuthenticated) {
        setLoading(true);
        let loggedUser = await actor.getMyProfile();
        if (!loggedUser?.length) loggedUser = await actor.addUser('');
        setUser({ actor, authClient, isAuthenticated, principal, role: loggedUser[0]?.role, profilePicture: handleProfilePicture((loggedUser[0]?.profilePicture as (Uint8Array | number[])[]).map(item => (item instanceof Uint8Array ? item : new Uint8Array(item)))) });
        if (loggedUser[0]?.role === 'patient') {
          const patientProfile = await actor.getPatientProfile();
          setUser(prev => ({ ...prev, patient: patientProfile[0] }));
        }
        if (loggedUser[0]?.role === 'doctor') {
          const doctorProfile = await actor.getDoctorProfile();
          setUser(prev => ({ ...prev, doctor: doctorProfile[0] }));
        }
      } else {
        setUser({ actor, authClient, isAuthenticated, principal });
      }
    } catch {
      indexedDB.deleteDatabase('auth-client-db');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateActor();
  }, []);

  const login = async () => {
    await user?.authClient?.login({ identityProvider, onSuccess: updateActor });
  };

  const contextValue = useMemo(() => ({ user, login, updatePatient, updateDoctor, logout, setLoading, updateUser }), [user]);

  return <AuthContext.Provider value={contextValue}>{loading ? <Loading /> : children}</AuthContext.Provider>;
};
