/** Given a dropdown item and a ResourceIndex,
 * figures out the corresponding Tool | Coordinate | Point */
import { DropDownItem } from "../../../ui/index";
import { ResourceIndex } from "../../../resources/interfaces";
import { KnownGroupTag, LocationData } from "./interfaces";
import { findPointerByTypeAndId, findToolById } from "../../../resources/selectors";
import { bail } from "../../../util";

/** Takes a DropDownItem and turns it into data suitable
 * for MoveAbsolute["args"]["location"] */
export let handleSelect = (index: ResourceIndex, input: DropDownItem): LocationData => {
  const tag = input.headingId as KnownGroupTag;
  const id = parseInt("" + input.value);
  switch (tag) {
    case "ToolSlot":
    case "GenericPointer":
    case "Plant":
      const p = findPointerByTypeAndId(index, tag, id);
      if (p && p.body.id) {
        return {
          kind: "point",
          args: { pointer_type: tag, pointer_id: p.body.id }
        };
      } else {
        return bail("Bad point_id: " + JSON.stringify(p));
      }
    case "Tool":
      const tool_id = findToolById(index, id)
        .body
        .id || bail("No id");
      return { kind: "tool", args: { tool_id } };
    case "identifier":
      return {
        kind: "identifier",
        args: {
          label: "" + input.value
        }
      };
    default:
      return { kind: "coordinate", args: { x: 0, y: 0, z: 0 } };
  }
};
