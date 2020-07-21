import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import AddEditActivity from "../../AddEditActivity.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import axios from "axios";
import * as mockData from "../../../../mockData/mockData.js";
import * as mockCollegeData from "../../../../mockData/mockCollegeData";
import * as mockActivityData from "../../../../mockData/mockActivityData";

import * as strapiApiConstants from "../../../../constants/StrapiApiConstants.js";

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

describe("Add Edit Activity", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check activity for medha admin for add activity", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/add-activity",
        addActivity: true,
        search: "",
        hash: "",
        key: "3w9dke"
      }
    };

    const getActivitySpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.questionSet
          });
        });
      });

    const getSpy = jest.spyOn(axios, "get").mockImplementation(() => {
      return new Promise(resolve => {
        return resolve({ data: mockCollegeData.streamsList });
      });
    });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <AddEditActivity {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getActivitySpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_QUESTION_SET
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES,
        { pageSize: -1 }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_ACTIVITY_TYPE
      ]
    ]);

    expect(getSpy.mock.calls).toEqual([
      [strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS]
    ]);

    /** This actually checks whether the post method is called */
    expect(getActivitySpy).toHaveBeenCalledTimes(3);
    expect(getSpy).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("Should check add edit activity for edit activity", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: mockActivityData.editActivityLocationData
    };

    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <AddEditActivity {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    wrapper.unmount();
  });
});
