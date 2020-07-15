import React, { useContext, useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import AddEditCollege from "../AddEditCollege";
import { BrowserRouter as Router } from "react-router-dom";
import LoaderContext from "../../../../context/LoaderContext";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

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

describe("test for edit college ", () => {
  it("It has an input field", () => {
    const wrapper = shallow(<AddEditCollege />);
    const input = wrapper.find("#name");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#name",
      "St. john college pf engineering and technology",
      "collegeName"
    );
    expect(updatedNameInput.props().value).toEqual(
      "St. john college pf engineering and technology"
    );
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#college_code",
      "SJCET12",
      "collegeCode"
    );
    expect(updatedNameInput.props().value).toEqual("SJCET12");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#address",
      "Palghar",
      "address"
    );
    expect(updatedNameInput.props().value).toEqual("Palghar");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#college_email",
      "sject@gmail.com",
      "collegeEmail"
    );
    expect(updatedNameInput.props().value).toEqual("sject@gmail.com");
  });
  it("test for  state field", () => {
    const stateOption = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];
    const wrapper = shallow(<AddEditCollege stateOption={stateOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#state", "1");
    expect(updatedNameInput.props().value.name).toEqual("Uttar pradesh");
  });

  it("test for  zone field", () => {
    const zoneOption = [
      {
        id: 1,
        name: "East Uttar pradesh"
      },
      {
        id: 2,
        name: "West Uttar pradesh"
      },
      {
        id: 3,
        name: "central Uttar pradesh"
      }
    ];
    const wrapper = shallow(<AddEditCollege zoneOption={zoneOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#zone", "1");
    expect(updatedNameInput.props().value.name).toEqual("East Uttar pradesh");
  });

  it("test for  rpc field", () => {
    const rpcOption = [
      {
        id: 1,
        name: "Agra"
      },
      {
        id: 2,
        name: "Bareilly"
      }
    ];
    const wrapper = shallow(<AddEditCollege rpcOption={rpcOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#rpc", "1");
    expect(updatedNameInput.props().value.name).toEqual("Agra");
  });
});
