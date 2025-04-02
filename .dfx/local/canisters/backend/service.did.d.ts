import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Appointment {
  'doctorId' : Principal,
  'patientId' : Principal,
  'appointmentReason' : string,
  'appointmentStatus' : string,
  'appointmentDate' : string,
  'appointmentId' : string,
}
export interface Doctor {
  'hospitalAffiliation' : string,
  'name' : string,
  'description' : string,
  'email' : string,
  'address' : string,
  'specialization' : string,
  'licenseNumber' : string,
  'phone' : string,
}
export interface DoctorUpdate {
  'hospitalAffiliation' : [] | [string],
  'name' : [] | [string],
  'description' : [] | [string],
  'email' : [] | [string],
  'address' : [] | [string],
  'specialization' : [] | [string],
  'licenseNumber' : [] | [string],
  'phone' : [] | [string],
}
export interface Patient {
  'weight' : string,
  'height' : string,
  'status' : string,
  'bloodType' : string,
  'temperature' : string,
  'dateOfBirth' : string,
  'name' : string,
  'bloodPressure' : string,
  'updatedAt' : bigint,
  'heartRate' : string,
  'notes' : string,
  'chronicConditions' : Array<string>,
  'allergies' : Array<string>,
  'currentMedications' : Array<string>,
}
export interface PatientUpdate {
  'weight' : [] | [string],
  'height' : [] | [string],
  'status' : [] | [string],
  'bloodType' : [] | [string],
  'temperature' : [] | [string],
  'dateOfBirth' : [] | [string],
  'name' : [] | [string],
  'bloodPressure' : [] | [string],
  'updatedAt' : [] | [bigint],
  'heartRate' : [] | [string],
  'notes' : [] | [string],
  'chronicConditions' : [] | [Array<string>],
  'allergies' : [] | [Array<string>],
  'currentMedications' : [] | [Array<string>],
}
export interface User {
  'role' : string,
  'profilePicture' : [] | [Uint8Array | number[]],
}
export interface UserUpdate {
  'role' : [] | [string],
  'profilePicture' : [] | [Uint8Array | number[]],
}
export interface _SERVICE {
  'addAppointment' : ActorMethod<
    [Principal, Principal, string, string],
    [] | [Appointment]
  >,
  'addUser' : ActorMethod<[string], [] | [User]>,
  'checkFileExists' : ActorMethod<[string], boolean>,
  'getAllAppointments' : ActorMethod<
    [],
    Array<[string, Appointment, [] | [Doctor], [] | [Patient]]>
  >,
  'getAllDoctors' : ActorMethod<[], Array<[Principal, Doctor, User]>>,
  'getDoctorProfile' : ActorMethod<[], [] | [Doctor]>,
  'getMyProfile' : ActorMethod<[], [] | [User]>,
  'getPatient' : ActorMethod<[Principal], [] | [Patient]>,
  'getPatientProfile' : ActorMethod<[], [] | [Patient]>,
  'getUpcomingAppointments' : ActorMethod<
    [],
    Array<[string, Appointment, Patient, Doctor]>
  >,
  'getUserDoctorData' : ActorMethod<[], [] | [Doctor]>,
  'markAppointmentAsCancelled' : ActorMethod<[string], boolean>,
  'markAppointmentAsComplete' : ActorMethod<[string], boolean>,
  'updateDoctorData' : ActorMethod<[DoctorUpdate], [] | [Doctor]>,
  'updatePatientField' : ActorMethod<
    [PatientUpdate, [] | [Principal]],
    [] | [Patient]
  >,
  'updateUserField' : ActorMethod<[UserUpdate], [] | [User]>,
  'uploadFileChunk' : ActorMethod<
    [string, Uint8Array | number[], bigint, string, string],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
