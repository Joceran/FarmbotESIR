import { TaggedWebcamFeed } from "../../resources/tagged_resources";
import { WebcamPanelProps } from "./interfaces";

export const props = (feeds: TaggedWebcamFeed[]): WebcamPanelProps => {
  return {
    onToggle: jest.fn(),
    feeds,
    init: jest.fn(),
    edit: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn(),
  };
};
