import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import AddEditEvent from "../AddEditEvent";
import LoaderContext from "../../../../context/LoaderContext";
import SetIndexContext from "../../../../context/SetIndexContext";
import { BrowserRouter as Router } from "react-router-dom";
import * as mockData from "../../../../mockData/mockEventData";
import * as serviceProviders from "../../../../api/Axios";

import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";
import * as collegeAdminUser from "../../../../mockuser/CollegeAdmin.json";
import auth from "../../../../components/Auth";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("Add Edit Event", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });
  it("Should check event", async () => {
    let props = { dataForEdit: mockData.mockEventData, editEvent: true };
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <Router>
          <AddEditEvent {...props} />
        </Router>
      </LoaderContext.Provider>
    );
  });
  it("Should check api in useEffect", async () => {
    const getStatusOfDashboardSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: {
              result: [
                {
                  id: 1,
                  name: "Uttar Pradesh",
                  is_active: true,
                  abbreviation: "UP",
                  identifier: "",
                  country: {
                    id: 1,
                    name: "India",
                    is_active: true,
                    abbreviation: "IN",
                    identifier: "IN",
                    created_at: "2020-06-25T06:43:49.635Z",
                    updated_at: "2020-06-25T06:43:49.635Z"
                  },
                  created_at: "2020-06-25T06:43:49.648Z",
                  updated_at: "2020-06-25T06:43:49.648Z"
                }
              ],
              page: 1,
              pageSize: 1,
              rowCount: 1,
              pageCount: 1
            }
          });
        });
      });

    let props = {
      location: {
        fromeditUser: false,
        editedUserName: null,
        fromAddUser: false,
        addedUserName: null
      }
    };
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <Router>
          <AddEditEvent {...props} />
        </Router>
      </LoaderContext.Provider>
    );
    console.log("api****", getStatusOfDashboardSpy.mock.calls);

    expect(getStatusOfDashboardSpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_QUESTION_SET
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
        { pageSize: -1 }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS,
        { pageSize: -1 }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES,
        { pageSize: -1 }
      ]
    ]);

    expect(getStatusOfDashboardSpy).toHaveBeenCalledTimes(4);
    wrapper.unmount();
  });

  it("Should check edit event ", async () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    const getStatusOfDashboardSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: {
              result: [
                {
                  id: 1,
                  name: "Uttar Pradesh",
                  is_active: true,
                  abbreviation: "UP",
                  identifier: "",
                  country: {
                    id: 1,
                    name: "India",
                    is_active: true,
                    abbreviation: "IN",
                    identifier: "IN",
                    created_at: "2020-06-25T06:43:49.635Z",
                    updated_at: "2020-06-25T06:43:49.635Z"
                  },
                  created_at: "2020-06-25T06:43:49.648Z",
                  updated_at: "2020-06-25T06:43:49.648Z"
                }
              ],
              page: 1,
              pageSize: 1,
              rowCount: 1,
              pageCount: 1
            }
          });
        });
      });

    let props = {
      location: {
        fromeditUser: false,
        editedUserName: null,
        fromAddUser: false,
        addedUserName: null
      }
    };
    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <Router>
          <AddEditEvent {...props} />
        </Router>
      </LoaderContext.Provider>
    );

    expect(getStatusOfDashboardSpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_QUESTION_SET
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
        { pageSize: -1 }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS,
        { pageSize: -1 }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES,
        { pageSize: -1 }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_QUESTION_SET
      ]
    ]);

    expect(getStatusOfDashboardSpy).toHaveBeenCalledTimes(5);
    wrapper.unmount();
  });
});
