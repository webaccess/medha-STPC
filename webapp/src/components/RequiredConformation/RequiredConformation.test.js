import React from "react";
import { shallow } from "enzyme";

import RequiredConformation from "./RequiredConformation";

describe("Testing RequiredConformation", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<RequiredConformation {...props} />);
    expect(wrapper).toBeDefined();
  });
});
