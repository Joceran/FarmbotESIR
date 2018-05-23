import { buildResourceIndex, fakeDevice } from "../../__test_support__/resource_index_builder";
import * as Selector from "../selectors";
import {
  resourceReducer,
  emptyState
} from "../reducer";
import {
  TaggedTool,
  TaggedToolSlotPointer,
  SpecialStatus
} from "../tagged_resources";
import { createOK } from "../actions";
import { generateUuid } from "../util";
import {
  fakeWebcamFeed,
  fakeSequence
} from "../../__test_support__/fake_state/resources";
import { Actions } from "../../constants";
import * as _ from "lodash";

const TOOL_ID = 99;
const SLOT_ID = 100;
const fakeTool: TaggedTool = {
  kind: "Tool",
  specialStatus: SpecialStatus.SAVED,
  uuid: generateUuid(TOOL_ID, "Tool"),
  body: {
    name: "yadda yadda",
    id: TOOL_ID
  }
};
const fakeSlot: TaggedToolSlotPointer = {
  kind: "Point",
  specialStatus: SpecialStatus.SAVED,
  uuid: generateUuid(SLOT_ID, "Point"),
  body: {
    tool_id: TOOL_ID,
    pointer_type: "ToolSlot",
    radius: 0,
    x: 0,
    y: 0,
    z: 0,
    name: "wow",
    pointer_id: SLOT_ID,
    meta: {},
    pullout_direction: 0
  }
};
const fakeIndex = buildResourceIndex().index;

describe("findSlotByToolId", () => {
  it("returns undefined when not found", () => {
    const state = resourceReducer(buildResourceIndex(), createOK(fakeTool));
    expect(state.index.byKindAndId["Tool." + fakeTool.body.id]);
    const result = Selector.findSlotByToolId(state.index, TOOL_ID);
    expect(result).toBeFalsy();
  });

  it("returns something when there is a match", () => {
    const initialState = buildResourceIndex();
    const state = [createOK(fakeTool), createOK(fakeSlot)]
      .reduce(resourceReducer, initialState);
    const result = Selector.findSlotByToolId(state.index, TOOL_ID);
    expect(result).toBeTruthy();
    if (result) { expect(result.kind).toBe("Point"); }
  });
});

describe("getFeeds", () => {
  it("returns empty array", () => {
    expect(Selector.selectAllWebcamFeeds(emptyState().index).length).toBe(0);
  });

  it("finds the only WebcamFeed", () => {
    const feed = fakeWebcamFeed();
    const state = [{
      type: Actions.RESOURCE_READY,
      payload: {
        name: "WebcamFeed",
        data: feed
      }
    }].reduce(resourceReducer, emptyState());
    expect(Selector.selectAllWebcamFeeds(state.index)[0].body).toEqual(feed);
  });
});

describe("selectAllLogs", () => {
  it("stays truthful to its name by finding all logs", () => {
    const results = Selector.selectAllLogs(fakeIndex);
    expect(results.length).toBeGreaterThan(0);
    const kinds = _(results).map("kind").uniq().value();
    expect(kinds.length).toEqual(1);
    expect(kinds[0]).toEqual("Log");
  });
});

describe("findResourceById()", () => {
  it("returns UUID", () => {
    const uuid = Selector.findResourceById(fakeIndex, "Sequence", 23);
    expect(uuid).toContain("Sequence.23");
  });

  it("throws error", () => {
    const findUuid = () =>
      Selector.findResourceById(fakeIndex, "Sequence", NaN);
    expect(findUuid).toThrow("UUID not found for id NaN");
  });
});

describe("isKind()", () => {
  it("is", () => {
    const ret = Selector.isKind("Sequence")(fakeSequence());
    expect(ret).toBeTruthy();
  });

  it("isn't", () => {
    const ret = Selector.isKind("Tool")(fakeSequence());
    expect(ret).toBeFalsy();
  });
});

describe("groupPointsByType()", () => {
  it("returns points", () => {
    const points = Selector.groupPointsByType(fakeIndex);
    const expectedKeys = ["Plant", "GenericPointer", "ToolSlot"];
    expect(expectedKeys.every(key => key in points)).toBeTruthy();
  });
});

describe("findPointerByTypeAndId()", () => {
  it("throws error", () => {
    const find = () => Selector.findPointerByTypeAndId(fakeIndex, "Other", 0);
    expect(find).toThrow("Tried to fetch bad point Other 0");
  });
});

describe("findToolSlot()", () => {
  it("throws error", () => {
    const find = () => Selector.findToolSlot(fakeIndex, "bad");
    expect(find).toThrow("ToolSlotPointer not found: bad");
  });
});

describe("findPlant()", () => {
  it("throws error", () => {
    console.warn = jest.fn();
    const find = () => Selector.findPlant(fakeIndex, "bad");
    expect(find).toThrowError();
    expect(console.warn).toBeCalled();
  });
});

describe("selectCurrentToolSlot()", () => {
  it("throws error", () => {
    const find = () => Selector.selectCurrentToolSlot(fakeIndex, "bad");
    expect(find).toThrowError();
  });
});

describe("getSequenceByUUID()", () => {
  it("throws error", () => {
    console.warn = jest.fn();
    const find = () => Selector.getSequenceByUUID(fakeIndex, "bad");
    expect(find).toThrow("BAD Sequence UUID");
    expect(console.warn).toBeCalled();
  });
});

describe("findAllById()", () => {
  it("returns", () => {
    const result = Selector.findAllById(fakeIndex, [23], "Sequence");
    expect(result.length).toEqual(1);
  });
});

describe("toolsInUse()", () => {
  it("returns tools", () => {
    const activeTools = Selector.toolsInUse(fakeIndex);
    expect(activeTools.length).toBeGreaterThan(0);
  });
});

describe("hasId()", () => {
  it("has", () => {
    const result = Selector.hasId(fakeIndex, "Sequence", 23);
    expect(result).toBeTruthy();
  });
});

describe("findFarmEventById()", () => {
  it("throws error", () => {
    const find = () => Selector.findFarmEventById(fakeIndex, 0);
    expect(find).toThrow("Bad farm_event id: 0");
  });
});

describe("maybeFindToolById()", () => {
  it("not found", () => {
    const result = Selector.maybeFindToolById(fakeIndex, 0);
    expect(result).toBeUndefined();
  });
});

describe("findToolById()", () => {
  it("throws error", () => {
    const find = () => Selector.findToolById(fakeIndex, 0);
    expect(find).toThrow("Bad tool id: 0");
  });
});

describe("findSequenceById()", () => {
  it("throws error", () => {
    const find = () => Selector.findSequenceById(fakeIndex, 0);
    expect(find).toThrow("Bad sequence id: 0");
  });
});

describe("findRegimenById()", () => {
  it("throws error", () => {
    const find = () => Selector.findRegimenById(fakeIndex, 0);
    expect(find).toThrow("Bad regimen id: 0");
  });
});

describe("maybeFindPlantById()", () => {
  it("not found", () => {
    const result = Selector.maybeFindPlantById(fakeIndex, 0);
    expect(result).toBeUndefined();
  });
});

describe("getDeviceAccountSettings", () => {
  const DEV1 = fakeDevice();
  DEV1.uuid = "Device.416.0";

  const DEV2 = fakeDevice();
  DEV2.uuid = "Device.417.0";

  it("crashes if < 1", () => {
    const { index } = buildResourceIndex([]);
    const kaboom = () => Selector.getDeviceAccountSettings(index);
    expect(kaboom).toThrowError();
  });

  it("crashes if > 1", () => {
    const { index } = buildResourceIndex([DEV1, DEV2]);
    const kaboom = () => Selector.getDeviceAccountSettings(index);
    expect(kaboom).toThrowError();
  });

  it("returns exactly one device", () => {
    const { index } = buildResourceIndex([DEV1]);
    const result = Selector.getDeviceAccountSettings(index);
    expect(result.kind).toBe("Device");
  });
});
