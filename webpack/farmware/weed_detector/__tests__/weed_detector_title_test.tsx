import "../../../__test_support__/unmock_i18next";
import * as React from "react";
import { mount } from "enzyme";
import { TitleBar } from "../title";

describe("<TitleBar/>", () => {
  it("Has a progress bar", () => {
    const props = {
      onSave: jest.fn(),
      onTest: jest.fn(),
      onSettingToggle: jest.fn(),
      onDeletionClick: jest.fn(),
      settingsMenuOpen: false,
      title: "Test",
      help: "help text",
      env: {}
    };

    const tb = mount(<TitleBar {...props} />);
    expect(tb.text().toLowerCase()).toContain("clear weeds");
    tb.setProps({ deletionProgress: "10%" });
    expect(tb.text().toLowerCase()).toContain("10%");
    expect(tb.text().toLowerCase()).not.toContain("clear weeds");
  });
});
