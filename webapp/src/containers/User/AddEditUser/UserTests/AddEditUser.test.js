import React from "react";
import { shallow } from "enzyme";
import AddEditUser from "../AddEditUser";
import auth from "../../../../components/Auth";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import * as mockData from "../../../../mockData/mockData";
import * as mockUserData from "../../../../mockData/mockUserData";
import * as serviceProviders from "../../../../api/Axios";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("testing for state", () => {
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

  const simulateChangeOnRpcAutoInput = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate(
      "change",

      { newNameValue },
      newValue
    );
    return wrapper.find(inputSelector);
  };

  it("It has an input field", () => {
    const wrapper = shallow(<AddEditUser />);
    const input = wrapper.find("#firstname");
    expect(input.props().value.length).toBe(0);
    expect(input.props().value).toBe("");
  });

  it("change value of input for firstname field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#firstname",
      "mayank",
      "firstname"
    );
    expect(updatedNameInput.props().value).toEqual("mayank");
  });

  it("change value of input for lastname field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "surti",
      "lastname"
    );
    expect(updatedNameInput.props().value).toEqual("surti");
  });

  it("change value of input  for email field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#email",
      "mayank.surti@webaccessglobal.com",
      "email"
    );
    expect(updatedNameInput.props().value).toEqual(
      "mayank.surti@webaccessglobal.com"
    );
  });

  it("change value of input  for contact number field", () => {
    const wrapper = shallow(<AddEditUser />);

    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7897897890",
      "contact"
    );
    expect(updatedNameInput.props().value).toEqual("7897897890");
  });

  it("change value of input  for password field", () => {
    const wrapper = shallow(<AddEditUser />);
    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );
    expect(updatedNameInput.props().value).toEqual("admin1234");
  });

  it("test for  password field type text", () => {
    const wrapper = shallow(<AddEditUser showPassword={true} />);
    const passwordfield = wrapper.find("#password");
    expect(passwordfield.props().type).toEqual("text");
  });

  it("test for  password field type password", () => {
    const wrapper = shallow(<AddEditUser showPassword={false} />);
    const passwordfield = wrapper.find("#password");
    expect(passwordfield.props().type).toEqual("password");
  });

  it("test for  autocomplete field", () => {
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
    const wrapper = shallow(<AddEditUser option={option} />);
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#role", "4");

    expect(updatedNameInput.props().value.name).toEqual("Zonal Admin");
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
    const wrapper = shallow(
      <AddEditUser zoneOption={zoneOption} isZoneBlocked="false" />
    );
    const updatedNameInput = simulateChangeOnAutoInput(wrapper, "#zone", "1");
    expect(updatedNameInput.props().value.name).toEqual("East Uttar pradesh");
  });

  it("test for  college field", () => {
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
      <AddEditUser collegeOption={collegeOption} isCollegeBlocked="false" />
    );
    const updatedNameInput = simulateChangeOnRpcAutoInput(wrapper, "#college", {
      id: 1,
      rpc: {
        id: 1
      },
      zone: {
        id: 1
      }
    });
    expect(updatedNameInput.props().value.name).toEqual(
      "St. John college of engineering"
    );
  });

  it("it should simulate submit form for adding Zonal Admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { user: "test" }
          });
        });
      });
    const props = {
      location: {
        pathname: "/add-user",
        search: "",
        hash: "",
        state: null,
        key: "iaj4ro"
      },
      zoneOption: mockUserData.mockDataForZone,
      collegeOption: mockUserData.mockUserDataForColleges,
      option: mockUserData.mockDataForRoles
    };
    const wrapper = shallow(<AddEditUser {...props} />);
    const updateFirstName = simulateChangeOnInput(
      wrapper,
      "#firstname",
      "test",
      "firstname"
    );
    const updateLastName = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "test",
      "lastname"
    );
    const updateEmail = simulateChangeOnInput(
      wrapper,
      "#email",
      "test@test.com",
      "email"
    );
    const updateContact = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7897897890",
      "contact"
    );
    const updatePassword = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );
    const updateRole = simulateChangeOnAutoInput(wrapper, "#role", "4");
    const updateZone = simulateChangeOnAutoInput(wrapper, "#zone", "1");

    expect(updateFirstName.props().value).toEqual("test");
    expect(updateLastName.props().value).toEqual("test");
    expect(updateEmail.props().value).toEqual("test@test.com");
    expect(updateContact.props().value).toEqual("7897897890");
    expect(updatePassword.props().value).toEqual("admin1234");
    expect(updateRole.props().value.name).toEqual("Zonal Admin");
    expect(updateZone.props().value.name).toEqual(
      "West Zone - Daurala (Meerut)"
    );
    expect(
      wrapper
        .find("#userForm")
        .simulate("submit", { preventDefault: jest.fn() })
    );

    expect(postSpy).toBeCalled();
  });

  it("it should simulate submit form for adding College Admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { user: "test" }
          });
        });
      });
    const props = {
      location: {
        pathname: "/add-user",
        search: "",
        hash: "",
        state: null,
        key: "iaj4ro"
      },
      zoneOption: mockUserData.mockDataForZone,
      collegeOption: mockUserData.mockUserDataForColleges,
      option: mockUserData.mockDataForRoles
    };
    const wrapper = shallow(<AddEditUser {...props} />);
    const updateFirstName = simulateChangeOnInput(
      wrapper,
      "#firstname",
      "test",
      "firstname"
    );
    const updateLastName = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "test",
      "lastname"
    );
    const updateEmail = simulateChangeOnInput(
      wrapper,
      "#email",
      "test@test.com",
      "email"
    );
    const updateContact = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7897897890",
      "contact"
    );
    const updatePassword = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );
    const updateRole = simulateChangeOnAutoInput(wrapper, "#role", "6");
    const updateCollege = wrapper.find("#college");
    updateCollege.simulate(
      "change",
      {},
      {
        id: 2,
        name: "Government Leather Institute, Agra",
        zone: {
          id: 1
        },
        rpc: {
          id: 1
        }
      }
    );

    expect(updateFirstName.props().value).toEqual("test");
    expect(updateLastName.props().value).toEqual("test");
    expect(updateEmail.props().value).toEqual("test@test.com");
    expect(updateContact.props().value).toEqual("7897897890");
    expect(updatePassword.props().value).toEqual("admin1234");
    expect(updateRole.props().value.name).toEqual("College Admin");
    expect(wrapper.find("#college").props().value.name).toEqual(
      "Government Leather Institute, Agra"
    );
    expect(
      wrapper
        .find("#userForm")
        .simulate("submit", { preventDefault: jest.fn() })
    );

    expect(postSpy).toBeCalled();
  });

  it("it should simulate submit form for adding Department Admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { user: "test" }
          });
        });
      });
    const props = {
      location: {
        pathname: "/add-user",
        search: "",
        hash: "",
        state: null,
        key: "iaj4ro"
      },
      zoneOption: mockUserData.mockDataForZone,
      collegeOption: mockUserData.mockUserDataForColleges,
      option: mockUserData.mockDataForRoles
    };
    const wrapper = shallow(<AddEditUser {...props} />);
    const updateFirstName = simulateChangeOnInput(
      wrapper,
      "#firstname",
      "test",
      "firstname"
    );
    const updateLastName = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "test",
      "lastname"
    );
    const updateEmail = simulateChangeOnInput(
      wrapper,
      "#email",
      "test@test.com",
      "email"
    );
    const updateContact = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7897897890",
      "contact"
    );
    const updatePassword = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );
    const updateRole = simulateChangeOnAutoInput(wrapper, "#role", "9");

    expect(updateFirstName.props().value).toEqual("test");
    expect(updateLastName.props().value).toEqual("test");
    expect(updateEmail.props().value).toEqual("test@test.com");
    expect(updateContact.props().value).toEqual("7897897890");
    expect(updatePassword.props().value).toEqual("admin1234");
    expect(updateRole.props().value.name).toEqual("Department Admin");
    expect(
      wrapper
        .find("#userForm")
        .simulate("submit", { preventDefault: jest.fn() })
    );

    expect(postSpy).toBeCalled();
  });

  it("it should simulate submit form for adding Medha Admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: { user: "test" }
          });
        });
      });
    const props = {
      location: {
        pathname: "/add-user",
        search: "",
        hash: "",
        state: null,
        key: "iaj4ro"
      },
      zoneOption: mockUserData.mockDataForZone,
      collegeOption: mockUserData.mockUserDataForColleges,
      option: mockUserData.mockDataForRoles
    };
    const wrapper = shallow(<AddEditUser {...props} />);
    const updateFirstName = simulateChangeOnInput(
      wrapper,
      "#firstname",
      "test",
      "firstname"
    );
    const updateLastName = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "test",
      "lastname"
    );
    const updateEmail = simulateChangeOnInput(
      wrapper,
      "#email",
      "test@test.com",
      "email"
    );
    const updateContact = simulateChangeOnInput(
      wrapper,
      "#contact_number",
      "7897897890",
      "contact"
    );
    const updatePassword = simulateChangeOnInput(
      wrapper,
      "#password",
      "admin1234",
      "password"
    );
    const updateRole = simulateChangeOnAutoInput(wrapper, "#role", "8");

    expect(updateFirstName.props().value).toEqual("test");
    expect(updateLastName.props().value).toEqual("test");
    expect(updateEmail.props().value).toEqual("test@test.com");
    expect(updateContact.props().value).toEqual("7897897890");
    expect(updatePassword.props().value).toEqual("admin1234");
    expect(updateRole.props().value.name).toEqual("Medha Admin");
    expect(
      wrapper
        .find("#userForm")
        .simulate("submit", { preventDefault: jest.fn() })
    );

    expect(postSpy).toBeCalled();
  });

  it("it should simulate various conditions on changing roles and submit incomplete form", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = {
      location: {
        pathname: "/add-user",
        search: "",
        hash: "",
        state: null,
        key: "iaj4ro"
      },
      zoneOption: mockUserData.mockDataForZone,
      collegeOption: mockUserData.mockUserDataForColleges,
      option: mockUserData.mockDataForRoles
    };
    const wrapper = shallow(<AddEditUser {...props} />);

    const updateRoleCollegeAdmin = simulateChangeOnAutoInput(
      wrapper,
      "#role",
      "6"
    );
    expect(updateRoleCollegeAdmin.props().value.name).toEqual("College Admin");
    const updateRoleMedhaAdmin = simulateChangeOnAutoInput(
      wrapper,
      "#role",
      "9"
    );
    expect(updateRoleMedhaAdmin.props().value.name).toEqual("Department Admin");
    const updateRoleDepartmentAdmin = simulateChangeOnAutoInput(
      wrapper,
      "#role",
      "8"
    );
    expect(updateRoleDepartmentAdmin.props().value.name).toEqual("Medha Admin");
    const updateRoleZonalAdmin = simulateChangeOnAutoInput(
      wrapper,
      "#role",
      "4"
    );
    expect(updateRoleZonalAdmin.props().value.name).toEqual("Zonal Admin");
    expect(
      wrapper
        .find("#userForm")
        .simulate("submit", { preventDefault: jest.fn() })
    );
  });

  it("it should simulate edit college admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = mockUserData.mocKLocationDataForEditCollegeAdmin;
    props.zoneOption = mockUserData.mockDataForZone;
    props.collegeOption = mockUserData.mockUserDataForColleges;
    props.option = mockUserData.mockDataForRoles;
    shallow(<AddEditUser {...props} />);
  });

  it("it should simulate edit zonal admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = mockUserData.mockLocationDataForZonalAdmin;
    props.zoneOption = mockUserData.mockDataForZone;
    props.collegeOption = mockUserData.mockUserDataForColleges;
    props.option = mockUserData.mockDataForRoles;
    shallow(<AddEditUser {...props} />);
  });

  it("it should simulate edit medha admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = mockUserData.mockLocationDataForMedhaAdmin;
    props.zoneOption = mockUserData.mockDataForZone;
    props.collegeOption = mockUserData.mockUserDataForColleges;
    props.option = mockUserData.mockDataForRoles;
    shallow(<AddEditUser {...props} />);
  });

  it("it should simulate edit Department admin", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = mockUserData.mockLocationDataForDepartmentAdmin;
    props.zoneOption = mockUserData.mockDataForZone;
    props.collegeOption = mockUserData.mockUserDataForColleges;
    props.option = mockUserData.mockDataForRoles;
    shallow(<AddEditUser {...props} />);
  });

  it("it should simulate edit Student", () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    const props = mockUserData.mockLocationDataForStudent;
    props.zoneOption = mockUserData.mockDataForZone;
    props.collegeOption = mockUserData.mockUserDataForColleges;
    props.option = mockUserData.mockRoleForStudent;
    shallow(<AddEditUser {...props} />);
  });
});
