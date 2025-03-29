import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
actor Main {
  type User = {
    role : Text;
    profilePicture : ?Blob;
  };
  type UserUpdate = {
    role : ?Text;
    profilePicture : ?Blob;
  };
  type Patient = {
    name : Text;
    dateOfBirth : Text;
    bloodType : Text;
    allergies : [Text];
    currentMedications : [Text];
    chronicConditions : [Text];
    bloodPressure : Text;
    heartRate : Text;
    temperature : Text;
    weight : Text;
    height : Text;
    notes : Text;
    status : Text;
    updatedAt : Int;
  };
  type PatientUpdate = {
    name : ?Text;
    dateOfBirth : ?Text;
    bloodType : ?Text;
    allergies : ?[Text];
    currentMedications : ?[Text];
    chronicConditions : ?[Text];
    bloodPressure : ?Text;
    heartRate : ?Text;
    temperature : ?Text;
    weight : ?Text;
    height : ?Text;
    notes : ?Text;
    status : ?Text;
    updatedAt : ?Int;
  };
  type Doctor = {
    name : Text;
    email : Text;
    phone : Text;
    specialization : Text;
    licenseNumber : Text;
    hospitalAffiliation : Text;
    address : Text;
    description : Text;
  };
  type DoctorUpdate = {
    name : ?Text;
    email : ?Text;
    phone : ?Text;
    specialization : ?Text;
    licenseNumber : ?Text;
    hospitalAffiliation : ?Text;
    address : ?Text;
    description : ?Text;
  };

  type FileChunk = {
    chunk : Blob;
    index : Nat;
  };

  // Define a data type for a file's data.
  type File = {
    name : Text;
    chunks : [FileChunk];
    totalSize : Nat;
    fileType : Text;
    documentType : Text;
  };
  type DocumentReference = {
    docId : Text;
    fileName : Text;
    contentType : Text;
  };
  type Appointment = {
    appointmentId : Text;
    doctorId : Principal;
    patientId : Principal;
    appointmentDate : Text;
    appointmentStatus : Text;
    appointmentReason : Text;
  };
  // Define a data type for storing files associated with a user principal.
  type UserFiles = HashMap.HashMap<Text, File>;
  private var appointments = HashMap.HashMap<Text, Appointment>(10, Text.equal, Text.hash);
  private var files = HashMap.HashMap<Principal, UserFiles>(10, Principal.equal, Principal.hash);
  stable var userProfiles : Trie.Trie<Principal, User> = Trie.empty();
  stable var doctorProfiles : Trie.Trie<Principal, Doctor> = Trie.empty();
  stable var patientProfiles : Trie.Trie<Principal, Patient> = Trie.empty();
  // Function to add an appointment
  public shared func addAppointment(
    doctorId : Principal,
    patientId : Principal,
    appointmentDate : Text,
    appointmentReason : Text,
  ) : async ?Appointment {
    let appointmentId = "appointment-" # Nat.toText(Int.abs(appointments.size() + 1));
    let newAppointment : Appointment = {
      appointmentId = appointmentId;
      doctorId = doctorId;
      patientId = patientId;
      appointmentDate = appointmentDate;
      appointmentStatus = "pending";
      appointmentReason = appointmentReason;
    };

    appointments.put(appointmentId, newAppointment);
    return ?newAppointment;
  };
  public shared (msg) func getMyProfile() : async ?User {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    Trie.get(userProfiles, callerKey, Principal.equal);
  };
  public shared (msg) func getPatientProfile() : async ?Patient {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    Trie.get(patientProfiles, callerKey, Principal.equal);
  };
  public shared (msg) func getDoctorProfile() : async ?Doctor {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    Trie.get(doctorProfiles, callerKey, Principal.equal);
  };
  public func getPatient(patientId : Principal) : async ?Patient {
    let patientKey = { hash = Principal.hash(patientId); key = patientId };
    Trie.get(patientProfiles, patientKey, Principal.equal);
  };

  // add user
  public shared (msg) func addUser(role : Text) : async ?User {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    let newUser : User = { role = role; profilePicture = null };
    let (newUserProfiles, _) = Trie.put(
      userProfiles,
      callerKey,
      Principal.equal,
      newUser,
    );
    userProfiles := newUserProfiles;
    return ?newUser;
  };
  private func getUserFiles(user : Principal) : UserFiles {
    switch (files.get(user)) {
      case null {
        let newFileMap = HashMap.HashMap<Text, File>(10, Text.equal, Text.hash);
        files.put(user, newFileMap);
        newFileMap;
      };
      case (?existingFiles) existingFiles;
    };
  };

  public shared (msg) func checkFileExists(name : Text) : async Bool {
    let userFiles = getUserFiles(msg.caller);
    Option.isSome(userFiles.get(name));
  };

  public shared ({ caller }) func updateUserField(update : UserUpdate) : async ?User {
    let callerKey = { hash = Principal.hash(caller); key = caller };
    let existingUserOpt = Trie.get(userProfiles, callerKey, Principal.equal);

    switch (existingUserOpt) {
      case (null) { return null };
      case (?existingUser) {
        let updatedUser : User = {
          role = switch (update.role) {
            case null { existingUser.role };
            case (?newRole) { newRole };
          };
          profilePicture = switch (update.profilePicture) {
            case (null) { existingUser.profilePicture };
            case (?newPic) { ?newPic };
          };
        };

        let (newUserProfiles, _) = Trie.put(
          userProfiles,
          callerKey,
          Principal.equal,
          updatedUser,
        );
        userProfiles := newUserProfiles;
        return ?updatedUser;
      };
    };
  };
  public shared (msg) func updateDoctorData(update : DoctorUpdate) : async ?Doctor {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };

    // Fungsi pembantu untuk memperbarui atau membuat pasien baru
    func updateOrCreateDoctor(existingOpt : ?Doctor) : Doctor {
      switch (existingOpt) {
        case (null) {
          {
            name = Option.get(update.name, "");
            email = Option.get(update.email, "");
            phone = Option.get(update.phone, "");
            specialization = Option.get(update.specialization, "");
            licenseNumber = Option.get(update.licenseNumber, "");
            hospitalAffiliation = Option.get(update.hospitalAffiliation, "");
            address = Option.get(update.address, "");
            description = Option.get(update.description, "");
          };
        };
        case (?existing) {
          {
            name = Option.get(update.name, existing.name);
            email = Option.get(update.email, existing.email);
            phone = Option.get(update.phone, existing.phone);
            specialization = Option.get(update.specialization, existing.specialization);
            licenseNumber = Option.get(update.licenseNumber, existing.licenseNumber);
            hospitalAffiliation = Option.get(update.hospitalAffiliation, existing.hospitalAffiliation);
            address = Option.get(update.address, existing.address);
            description = Option.get(update.description, existing.description);
          };
        };
      };
    };

    // Dapatkan pasien yang ada atau null
    let existingDoctorOpt = Trie.get(doctorProfiles, callerKey, Principal.equal);

    // Perbarui atau buat pasien
    let updatedDoctor = updateOrCreateDoctor(existingDoctorOpt);

    // Simpan ke trie
    let (newDoctorProfiles, _) = Trie.put(
      doctorProfiles,
      callerKey,
      Principal.equal,
      updatedDoctor,
    );
    doctorProfiles := newDoctorProfiles;

    return ?updatedDoctor;

  };
  public shared ({ caller }) func updatePatientField(update : PatientUpdate, patientId : ?Principal) : async ?Patient {
    Debug.print("Caller: " # Principal.toText(caller));
    Debug.print("PatientId: " # debug_show (patientId));
    let callerKey = switch (patientId) {
      case (?id) {
        { hash = Principal.hash(id); key = id };
      };
      case (null) {
        { hash = Principal.hash(caller); key = caller };
      };
    };
    Debug.print("Caller Key: " # Principal.toText(callerKey.key));

    func updateOrCreatePatient(existingOpt : ?Patient) : Patient {
      switch (existingOpt) {
        case (null) {
          {
            name = Option.get(update.name, "");
            dateOfBirth = Option.get(update.dateOfBirth, "");
            bloodType = Option.get(update.bloodType, "");
            allergies = Option.get(update.allergies, []);
            currentMedications = Option.get(update.currentMedications, []);
            chronicConditions = Option.get(update.chronicConditions, []);
            bloodPressure = Option.get(update.bloodPressure, "");
            heartRate = Option.get(update.heartRate, "");
            temperature = Option.get(update.temperature, "");
            weight = Option.get(update.weight, "");
            height = Option.get(update.height, "");
            notes = Option.get(update.notes, "");
            status = Option.get(update.status, "non-editable");
            updatedAt = Option.get(update.updatedAt, Time.now());
          };
        };
        case (?existing) {
          {
            name = Option.get(update.name, existing.name);
            dateOfBirth = Option.get(update.dateOfBirth, existing.dateOfBirth);
            bloodType = Option.get(update.bloodType, existing.bloodType);
            allergies = Option.get(update.allergies, existing.allergies);
            currentMedications = Option.get(update.currentMedications, existing.currentMedications);
            chronicConditions = Option.get(update.chronicConditions, existing.chronicConditions);
            bloodPressure = Option.get(update.bloodPressure, existing.bloodPressure);
            heartRate = Option.get(update.heartRate, existing.heartRate);
            temperature = Option.get(update.temperature, existing.temperature);
            weight = Option.get(update.weight, existing.weight);
            height = Option.get(update.height, existing.height);
            notes = Option.get(update.notes, existing.notes);
            status = Option.get(update.status, existing.status);
            updatedAt = Option.get(update.updatedAt, Time.now());
          };
        };
      };
    };

    // Dapatkan pasien yang ada atau null
    let existingPatientOpt = Trie.get(patientProfiles, callerKey, Principal.equal);

    // Perbarui atau buat pasien
    let updatedPatient = updateOrCreatePatient(existingPatientOpt);

    // Simpan ke trie
    let (newPatientProfiles, _) = Trie.put(
      patientProfiles,
      callerKey,
      Principal.equal,
      updatedPatient,
    );
    patientProfiles := newPatientProfiles;

    return ?updatedPatient;
  };
  public shared (msg) func uploadFileChunk(name : Text, chunk : Blob, index : Nat, fileType : Text, documentType : Text) : async () {
    let userFiles = getUserFiles(msg.caller);
    let fileChunk = { chunk = chunk; index = index };

    switch (userFiles.get(name)) {
      case null {
        userFiles.put(
          name,
          {
            name = name;
            chunks = [fileChunk];
            totalSize = chunk.size();
            fileType = fileType;
            documentType = documentType;
          },
        );
      };
      case (?existingFile) {
        let updatedChunks = Array.append(existingFile.chunks, [fileChunk]);
        userFiles.put(
          name,
          {
            name = name;
            chunks = updatedChunks;
            totalSize = existingFile.totalSize + chunk.size();
            fileType = fileType;
            documentType = documentType;
          },
        );
      };
    };
  };
  public shared (msg) func getUserDoctorData() : async ?Doctor {
    let doctorKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    Trie.get(doctorProfiles, doctorKey, Principal.equal);
  };

  public shared func getAllDoctors() : async [(Principal, Doctor, User)] {
    let doctorDataArray = Trie.toArray<Principal, Doctor, (Principal, Doctor, User)>(
      doctorProfiles,
      func(key, value) : (Principal, Doctor, User) {
        let userKey = { hash = Principal.hash(key); key = key };
        let userData = Option.get(Trie.get(userProfiles, userKey, Principal.equal), { role = ""; profilePicture = null });
        (key, value, userData);
      },
    );
    return doctorDataArray;
  };
  public shared func getAllAppointments() : async [(Text, Appointment, ?Doctor, ?Patient)] {
    let appointmentsArray = Iter.toArray(appointments.entries());

    let enrichedAppointments = Array.map<(Text, Appointment), (Text, Appointment, ?Doctor, ?Patient)>(
      appointmentsArray,
      func((id, appointment)) {
        let doctorKey = {
          hash = Principal.hash(appointment.doctorId);
          key = appointment.doctorId;
        };
        let doctorData = Trie.get(doctorProfiles, doctorKey, Principal.equal);

        let patientKey = {
          hash = Principal.hash(appointment.patientId);
          key = appointment.patientId;
        };
        let patientData = Trie.get(patientProfiles, patientKey, Principal.equal);

        (id, appointment, doctorData, patientData);
      },
    );
    return enrichedAppointments;
  };
  public func markAppointmentAsComplete(appointmentId : Text) : async Bool {
    switch (appointments.get(appointmentId)) {
      case null { false };
      case (?existingAppointment) {
        let updatedAppointment = {
          existingAppointment with appointmentStatus = "completed"
        };
        let _ = appointments.put(appointmentId, updatedAppointment);
        true;
      };
    };
  };
  public func markAppointmentAsCancelled(appointmentId : Text) : async Bool {
    switch (appointments.get(appointmentId)) {
      case null { false };
      case (?existingAppointment) {
        let updatedAppointment = {
          existingAppointment with appointmentStatus = "cancelled"
        };
        let _ = appointments.put(appointmentId, updatedAppointment);
        true;
      };
    };
  };

  public shared ({ caller }) func getUpcomingAppointments() : async [(Text, Appointment, Patient, Doctor)] {
    // Convert HashMap to Array using Iter.toArray and entries()
    let appointmentsArray = Iter.toArray(appointments.entries());

    let upcomingAppointments = Array.filter<(Text, Appointment)>(
      appointmentsArray,
      func((id, appointment)) {
        appointment.appointmentStatus == "pending" and appointment.patientId == caller;
      },
    );

    let enrichedAppointments = Array.map<(Text, Appointment), (Text, Appointment, Patient, Doctor)>(
      upcomingAppointments,
      func((id, appointment)) {
        let patientKey = {
          hash = Principal.hash(appointment.patientId);
          key = appointment.patientId;
        };
        let patientData = Trie.get(patientProfiles, patientKey, Principal.equal);

        let doctorKey = {
          hash = Principal.hash(appointment.doctorId);
          key = appointment.doctorId;
        };
        let doctorData = Trie.get(doctorProfiles, doctorKey, Principal.equal);

        switch (patientData, doctorData) {
          case (?patient, ?doctor) {
            (id, appointment, patient, doctor);
          };
          case _ {
            (id, appointment, { name = ""; dateOfBirth = ""; bloodType = ""; allergies = []; currentMedications = []; chronicConditions = []; bloodPressure = ""; heartRate = ""; temperature = ""; weight = ""; height = ""; notes = ""; status = ""; updatedAt = 0 }, { name = ""; email = ""; phone = ""; specialization = ""; licenseNumber = ""; hospitalAffiliation = ""; address = ""; description = "" });
          };
        };
      },
    );

    return enrichedAppointments;
  };
};
