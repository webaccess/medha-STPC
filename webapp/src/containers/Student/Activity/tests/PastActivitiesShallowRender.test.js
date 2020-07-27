import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import PastActivities from "../PastActivities.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as collegeUser from "../../../../mockuser/CollegeAdmin.json";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockStudentData from "../../../../mockData/mockStudentData";
import SetIndexContext from "../../../../context/SetIndexContext.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage Past activity", () => {
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
  it("Should check table data without filters", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    let props = {
      location: {
        pathname: "/past-activities",
        search: "",
        hash: "",
        key: "rf0jxx"
      },
      mockPastActivityData: mockStudentData.mockTempDataForPastActivity
    };
    jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.mockDataForStudentPastActivity
          });
        });
      });
    jest
      .spyOn(serviceProviders, "serviceProviderForGetOneRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.mockdataForEditingFeedbackActivity
          });
        });
      });

    const spyGetDataForFilters = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.mockDataForPastEvents
          });
        });
      });

    let wrapper = shallow(<PastActivities {...props} />);

    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(52, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);

    wrapper.find("#ManageTableID").props().onGiveFeedback({ id: 1 });
    wrapper.find("#ManageTableID").props().onEditFeedback({ id: 1 });

    /** Set filters */
    wrapper.find("#name-filter").simulate("change", {
      persist: jest.fn(),
      target: { value: "Test" }
    });
    expect(wrapper.find("#name-filter").props().value).toBe("Test");
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#activity-status-filter",
      "1"
    );
    wrapper.find("#submitFilter").simulate("click", {
      persist: jest.fn()
    });
    expect(spyGetDataForFilters).toHaveBeenCalledTimes(3);
    /** Simulate table events when the filters are set */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(52, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);

    /** This simulates the clear filter */
    wrapper.find("#clearFilter").simulate("click", {
      preventDefault: jest.fn()
    });
  });

  it("should pass wrong value sto the filter", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    let props = {
      location: {
        pathname: "/past-activities",
        search: "",
        hash: "",
        key: "rf0jxx"
      },
      mockPastActivityData: mockStudentData.mockTempDataForPastActivity
    };

    let wrapper = shallow(<PastActivities {...props} />);

    wrapper.find("#activity-status-filter").simulate("change", {}, null);
  });
});

describe("Manage Past Event UnSuccessfull api calls", () => {
  it("should check unsuccessfull call for getting feedback and editing feedback", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    let props = {
      location: {
        pathname: "/past-events",
        search: "",
        hash: "",
        key: "65lh3d"
      },
      isTesting: true,
      mockPastEventData: mockStudentData.mockTempDataForPastActivity
    };

    jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise((resolve, reject) => {
          return reject({ error: "error" });
        });
      });

    jest
      .spyOn(serviceProviders, "serviceProviderForGetOneRequest")
      .mockImplementation(() => {
        return new Promise((resolve, reject) => {
          return reject({ error: "error" });
        });
      });

    let wrapper = shallow(<PastActivities {...props} />);
    /** Simulating table events without filter */
    // wrapper.find("#ManageTableID").props().onGiveFeedback({ id: 1 });
    // wrapper.find("#ManageTableID").props().onEditFeedback({ id: 1 });
  });
});
