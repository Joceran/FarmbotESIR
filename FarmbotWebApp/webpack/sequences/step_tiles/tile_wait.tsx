import * as React from "react";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { StepParams } from "../interfaces";
import { ToolTips } from "../../constants";
import { StepWrapper, StepHeader, StepContent } from "../step_ui/index";
import { Row, Col } from "../../ui/index";

export function TileWait({
  dispatch, currentStep, index, currentSequence }: StepParams) {
  const className = "wait-step";
  return <StepWrapper>
    <StepHeader
      className={className}
      helpText={ToolTips.WAIT}
      currentSequence={currentSequence}
      currentStep={currentStep}
      dispatch={dispatch}
      index={index} />
    <StepContent className={className}>
      <Row>
        <Col xs={6} md={3}>
          <label>{t("Time in milliseconds")}</label>
          <StepInputBox dispatch={dispatch}
            step={currentStep}
            sequence={currentSequence}
            index={index}
            field="milliseconds" />
        </Col>
      </Row>
    </StepContent>
  </StepWrapper>;

}
