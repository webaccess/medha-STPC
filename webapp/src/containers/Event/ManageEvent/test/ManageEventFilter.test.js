import React from "react";
import { shallow } from "enzyme";
import ManageEvent from "../ManageEvent.js";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Manage Event Filters", () => {
  it("Should check the filters", async () => {
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
        }
      ]
    };

    let wrapper = shallow(<ManageEvent {...props} />);

    /** Testing for manage event event filter */
    wrapper.find("#eventName").simulate("change", {
      persist: jest.fn(),
      target: { value: "Test" }
    });
    expect(wrapper.find("#eventName").props().value).toBe("Test");

    /** Testing for manage event date filter */
    wrapper
      .find("#startDate")
      .simulate(
        "change",
        "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
      );
    expect(wrapper.find("#startDate").props().value).toBe(
      "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
    );

    /** Testing for end date filter */
    /** Testing for manage event date filter */
    wrapper
      .find("#endDate")
      .simulate(
        "change",
        "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
      );
    expect(wrapper.find("#endDate").props().value).toBe(
      "Thu Jul 09 2020 19:43:00 GMT+0530 (India Standard Time)"
    );

    /** This simulates the search filter */
    wrapper.find("#submitFiter").simulate("click", {
      persist: jest.fn()
    });

    /** This simulates the clear filter */
    wrapper.find("#clearFilter").simulate("click", {
      preventDefault: jest.fn()
    });
  });
});
