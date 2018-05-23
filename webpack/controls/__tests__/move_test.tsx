const mockDevice = {
  moveAbsolute: jest.fn(() => { return Promise.resolve(); }),
};

jest.mock("../../device", () => ({
  getDevice: () => (mockDevice)
}));

jest.mock("../../config_storage/actions", () => {
  return {
    toggleWebAppBool: jest.fn()
  };
});

import * as React from "react";
import { mount, shallow } from "enzyme";
import { Move } from "../move";
import { bot } from "../../__test_support__/fake_state/bot";
import { MoveProps } from "../interfaces";
import { toggleWebAppBool } from "../../config_storage/actions";
import { Dictionary } from "farmbot";
import { BooleanSetting } from "../../session_keys";
import { Actions } from "../../constants";

describe("<Move />", () => {
  beforeEach(function () {
    jest.clearAllMocks();
  });

  const mockConfig: Dictionary<boolean> = {};

  function fakeProps(): MoveProps {
    return {
      dispatch: jest.fn(),
      bot: bot,
      user: undefined,
      arduinoBusy: false,
      botToMqttStatus: "up",
      firmwareSettings: bot.hardware.mcu_params,
      getWebAppConfigVal: jest.fn((key) => (mockConfig[key])),
    };
  }

  it("has default elements", () => {
    const wrapper = mount(<Move {...fakeProps()} />);
    const txt = wrapper.text().toLowerCase();
    ["move amount (mm)", "110100100010000", "x axisy axisz axis", "motor", "go"]
      .map(string => expect(txt).toContain(string));
  });

  it("has only raw encoder data display", () => {
    const p = fakeProps();
    mockConfig.raw_encoders = true;
    const wrapper = mount(<Move {...p} />);
    const txt = wrapper.text().toLowerCase();
    expect(txt).toContain("raw");
    expect(txt).not.toContain("scaled");
  });

  it("has both encoder data displays", () => {
    const p = fakeProps();
    mockConfig.raw_encoders = true;
    mockConfig.scaled_encoders = true;
    const wrapper = mount(<Move {...p} />);
    const txt = wrapper.text().toLowerCase();
    expect(txt).toContain("raw");
    expect(txt).toContain("scaled");
  });

  it("toggle: invert jog button", () => {
    const wrapper = mount(<Move {...fakeProps()} />);
    // tslint:disable-next-line:no-any
    const instance = wrapper.instance() as any;
    instance.toggle(BooleanSetting.xy_swap)();
    expect(toggleWebAppBool).toHaveBeenCalledWith(BooleanSetting.xy_swap);
  });

  it("changes step size", () => {
    const p = fakeProps();
    const wrapper = mount(<Move {...p} />);
    const btn = wrapper.find("button").first();
    expect(btn.text()).toEqual("1");
    btn.simulate("click");
    expect(p.dispatch).toHaveBeenCalledWith({
      type: Actions.CHANGE_STEP_SIZE,
      payload: 1
    });
  });

  it("inputs axis destination", () => {
    const p = fakeProps();
    const wrapper = shallow(<Move {...p} />);
    const axisInput = wrapper.find("AxisInputBoxGroup");
    axisInput.simulate("commit", "123");
    expect(mockDevice.moveAbsolute).toHaveBeenCalledWith("123");
  });
});
