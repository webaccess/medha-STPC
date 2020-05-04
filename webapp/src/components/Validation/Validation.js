/* eslint-disable no-useless-escape */
import { includes, mapKeys, reject } from "lodash";
/**
 * [validateInput description]
 * @param  {String || Number} value  Input's value
 * @param  {Object} inputValidations
 * @param  {String} [type='text']    Optionnal: the input's type only for email
 * @return {Array}                  Array of errors to be displayed
 */
const validation = (value, inputValidations = {}, type = "text") => {
  let errors = [];
  const emailRegex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const passRegx = new RegExp("/^$|s+/");
  const phonenoRegx = /^\d{10}$/;

  // handle i18n
  const requiredError = { id: "components.Input.error.validation.required" };
  mapKeys(inputValidations, (validationValue, validationKey) => {
    switch (validationKey) {
      case "max":
        if (parseInt(value, 10) > validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      case "maxLength":
        if (value.length > validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      case "min":
        if (parseInt(value, 10) < validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      case "minLength":
        if (value.length < validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      case "required":
        if (value.length === 0) {
          errors.push(validationValue.message);
        }
        break;
      case "validateEmailRegex":
        if (value.length !== 0 && !emailRegex.test(value)) {
          errors.push(validationValue.message);
        }
        break;
      case "validatePasswordRegex":
        if (value.length !== 0 && !passRegx.test(value)) {
          errors.push(validationValue.message);
        }
        break;
        case "validatePasswordMinLength":
        if(value.length !== 0 && value.length < 6){
          errors.push(validationValue.message);
        }
        break;
      case "validateMobileNumber":
        if (value.length !== 0 && !phonenoRegx.test(value)) {
          errors.push(validationValue.message);
        }
        break;
      case "validateOtp":
        //change the value and condition for length after length of otp is decided
        if (value.length !== 0 && value.length === validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      case "validateOtpForForgotPassword":
        //change the value and condition for length after length of otp is decided
        if (value.length !== 0 && value.length < validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      case "validateConfirmNewPassword":
        if (value !== validationValue.value) {
          errors.push(validationValue.message);
        }
        break;
      default:
        errors = [];
    }
  });

  if (type === "email" && !emailRegex.test(value)) {
    errors.push("Not an email");
  }

  if (includes(errors, requiredError)) {
    errors = reject(errors, error => error !== requiredError);
  }

  return errors;
};

export default validation;
