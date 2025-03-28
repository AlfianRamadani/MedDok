import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import HashMap "mo:map/Map";
import { phash; thash } "mo:map/Map";
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
    graduationYear : Nat;
    hospitalAffiliation : Text;
    address : Text;
    description : Text;
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
  type UserFiles = HashMap.Map<Text, File>;
  private var appointments = HashMap.new<Text, Appointment>();
  private var files = HashMap.new<Principal, UserFiles>();
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
    let newAppointment : Appointment = {
      appointmentId = "appointment-" # Nat.toText(Int.abs(appointments.size() + 1));
      doctorId = doctorId;
      patientId = patientId;
      appointmentDate = appointmentDate;
      appointmentStatus = "pending";
      appointmentReason = appointmentReason;
    };
    let _ = HashMap.put(appointments, thash, newAppointment.appointmentId, newAppointment);
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
    switch (HashMap.get(files, phash, user)) {
      case null {
        let newFileMap = HashMap.new<Text, File>();
        let _ = HashMap.put(files, phash, user, newFileMap);
        newFileMap;
      };
      case (?existingFiles) existingFiles;
    };
  };
  public shared (msg) func checkFileExists(name : Text) : async Bool {
    Option.isSome(HashMap.get(getUserFiles(msg.caller), thash, name));
  };
  public shared (msg) func addDoctor(
    name : Text,
    email : Text,
    phone : Text,
    specialization : Text,
    licenseNumber : Text,
    graduationYear : Nat,
    hospitalAffiliation : Text,
    address : Text,
  ) : async ?Doctor {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    let newDoctor : Doctor = {
      name = name;
      email = email;
      phone = phone;
      specialization = specialization;
      licenseNumber = licenseNumber;
      graduationYear = graduationYear;
      hospitalAffiliation = hospitalAffiliation;
      address = address;
      description = "";
    };
    let (newDoctorProfiles, _) = Trie.put(
      doctorProfiles,
      callerKey,
      Principal.equal,
      newDoctor,
    );
    doctorProfiles := newDoctorProfiles;
    return ?newDoctor;
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
  public shared ({ caller }) func updatePatientField(update : PatientUpdate) : async ?Patient {
    let callerKey = { hash = Principal.hash(caller); key = caller };
    Debug.print("Caller key: " # Principal.toText(callerKey.key));
    Debug.print(debug_show (update));

    // Fungsi pembantu untuk memperbarui atau membuat pasien baru
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
  // Upload a file in chunks.
  public shared (msg) func uploadFileChunk(name : Text, chunk : Blob, index : Nat, fileType : Text, documentType : Text) : async () {
    let userFiles = getUserFiles(msg.caller);
    let fileChunk = { chunk = chunk; index = index };

    switch (HashMap.get(userFiles, thash, name)) {
      case null {
        let _ = HashMap.put(userFiles, thash, name, { name = name; chunks = [fileChunk]; totalSize = chunk.size(); fileType = fileType; documentType = documentType });
      };
      case (?existingFile) {
        let updatedChunks = Array.append(existingFile.chunks, [fileChunk]);
        let _ = HashMap.put(
          userFiles,
          thash,
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

  public shared (msg) func editDoctorUserData(
    name : Text,
    email : Text,
    phone : Text,
    specialization : Text,
    licenseNumber : Text,
    graduationYear : Nat,
    hospitalAffiliation : Text,
    address : Text,
    description : Text,
  ) : async ?Doctor {
    let callerKey = { hash = Principal.hash(msg.caller); key = msg.caller };
    let updatedDoctorData : Doctor = {
      name = name;
      email = email;
      phone = phone;
      specialization = specialization;
      licenseNumber = licenseNumber;
      graduationYear = graduationYear;
      hospitalAffiliation = hospitalAffiliation;
      address = address;
      description = description;
    };
    let (newDoctorProfiles, _) = Trie.put(
      doctorProfiles,
      callerKey,
      Principal.equal,
      updatedDoctorData,
    );
    doctorProfiles := newDoctorProfiles;
    return ?updatedDoctorData;
  };
  public shared func getAllDoctors() : async [(Principal, Doctor)] {
    let doctorDataArray = Trie.toArray<Principal, Doctor, (Principal, Doctor)>(
      doctorProfiles,
      func(key, value) : (Principal, Doctor) {
        (key, value);
      },
    );
    return doctorDataArray;
  };
  public shared func getAllAppointments() : async [(Text, Appointment, ?Doctor)] {
    let appointmentsArray = HashMap.toArray<Text, Appointment>(appointments);
    let enrichedAppointments = Array.map<(Text, Appointment), (Text, Appointment, ?Doctor)>(
      appointmentsArray,
      func((id, appointment)) {
        let doctorKey = {
          hash = Principal.hash(appointment.doctorId);
          key = appointment.doctorId;
        };
        let doctorData = Trie.get(doctorProfiles, doctorKey, Principal.equal);
        (id, appointment, doctorData);
      },
    );

    return enrichedAppointments;
  };

};
