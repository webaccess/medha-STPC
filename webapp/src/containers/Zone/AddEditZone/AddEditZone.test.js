import React from "react";
import { shallow, mount } from "enzyme";
import AddEditZone from "./AddEditZone";
import { BrowserRouter as Router } from "react-router-dom";

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
    const wrapper = shallow(<AddEditZone />);
    const input = wrapper.find("#test");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<AddEditZone />);

    const updatedNameInput = simulateChangeOnInput(
      abc,
      "#test",
      "maharashtra",
      "zoneName"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });
});
