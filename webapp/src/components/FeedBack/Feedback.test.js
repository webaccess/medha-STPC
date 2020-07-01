import React from "react";
import { shallow } from "enzyme";

import Feedback from "./Feedback";

describe("ContentPlaceholder Component Test Suite", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: false,
      cannotGiveFeedback: false,
      isViewFeedback: false,
      feedbackNotAvailable: false,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders one icon when any one of isGiveFeedback, isEditFeedback, cannotGiveFeedback, isViewFeedback is true", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: false,
      cannotGiveFeedback: false,
      isViewFeedback: true,
      feedbackNotAvailable: true,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).toHaveLength(1);
  });

  it(" renders when isGiveFeedback, isEditFeedback, cannotGiveFeedback, isViewFeedback is false", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: false,
      cannotGiveFeedback: false,
      isViewFeedback: false,
      feedbackNotAvailable: false,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).not.toHaveLength(1);
  });

  it(" renders when isGiveFeedback is true", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: true,
      isEditFeedback: false,
      cannotGiveFeedback: false,
      isViewFeedback: false,
      feedbackNotAvailable: false,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).toHaveLength(1);
  });

  it(" renders when isEditFeedback is true", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: true,
      cannotGiveFeedback: false,
      isViewFeedback: false,
      feedbackNotAvailable: false,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).toHaveLength(1);
  });

  it(" renders when cannotGiveFeedback is true", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: false,
      cannotGiveFeedback: true,
      isViewFeedback: false,
      feedbackNotAvailable: false,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).toHaveLength(1);
  });

  it(" renders when isViewFeedback is true", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: false,
      cannotGiveFeedback: false,
      isViewFeedback: true,
      feedbackNotAvailable: false,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).toHaveLength(1);
  });

  it(" does not renders when isViewFeedback is false and feedbackNotAvailable is true", () => {
    props = {
      id: "feedback-id",
      onClick: jest.fn(() => "onClick"),
      isGiveFeedback: false,
      isEditFeedback: false,
      cannotGiveFeedback: false,
      isViewFeedback: false,
      feedbackNotAvailable: true,
      message: ""
    };
    wrapper = shallow(<Feedback {...props} />);
    expect(wrapper.find("#feedback-id")).not.toHaveLength(1);
  });
});
