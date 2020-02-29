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


export const setStreams = (id, name) => {
  return {
    id: id,
    name: name
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

/**  Adders */
export const addRpc = (name, zone = null, main_college = null) => {
  return {
    name: name,
    zone: zone,
    main_college: main_college
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

export const addState = (name) => {
  return {
    name : name,
  };
};

export const addZone = (
  name,
  state= null
  ) => {
  return {
    name : name,
    state : state
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
  state  = null, 
  zone  = null,
  rpc  = null,
  college  = null,
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
