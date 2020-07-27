import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ViewPastEvent from "../ViewPastEvent.js";
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

describe("Manage Past Event", () => {
  it("should check table events with and without filters with successfully calling get feedback and edit feedback", async () => {
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
      mockPastEventData: mockStudentData.mockTempDataForPastEvent
    };

    jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.mockDataForgivingFeedback
          });
        });
      });

    jest
      .spyOn(serviceProviders, "serviceProviderForGetOneRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.mockDataForEditingFeedback
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

    let wrapper = shallow(<ViewPastEvent {...props} />);

    /** Simulating table events without filter */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "title" }, "asc", 20, 2);
    wrapper.find("#ManageTableID").props().onGiveFeedback({ id: 1 });
    wrapper.find("#ManageTableID").props().onEditFeedback({ id: 1 });

    /** Set filters */
    wrapper.find("#name").simulate("change", {
      persist: jest.fn(),
      target: { value: "Test" }
    });
    expect(wrapper.find("#name").props().value).toBe("Test");

    wrapper
      .find("#startDate")
      .simulate(
        "change",
        "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
      );
    expect(wrapper.find("#startDate").props().value).toBe(
      "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
    );

    wrapper
      .find("#endDate")
      .simulate(
        "change",
        "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
      );
    expect(wrapper.find("#endDate").props().value).toBe(
      "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
    );

    wrapper.find("#status-filter").simulate("change", {}, { id: "true" });
    expect(wrapper.find("#status-filter").props().value.name).toBe("Attended");

    /** Simulate data when filters are set */
    /** This simulates the search filter */
    wrapper.find("#submitFiter").simulate("click", {
      persist: jest.fn()
    });

    expect(spyGetDataForFilters).toHaveBeenCalledTimes(5);

    /** Simulate table events when the filters are set */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper
      .find("#ManageTableID")
      .props()
      .onSort({ selector: "title" }, "asc", 20, 2);

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
        pathname: "/past-events",
        search: "",
        hash: "",
        key: "65lh3d"
      },
      isTesting: true,
      mockPastEventData: mockStudentData.mockTempDataForPastEvent
    };

    let wrapper = shallow(<ViewPastEvent {...props} />);
    wrapper.find("#startDate").simulate("change", "Invalid Date");

    wrapper.find("#endDate").simulate("change", "Invalid Date");

    wrapper.find("#status-filter").simulate("change", {}, null);
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
      mockPastEventData: mockStudentData.mockTempDataForPastEvent
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

    let wrapper = shallow(<ViewPastEvent {...props} />);
    /** Simulating table events without filter */
    wrapper.find("#ManageTableID").props().onGiveFeedback({ id: 1 });
    wrapper.find("#ManageTableID").props().onEditFeedback({ id: 1 });
  });
});
