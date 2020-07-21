import React, { useState as useStateMock } from "react";
import { mount } from "enzyme";
import ManageCollege from "../ManageCollege.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";

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
        fromeditCollege: false,
        editedCollegeData: null,
        fromAddCollege: false,
        addedCollegeData: null
      }
    };

    const getManageCollegeSpy = jest
      .spyOn(serviceProviders, "serviceProviderForGetRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: {
              result: [
                {
                  id: 2,
                  name: "Government Leather Institute, Agra",
                  contact: {
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
                    district: {
                      id: 1,
                      name: "Agra",
                      is_active: true,
                      abbreviation: "AG",
                      identifier: null,
                      state: 1,
                      created_at: "2020-06-24T07:09:28.265Z",
                      updated_at: "2020-06-24T07:09:28.265Z"
                    },
                    individual: null,
                    user: null,
                    created_at: "2020-06-24T07:19:43.652Z",
                    updated_at: "2020-07-17T12:33:50.639Z"
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
                  college_code: "GLI34",
                  principal: null,
                  is_blocked: false,
                  created_at: "2020-06-24T07:19:43.643Z",
                  updated_at: "2020-07-17T12:33:50.578Z",
                  stream_strength: [
                    {
                      id: 8,
                      stream: {
                        id: 1,
                        name: "Mechanical Engineering (Production)",
                        created_at: "2020-06-24T07:09:35.408Z",
                        updated_at: "2020-06-24T07:09:35.408Z"
                      },
                      first_year_strength: 0,
                      second_year_strength: 0,
                      third_year_strength: 0
                    },
                    {
                      id: 9,
                      stream: {
                        id: 2,
                        name: "Computer Science And Engineering",
                        created_at: "2020-06-24T07:09:35.414Z",
                        updated_at: "2020-06-24T07:09:35.414Z"
                      },
                      first_year_strength: 0,
                      second_year_strength: 0,
                      third_year_strength: 0
                    }
                  ],
                  tpos: []
                }
              ]
            }
          });
        });
      });

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageCollege {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );

    /** This actually checks whether the post method is called with proper url and request body */
    expect(getManageCollegeSpy.mock.calls).toEqual([
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES,
        {
          _sort: "name:asc",
          page: 1,
          pageSize: 10
        }
      ],
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES,
        {
          pageSize: -1
        }
      ]
    ]);

    /** This actually checks whether the post method is called */
    expect(getManageCollegeSpy).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it("Should check Manage Event page for medha admin when data is edited", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/manage-college",
        fromeditCollege: true,
        isDataEdited: true,
        editedCollegeData: {
          result: {
            name: "Government Leather Institute, Agra",
            phone: "0356273401",
            email: "collegeemail2@gmail.com",
            state: 1,
            address_1: "UP",
            district: 1,
            organization: 2,
            contact_type: "organization",
            updated_at: "2020-07-17T12:33:50.639Z",
            id: 3,
            phone_other: null,
            email_other: null,
            address_2: null,
            city: null,
            pincode: null,
            country: null,
            village: null,
            individual: null,
            user: null,
            created_at: "2020-06-24T07:19:43.652Z"
          }
        },
        editResponseMessage: "",
        editedData: {},
        search: "",
        hash: "",
        key: "pntku5"
      }
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageCollege {...props} />
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
        pathname: "/manage-college",
        fromAddCollege: true,
        isDataAdded: true,
        addedCollegeData: {
          result: {
            name: "Zila Parishad Agriculture College",
            phone: "9087654786",
            email: "yogesh@gmail.com",
            state: 1,
            address_1: "asdccc",
            district: 50,
            organization: 3,
            contact_type: "organization",
            updated_at: "2020-07-17T12:35:44.460Z",
            created_at: "2020-07-17T12:35:44.460Z",
            id: 47,
            phone_other: null,
            email_other: null,
            address_2: null,
            city: null,
            pincode: null,
            country: null,
            village: null,
            individual: null,
            user: null
          }
        },
        addResponseMessage: "",
        addedData: {},
        search: "",
        hash: "",
        key: "ae18eq"
      }
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <SetIndexContext.Provider value={{ setIndex }}>
          <Router>
            <ManageCollege {...props} />
          </Router>
        </SetIndexContext.Provider>
      </LoaderContext.Provider>
    );
    wrapper.unmount();
  });

  // it("Should check Manage Event page for medha admin for rendering table", async () => {
  //   auth.setToken(medhaAdminUser.jwt, true);
  //   auth.setUserInfo(medhaAdminUser.user, true);
  //   let props = {
  //     location: {
  //       fromeditEvent: false,
  //       editedCollegeData: null,
  //       fromAddCollege: false,
  //       addedCollegeData: null
  //     },
  //     testDataToShow: [
  //       {
  //         id: 3,
  //         title: "Test",
  //         start_date_time: "Tue Jul 07 2020",
  //         end_date_time: "Thu Jul 16 2020",
  //         question_set: true,
  //         giveFeedback: true,
  //         editFeedback: false,
  //         cannotGiveFeedback: false,
  //         IsEditable: true
  //       }
  //     ]
  //   };

  //   //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
  //   let wrapper = mount(
  //     <LoaderContext.Provider value={{ setLoaderStatus }}>
  //       <SetIndexContext.Provider value={{ setIndex }}>
  //         <Router>
  //           <ManageCollege {...props} />
  //         </Router>
  //       </SetIndexContext.Provider>
  //     </LoaderContext.Provider>
  //   );

  //   wrapper.unmount();
  // });
});
