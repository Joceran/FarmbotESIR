import * as _ from "lodash";
import * as React from "react";
import { t } from "i18next";
import { Component } from "react";
import { StepParams } from "../interfaces";
import { MoveAbsState } from "../interfaces";
import {
  Tool,
  Coordinate,
  LegalSequenceKind,
  Point,
  Identifier,
  MoveAbsolute
} from "farmbot";
import { Row, Col } from "../../ui/index";
import {
  isTaggedSequence,
  TaggedTool,
  TaggedToolSlotPointer
} from "../../resources/tagged_resources";
import {
  findToolById,
  findSlotByToolId,
  findPointerByTypeAndId
} from "../../resources/selectors";
import { defensiveClone, betterMerge } from "../../util";
import { overwrite } from "../../api/crud";
import { Xyz } from "../../devices/interfaces";
import { TileMoveAbsSelect, InputBox } from "./tile_move_absolute/index";
import { ToolTips } from "../../constants";
// import { extractParent } from "../locals_list";
import {
  StepWrapper,
  StepHeader,
  StepContent,
  StepWarning,
  conflictsString
} from "../step_ui/index";
import { StepInputBox } from "../inputs/step_input_box";

interface Args {
  location: Tool | Coordinate | Point | Identifier;
  speed: number;
  offset: Coordinate;
}
type LocationArg = "location" | "offset";

export class TileMoveAbsolute extends Component<StepParams, MoveAbsState> {
  get resources() { return this.props.resources; }
  get step() { return this.props.currentStep; }
  get tool(): TaggedTool | undefined {
    const l = this.args.location;
    if (l && l.kind === "tool" && l.args.tool_id) {
      return findToolById(this.resources, l.args.tool_id);
    }
  }
  get tool_id() { return this.tool && this.tool.body.id; }
  get slot(): TaggedToolSlotPointer | undefined {
    return (this.tool_id) ?
      findSlotByToolId(this.resources, this.tool_id) : undefined;
  }
  get args() {
    // Incase we rename it later:
    const MOVE_ABSOLUTE: LegalSequenceKind = "move_absolute";
    if (this.step.kind === MOVE_ABSOLUTE) {
      return this.step.args;
    } else {
      throw new Error("Impossible celery node detected.");
    }
  }

  get xyzDisabled(): boolean {
    type Keys = MoveAbsolute["args"]["location"]["kind"];
    const choices: Keys[] = ["point", "tool", "identifier"];
    return !!choices.includes(this.args.location.kind);
  }

  getOffsetValue = (val: Xyz) => {
    return (this.args.offset.args[val] || 0).toString();
  }

  updateArgs = (update: Partial<Args>) => {
    const copy = defensiveClone(this.props.currentSequence).body;
    const step = (copy.body || [])[this.props.index];
    if (step && step.kind === "move_absolute") {
      // TODO: Hacky...Something off with the copying here
      delete step.args.location.args;
      step.args = betterMerge(step.args, update);
      this.props.dispatch(overwrite(this.props.currentSequence, copy));
    } else {
      throw new Error("Impossible condition.");
    }
  }

  getAxisValue = (axis: Xyz): string => {
    let number: number | undefined;
    // const { locals } = this.props.currentSequence.body.args;
    // if (!locals) { return "-9"; }
    // const { body } = this.props.currentSequence.body.args.locals;
    // const parent = extractParent(body);
    // const maybe = ((parent && parent.args.data_value) || this.args.location);
    // const l = this.args.location.kind === "identifier" ?
    //   maybe : this.args.location;
    const l = this.args.location;
    switch (l.kind) {
      case "coordinate":
        number = l.args[axis];
        break;
      case "tool":
        number = (this.slot) ? this.slot.body[axis] : undefined;
        break;
      case "point":
        const { pointer_id, pointer_type } = l.args;
        number = findPointerByTypeAndId(this.resources,
          pointer_type,
          pointer_id).body[axis];
        break;
    }
    return (number || 0).toString();
  }

  updateInputValue = (axis: Xyz, place: LocationArg) =>
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const num = parseInt(e.currentTarget.value, 10);
      const update = { [place]: { args: { [axis]: num } } };
      this.updateArgs(_.merge({}, this.args, update));
    }

  get settingConflicts(): Record<Xyz, boolean> {
    const conflicts = { x: false, y: false, z: false };
    if (this.props.hardwareFlags) {
      const {
        stopAtHome, stopAtMax, negativeOnly, axisLength
      } = this.props.hardwareFlags;
      const axes: Xyz[] = ["x", "y", "z"];
      axes.map((axis: Xyz) => {
        const coord = parseFloat(this.getAxisValue(axis));
        const offset = parseFloat(this.getOffsetValue(axis));
        const sum = coord + offset;
        if (stopAtHome[axis]) {
          conflicts[axis] = negativeOnly[axis] ? sum > 0 : sum < 0;
        }
        if (stopAtMax[axis] && axisLength[axis] !== 0) {
          conflicts[axis] = conflicts[axis] || (negativeOnly[axis]
            ? sum < -axisLength[axis]
            : sum > axisLength[axis]);
        }
      });
    }
    return conflicts;
  }

  get settingConflictWarning() {
    return "Movement out of bounds for: "
      + conflictsString(this.settingConflicts);
  }

  render() {
    const { currentStep, dispatch, index, currentSequence } = this.props;
    if (currentSequence && !isTaggedSequence(currentSequence)) {
      throw new Error("WHOOPS!");
    }

    const className = "move-absolute-step";
    return <StepWrapper>
      <StepHeader
        className={className}
        helpText={ToolTips.MOVE_ABSOLUTE}
        currentSequence={currentSequence}
        currentStep={currentStep}
        dispatch={dispatch}
        index={index}>
        {_.some(this.settingConflicts) &&
          <StepWarning
            warning={this.settingConflictWarning}
            conflicts={this.settingConflicts} />}
      </StepHeader>
      <StepContent className={className}>
        <Row>
          <Col md={12}>
            <label>{t("Import coordinates from")}</label>
            <TileMoveAbsSelect
              resources={this.resources}
              selectedItem={this.args.location}
              onChange={(location) => this.updateArgs({ location })}
              shouldDisplay={this.props.shouldDisplay || (() => false)} />
          </Col>
          <Col xs={3}>
            <InputBox
              onCommit={this.updateInputValue("x", "location")}
              disabled={this.xyzDisabled}
              name="location-x"
              value={this.getAxisValue("x")}>
              {t("X (mm)")}
            </InputBox>
          </Col>
          <Col xs={3}>
            <InputBox
              onCommit={this.updateInputValue("y", "location")}
              disabled={this.xyzDisabled}
              name="location-y"
              value={this.getAxisValue("y")}>
              {t("Y (mm)")}
            </InputBox>
          </Col>
          <Col xs={3}>
            <InputBox
              onCommit={this.updateInputValue("z", "location")}
              name="location-z"
              disabled={this.xyzDisabled}
              value={this.getAxisValue("z")}>
              {t("Z (mm)")}
            </InputBox>
          </Col>
          <Col xs={3}>
            <label>
              {t("Speed (%)")}
            </label>
            <StepInputBox
              field={"speed"}
              step={this.step}
              index={index}
              dispatch={this.props.dispatch}
              sequence={this.props.currentSequence} />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <InputBox
              onCommit={this.updateInputValue("x", "offset")}
              name="offset-x"
              value={this.getOffsetValue("x")}>
              {t("X-Offset")}
            </InputBox>
          </Col>
          <Col xs={3}>
            <InputBox
              onCommit={this.updateInputValue("y", "offset")}
              name="offset-y"
              value={this.getOffsetValue("y")}>
              {t("Y-Offset")}
            </InputBox>
          </Col>
          <Col xs={3}>
            <InputBox
              onCommit={this.updateInputValue("z", "offset")}
              name="offset-z"
              value={this.getOffsetValue("z")}>
              {t("Z-Offset")}
            </InputBox>
          </Col>
        </Row>
      </StepContent>
    </StepWrapper>;
  }
}
