import { Validation as validateInput } from "../components";

/** Function to check if required fields are present in the set values of form*/
export const checkAllKeysPresent = (objectWithKeys, schema) => {
  let areFieldsValid = false;
  let checkIfFieldsValidatorIsFalseCounter = 0;
  Object.keys(schema).map(field => {
    if (schema[field]["required"] && objectWithKeys.hasOwnProperty(field)) {
      areFieldsValid = true;
    } else if (
      schema[field]["required"] &&
      !objectWithKeys.hasOwnProperty(field)
    ) {
      checkIfFieldsValidatorIsFalseCounter += 1;
    }
  });
  if (checkIfFieldsValidatorIsFalseCounter) {
    areFieldsValid = false;
  }
  return areFieldsValid;
};

/** Function to check if required fields are not present then this returns all the requiured fields*/
export const getListOfKeysNotPresent = (objectWithKeys, schema) => {
  Object.keys(schema).map(field => {
    if (schema[field]["required"] && !objectWithKeys.hasOwnProperty(field)) {
      objectWithKeys[field] = "";
    }
  });
  return objectWithKeys;
};

/** returns true if json is empty */
export const checkEmpty = obj => {
  return !Object.keys(obj).length ? true : false;
};

/** returns errors of form */
export const setErrors = (objectToCheck, schema) => {
  let formErrors = {};
  Object.keys(objectToCheck).map(field => {
    const errors = validateInput(
      objectToCheck[field],
      schema[field]["validations"]
    );
    if (errors.length) {
      formErrors[field] = errors;
    }
  });
  return formErrors;
};
