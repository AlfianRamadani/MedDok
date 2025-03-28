import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Error from './pages/Error';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AppointmentPage from './pages/Appointments/Appointment';
import Layout from './components/Layout';
import MedicalHistory from './pages/MedicalHistory';
import Welcome from './pages/Welcome';
import DoctorVerification from './pages/DoctorVerification';
import DoctorProfile from './pages/DoctorProfile';
import PatientProfile from './pages/PatientProfile';
import DoctorList from './pages/Appointments/DoctorList';

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
              <Route index element={<Dashboard />} />
              <Route path='appointments' element={<AppointmentPage />} />
              <Route path='appointments/doctor-list' element={<DoctorList />} />
              <Route path='medical-history' element={<MedicalHistory />} />
              <Route path='settings/patient' element={<PatientProfile />} />
              <Route path='settings/doctor' element={<DoctorProfile isEditable={true} />} />
            </Route>
            <Route path='doctor-verification' element={<DoctorVerification />} />
            <Route path='welcome' element={<Welcome />} />
            <Route path='/404' element={<Error />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}
