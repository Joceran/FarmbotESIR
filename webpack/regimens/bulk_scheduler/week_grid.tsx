import * as React from "react";
import { WeekRow } from "./week_row";
import { WeekGridProps } from "./interfaces";
import { pushWeek, popWeek, deselectDays, selectDays } from "./actions";
import { t } from "i18next";
import { Row, Col } from "../../ui/index";

export function WeekGrid({ weeks, dispatch }: WeekGridProps) {
  return <div>
    <Row>
      <Col xs={12}>
        <label className="regimen-days-label">
          {t("Days")}
        </label>
        {weeks.map(function (week, i) {
          return <WeekRow key={i} index={i} week={week}
            dispatch={dispatch} />;
        })}
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <div className="week-grid-meta-buttons">
          <button
            className="green widget-control fb-button"
            onClick={() => dispatch(pushWeek())}>
            <i className="fa fa-plus" /> {t("Week")}
          </button>
          <button
            className="red widget-control fb-button"
            onClick={() => dispatch(popWeek())}>
            <i className="fa fa-minus" /> {t("Week")}
          </button>
          <button
            className="gray widget-control fb-button"
            onClick={() => dispatch(deselectDays())}>
            {t("Deselect all")}
          </button>
          <button
            className="gray widget-control fb-button"
            onClick={() => dispatch(selectDays())}>
            {t("Select all")}
          </button>
        </div>
      </Col>
    </Row>
  </div >;
}
