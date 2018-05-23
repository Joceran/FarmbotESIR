import * as React from "react";
import { t } from "i18next";
import { timezoneMismatch } from "../../devices/timezones/guess_timezone";
import { Content } from "../../constants";

interface TzWarningProps {
  deviceTimezone: string | undefined;
}

export function TzWarning({ deviceTimezone }: TzWarningProps) {
  return <div className="note">
    {timezoneMismatch(deviceTimezone) ? t(Content.FARM_EVENT_TZ_WARNING) : ""}
  </div>;
}
