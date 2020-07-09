import React from "react";
import { shallow } from "enzyme";

import Modal from "./Modal";
describe("Testing NotFoundPage", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    props = {
      footer: {
        displayClose: "close"
      }
    };
    wrapper = shallow(<Modal {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    props = {
      footer: {
        displayClose: "close"
      }
    };
    wrapper = shallow(<Modal {...props} />);
    expect(wrapper).toBeDefined();
  });
});
