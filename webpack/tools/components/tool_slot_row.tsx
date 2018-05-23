import * as React from "react";
import { Row, Col, FBSelect, DropDownItem } from "../../ui";
import { Popover, Position } from "@blueprintjs/core";
import { SlotMenu } from "./toolbay_slot_menu";
import { TaggedToolSlotPointer } from "../../resources/tagged_resources";
import { destroy } from "../../api/crud";
import { Xyz } from "../../devices/interfaces";
import { ToolBayNumberCol } from "./toolbay_number_column";

interface ToolSlotRowProps {
  dispatch: Function;
  slot: TaggedToolSlotPointer;
  botPosition: Record<"x" | "y" | "z", number | undefined>;
  /** List of all legal tool options for the current tool slot. */
  toolOptions: DropDownItem[];
  /** The current tool (if any) in the slot. */
  chosenToolOption: DropDownItem;
  /** Broadcast tool change back up to parent. */
  onToolSlotChange(item: DropDownItem): void;
}

type Axis = Xyz & keyof (TaggedToolSlotPointer["body"]);
const axes: Axis[] = ["x", "y", "z"];

export function ToolSlotRow(p: ToolSlotRowProps) {
  const {
    dispatch,
    slot,
    botPosition,
    toolOptions,
    onToolSlotChange,
    chosenToolOption
  } = p;

  return <Row>
    <Col xs={1}>
      <Popover position={Position.BOTTOM_LEFT}>
        <i className="fa fa-gear" />
        <SlotMenu
          dispatch={dispatch}
          slot={slot}
          botPosition={botPosition} />
      </Popover>
    </Col>
    {
      axes
        .map(axis => ({ axis, dispatch, slot, value: (slot.body[axis] || 0) }))
        .map((props) =>
          <ToolBayNumberCol key={slot.uuid + props.axis} {...props} />)
    }
    <Col xs={4}>
      <FBSelect
        list={toolOptions}
        selectedItem={chosenToolOption}
        allowEmpty={true}
        onChange={onToolSlotChange} />
    </Col>
    <Col xs={1}>
      <button
        className="red fb-button del-button"
        onClick={() => dispatch(destroy(slot.uuid))}>
        <i className="fa fa-times" />
      </button>
    </Col>
  </Row>;
}
