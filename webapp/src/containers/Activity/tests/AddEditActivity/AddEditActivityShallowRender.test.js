import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";
import AddEditActivity from "../../AddEditActivity.js";
import { BrowserRouter as Router } from "react-router-dom";
import auth from "../../../../components/Auth";
import LoaderContext from "../../../../context/LoaderContext";
import * as serviceProviders from "../../../../api/Axios";
import * as medhaAdminUser from "../../../../mockuser/MedhaAdmin.json";
import * as studentUser from "../../../../mockuser/StudentUser.json";
import SetIndexContext from "../../../../context/SetIndexContext.js";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import axios from "axios";
import * as mockData from "../../../../mockData/mockData.js";
import * as mockCollegeData from "../../../../mockData/mockCollegeData";
import * as mockActivityData from "../../../../mockData/mockActivityData";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants.js";

React.useLayoutEffect = React.useEffect;

jest.mock("axios");
jest.mock("../../../../api/Axios");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

describe("Add Edit Activity", () => {
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

  it("Should check activity for medha admin for add activity", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/add-activity",
        addActivity: true
      },
      collegeListForTest: mockActivityData.mockCollegeListForAddingActivity,
      streamListForTest: mockCollegeData.streamsList,
      collegeStreamListForTest:
        mockActivityData.mockCollegeStreamListForMainpuriCollege,
      activityTypeListForTest: mockData.activityType,
      questionSetListForTest: mockData.questionSet,
      isDataForTesting: true
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<AddEditActivity {...props} />);

    const updatedActivityType = simulateChangeOnAutoInput(
      wrapper,
      "#activitytype",
      "1"
    );

    const updatedActivityName = simulateChangeOnAutoInput2(
      wrapper,
      "#activityname",
      "Soft Skills 1"
    );

    const updateAddress = simulateChangeOnInput(
      wrapper,
      "#addressId",
      "Soft Skills 1",
      "address"
    );

    const input = wrapper.find("#collegeId");
    input.simulate(
      "change",

      {},
      { contact: { id: 2 } }
    );

    const updateStream = wrapper.find("#collegeStreamID");
    updateStream.simulate("change", {}, [
      {
        id: 1,
        name: "Mechanical Engineering (Production)"
      }
    ]);

    const updateEducationYear = simulateChangeOnAutoInput2(
      wrapper,
      "#educationYearId",
      "First"
    );

    const updateTrainer = simulateChangeOnInput(
      wrapper,
      "#trainerId",
      "Test Trainer",
      "trainer"
    );

    const updateQuestionSet = simulateChangeOnAutoInput(
      wrapper,
      "#question_set",
      "1"
    );

    const postSpy = jest
      .spyOn(serviceProviders, "serviceProviderForPostRequest")
      .mockImplementation(() => {
        return new Promise(resolve => {
          return resolve({ data: mockActivityData.mockAddActivityResponse });
        });
      });

    wrapper.find("#submitActivity").simulate("click", {
      preventDefault: jest.fn()
    });

    expect(postSpy).toBeCalled();

    expect(updateQuestionSet.props().value.name).toEqual(
      "Activity Question Set"
    );
    expect(updateTrainer.props().value).toEqual("Test Trainer");
    expect(updateEducationYear.props().value.name).toEqual("First");
    expect(wrapper.find("#collegeId").props().value.name).toEqual(
      "Government Polytechnic, Mainpuri"
    );
    expect(updateAddress.props().value).toEqual("Soft Skills 1");
    expect(updatedActivityType.props().value.name).toEqual("Training");
    expect(updatedActivityName.props().value.name).toEqual("Soft Skills 1");
  });

  it("Should check activity for medha admin for add activity for passing null value to college drop down", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/add-activity",
        addActivity: true
      },
      collegeListForTest: mockActivityData.mockCollegeListForAddingActivity,
      streamListForTest: mockCollegeData.streamsList,
      collegeStreamListForTest:
        mockActivityData.mockCollegeStreamListForMainpuriCollege,
      activityTypeListForTest: mockData.activityType,
      questionSetListForTest: mockData.questionSet,
      isDataForTesting: true
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<AddEditActivity {...props} />);
    const input = wrapper.find("#collegeId");
    input.simulate(
      "change",

      {},
      null
    );
  });

  it("Should check activity for medha admin for add activity for passing incomplete values", async () => {
    auth.setToken(medhaAdminUser.jwt, true);
    auth.setUserInfo(medhaAdminUser.user, true);
    let props = {
      location: {
        pathname: "/add-activity",
        addActivity: true
      },
      collegeListForTest: mockActivityData.mockCollegeListForAddingActivity,
      streamListForTest: mockCollegeData.streamsList,
      collegeStreamListForTest:
        mockActivityData.mockCollegeStreamListForMainpuriCollege,
      activityTypeListForTest: mockData.activityType,
      questionSetListForTest: mockData.questionSet,
      isDataForTesting: true
    };

    //jest.spyOn(React, "useState").mockImplementation(setYearDataUseState);
    let wrapper = shallow(<AddEditActivity {...props} />);

    wrapper.find("#submitActivity").simulate("click", {
      preventDefault: jest.fn()
    });
  });
});
