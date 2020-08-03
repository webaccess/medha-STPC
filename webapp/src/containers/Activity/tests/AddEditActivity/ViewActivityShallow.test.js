import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import ViewActivity from "../../ViewActivity.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as collegeAdminUser from "../../../../mockuser/CollegeAdmin.json";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockData from "../../../../mockData/mockData.js";
import * as mockCollegeData from "../../../../mockData/mockCollegeData";
import * as mockActivityData from "../../../../mockData/mockActivityData";

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage Past Event", () => {
  it("should check table events with and without filters with successfully calling get feedback and edit feedback", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      isTesting: true,
      location: mockActivityData.mockManageActivityLocationData,
      viewData: mockActivityData.mockManageActivityLocationViewData,
      activityType: [
        {
          id: 1,
          name: "Training",
          is_active: true,
          created_at: "2020-06-24T07:09:36.947Z",
          updated_at: "2020-06-24T07:09:36.947Z"
        },
        {
          id: 2,
          name: "Workshop",
          is_active: true,
          created_at: "2020-06-24T07:09:36.955Z",
          updated_at: "2020-06-24T07:09:36.955Z"
        },
        {
          id: 3,
          name: "Industrial Visit",
          is_active: true,
          created_at: "2020-06-24T07:09:36.959Z",
          updated_at: "2020-06-24T07:09:36.959Z"
        }
      ]
    };

    jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: []
          });
        });
      });

    jest
      .spyOn(serviceProviders, "serviceProviderForGetOneRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: []
          });
        });
      });

    const spyGetDataForFilters = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockActivityData.mockManageActivityLocationViewApiData
          });
        });
      });

    let wrapper = shallow(<ViewActivity {...props} />);

    /** Simulating table events without filter */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper.find("#ManageTableID").props().editEvent({ id: 1 });
    wrapper
      .find("#ManageTableID")
      .props()
      .deleteEvent({ target: { id: 1 } });

    /** Set filters */
    wrapper.find("#name").simulate("change", {
      persist: jest.fn(),
      target: { value: "Test" }
    });
    expect(wrapper.find("#name").props().value).toBe("Test");

    wrapper
      .find("#Date")
      .simulate(
        "change",
        "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
      );
    expect(wrapper.find("#Date").props().value).toBe(
      "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
    );

    wrapper.find("#activity_filter").simulate("change", {}, { id: 1 });
    expect(wrapper.find("#activity_filter").props().value.name).toBe(
      "Training"
    );
    wrapper.find("#Education_Year").simulate("change", {}, { id: "First" });
    expect(wrapper.find("#Education_Year").props().value.name).toBe("First");

    // /** Simulate data when filters are set */
    // /** This simulates the search filter */
    wrapper.find("#submitFiter").simulate("click", {
      persist: jest.fn()
    });

    expect(spyGetDataForFilters).toHaveBeenCalledTimes(3);

    // /** Simulate table events when the filters are set */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper.find("#ManageTableID").props().onChangePage(2);

    /** This simulates the clear filter */
    wrapper.find("#clearFilter").simulate("click", {
      preventDefault: jest.fn()
    });
  });

  it("should pass wrong value sto the filter", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: mockActivityData.mockManageActivityLocationData,
      viewData: mockActivityData.mockManageActivityLocationViewData,
      activityType: [
        {
          id: 1,
          name: "Training",
          is_active: true,
          created_at: "2020-06-24T07:09:36.947Z",
          updated_at: "2020-06-24T07:09:36.947Z"
        },
        {
          id: 2,
          name: "Workshop",
          is_active: true,
          created_at: "2020-06-24T07:09:36.955Z",
          updated_at: "2020-06-24T07:09:36.955Z"
        },
        {
          id: 3,
          name: "Industrial Visit",
          is_active: true,
          created_at: "2020-06-24T07:09:36.959Z",
          updated_at: "2020-06-24T07:09:36.959Z"
        }
      ]
    };

    let wrapper = shallow(<ViewActivity {...props} />);
    wrapper.find("#Date").simulate("change", "Invalid Date");

    wrapper.find("#activity_filter").simulate("change", {}, null);
    wrapper.find("#Education_Year").simulate("change", {}, null);
  });

  it("feedbackr", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: mockActivityData.mockManageActivityLocationData,
      viewData: mockActivityData.mockManageActivityLocationViewData,
      activityType: [
        {
          id: 1,
          name: "Training",
          is_active: true,
          created_at: "2020-06-24T07:09:36.947Z",
          updated_at: "2020-06-24T07:09:36.947Z"
        },
        {
          id: 2,
          name: "Workshop",
          is_active: true,
          created_at: "2020-06-24T07:09:36.955Z",
          updated_at: "2020-06-24T07:09:36.955Z"
        },
        {
          id: 3,
          name: "Industrial Visit",
          is_active: true,
          created_at: "2020-06-24T07:09:36.959Z",
          updated_at: "2020-06-24T07:09:36.959Z"
        }
      ],
      isGiveFeedback: true,
      isEditFeedback: false,
      isViewFeedback: true
    };

    let wrapper = shallow(<ViewActivity {...props} />);
    expect(wrapper.find("ViewFeedBack").props().formSuperAdmin).toBe(true);
    expect(wrapper.find("AddEditFeedBack").props().isAddFeedback).toBe(true);
  });
  it("feedbackr", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let props = {
      location: mockActivityData.mockManageActivityLocationData,
      viewData: mockActivityData.mockManageActivityLocationViewData,
      activityType: [
        {
          id: 1,
          name: "Training",
          is_active: true,
          created_at: "2020-06-24T07:09:36.947Z",
          updated_at: "2020-06-24T07:09:36.947Z"
        },
        {
          id: 2,
          name: "Workshop",
          is_active: true,
          created_at: "2020-06-24T07:09:36.955Z",
          updated_at: "2020-06-24T07:09:36.955Z"
        },
        {
          id: 3,
          name: "Industrial Visit",
          is_active: true,
          created_at: "2020-06-24T07:09:36.959Z",
          updated_at: "2020-06-24T07:09:36.959Z"
        }
      ],
      isGiveFeedback: false,
      isEditFeedback: true,
      isViewFeedback: true
    };

    let wrapper = shallow(<ViewActivity {...props} />);
    expect(wrapper.find("ViewFeedBack").props().fromCollegeAdmin).toBe(true);
    expect(wrapper.find("AddEditFeedBack").props().isEditFeedback).toBe(true);
  });
});
