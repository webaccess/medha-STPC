import React from "react";
import { shallow } from "enzyme";
import AddEditUser from "../AddEditUser";

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

  it("It has an input field", () => {
    const wrapper = shallow(<AddEditUser />);
    const input = wrapper.find("#firstname");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#firstname",
      "mayank",
      "firstname"
    );
    expect(updatedNameInput.props().value).toEqual("mayank");
  });

  it("change value of input for lastname field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "surti",
      "lastname"
    );
    expect(updatedNameInput.props().value).toEqual("surti");
  });

  it("change value of input  for email field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#email",
      "mayank.surti@webaccessglobal.com",
      "email"
    );
    expect(updatedNameInput.props().value).toEqual(
      "mayank.surti@webaccessglobal.com"
    );
  });

  it("change value of input  for contact number field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7897897890",
      "contact"
    );
    expect(updatedNameInput.props().value).toEqual("7897897890");
  });

  it("change value of input  for password field", () => {
    const wrapper = shallow(<AddEditUser />);
    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );
    expect(updatedNameInput.props().value).toEqual("admin1234");
  });

  it("test for  password field type text", () => {
    const wrapper = shallow(<AddEditUser showPassword={true} />);
    const passwordfield = wrapper.find("#password");
    expect(passwordfield.props().type).toEqual("text");
  });

  it("test for  password field type password", () => {
    const wrapper = shallow(<AddEditUser showPassword={false} />);
    const passwordfield = wrapper.find("#password");
    expect(passwordfield.props().type).toEqual("password");
  });

  it("test for  autocomplete field", () => {
    const option = [
      {
        id: 6,
        name: "College Admin"
      },
      {
        id: 9,
        name: "Department Admin"
      },
      {
        id: 8,
        name: "Medha Admin"
      },
      {
        id: 4,
        name: "Zonal Admin"
      }
    ];
    const wrapper = shallow(<AddEditUser option={option} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#role", "4");

    expect(updatedNameInput.props().value.name).toEqual("Zonal Admin");
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
    const wrapper = shallow(<AddEditUser stateOption={stateOption} />);
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
    const wrapper = shallow(<AddEditUser zoneOption={zoneOption} />);
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
    const wrapper = shallow(<AddEditUser rpcOption={rpcOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#rpc", "1");
    expect(updatedNameInput.props().value.name).toEqual("Agra");
  });

  it("test for  college field", () => {
    const collegeOption = [
      {
        id: 1,
        name: "St. John college of engineering"
      },
      {
        id: 2,
        name: "Mithibai college"
      }
    ];
    const wrapper = shallow(<AddEditUser collegeOption={collegeOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#college",
      "1"
    );
    expect(updatedNameInput.props().value.name).toEqual(
      "St. John college of engineering"
    );
  });
});
