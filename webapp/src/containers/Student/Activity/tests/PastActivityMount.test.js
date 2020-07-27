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
jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Manage Event", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check past event page for student for initial render", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    let props = {
      location: {
        pathname: "/past-activities",
        search: "",
        hash: "",
        key: "65lh3d"
      }
    };

    const getViewPAstActivitySpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.mockDataForStudentPastActivity
          });
        });
      });
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <PastActivities {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getViewPAstActivitySpy.mock.calls).toEqual([
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENTS_INDIVIDUAL_ACTIVITY_URL +
          `/20/` +
          strapiConstants.STRAPI_PAST_ACTIVITIES,
        {
          page: 1,
          pageSize: 10,
          _sort: "start_date_time:desc"
        }
      ]
    ]);
  });
});
