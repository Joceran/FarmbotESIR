jest.mock("react-redux", () => ({
  connect: jest.fn()
}));

import * as React from "react";
import { mount } from "enzyme";
import { Controls } from "../controls";
import { bot } from "../../__test_support__/fake_state/bot";
import {
  fakePeripheral, fakeWebcamFeed, fakeSensor
} from "../../__test_support__/fake_state/resources";
import { Dictionary } from "farmbot";
import { Props } from "../interfaces";

describe("<Controls />", () => {
  const mockConfig: Dictionary<boolean> = {};

  function fakeProps(): Props {
    return {
      dispatch: jest.fn(),
      bot: bot,
      feeds: [fakeWebcamFeed()],
      user: undefined,
      peripherals: [fakePeripheral()],
      sensors: [fakeSensor()],
      botToMqttStatus: "up",
      firmwareSettings: bot.hardware.mcu_params,
      shouldDisplay: () => true,
      getWebAppConfigVal: jest.fn((key) => (mockConfig[key])),
    };
  }

  it("shows webcam widget", () => {
    mockConfig.hide_webcam_widget = false;
    const wrapper = mount(<Controls {...fakeProps()} />);
    const txt = wrapper.text().toLowerCase();
    ["webcam", "move", "peripherals", "sensors"]
      .map(string => expect(txt).toContain(string));
  });

  it("hides webcam widget", () => {
    mockConfig.hide_webcam_widget = true;
    const wrapper = mount(<Controls {...fakeProps()} />);
    const txt = wrapper.text().toLowerCase();
    ["move", "peripherals", "sensors"]
      .map(string => expect(txt).toContain(string));
    expect(txt).not.toContain("webcam");
  });

  it("doesn't show sensors", () => {
    const p = fakeProps();
    p.shouldDisplay = () => false;
    const wrapper = mount(<Controls {...p} />);
    const txt = wrapper.text().toLowerCase();
    expect(txt).not.toContain("sensors");
  });
});
