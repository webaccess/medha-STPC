import React from "react";
import { shallow } from "enzyme";
import useStyles from "./ViewPageStyles";

const Composer = () => (
  <p>
    <div className={useStyles().root} />
  </p>
);

describe("Testing ViewPageStyles", () => {
  it("should render a div with root class", () => {
    const wrapper = shallow(<Composer />);
    expect(wrapper).toBeDefined();
  });
});
