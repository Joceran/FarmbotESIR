jest.mock("react-redux", () => ({
  connect: jest.fn()
}));

import * as React from "react";
import { FarmDesigner } from "../index";
import { mount } from "enzyme";
import { Props } from "../interfaces";
import { GardenMapLegendProps } from "../map/interfaces";
import { bot } from "../../__test_support__/fake_state/bot";
import { fakeImage } from "../../__test_support__/fake_state/resources";

describe("<FarmDesigner/>", () => {
  function fakeProps(): Props {

    return {
      dispatch: jest.fn(),
      selectedPlant: undefined,
      designer: {
        selectedPlants: undefined,
        hoveredPlant: {
          plantUUID: undefined,
          icon: ""
        },
        hoveredPlantListItem: undefined,
        cropSearchQuery: "",
        cropSearchResults: [],
        chosenLocation: { x: undefined, y: undefined, z: undefined },
        currentPoint: undefined,
      },
      hoveredPlant: undefined,
      points: [],
      plants: [],
      toolSlots: [],
      crops: [],
      botLocationData: {
        position: { x: undefined, y: undefined, z: undefined },
        scaled_encoders: { x: undefined, y: undefined, z: undefined },
        raw_encoders: { x: undefined, y: undefined, z: undefined },
      },
      botMcuParams: bot.hardware.mcu_params,
      stepsPerMmXY: { x: undefined, y: undefined },
      peripherals: [],
      eStopStatus: false,
      latestImages: [],
      cameraCalibrationData: {
        scale: undefined, rotation: undefined,
        offset: { x: undefined, y: undefined },
        origin: undefined,
        calibrationZ: undefined
      },
      tzOffset: 0,
      getConfigValue: jest.fn(),
    };
  }

  it("loads default map settings", () => {
    localStorage["showPoints"] = "false";
    const wrapper = mount(<FarmDesigner {...fakeProps()} />);
    const legendProps = wrapper.find("GardenMapLegend").props() as GardenMapLegendProps;
    expect(legendProps.legendMenuOpen).toBeFalsy();
    expect(legendProps.showPlants).toBeTruthy();
    expect(legendProps.showPoints).toBeTruthy();
    expect(legendProps.showSpread).toBeFalsy();
    expect(legendProps.showFarmbot).toBeTruthy();
    expect(legendProps.showImages).toBeFalsy();
    expect(legendProps.botOriginQuadrant).toEqual(2);
    expect(legendProps.imageAgeInfo).toEqual({ newestDate: "", toOldest: 1 });
    // tslint:disable-next-line:no-any
    const gardenMapProps = wrapper.find("GardenMap").props() as any;
    expect(gardenMapProps.gridSize.x).toEqual(2900);
    expect(gardenMapProps.gridSize.y).toEqual(1400);
  });

  it("loads image info", () => {
    const p = fakeProps();
    const image1 = fakeImage();
    const image2 = fakeImage();
    image1.body.created_at = "2001-01-03T00:00:00.000Z";
    image2.body.created_at = "2001-01-01T00:00:00.000Z";
    p.latestImages = [image1, image2];
    const wrapper = mount(<FarmDesigner {...p} />);
    const legendProps = wrapper.find("GardenMapLegend").props() as GardenMapLegendProps;
    expect(legendProps.imageAgeInfo)
      .toEqual({ newestDate: "2001-01-03T00:00:00.000Z", toOldest: 2 });
  });

  it("renders nav titles", () => {
    const wrapper = mount(<FarmDesigner {...fakeProps()} />);
    ["Designer", "Plants", "Farm Events"].map(string =>
      expect(wrapper.text()).toContain(string));
  });
});
