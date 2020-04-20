"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

/**
 * Kaleyra API config
 */
const KALEYRA_API_URL = "https://api.ap.kaleyra.io/v1/";
const SID = "HXAP1663285974IN";
const KALEYRA_API_KEY = "Af34335fb07fb3fe712441ecc92a5d193";

const axios = require("axios");

/**
 * Adding api-key for kaleyra and URL
 */
const instance = axios.create({
  baseURL: `${KALEYRA_API_URL}`,
  timeout: 1000,
  headers: { "api-key": KALEYRA_API_KEY }
});

module.exports = {
  sendOTP: async (mobileNo, OTP) => {
    const body = {
      to: `+91${mobileNo}`,
      type: "OTP",
      sender: "Medha-STPC",
      body: `Your OTP is ${OTP}`
    };

    const URL = `${SID}/messages`;
    await instance
      .post(URL, body)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });

    return;
  }
};
