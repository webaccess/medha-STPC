import axios from "axios";
import { Auth as auth } from "../components";

const TOKEN = auth.getToken();
const HEADERS = {
  "content-type": "application/json",
  Authorization: `Bearer ${TOKEN}`
};

export const serviceProviderForGetRequest = async (
  url,
  payload = {},
  headers = HEADERS
) => {
  const URL = url;
  return await axios(URL, {
    method: "GET",
    headers: HEADERS,
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
  headers = HEADERS
) => {
  const URL = url + "/" + id;
  return await axios(URL, {
    method: "GET",
    headers: HEADERS
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
  headers = HEADERS
) => {
  const URL = url;
  return await axios(URL + "/" + id, {
    method: "Put",
    headers: HEADERS,
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
  headers = HEADERS
) => {
  const URL = url;
  return await axios(URL + "/" + id, {
    method: "Delete",
    headers: HEADERS
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};

export const serviceProviderForPostRequest = async (
  url,
  payload = {},
  headers = HEADERS
) => {
  const URL = url;
  return await axios(URL, {
    method: "POST",
    headers: HEADERS,
    data: payload
  })
    .then(response => response)
    .catch(error => {
      throw error;
    });
};
