import * as React from "react";
import { DrawnPoint, DrawnPointProps } from "../drawn_point";
import { mount } from "enzyme";

describe("<DrawnPoint/>", () => {
  function fakeProps(): DrawnPointProps {
    return {
      mapTransformProps: {
        quadrant: 2, gridSize: { x: 3000, y: 1500 }
      },
      data: {
        cx: 10,
        cy: 20,
        r: 30,
        color: "red"
      }
    };
  }

  it("renders point", () => {
    const wrapper = mount(<DrawnPoint {...fakeProps() } />);
    expect(wrapper.find("g").props().stroke).toEqual("red");
    expect(wrapper.find("circle").first().props()).toEqual({
      id: "point-radius", strokeDasharray: "4 5",
      cx: 10, cy: 20, r: 30,
    });
    expect(wrapper.find("circle").last().props()).toEqual({
      id: "point-center",
      cx: 10, cy: 20, r: 2,
    });
  });
});
