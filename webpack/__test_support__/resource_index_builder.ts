import { resourceReducer, emptyState } from "../resources/reducer";
import {
  TaggedResource, TaggedDevice, TaggedPoint,
  SpecialStatus,
  TaggedLog,
  ResourceName
} from "../resources/tagged_resources";
import * as _ from "lodash";
import { Actions } from "../constants";
export function fakeDevice(): TaggedDevice {
  return {
    "kind": "Device",
    "specialStatus": SpecialStatus.SAVED,
    "body": {
      "id": 415,
      "name": "wispy-firefly-846",
      "tz_offset_hrs": 0
    },
    "uuid": "Device.415.0"
  };
}
const tr1: TaggedResource = {
  "kind": "User",
  "body": {
    "id": 152,
    "name": "FarmBot 1",
    "email": "farmbot1@farmbot.io",
    "created_at": "2017-09-03T20:01:40.336Z",
    "updated_at": "2017-09-27T14:00:47.326Z",
  },
  "specialStatus": SpecialStatus.SAVED,
  "uuid": "User.152.44"
};
const tr2: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "FarmEvent",
  "body": {
    "id": 21,
    "start_time": "2017-05-22T05:00:00.000Z",
    "end_time": "2017-05-30T05:00:00.000Z",
    "repeat": 1,
    "time_unit": "daily",
    "executable_id": 23,
    "executable_type": "Sequence"
  },
  "uuid": "FarmEvent.21.1"
};

const tr3: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "FarmEvent",
  "body": {
    "id": 22,
    "start_time": "2017-05-22T05:00:00.000Z",
    "end_time": "2017-05-29T05:00:00.000Z",
    "repeat": 2,
    "time_unit": "daily",
    "executable_id": 24,
    "executable_type": "Sequence"
  },
  "uuid": "FarmEvent.22.2"
};

const tr4: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Image",
  "body": {
    "id": 415,
    "device_id": 415,
    "attachment_processed_at": undefined,
    "updated_at": "2017-05-24T20:41:19.766Z",
    "created_at": "2017-05-24T20:41:19.766Z",
    "attachment_url": "https://placehold.it/640%3Ftext=Processing...",
    "meta": {
      "x": 928,
      "y": 428,
      "z": 144
    }
  },
  "uuid": "Image.415.3"
};

const tr5: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Image",
  "body": {
    "id": 414,
    "device_id": 415,
    "attachment_processed_at": undefined,
    "updated_at": "2017-05-24T20:41:19.691Z",
    "created_at": "2017-05-24T20:41:19.691Z",
    "attachment_url": "http://placehold.it/640%3Ftext=Processing...",
    "meta": {
      "x": 853,
      "y": 429,
      "z": 165
    }
  },
  "uuid": "Image.414.4"
};

const tr6: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Peripheral",
  "body": {
    "id": 11,
    "pin": 13,
    "label": "LED"
  },
  "uuid": "Peripheral.11.5"
};

const tr7: TaggedPoint = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Point",
  "body": {
    "id": 1392,
    "created_at": "2017-05-24T20:41:19.804Z",
    "updated_at": "2017-05-24T20:41:19.804Z",
    "meta": {

    },
    "name": "fenestrate-flower-3632",
    "pointer_type": "Plant",
    "radius": 46,
    "x": 347,
    "y": 385,
    "z": 0,
    "openfarm_slug": "radish",
    "plant_stage": "planned"
  },
  "uuid": "Point.1392.6"
};

const tr8: TaggedPoint = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Point",
  "body": {
    "id": 1393,
    "created_at": "2017-05-24T20:41:19.822Z",
    "updated_at": "2017-05-24T20:41:19.822Z",
    "meta": {

    },
    "name": "alate-fire-7363",
    "pointer_type": "Plant",
    "radius": 36,
    "x": 727,
    "y": 376,
    "z": 0,
    "openfarm_slug": "garlic",
    "plant_stage": "planned"
  },
  "uuid": "Point.1393.7"
};

const tr9: TaggedPoint = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Point",
  "body": {
    "id": 1394,
    "created_at": "2017-05-24T20:41:19.855Z",
    "updated_at": "2017-05-24T20:41:19.855Z",
    "meta": {
      "color": undefined,
      "created_by": "plant-detection"
    },
    "name": "untitled",
    "pointer_type": "GenericPointer",
    "radius": 6,
    "x": 1245,
    "y": 637,
    "z": 5
  },
  "uuid": "Point.1394.8"
};

const tr10: TaggedPoint = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Point",
  "body": {
    "id": 1395,
    "created_at": "2017-05-24T20:41:19.889Z",
    "updated_at": "2017-05-24T20:41:19.889Z",
    "meta": {
      "color": "gray",
      "created_by": "plant-detection"
    },
    "name": "untitled",
    "pointer_type": "GenericPointer",
    "radius": 10,
    "x": 490,
    "y": 421,
    "z": 5
  },
  "uuid": "Point.1395.9"
};

const tr11: TaggedPoint = {
  "kind": "Point",
  "specialStatus": SpecialStatus.SAVED,
  "body": {
    "id": 1396,
    "created_at": "2017-05-24T20:41:20.112Z",
    "updated_at": "2017-05-24T20:41:20.112Z",
    "meta": {

    },
    "name": "Slot One.",
    "pointer_type": "ToolSlot",
    "pullout_direction": 0,
    "radius": 25,
    "x": 10,
    "y": 10,
    "z": 10,
    "tool_id": 14
  },
  "uuid": "Point.1396.10"
};

const tr12: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Regimen",
  "body": {
    "id": 11,
    "name": "Test Regimen 456",
    "color": "gray",
    "regimen_items": [
      {
        "id": 33,
        "regimen_id": 11,
        "sequence_id": 23,
        "time_offset": 345900000
      }
    ]
  },
  "uuid": "Regimen.11.46"
};

const tr13: TaggedResource = {
  "kind": "Sequence",
  "specialStatus": SpecialStatus.SAVED,
  "body": {
    "id": 23,
    "name": "Goto 0, 0, 0",
    "color": "gray",
    "body": [
      {
        "kind": "move_absolute",
        "args": {
          "location": {
            "kind": "coordinate",
            "args": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "offset": {
            "kind": "coordinate",
            "args": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "speed": 100
        }
      }
    ],
    "args": {
      "version": 4,
      "locals": { kind: "scope_declaration", args: {} },
    },
    "kind": "sequence"
  },
  "uuid": "Sequence.23.47"
};

const tr14: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Tool",
  "body": {
    "id": 14,
    "name": "Trench Digging Tool",
    "status": "active"
  },
  "uuid": "Tool.14.49"
};

const tr15: TaggedResource = {
  "specialStatus": SpecialStatus.SAVED,
  "kind": "Tool",
  "body": {
    "id": 15,
    "name": "Berry Picking Tool",
    "status": "inactive"
  },
  "uuid": "Tool.15.50"
};

const log: TaggedLog = {
  kind: "Log",
  specialStatus: SpecialStatus.SAVED,
  body: {
    id: 1091396, created_at: 1510010193,
    message: "Farmbot Movement complete.",
    type: "success",
    channels: []
  },
  uuid: "Log.1091396.70"
};

export let FAKE_RESOURCES: TaggedResource[] = [tr1, fakeDevice(), tr2, tr3, tr4,
  tr5, tr6, tr7, tr8, tr9, tr10, tr11, tr12, tr13, tr14, tr15, log];

export
  function buildResourceIndex(resources: TaggedResource[] = FAKE_RESOURCES,
    state = emptyState()) {
  const KIND: keyof TaggedResource = "kind"; // Safety first, kids.
  return _(resources)
    .groupBy(KIND)
    .toPairs()
    .map((x: [(TaggedResource["kind"]), TaggedResource[]]) => x)
    .map((y: [ResourceName, TaggedResource[]]) => ({
      type: Actions.RESOURCE_READY,
      payload: { name: y[0], data: y[1].map(x => x.body) }
    }))
    .reduce(resourceReducer, state);
}
