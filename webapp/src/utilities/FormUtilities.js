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
export const getListOfKeysNotPresent = (
  objectWithKeys,
  schema,
  isDatePresent,
  dateFrom,
  dateTo
) => {
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

/** returns errors in form 
 * Accepts 5 parameters.
 * 1: the object to check i.e formState.values
 * 2: The schema which contains all objects to check.
 * 3: Is date present for date validation.
 * 4: dateFrom: schema name for date from/ start date
 * 5: dateTo: schema name for date to/ end date
 * 
 * Sample structure to call
 * formState.errors = formUtilities.setErrors(
        formState.values,
        EventSchema,
        true,
        dateFrom,
        dateTo
      );
*/
export const setErrors = (
  objectToCheck,
  schema,
  isDatePresent,
  dateFrom,
  dateTo
) => {
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
  if (isDatePresent) {
    if (
      objectToCheck.hasOwnProperty(dateFrom) &&
      objectToCheck[dateFrom] !== null
    ) {
      if (objectToCheck[dateFrom] > objectToCheck[dateTo]) {
        if (!formErrors.hasOwnProperty(dateFrom)) {
          formErrors[dateFrom] = ["Start date cannot be greater that end date"];
        }
      }
    }
    if (
      objectToCheck.hasOwnProperty(dateTo) &&
      objectToCheck[dateTo] !== null
    ) {
      if (objectToCheck[dateTo] < objectToCheck[dateFrom]) {
        if (!formErrors.hasOwnProperty(dateTo)) {
          formErrors[dateTo] = ["End date cannot be smaller that start date"];
        }
      }
    }
  }
  return formErrors;
};
/**This function is used to check if selected date for date of birth field is greater or same than current field.
 * if selected date is greater or same in compare to current date this function will return false and
 * if selected date is less than current date then this function will return true */
export const validateDateOfBirth = selectedDate => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let currentDate = year + "-" + month + "-" + dt;
  let selectYear = selectedDate.getFullYear();
  let selectedMonth = selectedDate.getMonth() + 1;
  let selectedDay = selectedDate.getDate();
  if (selectedDay < 10) {
    selectedDay = "0" + selectedDay;
  }
  if (selectedMonth < 10) {
    selectedMonth = "0" + selectedMonth;
  }
  let dateOfBirth = selectYear + "-" + selectedMonth + "-" + selectedDay;
  if (dateOfBirth >= currentDate) {
    return false;
  } else {
    return true;
  }
};
