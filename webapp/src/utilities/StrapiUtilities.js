/** Setters are used for setting an existing strapi data of a content type
 * While adders are used to add a new data in the correspoding content type
 * Setters require 'id' as their parameters
 * While in adders we don't require id as a parameter because strapi itself generates id for a new data added
 * For eg:-
 * Consider the 'addCollege' adder
 * 
 * "export const addCollege = (
      name,
      college_code,
      address,
      contact_number,
      college_email,
      principal = null,
      rpc = null,
      streams = []
    ) => {
      return {
        name: name,
        college_code: college_code,
        address: address,
        contact_number: contact_number,
        college_email: college_email,
        principal: principal,
        rpc: rpc,
        streams: streams
      };
    };"

 *  The above adder is use for adding a new data of college in college content type.
    Over here name, college_code, college_id, address, contact_number, college_email are mandatory fields.
    But principal, streams and rpc are not mandatory, so there are initialized by default as principal = null, rpc = null, streams = []
    principal and rpc are single select so they are initalized as null while streams is multi select so its a blank array []
    while if there had been any strings which are not compulsory then they would have been initialized to null.

    Why setters?

    Now in college content type there is a relation of rpc to rpc's content type, principal to user's content type and streams to stream's content type.
    To post this data to strapi we have to post them in JSON form, Therefore, We have setter which return values in JSON form.
    So for eg while adding a new college, when we choose any existing rpc, principal, streams then we will require the id of that data which we have choosen.
    This id we give in setters.


 */

/**  Setters */
export const setState = id => {
  return {
    id: id
  };
};

export const setUser = id => {
  return {
    id: id
  };
};

export const setAdmins = id => {
  return {
    id: id
  };
};

export const setZone = id => {
  return {
    id: id
  };
};

export const setRpc = (id, main_college = null) => {
  return {
    id: id,
    main_college: main_college
  };
};

export const setMainCollege = id => {
  return {
    id: id
  };
};

export const setRole = id => {
  return {
    id: id
  };
};

export const setStreams = id => {
  return {
    id: id
  };
};

export const setCollege = id => {
  return {
    id: id
  };
};

export const setQualification = id => {
  return {
    id: id
  };
};

/**  Adders */
export const addRpc = (name, state = null, main_college = null) => {
  return {
    name: name,
    state: state,
    main_college: main_college
  };
};

export const addCollege = (
  name,
  college_code,
  address,
  contact_number,
  college_email,
  blocked = false,
  principal = null,
  state = null,
  rpc = null,
  zone = null,
  district = null,
  stream_strength = [],
  tpos = []
) => {
  return {
    name: name,
    college_code: college_code,
    address_1: address,
    phone: contact_number,
    email: college_email,
    is_blocked: blocked,
    principal: principal,
    state: state,
    rpc: rpc,
    zone: zone,
    district: district,
    stream_strength: stream_strength,
    tpos: tpos
  };
};
export const addEvent = (
  title,
  description,
  start_date_time,
  end_date_time,
  address,
  zone = null,
  rpc = null,
  qualifications = [],
  educations = [],
  colleges = null,
  streams = null,
  state = null,
  question_set = null
) => {
  return {
    title: title,
    description: description,
    start_date_time: start_date_time,
    end_date_time: end_date_time,
    address: address,
    zone: zone,
    rpc: rpc,
    qualifications: qualifications,
    educations: educations,
    contacts: colleges,
    streams: streams,
    state: state,
    question_set: question_set
  };
};
export const addState = name => {
  return {
    name: name
  };
};

export const addZone = (name, state = null) => {
  return {
    name: name,
    state: state
  };
};

export const addUser = (
  username,
  email,
  first_name,
  last_name,
  password,
  phone,
  blocked = false,
  state = null,
  zone = null,
  rpc = null,
  organization = null,
  role = null
) => {
  return {
    username: username,
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: password,
    phone: phone,
    blocked: blocked,
    state: state,
    zone: zone,
    rpc: rpc,
    organization: organization,
    role: role
  };
};
export const addStudent = (
  firstname,
  middlename,
  lastname,
  fatherfullname,
  motherfullname,
  address,
  state,
  district,
  email,
  contactNumber,
  username,
  password,
  gender,
  dateofbirth,
  physicallyHandicapped,
  college,
  stream = null,
  rollNumber = null,
  otp,
  files,
  futureAspirations = [],
  isStudent = true
) => {
  const data = {
    phone: contactNumber,
    otp: otp,
    username: username,
    password: password,
    email: email,
    organization: college,
    first_name: firstname,
    middle_name: middlename,
    last_name: lastname,
    father_full_name: fatherfullname,
    mother_full_name: motherfullname,
    address_1: address,
    state: state,
    district: district,
    date_of_birth: dateofbirth,
    stream: stream,
    gender: gender,
    roll_number: rollNumber,
    is_physically_challenged: physicallyHandicapped,
    future_aspirations: futureAspirations,
    role: 7,
    isStudent: true
  };
  if (files) {
    const formdata = new FormData();
    formdata.append("files.profile_photo", files, files.name);
    formdata.append("data", JSON.stringify(data));
    return formdata;
  } else return data;
};

export const addStudentFromCollege = (
  firstname,
  middlename,
  lastname,
  fatherfullname,
  motherfullname,
  address,
  state,
  district,
  email,
  contactNumber,
  userName,
  password,
  gender,
  dateofbirth,
  physicallyHandicapped,
  college,
  stream = null,
  rollNumber = null,
  files,
  futureAspirations
) => {
  const data = {
    phone: contactNumber,
    username: userName,
    password: password,
    email: email,
    organization: college,
    first_name: firstname,
    middle_name: middlename,
    last_name: lastname,
    father_full_name: fatherfullname,
    mother_full_name: motherfullname,
    address_1: address,
    state: state,
    district: district,
    date_of_birth: dateofbirth,
    stream: stream,
    gender: gender,
    roll_number: rollNumber,
    is_physically_challenged: physicallyHandicapped,
    future_aspirations: futureAspirations,
    role: 7,
    isStudent: true
  };

  if (files) {
    const formdata = new FormData();
    formdata.append("files.profile_photo", files, files.name);
    formdata.append("data", JSON.stringify(data));
    return formdata;
  } else return data;
};

export const editStudent = (
  firstname,
  middlename,
  lastname,
  fatherfullname,
  motherfullname,
  address,
  state,
  district,
  email,
  contactNumber,
  userName,
  gender,
  dateofbirth,
  physicallyHandicapped,
  college,
  stream = null,
  rollNumber = null,
  id,
  futureAspirations = [],
  files,
  password = undefined
) => {
  const data = {
    phone: contactNumber,
    username: userName,
    email: email,
    organization: college,
    first_name: firstname,
    middle_name: middlename,
    last_name: lastname,
    father_full_name: fatherfullname,
    mother_full_name: motherfullname,
    address_1: address,
    state: state,
    district: district,
    date_of_birth: dateofbirth,
    stream: stream,
    gender: gender,
    roll_number: rollNumber,
    is_physically_challenged: physicallyHandicapped,
    id: id,
    password: password,
    future_aspirations: futureAspirations,
    isStudent: true
  };

  if (files) {
    const formdata = new FormData();
    formdata.append("files.profile_photo", files, files.name);
    formdata.append("data", JSON.stringify(data));
    return formdata;
  } else return data;
};
export const addEducation = (
  yearOfPassing,
  educationYear,
  percentage,
  qualification,
  institute,
  pursuing,
  board,
  otherQualification,
  marksObtained,
  totalMarks
) => {
  return {
    year_of_passing: yearOfPassing,
    education_year: educationYear,
    percentage: parseFloat(percentage),
    qualification,
    institute,
    pursuing: !!pursuing,
    board,
    other_qualification: otherQualification,
    marks_obtained: parseInt(marksObtained),
    total_marks: parseInt(totalMarks)
  };
};

export const uploadDocument = (files, ref, refId, field, source) => {
  const formData = new FormData();
  formData.append("files", files);
  formData.append("ref", ref);
  formData.append("refId", refId);
  formData.append("field", field);
  formData.append("source", source);
  return formData;
};

export const addActivity = (
  title,
  activity_type,
  college,
  start_date_time,
  end_date_time,
  education_year,
  address,
  description,
  trainer_name,
  streams,
  files,
  question_set,
  cancelled
) => {
  const data = {
    title: title,
    activitytype: activity_type,
    contact: college,
    start_date_time: start_date_time,
    end_date_time: end_date_time,
    education_year: education_year,
    address: address,
    description: description,
    trainer_name: trainer_name,
    streams: streams,
    question_set: question_set,
    cancelled: cancelled
  };

  if (files) {
    const formdata = new FormData();
    formdata.append("files.upload_logo", files, files.name);
    formdata.append("data", JSON.stringify(data));
    return formdata;
  } else return data;
};

export const editActivity = (
  showPreview,
  title,
  activity_type,
  college,
  start_date_time,
  end_date_time,
  education_year,
  address,
  cancelled,
  description,
  trainer_name,
  streams,
  id,
  files,
  question_set,
  activitystatus
) => {
  const data = {
    title: title,
    activitytype: activity_type,
    contact: college,
    start_date_time: start_date_time,
    end_date_time: end_date_time,
    education_year: education_year,
    address: address,
    cancelled: cancelled,
    description: description,
    trainer_name: trainer_name,
    streams: streams,
    question_set: question_set,
    id: id,
    activity_status: activitystatus
  };
  const formdata = new FormData();

  if (showPreview) {
    formdata.append("files.upload_logo", files, files.name);
    formdata.append("data", JSON.stringify(data));
    return formdata;
  } else return data;
};
export const addAcademicHistory = (academicYear, educationYear, percentage) => {
  return {
    academic_year: academicYear,
    education_year: educationYear,
    percentage
  };
};

export const addActivityBatch = (name, students, dateFrom, dateTo) => {
  return {
    name,
    students,
    start_date_time: dateFrom,
    end_date_time: dateTo
  };
};

export const studentEventRegistration = (event, student) => {
  return {
    event: event,
    contact: student
  };
};

export const uploadStudentCSV = (file, contact) => {
  const id = contact ? contact.id : null;
  const formData = new FormData();
  formData.append("files.imported_file", file, file.name);
  formData.append("data", JSON.stringify({ status: "uploaded", contact: id }));
  return formData;
};

export const uploadStudentDocuments = (
  file,
  educationId,
  contactId,
  isResume
) => {
  const formData = new FormData();
  const name = isResume ? "resume" : file.name;
  formData.append("files.file", file, file.name);
  formData.append(
    "data",
    JSON.stringify({ contact: contactId, education: educationId, name })
  );
  return formData;
};
