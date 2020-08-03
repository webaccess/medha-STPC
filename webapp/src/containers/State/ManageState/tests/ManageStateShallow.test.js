import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ViewStates from "../ManageState";
import * as serviceProviders from "../../../../api/Axios";
import * as mockState from "../mockStateData/mockStateData";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage State", () => {
  it("should check filters", () => {
    let props = { isTesting: true, stateData: mockState.stateDataToShow };
    const spyGetDataForFilters = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: []
          });
        });
      });
    let wrapper = shallow(<ViewStates {...props} />);

    /** Simulating table events without filter */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "title" }, "asc", 20, 2);
    wrapper
      .find("#ManageTableID")
      .props()
      .editEvent({ target: { id: 1 } });
    /** Set filters */
    wrapper.find("#name").simulate("change", {
      persist: jest.fn(),
      target: { value: "Test" }
    });
    expect(wrapper.find("#name").props().value).toBe("Test");

    wrapper.find("#submitFilter").simulate("click", {
      persist: jest.fn()
    });
    expect(spyGetDataForFilters).toHaveBeenCalledTimes(5);
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper.find("#clearFilter").simulate("click", {
      preventDefault: jest.fn()
    });
  });

  it("search filter state", () => {
    const props = {
      isFilterSearch: true,
      isTesting: true,
      stateData: mockState.stateDataToShow
    };
    let wrapper = shallow(<ViewStates {...props} />);
    wrapper.find("#name").simulate("change", {
      persist: jest.fn(),
      target: { value: "Test" }
    });
    expect(wrapper.find("#name").props().value).toBe("Test");

    wrapper.find("#submitFilter").simulate("click", {
      persist: jest.fn()
    });
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
  });

  it("edit state", () => {
    const props = {
      location: mockState.EditedData,
      isTesting: true,
      stateData: mockState.stateDataToShow
    };
    let wrapper = shallow(<ViewStates {...props} />);
  });
  it("added state", () => {
    const props = {
      location: mockState.addedData,
      isTesting: true,
      stateData: mockState.stateDataToShow
    };
    let wrapper = shallow(<ViewStates {...props} />);
  });
  it("DELETE state", () => {
    const props = {
      showModalDelete: true,
      isMultiDelete: true,
      location: mockState.addedData,
      isTesting: true,
      MultiDeleteID: [1, 2, 3, 4],
      stateData: mockState.stateDataToShow
    };
    let wrapper = shallow(<ViewStates {...props} />);
    expect(wrapper.find("DeleteState").props().showModal).toBe(true);
    expect(wrapper.find("DeleteState").props().isMultiDelete).toBe(true);
    wrapper.find("DeleteState").props().modalClose();
  });
});
