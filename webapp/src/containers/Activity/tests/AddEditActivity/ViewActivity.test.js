import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
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

describe("Manage Activity", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check Manage Event page for medha admin", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: mockActivityData.mockManageActivityLocationData
    };

    const getViewActivitySpy = jest
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
            <ViewActivity {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    expect(getViewActivitySpy).toBeCalled();
    expect(getViewActivitySpy.mock.calls).toEqual([
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE],
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY,
        { page: 1, pageSize: 10 }
      ]
    ]);
  });

  it("Should check Manage Event page for college admin", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let props = {
      location: mockActivityData.mockManageActivityLocationData
    };

    const getViewActivitySpy = jest
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
            <ViewActivity {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    expect(getViewActivitySpy).toBeCalled();
    expect(getViewActivitySpy.mock.calls).toEqual([
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE],
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY,
        { page: 1, pageSize: 10 }
      ],
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          `/2/` +
          strapiConstants.STRAPI_COLLEGE_ACTIVITY
      ],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE],
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          `/2/` +
          strapiConstants.STRAPI_COLLEGE_ACTIVITY,
        { page: 1, pageSize: 10 }
      ]
    ]);
  });
  it("Should check Manage Event page for null admin", async () => {
    // auth.setToken(collegeAdminUser.jwt, true);
    // auth.setUserInfo(collegeAdminUser.user, true);
    let props = {
      location: mockActivityData.mockManageActivityLocationData
    };

    const getViewActivitySpy = jest
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
            <ViewActivity {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    expect(getViewActivitySpy).toBeCalled();
    expect(getViewActivitySpy.mock.calls).toEqual([
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE],
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY,
        { page: 1, pageSize: 10 }
      ],
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          `/2/` +
          strapiConstants.STRAPI_COLLEGE_ACTIVITY
      ],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE],
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          `/2/` +
          strapiConstants.STRAPI_COLLEGE_ACTIVITY,
        { page: 1, pageSize: 10 }
      ],
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          `/2/` +
          strapiConstants.STRAPI_COLLEGE_ACTIVITY
      ],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE],
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          `/2/` +
          strapiConstants.STRAPI_COLLEGE_ACTIVITY,
        { page: 1, pageSize: 10 }
      ]
    ]);
  });
});
describe("Manage Activity from add and edit activity", () => {
  it("edit activity", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: mockActivityData.mockManageActivityLocationEditedData
    };
    const wrapper = mount(<ViewActivity {...props} />);
  });
  it("add activity", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: mockActivityData.mockManageActivityLocationAddeddData
    };
    const wrapper = mount(<ViewActivity {...props} />);
  });

  it("view activity api", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: mockActivityData.mockManageActivityLocationAddeddData
    };
    const wrapper = mount(<ViewActivity {...props} />);
  });
});
