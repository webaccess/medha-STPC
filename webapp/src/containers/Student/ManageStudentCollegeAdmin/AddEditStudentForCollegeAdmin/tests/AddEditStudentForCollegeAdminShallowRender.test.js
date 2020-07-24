import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import AddEditStudentForCollegeAdmin from "../AddEditStudentForCollegeAdmin.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../../components/Auth";
import * as serviceProviders from "../../../../../api/Axios";
import * as collegeAdminUser from "../../../../../mockuser/CollegeAdmin.json";
import * as strapiConstants from "../../../../../constants/StrapiApiConstants";
import axios from "axios";
import * as mockData from "../../../../../mockData/mockData.js";
import * as mockStateData from "../../../../../mockData/mockStateData.js";
import * as mockCollegeData from "../../../../../mockData/mockCollegeData.js";
import * as mockDistrictData from "../../../../../mockData/mockDistrictData.js";
import * as mockStudentFromCollege from "../../../../../mockData/mockStudentFromCollegeAdmin";
import * as strapiApiConstants from "../../../../../constants/StrapiApiConstants.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Add Edit Student from College Admin simulate field changes", () => {
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

  const simulateChangeOnAutoInput2 = (
    wrapper,
    inputSelector,
    newValue,
    newNameValue
  ) => {
    const input = wrapper.find(inputSelector);
    input.simulate(
      "change",

      { newNameValue },
      { id: newValue }
    );
    return wrapper.find(inputSelector);
  };

  it("Should check add student fields from college admin", () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let streamsArray = [];
    for (let i in auth.getUserInfo().studentInfo.organization.stream_strength) {
      streamsArray.push(
        auth.getUserInfo().studentInfo.organization.stream_strength[i]["stream"]
      );
    }
    let props = {
      location: {
        pathname: "/college-add-student",
        addStudent: true,
        search: "",
        hash: "",
        key: "i4x4y5"
      },
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTestingDate: true
    };
    let wrapper = shallow(<AddEditStudentForCollegeAdmin {...props} />);

    const updateFirstName = simulateChangeOnInput(
      wrapper,
      "#firstName",
      "Test Student",
      "firstname"
    );
    const updateMiddleName = simulateChangeOnInput(
      wrapper,
      "#middlename",
      "Test Middle Name",
      "middlename"
    );
    const updateLastName = simulateChangeOnInput(
      wrapper,
      "#lastname",
      "Test Last Name",
      "lastname"
    );
    const updateFatherName = simulateChangeOnInput(
      wrapper,
      "#fatherFullName",
      "Test father name",
      "fatherFullName"
    );
    const updateMotherName = simulateChangeOnInput(
      wrapper,
      "#motherFullName",
      "Test Mother name",
      "motherFullName"
    );

    const updateDate = wrapper.find("#date-picker-inline");
    updateDate.simulate("change", new Date());

    const updateGender = simulateChangeOnAutoInput2(
      wrapper,
      "#gender-filter",
      "male"
    );

    const updateContact = simulateChangeOnInput(
      wrapper,
      "#contact",
      "0123456745",
      "contact"
    );

    const updatePhysicallyHandicapped = simulateChangeOnAutoInput2(
      wrapper,
      "#physically-handicapped-id",
      true
    );

    const updateEmail = simulateChangeOnInput(
      wrapper,
      "#email",
      "abc@abc.com",
      "email"
    );

    const updateCollege = simulateChangeOnAutoInput(
      wrapper,
      "#college-filter",
      "1"
    );

    const updateStream = simulateChangeOnAutoInput(
      wrapper,
      "#stream-filter",
      "1"
    );

    const updateRollNumber = simulateChangeOnInput(
      wrapper,
      "#rollnumber",
      "AB2345",
      "rollnumber"
    );

    const updatePassword = simulateChangeOnInput(
      wrapper,
      "#password",
      "abc1234",
      "password"
    );

    // const updateFuture = wrapper.find("#futureAspirations");
    // updateFuture.simulate(
    //   "change",
    //   {},
    //   {
    //     id: 1,
    //     name: "Private Jobs"
    //   }
    // );

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentFromCollege.mockStudentAddResponse
          });
        });
      });

    wrapper.find("#submit").simulate("click", {
      preventDefault: jest.fn()
    });

    //expect(postSpy).toBeCalled();
    // expect(updateFuture.props().value.name).toEqual("Private Jobs");
    expect(updatePassword.props().value).toEqual("abc1234");
    expect(updateRollNumber.props().value).toEqual("AB2345");
    expect(updateCollege.props().value.name).toEqual(
      "Government Polytechnic, Mainpuri"
    );
    expect(updateStream.props().value.name).toEqual(
      "Mechanical Engineering (Production)"
    );
    expect(updateEmail.props().value).toEqual("abc@abc.com");
    expect(updatePhysicallyHandicapped.props().value.name).toEqual("Yes");
    expect(updateContact.props().value).toEqual("0123456745");
    expect(updateGender.props().value.name).toEqual("Male");
    expect(updateFirstName.props().value).toEqual("Test Student");
    expect(updateMiddleName.props().value).toEqual("Test Middle Name");
    expect(updateLastName.props().value).toEqual("Test Last Name");
    expect(updateFatherName.props().value).toEqual("Test father name");
    expect(updateMotherName.props().value).toEqual("Test Mother name");
  });

  it("Should check add student fields from college admin using save and next", () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let streamsArray = [];
    for (let i in auth.getUserInfo().studentInfo.organization.stream_strength) {
      streamsArray.push(
        auth.getUserInfo().studentInfo.organization.stream_strength[i]["stream"]
      );
    }
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin,
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTestingDate: true
    };

    let wrapper = shallow(<AddEditStudentForCollegeAdmin {...props} />);

    const updateFuture = wrapper.find("#futureAspirations");
    updateFuture.simulate(
      "change",
      {},
      {
        id: 1,
        name: "Private Jobs"
      }
    );
    wrapper.find("#submitandnext").simulate("click", {
      preventDefault: jest.fn()
    });

    // expect(updateFuture.props().value.name).toEqual("Private Jobs");
  });

  it("Should when state is selected and the removed", () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let streamsArray = [];
    for (let i in auth.getUserInfo().studentInfo.organization.stream_strength) {
      streamsArray.push(
        auth.getUserInfo().studentInfo.organization.stream_strength[i]["stream"]
      );
    }
    let props = {
      location: {
        pathname: "/college-add-student",
        addStudent: true,
        search: "",
        hash: "",
        key: "i4x4y5"
      },
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTestingDate: true
    };
    let wrapper = shallow(<AddEditStudentForCollegeAdmin {...props} />);
  });

  it(" rejects for edit", () => {
    auth.setToken(collegeAdminUser.jwt, true);
    auth.setUserInfo(collegeAdminUser.user, true);
    let streamsArray = [];
    for (let i in auth.getUserInfo().studentInfo.organization.stream_strength) {
      streamsArray.push(
        auth.getUserInfo().studentInfo.organization.stream_strength[i]["stream"]
      );
    }
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin,
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTestingDate: true
    };

    let wrapper = shallow(<AddEditStudentForCollegeAdmin {...props} />);

    const updateFuture = wrapper.find("#futureAspirations");
    updateFuture.simulate(
      "change",
      {},
      {
        id: 1,
        name: "Private Jobs"
      }
    );
    wrapper.find("#submitandnext").simulate("click", {
      preventDefault: jest.fn()
    });

    // expect(updateFuture.props().value.name).toEqual("Private Jobs");
  });
});
