let mockAtMax = false;
let mockAtMin = false;
jest.mock("../zoom", () => {
  return {
    atMaxZoom: () => mockAtMax,
    atMinZoom: () => mockAtMin,
  };
});

import * as React from "react";
import { shallow } from "enzyme";
import { GardenMapLegend } from "../garden_map_legend";
import { GardenMapLegendProps } from "../interfaces";

describe("<GardenMapLegend />", () => {
  function fakeProps(): GardenMapLegendProps {
    return {
      zoom: () => () => undefined,
      toggle: () => () => undefined,
      updateBotOriginQuadrant: () => () => undefined,
      botOriginQuadrant: 2,
      legendMenuOpen: true,
      showPlants: false,
      showPoints: false,
      showSpread: false,
      showFarmbot: false,
      showImages: false,
      dispatch: jest.fn(),
      tzOffset: 0,
      getConfigValue: jest.fn(),
      imageAgeInfo: { newestDate: "", toOldest: 1 },
    };
  }

  function checkZoomButtons(atMax: boolean, atMin: boolean, expected: number) {
    mockAtMax = atMax;
    mockAtMin = atMin;
    const wrapper = shallow(<GardenMapLegend {...fakeProps() } />);
    expect(wrapper.find(".disabled").length).toEqual(expected);
  }

  it("zoom buttons active", () => {
    checkZoomButtons(false, false, 0);
  });

  it("zoom out button disabled", () => {
    checkZoomButtons(false, true, 1);
  });

  it("zoom in button disabled", () => {
    checkZoomButtons(true, false, 1);
  });
});
