import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import AddEditStudent from "../AddEditStudent.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";
import * as serviceProviders from "../../../api/Axios";
import * as medhaAdminUser from "../../../mockuser/MedhaAdmin.json";
import * as studentUser from "../../../mockuser/StudentUser.json";
import SetIndexContext from "../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import axios from "axios";
import * as mockData from "../../../mockData/mockData.js";
import * as mockCollegeData from "../../../mockData/mockCollegeData";
import * as mockDataForStudent from "../../../mockData/mockDataForStudent";

import * as strapiApiConstants from "../../../constants/StrapiApiConstants.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Add Edit Student", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check new registration form", async () => {
    let props = {
      location: {
        pathname: "/registration",
        search: "",
        hash: "",
        state: {
          otp: "888346",
          contactNumber: "0123454321",
          from: "/verifyotp"
        },
        key: "djqm1l"
      }
    };

    const getAddEditStudentFromStudentSpy = jest
      .spyOn(axios, "get")
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
            <AddEditStudent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    expect(getAddEditStudentFromStudentSpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_STATES +
          "?pageSize=-1"
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_FUTURE_ASPIRATIONS +
          "?pageSize=-1"
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_DISTRICTS +
          "?pageSize=-1"
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_COLLEGES +
          "?pageSize=-1"
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_STREAMS +
          "?pageSize=-1"
      ]
    ]);
    /** This actually checks whether the post method is called */
    expect(getAddEditStudentFromStudentSpy).toHaveBeenCalledTimes(5);

    wrapper.unmount();
  });

  it("Should check edit student for AddEditStudent", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    let props = {
      location:
        mockDataForStudent.mockLocationDataForEditStudentFromStudentLogin
    };

    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <AddEditStudent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    wrapper.unmount();
  });
});
