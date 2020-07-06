import React from "react";
import { shallow } from "enzyme";

import AddStudentIcon from "./AddStudentIcon";

describe("Testing AddStudentIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it("Renders without crashing", () => {
    // props = {
    //   id: "editIcon-id",
    //   onClick: jest.fn(() => "onClick")
    // };
    wrapper = shallow(<AddStudentIcon {...props} />);
    expect(wrapper).toBeDefined();
  });
});
