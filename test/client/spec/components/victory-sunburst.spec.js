/**
 * Client tests
 */
import React from "react";
import { mount } from "enzyme";
import VictorySunburst from "src/components/victory-sunburst";

describe("components/victory-sunburst", () => {
  it("renders an svg with the correct width and height", () => {
    const wrapper = mount(<VictorySunburst />);
    const svg = wrapper.find("svg").at(0);
    expect(svg.props("style").width).to.equal(700);
    expect(svg.props("style").height).to.equal(700);
  });
});
