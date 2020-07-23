import React, { useState as useStateMock } from "react";
import { mount, shallow } from "enzyme";
import ViewDocument from "../ViewDocument.js";
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

describe("View Document", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check initial full render for ViewDocument component", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);

    const getDocumentSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentData.viewDocumentResponseMock
          });
        });
      });

    const props = {
      location: {
        pathname: "/view-documents",
        search: "",
        hash: "",
        key: "ewqswn"
      }
    };
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ViewDocument {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called */
    expect(getDocumentSpy).toBeCalled();

    // /** This actually checks whether the post method is called with proper url and request body */
    expect(getDocumentSpy).toBeCalledWith(
      strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_STUDENTS_DIRECT_URL +
        `/20/` +
        strapiConstants.STRAPI_STUDENT_DOCUMENT,
      null
    );
    wrapper.unmount();
  });
});
