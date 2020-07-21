import React, { useContext, useState as useStateMock } from "react";
import { shallow, mount } from "enzyme";
import AddEditEvent from "../AddEditEvent";

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

const simulateChangeOnCollegeMultiSelectInput = (
  wrapper,
  inputSelector,
  newValue,
  newNameValue
) => {
  const input = wrapper.find(inputSelector);
  // for (var i = 0; i < newValue.length; i++) {
  input.simulate(
    "change",

    { newNameValue },
    newValue
  );
  // }
  return wrapper.find(inputSelector);
};

const simulateChangeOnDate = (wrapper, inputSelector, newValue) => {
  const input = wrapper.find(inputSelector);
  input.simulate(
    "change",

    newValue
  );
  return wrapper.find(inputSelector);
};

const simulateChangeOnStreamMultiSelectInput = (
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

const simulateChangeOnDynamicGridInput = (
  wrapper,
  inputSelector,
  event,
  selectedValueForAutoComplete,
  dynamicGridValue,
  isAutoComplete,
  isTextBox
) => {
  const input = wrapper.find(inputSelector);

  input.simulate(
    "change",
    { persist: jest.fn() },
    { id: parseInt(selectedValueForAutoComplete) },
    dynamicGridValue,
    isAutoComplete,
    isTextBox
  );
  // return wrapper.find(inputSelector);
};

describe("test for fields ", () => {
  it("It has an input field of eventname", () => {
    const wrapper = shallow(<AddEditEvent />);
    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#eventname",
      "TCS Drive 2020",
      "eventName"
    );
    expect(updatedNameInput.props().value).toEqual("TCS Drive 2020");
  });
  it("It has an input field of eventname", () => {
    const wrapper = shallow(<AddEditEvent />);
    const updatedNameInput = simulateChangeOnInput(
      wrapper,
      "#address",
      "Powai",
      "address"
    );
    expect(updatedNameInput.props().value).toEqual("Powai");
  });
  it("It has an input field of dateFrom", () => {
    const wrapper = shallow(<AddEditEvent />);
    const updatedDateInput = simulateChangeOnDate(
      wrapper,
      "#dateFrom",
      "Mon Jul 06 2020 15:38:00 GMT+0530 (India Standard Time)"
    );
    expect(updatedDateInput.props().value).toEqual(
      "Mon Jul 06 2020 15:38:00 GMT+0530 (India Standard Time)"
    );
  });
  it("It has an input field of dateTo", () => {
    const wrapper = shallow(<AddEditEvent />);
    const updatedDateInput = simulateChangeOnDate(
      wrapper,
      "#dateTo",
      "Thu Jul 09 2020 15:51:00 GMT+0530 (India Standard Time)"
    );
    expect(updatedDateInput.props().value).toEqual(
      "Thu Jul 09 2020 15:51:00 GMT+0530 (India Standard Time)"
    );
  });

  it("It has an input field of multi-select college", () => {
    const collegeOption = [
      {
        contact: {
          id: 1,
          name: "Government Polytechnic, Mainpuri"
        }
      },
      {
        contact: {
          id: 2,
          name: "Government Leather Institute, Agra"
        }
      }
    ];
    const wrapper = shallow(<AddEditEvent collegeOption={collegeOption} />);
    const updatedCollegeInput = simulateChangeOnCollegeMultiSelectInput(
      wrapper,
      "#college",
      [
        {
          contact: {
            id: 2
          }
        },
        {
          contact: {
            id: 3
          }
        }
      ]
    );
    expect(updatedCollegeInput.props().value[0].contact.id).toEqual(2);
    expect(updatedCollegeInput.props().value[1].contact.id).toEqual(3);
  });
  it("It has an input field of multi-select streams", () => {
    const streamOption = [
      {
        id: 1,
        name: "Mechanical Engineering (Production)"
      },
      {
        id: 2,
        name: "Computer Science And Engineering"
      },
      {
        id: 3,
        name: "Electronics Engineering"
      }
    ];
    const wrapper = shallow(<AddEditEvent streamOption={streamOption} />);
    const updatedStreamInput = simulateChangeOnStreamMultiSelectInput(
      wrapper,
      "#stream",
      [
        {
          id: 2
        },
        {
          id: 3
        }
      ]
    );
    expect(updatedStreamInput.props().value[0].id).toEqual(2);
    expect(updatedStreamInput.props().value[1].id).toEqual(3);
  });
  it("It has an input field of select question", () => {
    const questionOption = [
      {
        id: 1,
        name: "Activity Question Set"
      },
      {
        id: 2,
        name: "Event Question Set"
      }
    ];
    const wrapper = shallow(<AddEditEvent questionOption={questionOption} />);
    const updatedNameInput = simulateChangeOnAutoInput(
      wrapper,
      "#question_set",
      "1"
    );

    expect(updatedNameInput.props().value.name).toEqual(
      "Activity Question Set"
    );
  });

  it("It has an input field of dynamic grid", () => {
    const wrapper = shallow(<AddEditEvent />);
    const updatedNameInput = simulateChangeOnDynamicGridInput(
      wrapper,
      "#qualification-0",
      "sdcscsd3",
      "3",
      {
        index: 0.8407492409363633
      },
      true,
      false
    );
  });
});
