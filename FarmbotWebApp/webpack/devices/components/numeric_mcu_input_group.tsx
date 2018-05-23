import * as React from "react";
import { McuInputBox } from "./mcu_input_box";
import { SpacePanelToolTip } from "./space_panel_tool_tip";
import { NumericMCUInputGroupProps } from "./interfaces";
import { Row, Col } from "../../ui/index";

export function NumericMCUInputGroup(props: NumericMCUInputGroupProps) {

  const { sourceFwConfig, dispatch, tooltip, name, x, y, z, intSize, gray
  } = props;
  return <Row>
    <Col xs={6}>
      <label>
        {name}
      </label>
      <SpacePanelToolTip tooltip={tooltip} />
    </Col>
    <Col xs={2}>
      <McuInputBox
        setting={x}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch}
        intSize={intSize}
        gray={gray && gray.x} />
    </Col>
    <Col xs={2}>
      <McuInputBox
        setting={y}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch}
        intSize={intSize}
        gray={gray && gray.y} />
    </Col>
    <Col xs={2}>
      <McuInputBox
        setting={z}
        sourceFwConfig={sourceFwConfig}
        dispatch={dispatch}
        intSize={intSize}
        gray={gray && gray.z} />
    </Col>
  </Row>;
}
