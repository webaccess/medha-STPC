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
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import { BrowserRouter as Router } from "react-router-dom";

React.useLayoutEffect = React.useEffect;

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

describe("View Education", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check initial full render for ViewEducation component", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);

    const getEducationDetails = jest
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
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ViewEducation {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called */
    expect(getEducationDetails).toBeCalled();

    // /** This actually checks whether the post method is called with proper url and request body */
    expect(getEducationDetails).toBeCalledWith(
      strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_STUDENTS_INDIVIDUAL_URL +
        `/20/` +
        strapiConstants.STRAPI_STUDENT_EDUCATION,
      {
        page: 1,
        pageSize: 10
      }
    );
    wrapper.unmount();
  });
});
