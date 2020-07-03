import validation from "./Validation";

describe("Testing Validations", () => {
  it(" should check validatePasswordMinLength validation", () => {
    let validations = {
      validatePasswordMinLength: {
        value: true,
        message: "Invalid Password"
      }
    };
    let value = "admin1234";

    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });

  it(" should check validatePasswordMinLength validation with wrong value", () => {
    let validations = {
      validatePasswordMinLength: {
        value: true,
        message: "Invalid Password"
      }
    };
    let value = "admi";
    const mock = validation(value, validations);
    expect(mock).toEqual(["Invalid Password"]);
  });

  it(" should check validateMobileNumber validation", () => {
    let validations = {
      validateMobileNumber: {
        value: true,
        message: "Invalid Mobile Number"
      }
    };
    let value = 9029161784;

    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });

  it(" should check validateMobileNumber validation with wrong value", () => {
    let validations = {
      validateMobileNumber: {
        value: true,
        message: "Invalid Mobile Number"
      }
    };
    let value = 765778;
    const mock = validation(value, validations);
    expect(mock).toEqual(["Invalid Mobile Number"]);
  });

  it(" should check validateOtp validation", () => {
    let validations = {
      validateOtp: {
        value: 6,
        message: "Invalid OTP"
      }
    };
    let value = "897654";

    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });

  it(" should check validateOtp validation with wrong value", () => {
    let validations = {
      validateOtp: {
        value: 6,
        message: "Invalid OTP"
      }
    };
    let value = 897;
    const mock = validation(value, validations);
    expect(mock).toEqual(["Invalid OTP"]);
  });

  it(" should check validateOtpForForgotPassword validation", () => {
    let validations = {
      validateOtpForForgotPassword: {
        value: 4,
        message: "Please enter a valid OTP"
      }
    };
    let value = "65468";

    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });

  it(" should check validateOtpForForgotPassword validation with wrong value", () => {
    let validations = {
      validateOtpForForgotPassword: {
        value: 4,
        message: "Please enter a valid OTP"
      }
    };
    let value = "657";
    const mock = validation(value, validations);
    expect(mock).toEqual(["Please enter a valid OTP"]);
  });

  it(" should check required validation", () => {
    let validations = {
      required: {
        value: true,
        message: "required"
      }
    };
    let value = "test";

    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });

  it(" should check required validation with null value", () => {
    let validations = {
      required: {
        value: true,
        message: "required"
      }
    };
    let value = "";
    const mock = validation(value, validations);
    expect(mock).toEqual(["required"]);
  });

  it(" should check validateEmailRegex validation", () => {
    let validations = {
      validateEmailRegex: {
        value: "true",
        message: "Invalid Email"
      }
    };
    let value = "abc@gmail.com";

    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });

  it(" should check validateEmailRegex validation with wrong value", () => {
    let validations = {
      validateEmailRegex: {
        value: "true",
        message: "Invalid Email"
      }
    };
    let value = "abc";
    const mock = validation(value, validations);
    expect(mock).toEqual(["Invalid Email"]);
  });

  it(" should check email validation with right value", () => {
    let validations = {
      validateEmailRegex: {
        value: "true",
        message: "Invalid Email"
      }
    };
    let value = "abc@gmail.com";
    const mock = validation(value, validations, "email");
    expect(mock).toEqual([]);
  });

  it(" should check email validation with wrong value", () => {
    let validations = {
      validateEmailRegex: {
        value: "true",
        message: "Invalid Email"
      }
    };
    let value = "abc";
    const mock = validation(value, validations, "email");
    expect(mock).toEqual(["Invalid Email", "Not an email"]);
  });

  it(" should check default", () => {
    let validations = {
      default: {
        value: "true",
        message: "Invalid Email"
      }
    };
    let value = "abc";
    const mock = validation(value, validations);
    expect(mock).toEqual([]);
  });
});
