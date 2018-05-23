import * as React from "react";
import { Row, Col } from "../../../ui/index";
import { t } from "i18next";
import { ColWidth } from "../farmbot_os_settings";
import { ToggleButton } from "../../../controls/toggle_button";
import { updateConfig } from "../../actions";
import { Content } from "../../../constants";
import { AutoUpdateRowProps } from "./interfaces";

export function AutoUpdateRow(props: AutoUpdateRowProps) {
  const osAutoUpdate = props.sourceFbosConfig("os_auto_update");
  return <Row>
    <Col xs={ColWidth.label}>
      <label>
        {t("FARMBOT OS AUTO UPDATE")}
      </label>
    </Col>
    <Col xs={ColWidth.description}>
      <p>
        {t(Content.OS_AUTO_UPDATE)}
      </p>
    </Col>
    <Col xs={ColWidth.button}>
      <ToggleButton toggleValue={osAutoUpdate.value}
        dim={!osAutoUpdate.consistent}
        toggleAction={() => {
          const newOsAutoUpdateNum = !osAutoUpdate.value ? 1 : 0;
          props.dispatch(updateConfig({ os_auto_update: newOsAutoUpdateNum }));
        }} />
    </Col>
  </Row>;
}
