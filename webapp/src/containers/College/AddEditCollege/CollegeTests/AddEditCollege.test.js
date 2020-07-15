import React, { useContext, useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import AddEditCollege from "../AddEditCollege";
import auth from "../../../../components/Auth";
import { BrowserRouter as Router } from "react-router-dom";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("test for edit college ", () => {
  const setLoaderStatus = jest.fn();
  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setLoaderStatus]);
  });
  it("mount test", () => {
    const dataForEdit = {
      name: "SJCET",
      college_code: "SJ12",
      contact: {
        address_1: "Palghar",
        email: "sjcet@gmail.com",
        contact: {
          state: {
            id: 1
          },
          district: {
            id: 1
          }
        }
      },
      blocked: true,
      zone: {
        id: 1
      },
      rpc: {
        id: 1
      },
      stream_strength: [
        {
          first_year_strength: 0,
          second_year_strength: 0,
          id: 4,
          third_year_strength: 0,
          stream: {
            id: 1,
            name: "Mechanical Engineering (Production)"
          }
        },

        {
          first_year_strength: 0,
          second_year_strength: 0,
          id: 5,
          third_year_strength: 0,
          stream: {
            id: 2,
            name: "Computer Science And Engineering"
          }
        }
      ],
      principal: {
        contact: {
          user: "Mayank"
        }
      }
    };

    const zoneOption = [
      {
        id: 1,
        name: "East Uttar pradesh"
      },
      {
        id: 2,
        name: "West Uttar pradesh"
      },
      {
        id: 3,
        name: "central Uttar pradesh"
      }
    ];
    const stateOption = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];
    const option = [
      {
        id: 6,
        name: "College Admin"
      },
      {
        id: 9,
        name: "Department Admin"
      },
      {
        id: 8,
        name: "Medha Admin"
      },
      {
        id: 4,
        name: "Zonal Admin"
      }
    ];
    const rpcOption = [
      {
        id: 1,
        name: "Agra"
      },
      {
        id: 2,
        name: "Bareilly"
      }
    ];
    const collegeOption = [
      {
        id: 1,
        name: "St. John college of engineering"
      },
      {
        id: 2,
        name: "Mithibai college"
      }
    ];

    const wrapper = mount(
      <Router>
        {" "}
        <LoaderContext.Provider value={{ setLoaderStatus }}>
          <AddEditCollege
            dataForEdit={dataForEdit}
            editCollege={true}
            counter={0}
            collegeOption={collegeOption}
            rpcOption={rpcOption}
            option={option}
            stateOption={stateOption}
            zoneOption={zoneOption}
          />{" "}
        </LoaderContext.Provider>
      </Router>
    );
    wrapper.unmount();
  });

  it("Should check Manage User page for medha admin", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        fromeditUser: false,
        editedUserName: null,
        fromAddUser: false,
        addedUserName: null
      }
    };

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

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = mount(
      <LoaderContext.Provider value={{ setLoaderStatus }}>
        <Router>
          <AddEditCollege {...props} />
        </Router>
      </LoaderContext.Provider>
    );
    /** This actually checks whether the post method is called with proper url and request body */
    expect(getStatusOfDashboardSpy.mock.calls).toEqual([
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES,
        {
          name_contains: "Uttar Pradesh"
        }
      ],
      [
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS,
        {
          pageSize: -1
        }
      ],
      ["https://medha-devlopment.wastaging.com/streams", { pageSize: -1 }]
    ]);

    // /** This actually checks whether the post method is called */
    expect(getStatusOfDashboardSpy).toHaveBeenCalledTimes(3);
    wrapper.unmount();
  });
});
