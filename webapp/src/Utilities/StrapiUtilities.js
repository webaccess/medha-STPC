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
  rpc = null,
  zone = null,
  district = null,
  stream_strength = []
) => {
  return {
    name: name,
    college_code: college_code,
    address: address,
    contact_number: contact_number,
    college_email: college_email,
    blocked: blocked,
    principal: principal,
    rpc: rpc,
    zone: zone,
    district: district,
    stream_strength: stream_strength
  };
};
export const addEvent = (
  title,
  description,
  start_date_time,
  end_date_time,
  address,
  marks,
  zone = null,
  rpc = null,
  colleges = null,
  streams = null
) => {
  return {
    title: title,
    description: description,
    start_date_time: start_date_time,
    end_date_time: end_date_time,
    address: address,
    marks: marks,
    zone: zone,
    rpc: rpc,
    colleges: colleges,
    streams: streams
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
  contact_number,
  confirmed = false,
  state = null,
  zone = null,
  rpc = null,
  college = null,
  role = null
) => {
  return {
    username: username,
    email: email,
    first_name: first_name,
    last_name: last_name,
    password: password,
    contact_number: contact_number,
    confirmed: confirmed,
    state: state,
    zone: zone,
    rpc: rpc,
    college: college,
    role: role
  };
};
export const addStudent = (
  firstname,
  lastname,
  fatherfirstname,
  fatherlastname,
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
  otp
) => {
  return {
    contact_number: contactNumber,
    otp: otp,
    username: userName,
    password: password,
    email: email,
    college_id: college,
    first_name: firstname,
    last_name: lastname,
    father_first_name: fatherfirstname,
    father_last_name: fatherlastname,
    address: address,
    state: state,
    district: district,
    date_of_birth: dateofbirth,
    stream: stream,
    gender: gender,
    roll_number: rollNumber,
    physicallyHandicapped: physicallyHandicapped
  };
};

export const editStudent = (
  firstname,
  lastname,
  fatherfirstname,
  fatherlastname,
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
  id
) => {
  return {
    contact_number: contactNumber,
    username: userName,
    email: email,
    college: college,
    first_name: firstname,
    last_name: lastname,
    father_first_name: fatherfirstname,
    father_last_name: fatherlastname,
    address: address,
    state: state,
    district: district,
    date_of_birth: dateofbirth,
    stream: stream,
    gender: gender,
    roll_number: rollNumber,
    physicallyHandicapped: physicallyHandicapped,
    id: id
  };
};
export const addEducation = (qualification, board, yearOfPassing, marks) => {
  return {
    qualification,
    board,
    year_of_passing: parseInt(yearOfPassing),
    marks: parseFloat(marks)
  };
};

export const uploadDocument = (files, ref, refId, field) => {
  const formData = new FormData();
  formData.append("files", files);
  formData.append("ref", ref);
  formData.append("refId", refId);
  formData.append("field", field);
  return formData;
};

export const addActivity = (
  title,
  activity_type,
  academic_year,
  college,
  start_date_time,
  end_date_time,
  education_year,
  address,
  description,
  trainer_name,
  streams,
  files
) => {
  const data = {
    title: title,
    activity_type: activity_type,
    academic_year: academic_year,
    college: college,
    start_date_time: start_date_time,
    end_date_time: end_date_time,
    education_year: education_year,
    address: address,
    description: description,
    trainer_name: trainer_name,
    streams: streams
  };
  const formdata = new FormData();
  formdata.append("files.upload_logo", files, files.name);
  formdata.append("data", JSON.stringify(data));
  return formdata;
};

export const editActivity = (
  title,
  activity_type,
  academic_year,
  college,
  start_date_time,
  end_date_time,
  education_year,
  address,
  description,
  trainer_name,
  streams,
  id,
  files
) => {
  const data = {
    title: title,
    activity_type: activity_type,
    academic_year: academic_year,
    college: college,
    start_date_time: start_date_time,
    end_date_time: end_date_time,
    education_year: education_year,
    address: address,
    description: description,
    trainer_name: trainer_name,
    streams: streams,
    id: id
  };
  const formdata = new FormData();
  formdata.append("files.upload_logo", files, files.name);
  formdata.append("data", JSON.stringify(data));
  return formdata;
};
export const addAcademicHistory = (academicYear, educationYear) => {
  return {
    academic_year: academicYear,
    education_year: educationYear
  };
};

export const studentEventRegistration = (event, student) => {
  return {
    event: event,
    student: student
  };
};
