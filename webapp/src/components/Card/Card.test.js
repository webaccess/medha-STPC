import React from "react";
import { shallow } from "enzyme";

import Card from "./Card";
import CardBody from "./CardBody";
import CardHeader from "./CardHeader";

describe("Testing BlockGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<Card {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing", () => {
    wrapper = shallow(<CardBody {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    wrapper = shallow(<CardHeader {...props} />);
    expect(wrapper).toBeDefined();
  });
});
