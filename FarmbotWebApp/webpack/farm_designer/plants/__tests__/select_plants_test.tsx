jest.mock("react-redux", () => ({
  connect: jest.fn()
}));

let mockPath = "";
jest.mock("../../../history", () => ({
  getPathArray: jest.fn(() => { return mockPath.split("/"); })
}));

import * as React from "react";
import { mount, shallow } from "enzyme";
import { SelectPlants, SelectPlantsProps } from "../select_plants";
import { fakePlant } from "../../../__test_support__/fake_state/resources";
import { Actions } from "../../../constants";

describe("<SelectPlants />", () => {
  beforeEach(function () {
    jest.clearAllMocks();
    mockPath = "/app/designer/plants/select";
  });

  function fakeProps(): SelectPlantsProps {
    const plant1 = fakePlant();
    plant1.uuid = "plant.1";
    plant1.body.name = "Strawberry";
    const plant2 = fakePlant();
    plant2.uuid = "plant.2";
    plant2.body.name = "Blueberry";
    return {
      selected: ["plant.1"],
      plants: [plant1, plant2],
      dispatch: jest.fn(),
      currentIcon: "fake icon"
    };
  }

  it("displays selected plant", () => {
    const wrapper = mount(<SelectPlants {...fakeProps() } />);
    expect(wrapper.text()).toContain("Strawberry");
  });

  it("displays multiple selected plants", () => {
    const p = fakeProps();
    p.selected = ["plant.1", "plant.2"];
    const wrapper = mount(<SelectPlants {...p} />);
    ["Strawberry", "Blueberry", "Delete"].map(string =>
      expect(wrapper.text()).toContain(string));
  });

  it("displays no selected plants: selection empty", () => {
    const p = fakeProps();
    p.selected = [];
    const wrapper = mount(<SelectPlants {...p} />);
    expect(wrapper.text()).not.toContain("Strawberry Plant");
  });

  it("displays no selected plants: selection invalid", () => {
    const p = fakeProps();
    p.selected = ["not a uuid"];
    const wrapper = mount(<SelectPlants {...p} />);
    expect(wrapper.text()).not.toContain("Strawberry Plant");
  });

  it("selects all", () => {
    const p = fakeProps();
    p.dispatch = jest.fn();
    const wrapper = mount(<SelectPlants {...p} />);
    const selectAllButton = wrapper.find("button").at(1);
    expect(selectAllButton.text()).toEqual("Select all");
    selectAllButton.simulate("click");
    expect(p.dispatch).toHaveBeenCalledWith(
      { payload: ["plant.1", "plant.2"], type: Actions.SELECT_PLANT });
  });

  it("selects none", () => {
    const p = fakeProps();
    p.dispatch = jest.fn();
    const wrapper = mount(<SelectPlants {...p} />);
    const selectNoneButton = wrapper.find("button").at(2);
    expect(selectNoneButton.text()).toEqual("Select none");
    selectNoneButton.simulate("click");
    expect(p.dispatch).toHaveBeenCalledWith(
      { payload: undefined, type: Actions.SELECT_PLANT });
  });

  it("confirms deletion of selected plants", () => {
    const p = fakeProps();
    p.selected = ["plant.1", "plant.2"];
    const wrapper = mount(<SelectPlants {...p} />);
    expect(wrapper.text()).toContain("Delete");
    window.confirm = jest.fn();
    wrapper.find("button").first().simulate("click");
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete 2 plants?");
  });

  it("restores selected on back", () => {
    const p = fakeProps();
    p.selected = ["plant.1"];
    const wrapper = shallow(<SelectPlants {...p} />);
    wrapper.find("BackArrow").simulate("click");
    expect(p.dispatch).toHaveBeenCalledWith({
      payload: { icon: "fake icon", plantUUID: "plant.1" },
      type: Actions.TOGGLE_HOVERED_PLANT
    });
    expect(p.dispatch).toHaveBeenCalledWith({
      payload: ["plant.1"], type: Actions.SELECT_PLANT
    });
  });
});
