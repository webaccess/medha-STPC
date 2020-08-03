import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import DeleteState from "../DeleteState.js";
import * as serviceProviders from "../../../../api/Axios";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Delete RPC", () => {
  it("test the component for initial render with single delete", () => {
    let props = {
      isTesting: true,
      showModal: true,
      dataToDelete: {
        id: "3",
        name: "Andhra Pradesh"
      },
      id: "3",
      isMultiDelete: false,
      modalClose: jest.fn(),
      clearSelectedRow: jest.fn(),
      closeModal: jest.fn()
    };

    let wrapper = shallow(<DeleteState {...props} />);
    const deleteSpy = jest
      .spyOn(serviceProviders, "serviceProviderForDeleteRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });
    const checkIfStateCanBeDeletedSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });

    wrapper.find("#submitDeleteState").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });
    console.log("deleteState", checkIfStateCanBeDeletedSpy.mock);
    expect(checkIfStateCanBeDeletedSpy).toBeCalled();
  });

  it("test the component for initial render with multi delete and the data should not get deleted", () => {
    const props = {
      isTesting: true,
      showModal: true,
      id: [2, 3, 4, 1],
      isMultiDelete: true,
      dataToDelete: {},
      modalClose: jest.fn(),
      clearSelectedRow: jest.fn(),
      closeModal: jest.fn()
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<DeleteState {...props} />);

    const checkIfRpcCanBeDeletedSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [{ id: 1 }] }
          });
        });
      });
    const deleteSpy = jest
      .spyOn(serviceProviders, "serviceProviderForAllDeleteRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { result: [] }
          });
        });
      });

    wrapper.find("#submitDeleteState").simulate("click", {
      preventDefault: jest.fn(),
      persist: jest.fn()
    });

    expect(checkIfRpcCanBeDeletedSpy).toBeCalled();
  });
});
