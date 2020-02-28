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
