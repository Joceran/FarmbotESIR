import * as React from "react";
import { Widget, WidgetHeader } from "../../ui/index";
import { t } from "i18next";
import { ToolTips } from "../../constants";
import { WebcamPanelProps } from "./interfaces";
import { KeyValEditRow } from "../key_val_edit_row";
import { SpecialStatus, TaggedWebcamFeed } from "../../resources/tagged_resources";
import * as _ from "lodash";

export function sortedFeeds(feeds: TaggedWebcamFeed[]): TaggedWebcamFeed[] {
  return _.sortBy(feeds, (f) => { return f.body.id || Infinity; });
}

export function Edit(props: WebcamPanelProps) {
  const rows = sortedFeeds(props.feeds).map(wcf => {
    return <KeyValEditRow key={wcf.uuid}
      onClick={() => props.destroy(wcf)}
      onLabelChange={(e) => props.edit(wcf, { name: e.currentTarget.value })}
      onValueChange={(e) => props.edit(wcf, { url: e.currentTarget.value })}
      disabled={true}
      value={wcf.body.url}
      valuePlaceholder={"HTTP://..."}
      label={wcf.body.name}
      labelPlaceholder={t("Feed Name")}
      valueType="string" />;
  });
  const unsaved = props
    .feeds
    .filter(x => x.specialStatus === SpecialStatus.DIRTY);
  return <Widget>
    <WidgetHeader title="Edit" helpText={ToolTips.WEBCAM}>
      <button
        className="fb-button green"
        onClick={props.init}>
        <i className="fa fa-plus" />
      </button>
      <button
        className="fb-button green"
        onClick={() => { unsaved.map(x => props.save(x)); }}>
        {t("Save")}{unsaved.length > 0 ? "*" : ""}
      </button>
      <button
        className="fb-button gray"
        onClick={props.onToggle}>
        {t("View")}
      </button>
    </WidgetHeader>
    <div className="widget-body">
      {rows}
    </div>
  </Widget>;
}
