import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import ManageEvent from "../ManageEvent.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as eventData from "../mockData/EventData.json";
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
  const setYearData = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setIndex]);
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });

  it("Should check Manage Event page for medha admin", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        fromeditEvent: false,
        editedEventData: null,
        fromAddEvent: false,
        addedEventData: null
      }
    };

    const getManageUserSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: eventData
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageEvent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getManageUserSpy.mock.calls).toEqual([
      [
        process.env.REACT_APP_SERVER_URL + "events",
        {
          _sort: "title:asc",
          page: 1,
          pageSize: 10
        }
      ]
    ]);

    /** This actually checks whether the post method is called */
    expect(getManageUserSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("Should check Manage Event page for medha admin when data is edited", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/manage-events",
        fromeditEvent: true,
        isDataEdited: true,
        editedEventData: {
          id: 3,
          title: "Test",
          start_date_time: "2020-07-07T09:48:20.995Z",
          end_date_time: "2020-07-16T09:48:00.000Z",
          address: "UP",
          description: "<p>Test</p>\n",
          question_set: {
            id: 2,
            name: "Event Question Set",
            created_at: "2020-06-24T07:09:37.097Z",
            updated_at: "2020-06-24T07:09:37.097Z"
          },
          state: {
            id: 1,
            name: "Uttar Pradesh",
            is_active: true,
            abbreviation: "UP",
            identifier: "",
            country: 1,
            created_at: "2020-06-24T07:09:28.252Z",
            updated_at: "2020-06-24T07:09:28.252Z"
          },
          zone: {
            id: 1,
            name: "West Zone - Daurala (Meerut)",
            state: 1,
            created_at: "2020-06-24T07:09:35.322Z",
            updated_at: "2020-06-24T07:09:35.322Z"
          },
          rpc: {
            id: 1,
            name: "Agra",
            state: 1,
            main_college: 3,
            created_at: "2020-06-24T07:09:35.351Z",
            updated_at: "2020-06-24T08:50:17.773Z"
          },
          created_at: "2020-07-07T09:51:26.400Z",
          updated_at: "2020-07-15T06:26:54.263Z",
          qualifications: [
            {
              id: 14,
              qualification: "secondary",
              percentage: 70
            }
          ],
          educations: [
            {
              id: 4,
              education_year: "First",
              percentage: 70
            }
          ],
          upload_logo: null,
          streams: [],
          contacts: [
            {
              id: 2,
              name: "Government Polytechnic, Mainpuri",
              phone: "0356273400",
              phone_other: null,
              email: "collegeemail1@gmail.com",
              email_other: null,
              address_1: "UP",
              address_2: null,
              city: null,
              pincode: null,
              contact_type: "organization",
              organization: 1,
              country: null,
              village: null,
              state: 1,
              district: 49,
              individual: null,
              user: null,
              created_at: "2020-06-24T07:18:46.694Z",
              updated_at: "2020-06-24T07:18:46.694Z"
            },
            {
              id: 3,
              name: "Government Leather Institute, Agra",
              phone: "0356273401",
              phone_other: null,
              email: "collegeemail2@gmail.com",
              email_other: null,
              address_1: "UP",
              address_2: null,
              city: null,
              pincode: null,
              contact_type: "organization",
              organization: 2,
              country: null,
              village: null,
              state: 1,
              district: 1,
              individual: null,
              user: null,
              created_at: "2020-06-24T07:19:43.652Z",
              updated_at: "2020-06-24T07:19:43.652Z"
            }
          ]
        },
        addResponseMessage: "",
        editedData: {},
        search: "",
        hash: "",
        key: "4d5n3c"
      }
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageEvent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    wrapper.unmount();
  });

  it("Should check Manage Event page for medha admin when data is added", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/manage-events",
        fromAddEvent: true,
        isDataAdded: true,
        addedEventData: {
          id: 4,
          title: "test",
          start_date_time: "2020-07-15T06:32:05.081Z",
          end_date_time: "2020-07-24T06:32:00.000Z",
          address: "test",
          description: "<p>test</p>\n",
          question_set: {
            id: 2,
            name: "Event Question Set",
            created_at: "2020-06-24T07:09:37.097Z",
            updated_at: "2020-06-24T07:09:37.097Z"
          },
          state: {
            id: 1,
            name: "Uttar Pradesh",
            is_active: true,
            abbreviation: "UP",
            identifier: "",
            country: 1,
            created_at: "2020-06-24T07:09:28.252Z",
            updated_at: "2020-06-24T07:09:28.252Z"
          },
          zone: null,
          rpc: null,
          created_at: "2020-07-15T06:32:37.422Z",
          updated_at: "2020-07-15T06:32:37.438Z",
          qualifications: [],
          educations: [],
          upload_logo: null,
          streams: [],
          contacts: []
        },
        addResponseMessage: "",
        addedData: {},
        search: "",
        hash: "",
        key: "9373ir"
      }
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageEvent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    wrapper.unmount();
  });

  it("Should check Manage Event page for medha admin for rendering table", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        fromeditEvent: false,
        editedEventData: null,
        fromAddEvent: false,
        addedEventData: null
      },
      testDataToShow: [
        {
          id: 3,
          title: "Test",
          start_date_time: "Tue Jul 07 2020",
          end_date_time: "Thu Jul 16 2020",
          question_set: true,
          giveFeedback: true,
          editFeedback: false,
          cannotGiveFeedback: false,
          IsEditable: true
        }
      ]
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageEvent {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    wrapper.find("#pagination-first-page").at(0).simulate("click", 1);
    wrapper.unmount();
  });
});
