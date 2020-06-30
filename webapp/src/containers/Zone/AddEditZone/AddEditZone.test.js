import React from "react";
import { shallow } from "enzyme";
import AddEditZone from "./AddEditZone";
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

  const simulateChangeOnAutoInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate(
      "change",

      { newNameValue },
      { id: parseInt(newValue) }
    );
    return wrapper.find(inputSelector);
  };

  it("test for  autocomplete field", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];
    const wrapper = shallow(<AddEditZone option={option} />);
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#states-filter",
      "2"
    );

    expect(updatedNameInput.props().value.name).toEqual("Maharashtra");
  });

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
