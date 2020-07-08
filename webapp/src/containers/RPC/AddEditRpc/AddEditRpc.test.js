import React from "react";
import { shallow, mount } from "enzyme";
import AddEditRpc from "./AddEditRpc";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceProviders from "../../../api/Axios";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

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
    const wrapper = shallow(<AddEditRpc />);
    const input = wrapper.find("#rpcname");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<AddEditRpc />);

    const updatedNameInput = simulateChangeOnInput(
      abc,
      "#rpcname",
      "maharashtra",
      "rpcName"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });

  it("test for  autocomplete state field", () => {
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
    const wrapper = shallow(<AddEditRpc option={option} />);
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#statename",
      "2"
    );

    expect(updatedNameInput.props().value.name).toEqual("Maharashtra");
  });

  it("test for autocomplete college field", () => {
    const option = [
      {
        id: 1,
        name: "SJCET"
      },
      {
        id: 2,
        name: "Mithibai"
      }
    ];
    const wrapper = shallow(
      <AddEditRpc collegeOption={option} editRpc="true" />
    );

    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#collegename",
      "2"
    );
    expect(updatedNameInput.props().value.name).toEqual("Mithibai");
  });

  // it(" should properly render the component for edit", () => {
  //   const data = [
  //     {
  //       id: 1,
  //       name: "Uttar pradesh"
  //     },
  //     {
  //       id: 2,
  //       name: "Maharashtra"
  //     }
  //   ];
  //   const statesSpyOn = jest
  //     .spyOn(serviceProviders.serviceProviderForGetRequest, "get")
  //     .mockImplementation(() => {
  //       return new Promise(resolve => {
  //         return resolve(data);
  //       });
  //     });

  //   const wrapper = shallow(<AddEditRpc />);

  //   expect(statesSpyOn).toBeCalled();
  //   /** postSpy.mock.results.pop().value this gets the promise of the axios request */
  //   const postPromise = statesSpyOn.mock.results.pop().value;

  //   /** Check promise */
  //   return postPromise.then(postResponse => {
  //     console.log(postResponse);
  //   });
  // });
});
