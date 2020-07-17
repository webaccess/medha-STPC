import React from "react";
import { shallow } from "enzyme";
import AddEditState from "../AddEditState";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";

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
    };
    const wrapper = shallow(
      <AddEditState editState={true} dataForEdit={dataForEdit} />
    );
    const input = wrapper.find("#test");
    expect(input.props().value).toBe("Uttar pradesh");
  });
  it("Test for else condition of  Edit prefilled", () => {
    const dataForEdit = {};
    const wrapper = shallow(
      <AddEditState editState={true} dataForEdit={dataForEdit} />
    );
    const input = wrapper.find("#test");
    expect(input.props().value).toBe("");
  });
  it("Test for else condition of  Edit prefilled", () => {
    const wrapper = shallow(
      <AddEditState editState={true} dataForEdit={undefined} />
    );
    const input = wrapper.find("#test");
    expect(input.props().value).toBe("");
  });

  it("Test for submit api", () => {
    const wrapper = shallow(<AddEditState />);
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#test",
      "maharashtra",
      "state"
    );
    const mockDataRequest = { name: "maharashtra" };
    expect(updatedNameInput.props().value).toEqual("maharashtra");
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(postSpy).toBeCalled();
    expect(postSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES}`,
      expect.objectContaining(mockDataRequest)
    );
  });

  it("Test for update submit api", () => {
    const dataForEdit = {
      name: "maharashtra",
      id: 2
    };
    const wrapper = shallow(
      <AddEditState editState={true} dataForEdit={dataForEdit} />
    );
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPutRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });

    const mockDataRequest = { name: "maharashtra" };
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(postSpy).toBeCalled();
    expect(postSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES}`,
      2,
      expect.objectContaining(mockDataRequest)
    );
  });

  it("Test for update submit api", () => {
    const dataForEdit = {
      id: 2
    };
    const wrapper = shallow(
      <AddEditState editState={true} dataForEdit={dataForEdit} />
    );
    // const postSpy = jest
    //   .spyOn(serviceProviders, "serviceProviderForPutRequest")
    //   .mockImplementation(() => {
    //     return new Promise(resolve => {
    //       return resolve({ data: "data" });
    //     });
    //   });

    // const mockDataRequest = { name: "maharashtra" };
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    // expect(postSpy).toBeCalled();
    // expect(postSpy).toBeCalledWith(
    //   `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES}`,
    //   2,
    //   expect.objectContaining(mockDataRequest)
    // );
  });
});
