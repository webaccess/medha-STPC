import React from "react";
import { shallow, mount } from "enzyme";
import LogIn from "./Login.js";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

const simulateChangeOnInput = (wrapper, inputSelector, newValue, inputName) => {
  const input = wrapper.find(inputSelector);

  input.simulate("change", {
    persist: jest.fn(),
    target: { name: inputName, value: newValue }
  });
  return wrapper.find(inputSelector);
};

describe("Login", () => {
  it("Should check contact number has value", () => {
    const wrapper = shallow(<LogIn />);
    const contactInput = simulateChangeOnInput(
      wrapper,
      "#contactnumber",
      "9029161582",
      "identifier"
    );

    expect(contactInput.props().value).toBe("9029161582");
  });

  it("Should check password has value", () => {
    const wrapper = shallow(<LogIn />);
    const contactInput = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );

    expect(contactInput.props().value).toBe("admin1234");
  });
});
