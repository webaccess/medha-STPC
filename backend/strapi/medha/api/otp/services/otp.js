"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const axios = require("axios");
const APIKEY = process.env.MSG91_API_KEY;
module.exports = {
  sendOTP: async (mobileNo, OTP) => {
    let config = {
      method: "post",
      url: `https://api.msg91.com/api/v5/otp?invisible=0&otp=${OTP}&authkey=${APIKEY}&mobile=+91${mobileNo}`
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    return;
  }
};
