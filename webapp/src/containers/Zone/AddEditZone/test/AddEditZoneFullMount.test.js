import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import AddEditZone from "../AddEditZone";
import LoaderContext from "../../../../context/LoaderContext";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as serviceProviders from "../../../../api/Axios";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import { Router } from "@material-ui/icons";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));
jest.mock("axios");
jest.mock("../../../../api/Axios");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("testing for zone", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("test for  autocomplete field", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const addEditZoneSpy = jest
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
                    created_at: "2020-06-24T07:09:28.236Z",
                    updated_at: "2020-06-24T07:09:28.236Z"
                  },
                  created_at: "2020-06-24T07:09:28.252Z",
                  updated_at: "2020-06-24T07:09:28.252Z"
                }
              ],
              page: 1,
              pageSize: 10,
              rowCount: 1,
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
            <AddEditZone />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    // /** This actually checks whether the post method is called with proper url and request body */
    // expect(addEditZoneSpy.mock.calls).toEqual([
    //   [
    //     "https://medha-devlopment.wastaging.com/crm-plugin/states",
    //     {
    //       name_contains: "Uttar Pradesh"
    //     }
    //   ]
    // ]);

    // /** This actually checks whether the post method is called */
    // expect(addEditZoneSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
