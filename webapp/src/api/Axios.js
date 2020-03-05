import axios from "axios";
import { Auth as auth } from "../components";

const HEADERS = {
  "content-type": "application/json",
  Authorization: `Bearer ${JSON.parse(localStorage.getItem("jwtToken"))}`
};

export const serviceProviderForGetRequest = async (
  url,
  payload = {},
  headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${auth.getToken()}`
  }
) => {
  const URL = url;
  return await axios(URL, {
    method: "GET",
    headers: headers,
    params: payload
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export const serviceProviderForGetOneRequest = async (
  url,
  id,
  headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${auth.getToken()}`
  }
) => {
  const URL = url + "/" + id;
  return await axios(URL, {
    method: "GET",
    headers: headers
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export const serviceProviderForPutRequest = async (
  url,
  id,
  body,
  headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${auth.getToken()}`
  }
) => {
  const URL = url;
  return await axios(URL + "/" + id, {
    method: "PUT",
    headers: headers,
    data: body
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export const serviceProviderForDeleteRequest = async (
  url,
  id,
  headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${auth.getToken()}`
  }
) => {
  const URL = url;
  return await axios(URL + "/" + id, {
    method: "Delete",
    headers: headers
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export const serviceProviderForPostRequest = async (
  url,
  payload = {},
  headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${auth.getToken()}`
  }
) => {
  const URL = url;
  return await axios(URL, {
    method: "POST",
    headers: headers,
    data: payload
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export const serviceProviderForAllGetRequest = async (
  url,
  headers = {
    "content-type": "application/json",
    Authorization: `Bearer ${auth.getToken()}`
  }
) => {
  let temp = [];
  for (let i in url) {
    temp.push(serviceProviderForGetRequest(url[i]));
  }
  const URL = temp;
  // const URL1 = url1;
  return await axios
    .all(URL, {
      headers: headers
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
};
