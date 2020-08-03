import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ManageUser from "../ManageUser";
import * as serviceProviders from "../../../../api/Axios";
import * as mockData from "../MockData/MockData";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage User", () => {
  const simulateChangeOnInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate("change", {
      target: { name: newNameValue, value: newValue },
      persist: jest.fn()
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
  it("should check filters", () => {
    let props = {
      userData: mockData.userData,
      location: {
        hash: "",
        key: "aqytjq",
        pathname: "/manage-user",
        search: "",
        state: null
      }
    };
    const spyGetDataForFilters = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.userData
          });
        });
      });
    let wrapper = shallow(<ManageUser {...props} />);
    /** Simulating table events without filter */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "title" }, "asc", 20, 2);
    /** Check contact number */
    const contactNumber = simulateChangeOnInput(
      wrapper,
      "#contactNumberID",
      "0123456789",
      "contact.phone_contains"
    );
    expect(contactNumber.props().value).toEqual("0123456789");

    /** Check auto complete */
    simulateChangeOnAutoInput(wrapper, "#role_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#state_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#zone_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#rpc_filter", "1");
    simulateChangeOnAutoInput(wrapper, "#ipc_filter", "1");
    wrapper.find("#submitFilter").simulate("click", {
      persist: jest.fn()
    });

    expect(spyGetDataForFilters).toHaveBeenCalledTimes(7);
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper.find("#clearFilter").simulate("click", {
      preventDefault: jest.fn()
    });
  });
  it("should check edit props", () => {
    let props = {
      userData: mockData.userData,
      location: mockData.editProps
    };

    let wrapper = shallow(<ManageUser {...props} />);

    expect(wrapper.find("Alert").props().children).toBe(
      "An error has occured while updating user. Kindly, try again."
    );
  });
  it("should check add props", () => {
    let props = {
      userData: mockData.userData,
      location: mockData.addProps
    };

    let wrapper = shallow(<ManageUser {...props} />);
  });
  it("should check multi-delete props", () => {
    let props = {
      userData: mockData.userData,
      isMultiDelete: true,
      showModalDelete: true
    };

    let wrapper = shallow(<ManageUser {...props} />);
    expect(wrapper.find("DeleteUser").props().isMultiDelete).toBe(true);
  });
  it("should check delete props", () => {
    let props = {
      userData: mockData.userData,
      isMultiDelete: false,
      showModalDelete: true
    };

    let wrapper = shallow(<ManageUser {...props} />);
    expect(wrapper.find("DeleteUser").props().isMultiDelete).toBe(undefined);
  });

  it("should check mullti-blocked props", () => {
    let props = {
      userData: mockData.userData,
      isMulBlocked: true
    };

    let wrapper = shallow(<ManageUser {...props} />);

    expect(wrapper.find("BlockUser").props().isMulBlocked).toBe(true);
  });
});
