const mockStorj: Dictionary<boolean> = {};

jest.mock("../../../../session", () => {
  return {
    Session: {
      deprecatedGetBool: (k: string) => {
        mockStorj[k] = !!mockStorj[k];
        return mockStorj[k];
      },
    }
  };
});

import * as React from "react";
import { VirtualFarmBot } from "../index";
import { shallow } from "enzyme";
import { VirtualFarmBotProps } from "../../interfaces";
import { Dictionary } from "farmbot";
import { fakeMapTransformProps } from "../../../../__test_support__/map_transform_props";

describe("<VirtualFarmBot/>", () => {
  function fakeProps(): VirtualFarmBotProps {
    return {
      botLocationData: {
        position: { x: 0, y: 0, z: 0 },
        scaled_encoders: { x: undefined, y: undefined, z: undefined },
        raw_encoders: { x: undefined, y: undefined, z: undefined },
      },
      mapTransformProps: fakeMapTransformProps(),
      plantAreaOffset: { x: 100, y: 100 },
      peripherals: [],
      eStopStatus: false
    };
  }

  it("shows bot position", () => {
    const wrapper = shallow(<VirtualFarmBot {...fakeProps()} />);
    const figures = wrapper.find("BotFigure");
    expect(figures.length).toEqual(1);
    expect(figures.last().props().name).toEqual("motor-position");
  });

  it("shows trail", () => {
    mockStorj["display_trail"] = true;
    const wrapper = shallow(<VirtualFarmBot {...fakeProps()} />);
    expect(wrapper.find("BotTrail").length).toEqual(1);
  });

  it("shows encoder position", () => {
    mockStorj["encoder_figure"] = true;
    const wrapper = shallow(<VirtualFarmBot {...fakeProps()} />);
    const figures = wrapper.find("BotFigure");
    expect(figures.length).toEqual(2);
    expect(figures.last().props().name).toEqual("encoder-position");
  });
});
