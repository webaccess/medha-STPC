import React from "react";
import { shallow } from "enzyme";

import ViewStates from "./ManageState";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("testing for zone", () => {
  const simulateChangeOnInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate("change", {
      persist: jest.fn(),
      target: { name: newNameValue, value: newValue }
    });
    return wrapper.find(inputSelector);
  };

  it("It has an input field", () => {
    const wrapper = shallow(<ViewStates />);
    const input = wrapper.find("#name");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<ViewStates />);

    const updatedNameInput = simulateChangeOnInput(abc, "#name", "maharashtra");
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });
});
