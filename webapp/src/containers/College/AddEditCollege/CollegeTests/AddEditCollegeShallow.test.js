import React, { useContext, useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import AddEditCollege from "../AddEditCollege";
import { BrowserRouter as Router } from "react-router-dom";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import auth from "../../../../components/Auth";
import * as collegeData from "../../../../mockData/mockCollegeData";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

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
  console.log(
    "simulateChangeOnAutoInput",
    inputSelector,
    newValue,
    newNameValue
  );
  const input = wrapper.find(inputSelector);
  console.log("input**", input.debug());
  input.simulate(
    "change",

    { newNameValue },
    { id: parseInt(newValue) }
  );
  return wrapper.find(inputSelector);
};

const simulateChangeOnAddressInput = (
  wrapper,
  inputSelector,
  event,
  newValue,
  newNameValue
) => {
  const input = wrapper.find(inputSelector);
  input.simulate("change", {
    persist: jest.fn(),

    target: { value: newValue },
    newNameValue
  });
  return wrapper.find(inputSelector);
};

const simulateChangeOnStateAndDistrictInput = (
  wrapper,
  inputSelector,
  type,
  newValue,
  newNameValue
) => {
  console.log(
    "simulateChangeOnStateAndDistrictInput",
    inputSelector,
    type,
    newValue,
    newNameValue
  );
  const input = wrapper.find(inputSelector);
  input.simulate("change", type, newValue, newNameValue);
  return wrapper.find(inputSelector);
};

describe("test for edit college ", () => {
  it("It has an input field", () => {
    const wrapper = shallow(<AddEditCollege />);
    const input = wrapper.find("#name");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#name",
      "St. john college pf engineering and technology",
      "collegeName"
    );
    expect(updatedNameInput.props().value).toEqual(
      "St. john college pf engineering and technology"
    );
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#college_code",
      "SJCET12",
      "collegeCode"
    );
    expect(updatedNameInput.props().value).toEqual("SJCET12");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditCollege />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#college_email",
      "sject@gmail.com",
      "collegeEmail"
    );
    expect(updatedNameInput.props().value).toEqual("sject@gmail.com");
  });
  it("test for  state field", () => {
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
    const wrapper = shallow(<AddEditCollege stateOption={stateOption} />);

    const updatedNameInput = simulateChangeOnStateAndDistrictInput(
      wrapper,
      "#state",
      "state",
      { id: 1 },
      0
    );
    console.log("valueupdatedNameInput", updatedNameInput.props());
    expect(updatedNameInput.props().value.name).toEqual("Uttar pradesh");
  });
  it("test for  Districct field", () => {
    const districtOption = [
      {
        id: 1,
        name: "Agra"
      },
      {
        id: 2,
        name: "Aligarh"
      }
    ];
    const wrapper = shallow(<AddEditCollege districtOption={districtOption} />);

    const updatedNameInput = simulateChangeOnStateAndDistrictInput(
      wrapper,
      "#district",
      "district",
      { id: 1 },
      0
    );
    console.log("valueupdatedNameInput", updatedNameInput.props());
    expect(updatedNameInput.props().value.name).toEqual("Agra");
  });

  it("test for  zone field", () => {
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
    const wrapper = shallow(<AddEditCollege zoneOption={zoneOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#zone", "1");
    expect(updatedNameInput.props().value.name).toEqual("East Uttar pradesh");
  });

  it("test for  rpc field", () => {
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
    const wrapper = shallow(<AddEditCollege rpcOption={rpcOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#rpc", "1");
    expect(updatedNameInput.props().value.name).toEqual("Agra");
  });

  it("test for  address field", () => {
    const wrapper = shallow(<AddEditCollege />);
    const updatedNameInput = simulateChangeOnAddressInput(
      wrapper,
      "#address",
      0,
      "Palghar",
      "address_line_1"
    );
    expect(updatedNameInput.props().value).toEqual("Palghar");
  });

  it("test for  city field", () => {
    const wrapper = shallow(<AddEditCollege />);
    const updatedNameInput = simulateChangeOnAddressInput(
      wrapper,
      "#city",
      0,
      "Palghar",
      "city"
    );
    expect(updatedNameInput.props().value).toEqual("Palghar");
  });

  it("test for  submit field", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const districtOption = [
      {
        id: 1,
        name: "Agra"
      },
      {
        id: 2,
        name: "Aligarh"
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
    const wrapper = shallow(
      <AddEditCollege
        stateOption={stateOption}
        zoneOption={zoneOption}
        rpcOption={rpcOption}
        districtOption={districtOption}
        isCollegeAdmin={true}
      />
    );
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#name",
      "St. john college pf engineering and technology",
      "collegeName"
    );
    expect(updatedNameInput.props().value).toEqual(
      "St. john college pf engineering and technology"
    );
    const updatedNumberInput = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7977069203",
      "contactNumber"
    );
    expect(updatedNumberInput.props().value).toEqual("7977069203");

    const updatedCollegeCodeInput = simulateChangeOnInput(
      wrapper,
      "#college_code",
      "SJCET12",
      "collegeCode"
    );
    expect(updatedCollegeCodeInput.props().value).toEqual("SJCET12");
    const updatedNameStateInput = simulateChangeOnStateAndDistrictInput(
      wrapper,
      "#state",
      "state",
      { id: 1 },
      0
    );
    expect(updatedNameStateInput.props().value.name).toEqual("Uttar pradesh");
    const updatedZoneInput = simulateChangeOnAutoInput(wrapper, "#zone", "1");
    console.log("zonechange", updatedZoneInput.props());
    expect(updatedZoneInput.props().value.name).toEqual("East Uttar pradesh");
    const updatedRpcInput = simulateChangeOnAutoInput(wrapper, "#rpc", "1");
    expect(updatedRpcInput.props().value.name).toEqual("Agra");
    const updatedNameAddressInput = simulateChangeOnAddressInput(
      wrapper,
      "#address",
      0,
      "Palghar",
      "address_line_1"
    );
    expect(updatedNameAddressInput.props().value).toEqual("Palghar");
    const updatedNamePincodeInput = simulateChangeOnAddressInput(
      wrapper,
      "#pincode",
      0,
      "401101",
      "pincode"
    );
    expect(updatedNamePincodeInput.props().value).toEqual("401101");
    const updatedNameCityInput = simulateChangeOnAddressInput(
      wrapper,
      "#city",
      0,
      "Palghar",
      "city"
    );
    expect(updatedNameCityInput.props().value).toEqual("Palghar");

    const updatedNameDistrictInput = simulateChangeOnStateAndDistrictInput(
      wrapper,
      "#district",
      "district",
      { id: 1 },
      0
    );
    console.log("valueupdatedNameInput", updatedNameDistrictInput.props());
    expect(updatedNameDistrictInput.props().value.name).toEqual("Agra");
    // const abc = wrapper.find("#zone-label");
    // console.log("debudZone", abc.debug());
    // const updatedZoneInput = simulateChangeOnAutoInput(wrapper, "#zone", "1");
    // console.log("zonechange", updatedZoneInput.props());
    // expect(updatedZoneInput.props().value.name).toEqual("East Uttar pradesh");
    // const updatedRpcInput = simulateChangeOnAutoInput(wrapper, "#rpc", "1");
    // expect(updatedRpcInput.props().value.name).toEqual("Agra");

    const updatedEmailInput = simulateChangeOnInput(
      wrapper,
      "#college_email",
      "sject@gmail.com",
      "collegeEmail"
    );
    expect(updatedEmailInput.props().value).toEqual("sject@gmail.com");

    const mockDataRequest = {
      addresses: [
        {
          address_line_1: "Palghar",
          address_type: "Permanent",
          city: "Palghar",
          district: 1,
          pincode: "401101",
          state: 1
        }
      ],
      college_code: "SJCET12",
      district: null,
      email: "sject@gmail.com",
      is_blocked: false,
      name: "St. john college pf engineering and technology",
      phone: "7977069203",
      principal: null,
      rpc: 1,
      state: null,
      stream_strength: [],
      tpos: [],
      zone: 1
    };
    wrapper.find("#submit").simulate("click", {
      preventDefault: jest.fn()
    });
    expect(postSpy).toBeCalled();

    expect(postSpy).toBeCalledWith(
      `${
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ADD_COLLEGE
      }`,
      expect.objectContaining(mockDataRequest)
    );
  });

  it("It has an input field", () => {
    const dataForEdit = collegeData.editCollegeData;

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

    const wrapper = shallow(
      <AddEditCollege
        dataForEdit={dataForEdit}
        editCollege={true}
        counter={0}
        collegeOption={collegeOption}
        rpcOption={rpcOption}
        option={option}
        stateOption={stateOption}
        zoneOption={zoneOption}
      />
    );

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPutRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: "data" });
        });
      });
    wrapper.find("#submit").simulate("click", {
      preventDefault: jest.fn()
    });
    console.log("POSTSPYCOLLEGE", postSpy.mock.calls);
    expect(postSpy).toBeCalled();

    expect(postSpy).toBeCalledWith(
      strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_CONTACT_URL,
      2,
      {
        addresses: [
          {
            address_line_1: "Mainpuri",
            address_line_2: null,
            address_type: "Permanent",
            city: "manipuri",
            contact: 2,
            country: null,
            created_at: "2020-07-22T15:15:08.066Z",
            district: 3,
            id: 1,
            pincode: "401111",
            state: 1,
            updated_at: "2020-07-22T15:15:08.066Z"
          }
        ],
        college_code: "GPM23",
        district: null,
        email: "collegeemail1@gmail.com",
        is_blocked: false,
        name: "Government Polytechnic, Mainpuri",
        phone: "0356273400",
        principal: 2,
        rpc: 1,
        state: null,
        stream_strength: [
          {
            first_year_strength: 0,
            second_year_strength: 0,
            stream: 2,
            third_year_strength: 0
          },
          {
            first_year_strength: 0,
            second_year_strength: 0,
            stream: 1,
            third_year_strength: 0
          },
          {
            first_year_strength: 0,
            second_year_strength: 0,
            stream: 3,
            third_year_strength: 0
          }
        ],
        tpos: [],
        zone: 1
      },
      "edit-organization"
    );
  });
});
