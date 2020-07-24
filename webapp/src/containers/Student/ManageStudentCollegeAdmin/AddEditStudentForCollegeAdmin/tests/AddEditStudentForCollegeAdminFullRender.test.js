import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import AddEditStudentForCollegeAdmin from "../AddEditStudentForCollegeAdmin.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../../components/Auth";
import LoaderContext from "../../../../../context/LoaderContext";
import * as serviceProviders from "../../../../../api/Axios";
import * as collegeAdminUser from "../../../../../mockuser/CollegeAdmin.json";
import * as studentUser from "../../../../../mockuser/StudentUser.json";
import SetIndexContext from "../../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../../constants/StrapiApiConstants";
import axios from "axios";
import * as mockData from "../../../../../mockData/mockData.js";
import * as mockCollegeData from "../../../../../mockData/mockCollegeData";
import * as mockActivityData from "../../../../../mockData/mockActivityData";
import * as mockStudentFromCollege from "../../../../../mockData/mockStudentFromCollegeAdmin";
import * as strapiApiConstants from "../../../../../constants/StrapiApiConstants.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Add Edit Student from College Admin", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check add student component from college admin", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let props = {
      location: {
        pathname: "/college-add-student",
        addStudent: true,
        search: "",
        hash: "",
        key: "i4x4y5"
      }
    };

    jest.spyOn(axios, "get").mockImplementation(() => {
      return new Promise(resolve => {
        return resolve({
          data: []
        });
      });
    });

    const getAddEditStudentFromCollegeAdminSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: []
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <AddEditStudentForCollegeAdmin {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getAddEditStudentFromCollegeAdminSpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_FUTURE_ASPIRATIONS
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
        { pageSize: -1 },
        {}
      ]
    ]);
    /** This actually checks whether the post method is called */
    expect(getAddEditStudentFromCollegeAdminSpy).toHaveBeenCalledTimes(2);

    wrapper.unmount();
  });

  it("Should check edit student component from college admin", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin
    };
    jest.spyOn(axios, "get").mockImplementation(() => {
      return new Promise(resolve => {
        return resolve({
          data: []
        });
      });
    });

    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <AddEditStudentForCollegeAdmin {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    wrapper.unmount();
  });
});
