import React from "react";
import { shallow, mount } from "enzyme";
import AddEditRpc from "../AddEditRpc";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

const simulateChangeOnAutoInput = (
  wrapper,
  inputSelector,
  newValue,
  newNameValue
) => {
  const input = wrapper.find(inputSelector);
  input.simulate(
    "change",

    { newNameValue },
    { id: parseInt(newValue) }
  );
  return wrapper.find(inputSelector);
};

describe("testing for zone", () => {
  const simulateChangeOnInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate("change", {
      persist: jest.fn(),
      target: { name: newNameValue, value: newValue }
    });
    return wrapper.find(inputSelector);
  };

  it("It has an input field", () => {
    const wrapper = shallow(<AddEditRpc />);
    const input = wrapper.find("#rpcname");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<AddEditRpc />);

    const updatedNameInput = simulateChangeOnInput(
      abc,
      "#rpcname",
      "maharashtra",
      "rpcName"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });

  it("test for  autocomplete state field", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];
    const wrapper = shallow(<AddEditRpc option={option} />);
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#statename",
      "2"
    );

    expect(updatedNameInput.props().value.name).toEqual("Maharashtra");
  });

  it("test for autocomplete college field", () => {
    const option = [
      {
        id: 1,
        name: "SJCET"
      },
      {
        id: 2,
        name: "Mithibai"
      }
    ];
    const wrapper = shallow(
      <AddEditRpc collegeOption={option} editRpc="true" />
    );

    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#collegename",
      "2"
    );
    expect(updatedNameInput.props().value.name).toEqual("Mithibai");
  });

  it("Test for Edit pre-filled", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];

    const collegeOption = [
      {
        id: 1,
        name: "SJCET"
      },
      {
        id: 2,
        name: "Mithibai"
      }
    ];

    const dataForEdit = {
      name: "Bariely",
      state: {
        id: 1
      },
      main_college: {
        id: 1
      }
    };

    const wrapper = shallow(
      <AddEditRpc
        editRpc={true}
        collegeOption={collegeOption}
        option={option}
        dataForEdit={dataForEdit}
      />
    );
    const input = wrapper.find("#rpcname");
    const selectStateField = wrapper.find("#statename");
    const selectCollegeField = wrapper.find("#collegename");
    expect(input.props().value).toBe("Bariely");
    expect(selectStateField.props().value.name).toBe("Uttar pradesh");
    expect(selectCollegeField.props().value.name).toBe("SJCET");
  });

  it("Test for else condition in Edit pre-filled", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];

    const collegeOption = [
      {
        id: 1,
        name: "SJCET"
      },
      {
        id: 2,
        name: "Mithibai"
      }
    ];

    const dataForEdit = {
      state: {},
      main_college: {}
    };

    const wrapper = shallow(
      <AddEditRpc
        editRpc={true}
        collegeOption={collegeOption}
        option={option}
        dataForEdit={dataForEdit}
      />
    );
    const input = wrapper.find("#rpcname");
    const selectStateField = wrapper.find("#statename");
    const selectCollegeField = wrapper.find("#collegename");
    expect(input.props().value).toBe("");
    expect(selectStateField.props().value).toBe(null);
    expect(selectCollegeField.props().value).toBe(null);
  });

  it("Test for submit api", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];
    const wrapper = shallow(<AddEditRpc option={option} />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#rpcname",
      "maharashtra",
      "rpcName"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");
    const updatedNameAutoInput = simulateChangeOnAutoInput(
      wrapper,
      "#statename",
      "2"
    );

    expect(updatedNameAutoInput.props().value.name).toEqual("Maharashtra");
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });
    const mockDataRequest = {
      main_college: null,
      name: "maharashtra",
      state: 2
    };
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(postSpy).toBeCalled();
    expect(postSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS}`,
      expect.objectContaining(mockDataRequest)
    );
  });
  it("Test for update-API", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];

    const collegeOption = [
      {
        id: 1,
        name: "SJCET"
      },
      {
        id: 2,
        name: "Mithibai"
      }
    ];

    const dataForEdit = {
      id: 2,
      name: "Bariely",
      state: {
        id: 1
      },
      main_college: {
        id: 1
      }
    };

    const wrapper = shallow(
      <AddEditRpc
        editRpc={true}
        collegeOption={collegeOption}
        option={option}
        dataForEdit={dataForEdit}
      />
    );
    const input = wrapper.find("#rpcname");
    const selectStateField = wrapper.find("#statename");
    const selectCollegeField = wrapper.find("#collegename");
    expect(input.props().value).toBe("Bariely");
    expect(selectStateField.props().value.name).toBe("Uttar pradesh");
    expect(selectCollegeField.props().value.name).toBe("SJCET");

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPutRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });
    const mockDataRequest = { main_college: 1, name: "Bariely", state: 1 };
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });

    expect(postSpy).toBeCalled();
    expect(postSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS}`,
      2,
      expect.objectContaining(mockDataRequest)
    );
  });

  it("Test for submit api", () => {
    const option = [
      {
        id: 1,
        name: "Uttar pradesh"
      },
      {
        id: 2,
        name: "Maharashtra"
      }
    ];
    const wrapper = shallow(<AddEditRpc option={option} />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#rpcname",
      "maharashtra",
      "rpcName"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");

    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
  });
  it("MOUNT", () => {
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
    const props = {
      dataForEdit: {
        state: {
          id: 1
        }
      }
    };
    const wrapper = mount(
      <Router>
        <AddEditRpc editRpc={true} {...props} />
      </Router>
    );
    expect(getStatusOfDashboardSpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
        {
          name_contains: "Uttar Pradesh"
        }
      ],
      [
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_STATES +
          "/" +
          "1" +
          "/" +
          strapiApiConstants.STRAPI_ORGANIZATION +
          "/" +
          undefined +
          "/rpc"
      ]
    ]);

    // /** This actually checks whether the post method is called */
    expect(getStatusOfDashboardSpy).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });
});
