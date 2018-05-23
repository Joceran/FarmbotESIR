import * as React from "react";
import { BotExtents } from "../bot_extents";
import { shallow } from "enzyme";
import { bot } from "../../../__test_support__/fake_state/bot";
import { BotExtentsProps } from "../interfaces";
import { fakeMapTransformProps } from "../../../__test_support__/map_transform_props";

describe("<VirtualFarmBot/>", () => {
  function fakeProps(): BotExtentsProps {
    const mcuParams = bot.hardware.mcu_params;
    mcuParams.movement_stop_at_home_x = 1;
    mcuParams.movement_stop_at_home_y = 1;
    return {
      mapTransformProps: fakeMapTransformProps(),
      stopAtHome: { x: true, y: true },
      botSize: {
        x: { value: 3000, isDefault: true },
        y: { value: 1500, isDefault: true }
      }
    };
  }

  it("renders home lines", () => {
    const p = fakeProps();
    const wrapper = shallow(<BotExtents {...p} />);
    const homeLines = wrapper.find("#home-lines").find("line");
    expect(homeLines.at(0).props()).toEqual({ "x1": 2, "x2": 2, "y1": 2, "y2": 1500 });
    expect(homeLines.at(1).props()).toEqual({ "x1": 2, "x2": 3000, "y1": 2, "y2": 2 });
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).html()).toBeFalsy();
    expect(maxLines.at(1).html()).toBeFalsy();
  });

  it("renders home and max lines", () => {
    const p = fakeProps();
    p.botSize = {
      x: { value: 100, isDefault: false },
      y: { value: 100, isDefault: false }
    };
    const wrapper = shallow(<BotExtents {...p} />);
    const homeLines = wrapper.find("#home-lines").find("line");
    expect(homeLines.at(0).props()).toEqual({ "x1": 2, "x2": 2, "y1": 2, "y2": 100 });
    expect(homeLines.at(1).props()).toEqual({ "x1": 2, "x2": 100, "y1": 2, "y2": 2 });
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).props()).toEqual({ "x1": 100, "x2": 100, "y1": 2, "y2": 100 });
    expect(maxLines.at(1).props()).toEqual({ "x1": 2, "x2": 100, "y1": 100, "y2": 100 });
  });

  it("renders home and max lines for one axis only", () => {
    const p = fakeProps();
    p.stopAtHome.x = false;
    p.botSize = {
      x: { value: 3000, isDefault: true },
      y: { value: 100, isDefault: false }
    };
    const wrapper = shallow(<BotExtents {...p} />);
    const homeLines = wrapper.find("#home-lines").find("line");
    expect(homeLines.at(0).props()).toEqual({ "x1": 2, "x2": 3000, "y1": 2, "y2": 2 });
    expect(homeLines.at(1).html()).toBeFalsy();
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).props()).toEqual({ "x1": 2, "x2": 3000, "y1": 100, "y2": 100 });
    expect(maxLines.at(1).html()).toBeFalsy();
  });

  it("renders max lines", () => {
    const p = fakeProps();
    p.stopAtHome.x = false;
    p.stopAtHome.y = false;
    p.botSize = {
      x: { value: 100, isDefault: false },
      y: { value: 100, isDefault: false }
    };
    const wrapper = shallow(<BotExtents {...p} />);
    const homeLines = wrapper.find("#home-lines").find("line");
    expect(homeLines.at(0).html()).toBeFalsy();
    expect(homeLines.at(1).html()).toBeFalsy();
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).props()).toEqual({ "x1": 100, "x2": 100, "y1": 2, "y2": 100 });
    expect(maxLines.at(1).props()).toEqual({ "x1": 2, "x2": 100, "y1": 100, "y2": 100 });
  });

  it("renders home and max lines in correct location for quadrant 1", () => {
    const p = fakeProps();
    p.mapTransformProps.quadrant = 1;
    p.botSize = {
      x: { value: 100, isDefault: false },
      y: { value: 100, isDefault: false }
    };
    const wrapper = shallow(<BotExtents {...p} />);
    const homeLines = wrapper.find("#home-lines").find("line");
    expect(homeLines.at(0).props()).toEqual({ "x1": 2998, "x2": 2998, "y1": 2, "y2": 100 });
    expect(homeLines.at(1).props()).toEqual({ "x1": 2998, "x2": 2900, "y1": 2, "y2": 2 });
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).props()).toEqual({ "x1": 2900, "x2": 2900, "y1": 2, "y2": 100 });
    expect(maxLines.at(1).props()).toEqual({ "x1": 2998, "x2": 2900, "y1": 100, "y2": 100 });
  });

  it("renders max line in correct location", () => {
    const p = fakeProps();
    p.stopAtHome.x = false;
    p.stopAtHome.y = false;
    p.botSize = {
      x: { value: 100, isDefault: false },
      y: { value: 100, isDefault: true }
    };
    const wrapper = shallow(<BotExtents {...p} />);
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).props()).toEqual({ "x1": 100, "x2": 100, "y1": 2, "y2": 100 });
  });

  it("renders max line in correct location with swapped axes", () => {
    const p = fakeProps();
    p.stopAtHome.x = false;
    p.stopAtHome.y = false;
    p.mapTransformProps.xySwap = true;
    p.botSize = {
      x: { value: 100, isDefault: false },
      y: { value: 100, isDefault: true }
    };
    const wrapper = shallow(<BotExtents {...p} />);
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).props()).toEqual({ "x1": 2, "x2": 100, "y1": 100, "y2": 100 });
  });

  it("renders no lines", () => {
    const p = fakeProps();
    p.stopAtHome.x = false;
    p.stopAtHome.y = false;
    const wrapper = shallow(<BotExtents {...p} />);
    const homeLines = wrapper.find("#home-lines").find("line");
    expect(homeLines.at(0).html()).toBeFalsy();
    expect(homeLines.at(1).html()).toBeFalsy();
    const maxLines = wrapper.find("#max-lines").find("line");
    expect(maxLines.at(0).html()).toBeFalsy();
    expect(maxLines.at(1).html()).toBeFalsy();
  });

});
