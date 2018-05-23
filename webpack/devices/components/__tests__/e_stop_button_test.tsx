import * as React from "react";
import { mount } from "enzyme";
import { EStopButton } from "../e_stop_btn";
import { bot } from "../../../__test_support__/fake_state/bot";
import { taggedUser } from "../../../__test_support__/user";

describe("<EStopButton />", () => {
  it("renders", () => {
    bot.hardware.informational_settings.sync_status = "synced";
    const wrapper = mount(<EStopButton bot={bot} user={taggedUser} />);
    expect(wrapper.text()).toEqual("E-STOP");
    expect(wrapper.find("button").hasClass("red")).toBeTruthy();
  });

  it("grayed out", () => {
    bot.hardware.informational_settings.sync_status = undefined;
    const wrapper = mount(<EStopButton bot={bot} user={taggedUser} />);
    expect(wrapper.text()).toEqual("E-STOP");
    expect(wrapper.find("button").hasClass("gray")).toBeTruthy();
  });

  it("locked", () => {
    bot.hardware.informational_settings.sync_status = "synced";
    bot.hardware.informational_settings.locked = true;
    const wrapper = mount(<EStopButton bot={bot} user={taggedUser} />);
    expect(wrapper.text()).toEqual("UNLOCK");
    expect(wrapper.find("button").hasClass("yellow")).toBeTruthy();
  });
});
