import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import AddEditStudent from "../AddEditStudent.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../components/Auth";
import * as serviceProviders from "../../../api/Axios";
import * as student from "../../../mockuser/StudentUser.json";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import axios from "axios";
import * as mockData from "../../../mockData/mockData.js";
import * as mockStateData from "../../../mockData/mockStateData.js";
import * as mockCollegeData from "../../../mockData/mockCollegeData.js";
import * as mockDistrictData from "../../../mockData/mockDistrictData.js";
import * as mockStudentFromCollege from "../../../mockData/mockStudentFromCollegeAdmin";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Add Edit Student simulate field changes", () => {
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

  it("Should check student registration", () => {
    let props = {
      location: {
        pathname: "/registration",
        search: "",
        hash: "",
        state: {
          otp: "888346",
          contactNumber: "0123454321",
          from: "/verifyotp"
        },
        key: "djqm1l"
      },
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockCollegeData: mockCollegeData.mockCollegeListWithStreams,
      mockCollegeStreamList: mockCollegeData.streamsList,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTesting: true
    };
    let wrapper = shallow(<AddEditStudent {...props} />);

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
    const updateAddress = simulateChangeOnInput(
      wrapper,
      "#address",
      "test address",
      "address"
    );
    const updateState = simulateChangeOnAutoInput(
      wrapper,
      "#states-filter",
      "1"
    );
    const updateDistrict = simulateChangeOnAutoInput(
      wrapper,
      "#district-filter",
      "1"
    );
    const updateDate = wrapper.find("#date-picker-inline");
    updateDate.simulate("change", new Date());

    const updateGender = simulateChangeOnAutoInput2(
      wrapper,
      "#gender-filter",
      "male"
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

    const postSpy = jest.spyOn(axios, "post").mockImplementation(() => {
      return new Promise(resolve => {
        return resolve({
          data: mockStudentFromCollege.mockStudentAddResponse
        });
      });
    });

    wrapper.find("#submit").simulate("click", {
      preventDefault: jest.fn()
    });

    expect(postSpy).toBeCalled();
    // expect(updateFuture.props().value.name).toEqual("Private Jobs");
    expect(updatePassword.props().value).toEqual("abc1234");
    expect(updateRollNumber.props().value).toEqual("AB2345");
    expect(updateCollege.props().value.name).toEqual(
      "Government Polytechnic, Mainpuri"
    );
    expect(updateStream.props().value.id).toEqual(1);
    expect(updateEmail.props().value).toEqual("abc@abc.com");
    expect(updatePhysicallyHandicapped.props().value.name).toEqual("Yes");
    expect(updateGender.props().value.name).toEqual("Male");
    expect(updateDistrict.props().value.name).toEqual("Agra");
    expect(updateState.props().value.name).toEqual("Uttar Pradesh");
    expect(updateFirstName.props().value).toEqual("Test Student");
    expect(updateMiddleName.props().value).toEqual("Test Middle Name");
    expect(updateLastName.props().value).toEqual("Test Last Name");
    expect(updateFatherName.props().value).toEqual("Test father name");
    expect(updateMotherName.props().value).toEqual("Test Mother name");
    expect(updateAddress.props().value).toEqual("test address");
  });

  it(" should check for save and next for edit student", () => {
    auth.setToken(student.jwt, true);
    auth.setUserInfo(student.user, true);
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin,
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockCollegeData: mockCollegeData.mockCollegeListWithStreams,
      mockCollegeStreamList: mockCollegeData.streamsList,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTesting: true
    };

    let wrapper = shallow(<AddEditStudent {...props} />);
    const updateFuture = wrapper.find("#futureAspirations");
    updateFuture.simulate("change", {}, [
      {
        id: 1,
        name: "Private Jobs"
      }
    ]);
    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPutRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({
            data: mockStudentFromCollege.mockStudentAddResponse
          });
        });
      });

    wrapper.find("#submitandnext").simulate("click", {
      preventDefault: jest.fn()
    });

    expect(postSpy).toBeCalled();
  });

  it("Should when state is selected and the removed", () => {
    auth.setToken(student.jwt, true);
    auth.setUserInfo(student.user, true);
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin,
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockCollegeData: mockCollegeData.mockCollegeListWithStreams,
      mockCollegeStreamList: mockCollegeData.streamsList,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTesting: true
    };
    let wrapper = shallow(<AddEditStudent {...props} />);

    simulateChangeOnAutoInput(wrapper, "#states-filter", "1");

    wrapper.find("#states-filter").simulate("change", {}, null);
  });

  it(" should check for error while submitting form", () => {
    auth.setToken(student.jwt, true);
    auth.setUserInfo(student.user, true);
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin,
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockCollegeData: mockCollegeData.mockCollegeListWithStreams,
      mockCollegeStreamList: mockCollegeData.streamsList,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTesting: true
    };

    let wrapper = shallow(<AddEditStudent {...props} />);

    const updateFuture = wrapper.find("#futureAspirations");
    updateFuture.simulate("change", {}, [
      {
        id: 1,
        name: "Private Jobs"
      }
    ]);

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPutRequest")
      .mockImplementation(() => {
        return new Promise((resolve, reject) => {
          return reject("error");
        });
      });

    wrapper.find("#submitandnext").simulate("click", {
      preventDefault: jest.fn()
    });

    expect(postSpy).toBeCalled();
    // expect(updateFuture.props().value.name).toEqual("Private Jobs");
  });

  it(" should check for incomplete form", () => {
    auth.setToken(student.jwt, true);
    auth.setUserInfo(student.user, true);
    let props = {
      location:
        mockStudentFromCollege.mockLocationDataForEditStudentFromCollegeAdmin,
      mockStateList: mockStateData.mockStateDataForStudentRegistration,
      mockdistrictList: mockDistrictData.mockDistrictData,
      mockCollegeData: mockCollegeData.mockCollegeListWithStreams,
      mockCollegeStreamList: mockCollegeData.streamsList,
      mockstreamList: mockCollegeData.streamsList,
      mockFutureAspiration: mockData.mockFutureAspiration,
      forTesting: true
    };

    let wrapper = shallow(<AddEditStudent {...props} />);
    wrapper.find("#submitandnext").simulate("click", {
      preventDefault: jest.fn()
    });
    // expect(updateFuture.props().value.name).toEqual("Private Jobs");
  });
});
