export const setState = (id, name) => {
  return {
    id: id,
    name: name
  };
};

export const setUser = id => {
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

export const setStreams = (id, name) => {
  return {
    id: id,
    name: name
  };
};

export const addCollege = (
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
};

export const setCollege = (
  id,
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
    id: id,
    name: name,
    college_code: college_code,
    address: address,
    contact_number: contact_number,
    college_email: college_email,
    principal: principal,
    rpc: rpc,
    streams: streams
  };
};
