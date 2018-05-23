import * as React from "react";
import { t } from "i18next";
import { EditPlantInfoProps, PlantOptions } from "../interfaces";
import { history, getPathArray } from "../../history";
import { destroy, edit, save } from "../../api/crud";

export abstract class PlantInfoBase extends
  React.Component<EditPlantInfoProps, {}> {

  get stringyID() { return getPathArray()[4] || ""; }

  get plant() { return this.props.findPlant(this.stringyID); }

  destroy = (plantUUID: string) => {
    this.props.dispatch(destroy(plantUUID))
      .then(() => history.push("/app/designer/plants"), () => { });
  }

  updatePlant = (plantUUID: string, update: PlantOptions) => {
    if (this.plant) {
      this.props.dispatch(edit(this.plant, update));
      this.props.dispatch(save(plantUUID));
    }
  }

  fallback = () => {
    history.push("/app/designer/plants");
    return <span>{t("Redirecting...")}</span>;
  }

}
