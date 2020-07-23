import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ViewEducation from "../ViewEducation.js";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import * as mockStudentData from "../../../../mockData/mockStudentData";
import * as collegeAdminUser from "../../../../mockuser/CollegeAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("View Education", () => {
  it("Simulate changes after add education", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);

    const props = {
      location: {
        pathname: "/view-education",
        fromAddEducation: true,
        isDataAdded: true,
        addResponseMessage: "",
        addedData: {},
        search: "",
        hash: "",
        key: "9mcor6"
      }
    };
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    shallow(<ViewEducation {...props} />);
  });

  it("Simulate changes after edit education", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);

    const props = {
      location: {
        pathname: "/view-education",
        fromEditEducation: true,
        isDataEdited: true,
        editResponseMessage: "",
        editedData: {},
        search: "",
        hash: "",
        key: "eei7mz"
      }
    };
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    shallow(<ViewEducation {...props} />);
  });

  it("Simulate table and filters when search is active", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    const filterGetSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.viewEducationResponse
          });
        });
      });

    const props = {
      location: {
        pathname: "/view-education",
        search: "",
        hash: "",
        key: "e01z6s"
      }
    };
    /** Simulating fiter fields */
    const wrapper = shallow(<ViewEducation {...props} />);
    wrapper.find("#qualification").simulate("change", {
      target: {
        value: "test"
      },
      persist: jest.fn()
    });
    expect(wrapper.find("#qualification").props().value).toEqual("test");
    wrapper.find("#submitFilter").simulate("click", { persist: jest.fn() });
    expect(filterGetSpy).toBeCalled();
    /** Simulating table fields */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper
      .find("#ManageTableID")
      .props()
      .editEvent({
        persist: jest.fn(),
        target: {
          id: 1
        }
      });
    wrapper
      .find("#ManageTableID")
      .props()
      .deleteEvent({
        target: {
          id: 1,
          getAttribute: jest.fn()
        }
      });
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper.find("#cancelFilter").simulate("click", {});
  });

  it("Simulate table and filters when search is active and data is present in filter", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    const props = {
      location: {
        pathname: "/view-education",
        search: "",
        hash: "",
        key: "e01z6s"
      }
    };
    /** Simulating fiter fields */
    const wrapper = shallow(<ViewEducation {...props} />);
    wrapper.find("#qualification").simulate("change", {
      target: {
        value: "test"
      },
      persist: jest.fn()
    });
    /** Simulating table fields */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper
      .find("#ManageTableID")
      .props()
      .editEvent({
        persist: jest.fn(),
        target: {
          id: 1
        }
      });
    wrapper
      .find("#ManageTableID")
      .props()
      .deleteEvent({
        target: {
          id: 1,
          getAttribute: jest.fn()
        }
      });
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper.find("#cancelFilter").simulate("click", {});
    wrapper.find("#deleteEducation").props().deleteEvent(false, "error");
    wrapper.find("#deleteEducation").props().closeModal();
  });
});

describe("View Education", () => {
  it("Simulate table and filters when search is inactive and data is not present in filter", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    const props = {
      location: {
        pathname: "/view-education",
        search: "",
        hash: "",
        key: "e01z6s"
      }
    };
    /** Simulating fiter fields */
    const wrapper = shallow(<ViewEducation {...props} />);
    /** Simulating table fields */
    wrapper.find("#ManageTableID").props().onChangeRowsPerPage(20, 1);
    wrapper
      .find("#ManageTableID")
      .props()
      .editEvent({
        persist: jest.fn(),
        target: {
          id: 1
        }
      });
    wrapper
      .find("#ManageTableID")
      .props()
      .deleteEvent({
        target: {
          id: 1,
          getAttribute: jest.fn()
        }
      });
    wrapper.find("#ManageTableID").props().onChangePage(2);
    wrapper.find("#cancelFilter").simulate("click", {});
    wrapper.find("#deleteEducation").props().deleteEvent(true, "completed");
    wrapper.find("#deleteEducation").props().closeModal();
  });
});
