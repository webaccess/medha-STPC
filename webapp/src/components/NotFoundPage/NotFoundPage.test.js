import React from "react";
import { shallow } from "enzyme";

import NotFoundPage from "./NotFoundPage";

describe("Testing NotFoundPage", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<NotFoundPage {...props} />);
    expect(wrapper).toBeDefined();
  });
});
