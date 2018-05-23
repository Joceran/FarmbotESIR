jest.mock("react-redux", () => ({
  connect: jest.fn()
}));

jest.mock("../../../history", () => ({
  history: {
    push: jest.fn()
  }
}));

import * as React from "react";
import { mount } from "enzyme";
import { EditFarmEvent } from "../edit_farm_event";
import { AddEditFarmEventProps } from "../../interfaces";
import { fakeFarmEvent, fakeSequence } from "../../../__test_support__/fake_state/resources";

describe("<EditFarmEvent />", () => {
  function fakeProps(): AddEditFarmEventProps {
    const sequence = fakeSequence();
    sequence.body.id = 1;
    return {
      deviceTimezone: "",
      dispatch: jest.fn(),
      regimensById: {},
      sequencesById: { "1": sequence },
      farmEventsById: { "1": fakeFarmEvent("Sequence", 1) },
      executableOptions: [],
      repeatOptions: [],
      handleTime: jest.fn(),
      farmEvents: [],
      getFarmEvent: () => fakeFarmEvent("Sequence", 1),
      findExecutable: () => sequence,
      timeOffset: 0
    };
  }

  it("renders", () => {
    const wrapper = mount(<EditFarmEvent {...fakeProps() } />);
    ["Edit Farm Event", "Sequence or Regimen", "fake", "Save"]
      .map(string => expect(wrapper.text()).toContain(string));
    const deleteBtn = wrapper.find("button").last();
    expect(deleteBtn.text()).toEqual("Delete");
    expect(deleteBtn.props().hidden).toBeFalsy();
  });

  it("redirects", () => {
    const p = fakeProps();
    p.getFarmEvent = jest.fn();
    const wrapper = mount(<EditFarmEvent {...p } />);
    expect(wrapper.text()).toContain("Loading");
  });
});
