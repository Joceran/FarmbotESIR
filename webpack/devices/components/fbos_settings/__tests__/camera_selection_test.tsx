const mockDevice = {
  setUserEnv: jest.fn(() => { return Promise.resolve(); }),
};
jest.mock("../../../../device", () => ({
  getDevice: () => (mockDevice)
}));
const mockInfo = jest.fn();
const mockError = jest.fn();
jest.mock("farmbot-toastr", () => ({ info: mockInfo, error: mockError }));

import * as React from "react";
import { mount, shallow } from "enzyme";
import { CameraSelection } from "../camera_selection";
import { CameraSelectionProps } from "../interfaces";

describe("<CameraSelection/>", () => {
  beforeEach(function () {
    jest.clearAllMocks();
  });

  const fakeProps = (): CameraSelectionProps => {
    return {
      env: {},
      botOnline: true,
    };
  };

  it("doesn't render camera", () => {
    const cameraSelection = mount(<CameraSelection {...fakeProps()} />);
    expect(cameraSelection.find("button").text()).toEqual("USB Camera");
  });

  it("renders camera", () => {
    const p = fakeProps();
    p.env = { "camera": "\"RPI\"" };
    const cameraSelection = mount(<CameraSelection {...p} />);
    expect(cameraSelection.find("button").text()).toEqual("Raspberry Pi Camera");
  });

  it("changes camera", () => {
    const cameraSelection = shallow(<CameraSelection {...fakeProps()} />);
    cameraSelection.find("FBSelect")
      .simulate("change", { label: "My Camera", value: "mycamera" });
    expect(mockInfo)
      .toHaveBeenCalledWith("Sending camera configuration...", "Sending");
    expect(mockDevice.setUserEnv)
      .toHaveBeenCalledWith({ camera: "\"mycamera\"" });
  });
});
