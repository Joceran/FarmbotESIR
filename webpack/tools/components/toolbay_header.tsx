import * as React from "react";
import { Col, Row } from "../../ui/index";
import { t } from "i18next";

export function ToolBayHeader(_: {}) {
  return <Row>
    <Col xs={1}>
      <label>{t("Slot")}</label>
    </Col>
    <Col xs={2}>
      <label>{t("X")}</label>
    </Col>
    <Col xs={2}>
      <label>{t("Y")}</label>
    </Col>
    <Col xs={2}>
      <label>{t("Z")}</label>
    </Col>
    <Col xs={4}>
      <label>{t("Tool")}</label>
    </Col>
  </Row>;
}
