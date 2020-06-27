"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

/**
 * MSG91 API config
 */
const MSG91_API_KEY = "272179AT97Fn0ix5r45cb0d12a";

const MSG91_OTP_URL = `https://api.msg91.com/api/v5/otp?authkey=${MSG91_API_KEY}`;

const axios = require("axios");

/**
 * Adding api-key for kaleyra and URL
 */
const instance = axios.create({
  baseURL: `${MSG91_OTP_URL}`,
  timeout: 1000
});

module.exports = {
  sendOTP: async (mobileNo, OTP) => {
    const URL = `&mobile=+91${mobileNo}&otp=${OTP}`;
    await instance
      .get(URL)
      .then(({ data }) => {
        console.log(data);
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
    return;
  }
};
