import React from "react";
import { shallow } from "enzyme";
import AddEditState from "./AddEditState";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("testing for state", () => {
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
    const wrapper = shallow(<AddEditState />);
    const input = wrapper.find("#test");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<AddEditState />);

    const updatedNameInput = simulateChangeOnInput(
      abc,
      "#test",
      "maharashtra",
      "state"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });

  it("Testt for Edit prefilled", () => {
    const dataForEdit = {
      name: "Uttar pradesh"
    }
    const wrapper = shallow(<AddEditState editState={true} dataForEdit={dataForEdit} />);
    const input = wrapper.find("#test");
    expect(input.props().value).toBe("Uttar pradesh")
  });
  it("Test for else condition of  Edit prefilled", () => {
    const dataForEdit = {}
    const wrapper = shallow(<AddEditState editState={true} dataForEdit={dataForEdit} />);
    const input = wrapper.find("#test");
    expect(input.props().value).toBe("")
  })
  it("Test for else condition of  Edit prefilled", () => {
    const wrapper = shallow(<AddEditState editState={true} dataForEdit={undefined} />);
    const input = wrapper.find("#test");
    expect(input.props().value).toBe("")
  })
});
