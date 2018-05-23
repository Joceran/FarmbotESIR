jest.mock("../../../api/crud", () => ({
  destroy: jest.fn(),
}));

const mockOk = jest.fn();
jest.mock("farmbot-toastr", () => ({ success: mockOk }));

import * as React from "react";
import { mount } from "enzyme";
import { Photos } from "../photos";
import { TaggedImage } from "../../../resources/tagged_resources";
import { fakeImages } from "../../../__test_support__/fake_state/images";
import { defensiveClone } from "../../../util";
import { destroy } from "../../../api/crud";

describe("<Photos/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function prepareImages(data: TaggedImage[]): TaggedImage[] {
    const images: TaggedImage[] = [];
    data.forEach((item, index) => {
      const image = defensiveClone(item);
      image.uuid = `Position ${index}`;
      images.push(image);
    });
    return images;
  }

  it("renders title", () => {
    const wrapper = mount(<Photos
      images={[]}
      currentImage={undefined}
      dispatch={jest.fn()}
      timeOffset={0} />);
    expect(wrapper.text()).toContain("Photos");
  });

  it("shows photo", () => {
    const dispatch = jest.fn();
    const images = prepareImages(fakeImages);
    const currentImage = images[1];
    const props = { images, currentImage, dispatch, timeOffset: 0 };
    const wrapper = mount(<Photos {...props} />);
    expect(wrapper.text()).toContain("Created At:June 1st, 2017");
    expect(wrapper.text()).toContain("X:632Y:347Z:164");
  });

  it("no photos", () => {
    const props = {
      images: [],
      currentImage: undefined,
      dispatch: jest.fn(),
      timeOffset: 0
    };
    const wrapper = mount(<Photos {...props} />);
    expect(wrapper.text()).toContain("Image:No meta data.");
  });

  it("deletes photo", () => {
    const dispatch = jest.fn(() => { return Promise.resolve(); });
    const images = prepareImages(fakeImages);
    const currentImage = images[1];
    const props = {
      images,
      currentImage,
      dispatch,
      timeOffset: 0
    };
    const wrapper = mount(<Photos {...props} />);
    const deleteButton = wrapper.find("button").at(1);
    expect(deleteButton.text().toLowerCase()).toBe("delete photo");
    deleteButton.simulate("click");
    expect(destroy).toHaveBeenCalledWith("Position 1");
  });
});
