import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import ViewEvent from "../ViewEvent.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as eventDataForMedhaAdmin from "../mockData/eventDataForMedhaAdmin.json";
import * as registeredEvent from "../mockData/registeredEventResponse.json";

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
        pathname: "/view-event",
        dataForView: "4",
        search: "",
        hash: "",
        key: "za6u4i"
      }
    };

    const getViewEventSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetOneRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: eventDataForMedhaAdmin
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ViewEvent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getViewEventSpy.mock.calls).toEqual([
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS, "4"]
    ]);

    /** This actually checks whether the post method is called */
    expect(getViewEventSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("Should check Manage Event page for medha admin", async () => {
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    let props = {
      location: {
        pathname: "/view-event",
        dataForView: "4",
        search: "",
        hash: "",
        key: "za6u4i"
      }
    };

    const getViewEventSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetOneRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: eventDataForMedhaAdmin
          });
        });
      });

    const getViewEventSpy2 = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: registeredEvent
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ViewEvent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getViewEventSpy.mock.calls).toEqual([
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS, "4"],
      [strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS, "4"]
    ]);

    expect(getViewEventSpy2.mock.calls).toEqual([
      [
        strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACT_URL +
          "/" +
          auth.getUserInfo().studentInfo.contact.id +
          "/get-individual-registered-events"
      ]
    ]);

    /** This actually checks whether the post method is called */
    expect(getViewEventSpy).toHaveBeenCalledTimes(2);
    expect(getViewEventSpy2).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });
});
