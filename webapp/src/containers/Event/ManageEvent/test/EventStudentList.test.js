import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import EventStudentList from "../EventStudentList.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";

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

describe("Manage Event", () => {
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
      location: {
        eventTitle: "Hello",
        eventId: 1
      }
    };

    const getManageUserSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: {
              result: [
                {
                  id: 1,
                  name: "Mechanical Engineering (Production)",
                  created_at: "2020-06-25T06:43:54.120Z",
                  updated_at: "2020-06-25T06:43:54.120Z"
                }
              ],
              page: 1,
              pageSize: 52,
              rowCount: 52,
              pageCount: 1
            }
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <EventStudentList {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getManageUserSpy.mock.calls).toEqual([
      [
        process.env.REACT_APP_SERVER_URL + "events/1/contact/individuals",
        {
          _sort: "name:asc",
          page: 1,
          pageSize: 10
        }
      ],
      [
        process.env.REACT_APP_SERVER_URL + "streams",
        {
          pageSize: -1
        }
      ]
    ]);

    /** This actually checks whether the post method is called */
    expect(getManageUserSpy).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });
});
