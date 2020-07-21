import React, { useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import ManageZone from "../ManageZone.js";
import { BrowserRouter as Router } from "react-router-dom";
import LoaderContext from "../../../../context/LoaderContext";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as serviceProviders from "../../../../api/Axios";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockData from "../../../../mockData/mockData";

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

describe("Manage Zone", () => {
  const setIndex = jest.fn();
  const setLoaderStatus = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("test the component for initial render", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const manageZoneSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockData.manageZoneData
          });
        });
      });

    const props = {
      location: {
        pathname: "/manage-zones",
        search: "",
        hash: "",
        state: null,
        key: "r57y9u"
      }
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageZone {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    // /** This actually checks whether the post method is called with proper url and request body */
    expect(manageZoneSpy.mock.calls).toEqual([
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES,
        {
          page: 1,
          pageSize: 10,
          _sort: "name:asc"
        }
      ]
    ]);

    // /** This actually checks whether the post method is called */
    expect(manageZoneSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
