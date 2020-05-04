const ChangePasswordSchema = {
  oldPassword: {
    label: "Old Password",
    id: "oldPassword",
    type: "password",
    required: true,
    validations: {
      required: {
        value: "true",
        message: "Old password is required"
      }
    }
  },
  newPassword: {
    label: "New Password",
    id: "newPassword",
    type: "password",
    required: true,
    validations: {
      required: {
        value: "true",
        message: "New password is required"
      },
      validatePasswordMinLength: {
        value: "true",
        message: "Password is too short"
      }
    }
  }
};
export default ChangePasswordSchema;
