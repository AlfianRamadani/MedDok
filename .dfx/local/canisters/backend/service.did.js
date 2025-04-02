export const idlFactory = ({ IDL }) => {
  const Appointment = IDL.Record({
    'doctorId' : IDL.Principal,
    'patientId' : IDL.Principal,
    'appointmentReason' : IDL.Text,
    'appointmentStatus' : IDL.Text,
    'appointmentDate' : IDL.Text,
    'appointmentId' : IDL.Text,
  });
  const User = IDL.Record({
    'role' : IDL.Text,
    'profilePicture' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Doctor = IDL.Record({
    'hospitalAffiliation' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'email' : IDL.Text,
    'address' : IDL.Text,
    'specialization' : IDL.Text,
    'licenseNumber' : IDL.Text,
    'phone' : IDL.Text,
  });
  const Patient = IDL.Record({
    'weight' : IDL.Text,
    'height' : IDL.Text,
    'status' : IDL.Text,
    'bloodType' : IDL.Text,
    'temperature' : IDL.Text,
    'dateOfBirth' : IDL.Text,
    'name' : IDL.Text,
    'bloodPressure' : IDL.Text,
    'updatedAt' : IDL.Int,
    'heartRate' : IDL.Text,
    'notes' : IDL.Text,
    'chronicConditions' : IDL.Vec(IDL.Text),
    'allergies' : IDL.Vec(IDL.Text),
    'currentMedications' : IDL.Vec(IDL.Text),
  });
  const DoctorUpdate = IDL.Record({
    'hospitalAffiliation' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'address' : IDL.Opt(IDL.Text),
    'specialization' : IDL.Opt(IDL.Text),
    'licenseNumber' : IDL.Opt(IDL.Text),
    'phone' : IDL.Opt(IDL.Text),
  });
  const PatientUpdate = IDL.Record({
    'weight' : IDL.Opt(IDL.Text),
    'height' : IDL.Opt(IDL.Text),
    'status' : IDL.Opt(IDL.Text),
    'bloodType' : IDL.Opt(IDL.Text),
    'temperature' : IDL.Opt(IDL.Text),
    'dateOfBirth' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'bloodPressure' : IDL.Opt(IDL.Text),
    'updatedAt' : IDL.Opt(IDL.Int),
    'heartRate' : IDL.Opt(IDL.Text),
    'notes' : IDL.Opt(IDL.Text),
    'chronicConditions' : IDL.Opt(IDL.Vec(IDL.Text)),
    'allergies' : IDL.Opt(IDL.Vec(IDL.Text)),
    'currentMedications' : IDL.Opt(IDL.Vec(IDL.Text)),
  });
  const UserUpdate = IDL.Record({
    'role' : IDL.Opt(IDL.Text),
    'profilePicture' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  return IDL.Service({
    'addAppointment' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Text, IDL.Text],
        [IDL.Opt(Appointment)],
        [],
      ),
    'addUser' : IDL.Func([IDL.Text], [IDL.Opt(User)], []),
    'checkFileExists' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllAppointments' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(IDL.Text, Appointment, IDL.Opt(Doctor), IDL.Opt(Patient))
          ),
        ],
        [],
      ),
    'getAllDoctors' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, Doctor, User))],
        [],
      ),
    'getDoctorProfile' : IDL.Func([], [IDL.Opt(Doctor)], []),
    'getMyProfile' : IDL.Func([], [IDL.Opt(User)], []),
    'getPatient' : IDL.Func([IDL.Principal], [IDL.Opt(Patient)], []),
    'getPatientProfile' : IDL.Func([], [IDL.Opt(Patient)], []),
    'getUpcomingAppointments' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Appointment, Patient, Doctor))],
        [],
      ),
    'getUserDoctorData' : IDL.Func([], [IDL.Opt(Doctor)], []),
    'markAppointmentAsCancelled' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'markAppointmentAsComplete' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'updateDoctorData' : IDL.Func([DoctorUpdate], [IDL.Opt(Doctor)], []),
    'updatePatientField' : IDL.Func(
        [PatientUpdate, IDL.Opt(IDL.Principal)],
        [IDL.Opt(Patient)],
        [],
      ),
    'updateUserField' : IDL.Func([UserUpdate], [IDL.Opt(User)], []),
    'uploadFileChunk' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Nat, IDL.Text, IDL.Text],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
