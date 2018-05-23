import { TaggedSequence, SpecialStatus } from "../tagged_resources";
import { get } from "lodash";
import { maybeTagSteps, getStepTag } from "../sequence_tagging";

describe("maybeTagSteps()", () => {
  const UNTAGGED_SEQUENCE: TaggedSequence = {
    "kind": "Sequence",
    "uuid": "whatever",
    "specialStatus": SpecialStatus.SAVED,
    "body": {
      "id": 8,
      "name": "Goto 0, 0, 0",
      "color": "gray",
      "body": [
        {
          "kind": "move_relative",
          "args": {
            "x": 0,
            "y": 0,
            "z": 0,
            "speed": 100
          },
        }
      ],
      "args": {
        "locals": { kind: "scope_declaration", args: {} },
        "version": 4
      },
      "kind": "sequence"
    },
  };
  it("adds a UUID property to steps", () => {
    const body = UNTAGGED_SEQUENCE.body.body || [];
    expect(body.length).toEqual(1);
    expect(get(body[0], "uuid")).not.toBeDefined();
    expect(() => {
      getStepTag(body[0]);
    }).toThrow();
    maybeTagSteps(UNTAGGED_SEQUENCE);
    expect(get(body[0], "uuid")).toBeDefined();
  });
});
