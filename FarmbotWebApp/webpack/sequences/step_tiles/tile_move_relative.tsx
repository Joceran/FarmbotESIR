import * as React from "react";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { StepParams } from "../interfaces";
import { ToolTips } from "../../constants";
import { StepWrapper, StepHeader, StepContent } from "../step_ui/index";
import { Row, Col } from "../../ui/index";

export function TileMoveRelative({
  dispatch, currentStep, index, currentSequence }: StepParams) {
  const className = "move-relative-step";
  return <StepWrapper>
    <StepHeader
      className={className}
      helpText={ToolTips.MOVE_RELATIVE}
      currentSequence={currentSequence}
      currentStep={currentStep}
      dispatch={dispatch}
      index={index} />
    <StepContent className={className}>
      <Row>
        <Col xs={6} md={3}>
          <label>{t("X (mm)")}</label>
          <StepInputBox dispatch={dispatch}
            step={currentStep}
            sequence={currentSequence}
            index={index}
            field="x" />
        </Col>
        <Col xs={6} md={3}>
          <label>{t("Y (mm)")}</label>
          <StepInputBox dispatch={dispatch}
            step={currentStep}
            sequence={currentSequence}
            index={index}
            field="y" />
        </Col>
        <Col xs={6} md={3}>
          <label>{t("Z (mm)")}</label>
          <StepInputBox dispatch={dispatch}
            step={currentStep}
            sequence={currentSequence}
            index={index}
            field="z" />
        </Col>
        <Col xs={6} md={3}>
          <label>{t("Speed (%)")}</label>
          <StepInputBox dispatch={dispatch}
            step={currentStep}
            sequence={currentSequence}
            index={index}
            field="speed" />
        </Col>
      </Row>
    </StepContent>
  </StepWrapper>;
}
