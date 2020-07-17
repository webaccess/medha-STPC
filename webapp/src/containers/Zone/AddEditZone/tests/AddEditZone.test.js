import React from "react";
import { shallow, mount } from "enzyme";
import AddEditZone from "../AddEditZone";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

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

  it("test for  autocomplete field", () => {
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
    const wrapper = shallow(<AddEditZone option={option} />);
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#states-filter",
      "2"
    );

    expect(updatedNameInput.props().value.name).toEqual("Maharashtra");
  });

  it("It has an input field", () => {
    const wrapper = shallow(<AddEditZone />);
    const input = wrapper.find("#test");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input", () => {
    const abc = shallow(<AddEditZone />);

    const updatedNameInput = simulateChangeOnInput(
      abc,
      "#test",
      "maharashtra",
      "zoneName"
    );
    expect(updatedNameInput.props().value).toEqual("maharashtra");
  });

  it("test edit preFilled", () => {
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

    const editZone = true;
    // const counter = 0;
    const dataForEdit = {
      name: "West-UP",
      state: {
        id: 1
      }
    };

    const wrapper = shallow(
      <AddEditZone
        editZone={editZone}
        dataForEdit={dataForEdit}
        option={option}
      />
    );

    const input = wrapper.find("#test");
    const selectInput = wrapper.find("#states-filter");
    expect(input.props().value).toBe("West-UP");
    expect(selectInput.props().value.name).toBe("Uttar pradesh");
  });

  it("test edit preFilled forelse statement", () => {
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

    const editZone = true;
    const dataForEdit = {
      name: "West-UP",
      state: {
        id: 1
      }
    };

    const wrapper = shallow(
      <AddEditZone
        editZone={editZone}
        dataForEdit={undefined}
        option={option}
      />
    );

    const input = wrapper.find("#test");
    const selectInput = wrapper.find("#states-filter");
    expect(input.props().value).toBe("");
    expect(selectInput.props().value).toBe(null);
  });

  it("test edit preFilled forelse statement", () => {
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

    const editZone = true;
    const dataForEdit = {
      state: {
        id: 1
      }
    };

    const wrapper = shallow(
      <AddEditZone
        editZone={editZone}
        dataForEdit={dataForEdit}
        option={option}
      />
    );

    const input = wrapper.find("#test");
    const selectInput = wrapper.find("#states-filter");
    expect(input.props().value).toBe("");
    expect(selectInput.props().value.name).toBe("Uttar pradesh");
  });

  it("test edit preFilled forelse statement", () => {
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

    const editZone = true;
    const dataForEdit = {
      name: "West-UP",
      state: {}
    };

    const wrapper = shallow(
      <AddEditZone
        editZone={editZone}
        dataForEdit={dataForEdit}
        option={option}
      />
    );

    const input = wrapper.find("#test");
    const selectInput = wrapper.find("#states-filter");
    expect(input.props().value).toBe("West-UP");
    expect(selectInput.props().value).toBe(null);
  });

  it("submit api test ", () => {
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
    const wrapper = shallow(<AddEditZone option={option} />);

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });

    const updatedNameAutoInput = simulateChangeOnAutoInput(
      wrapper,
      "#states-filter",
      "2"
    );

    expect(updatedNameAutoInput.props().value.name).toEqual("Maharashtra");

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#test",
      "maharashtra",
      "zoneName"
    );
    const mockDataRequest = { name: "maharashtra", state: 2 };
    expect(updatedNameInput.props().value).toEqual("maharashtra");
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(postSpy).toBeCalled();
    expect(postSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES}`,
      expect.objectContaining(mockDataRequest)
    );
  });

  it("submit  test for Update api", () => {
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

    const editZone = true;
    const dataForEdit = {
      id: 2,
      name: "West-UP",
      state: {
        id: 1
      }
    };

    const wrapper = shallow(
      <AddEditZone
        editZone={editZone}
        dataForEdit={dataForEdit}
        option={option}
      />
    );

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPutRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });

    const mockDataRequest = { name: "West-UP", state: 1 };
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(postSpy).toBeCalled();
    expect(postSpy).toBeCalledWith(
      `${strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES}`,
      2,
      expect.objectContaining(mockDataRequest)
    );
  });

  it("click on submit when one field is missing ", () => {
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

    const editZone = true;
    const dataForEdit = {
      id: 2,
      name: "West-UP"
    };

    const wrapper = shallow(
      <AddEditZone
        editZone={editZone}
        dataForEdit={dataForEdit}
        option={option}
      />
    );

    // const postSpy = jest
    //   .spyOn(serviceProviders, "serviceProviderForPutRequest")
    //   .mockImplementation(() => {
    //     return new Promise(resolve => {
    //       return resolve({ data: "data" });
    //     });
    //   });
    wrapper.find("#form").simulate("submit", {
      preventDefault: jest.fn()
    });
    // expect(postSpy).toBeCalled();
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

    const wrapper = mount(
      <Router>
        <AddEditZone />
      </Router>
    );

    console.log("useeffectmount", getStatusOfDashboardSpy.mock.calls);
    /** This actually checks whether the post method is called with proper url and request body */
    expect(getStatusOfDashboardSpy.mock.calls).toEqual([
      [
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
        {
          name_contains: "Uttar Pradesh"
        }
      ]
    ]);

    // /** This actually checks whether the post method is called */
    expect(getStatusOfDashboardSpy).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
