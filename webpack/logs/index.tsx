import * as React from "react";
import * as moment from "moment";
import { connect } from "react-redux";
import { Col, Row, Page, ToolTip } from "../ui/index";
import { mapStateToProps } from "./state_to_props";
import { t } from "i18next";
import { Popover, Position } from "@blueprintjs/core";
import { LogsState, LogsProps, Filters } from "./interfaces";
import { ToolTips } from "../constants";
import { LogsSettingsMenu } from "./components/settings_menu";
import { LogsFilterMenu } from "./components/filter_menu";
import { LogsTable } from "./components/logs_table";
import { Session, safeNumericSetting } from "../session";
import { isUndefined } from "lodash";
import { NumericSetting } from "../session_keys";
import { NumberConfigKey } from "../config_storage/web_app_configs";

/** Format log date and time for display in the app. */
export const formatLogTime = (created_at: number, timeoffset: number) =>
  moment.unix(created_at).utcOffset(timeoffset).format("MMM D, h:mma");

@connect(mapStateToProps)
export class Logs extends React.Component<LogsProps, Partial<LogsState>> {

  /** Initialize log type verbosity level to the configured or default value. */
  initialize = (name: NumberConfigKey, defaultValue: number): number => {
    const currentValue = Session.deprecatedGetNum(safeNumericSetting(name));
    if (isUndefined(currentValue)) {
      Session.deprecatedSetNum(safeNumericSetting(name), defaultValue);
      return defaultValue;
    } else {
      return currentValue;
    }
  }

  state: LogsState = {
    autoscroll: false,
    success: this.initialize(NumericSetting.success_log, 1),
    busy: this.initialize(NumericSetting.busy_log, 1),
    warn: this.initialize(NumericSetting.warn_log, 1),
    error: this.initialize(NumericSetting.error_log, 1),
    info: this.initialize(NumericSetting.info_log, 1),
    fun: this.initialize(NumericSetting.fun_log, 1),
    debug: this.initialize(NumericSetting.debug_log, 1),
  };

  /** Toggle display of a log type. Verbosity level 0 hides all, 3 shows all.*/
  toggle = (name: keyof Filters) => {
    // If log type is off, set it to verbosity level 1, otherwise turn it off
    const newSetting = this.state[name] === 0 ? 1 : 0;
    return () => {
      this.setState({ [name]: newSetting });
      Session.deprecatedSetNum(safeNumericSetting(name + "_log"), newSetting);
    };
  }

  /** Set log type filter level. i.e., level 2 shows verbosity 2 and lower.*/
  setFilterLevel = (name: keyof Filters) => {
    return (value: number) => {
      this.setState({ [name]: value });
      Session.deprecatedSetNum(safeNumericSetting(name + "_log"), value);
    };
  };

  /** Determine if log type filters are active. */
  get filterActive() {
    const filterKeys = Object.keys(this.state)
      .filter(x => !(x === "autoscroll"));
    const filterValues = filterKeys
      .map((key: keyof Filters) => this.state[key]);
    // Filters active if every log type level is not equal to 3 (max verbosity)
    return !filterValues.every(x => x == 3);
  }

  render() {
    const filterBtnColor = this.filterActive ? "green" : "gray";
    return <Page className="logs">
      <Row>
        <Col xs={10}>
          <h3>
            <i>{t("Logs")}</i>
          </h3>
          <ToolTip helpText={ToolTips.LOGS} />
        </Col>
        <Col xs={2}>
          <div className={"settings-menu-button"}>
            <Popover position={Position.BOTTOM_RIGHT}>
              <i className="fa fa-gear" />
              <LogsSettingsMenu
                setFilterLevel={this.setFilterLevel}
                dispatch={this.props.dispatch}
                sourceFbosConfig={this.props.sourceFbosConfig} />
            </Popover>
          </div>
          <div className={"settings-menu-button"}>
            <Popover position={Position.BOTTOM_RIGHT}>
              <button className={`fb-button ${filterBtnColor}`}>
                {this.filterActive ? t("Filters active") : t("filter")}
              </button>
              <LogsFilterMenu
                toggle={this.toggle} state={this.state}
                setFilterLevel={this.setFilterLevel} />
            </Popover>
          </div>
        </Col>
      </Row>
      <Row>
        <LogsTable logs={this.props.logs}
          state={this.state}
          timeOffset={this.props.timeOffset} />
      </Row>
    </Page>;
  }
}
