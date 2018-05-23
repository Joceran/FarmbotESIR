import * as React from "react";
import { Link } from "react-router";
import * as _ from "lodash";
import { GardenPlant } from "../garden_plant";
import { PlantLayerProps, CropSpreadDict } from "../interfaces";
import { defensiveClone } from "../../../util";
import { getMode, Mode } from "../garden_map";

const cropSpreadDict: CropSpreadDict = {};

export function PlantLayer(props: PlantLayerProps) {
  const {
    crops,
    plants,
    dispatch,
    visible,
    currentPlant,
    dragging,
    editing,
    selectedForDel,
    mapTransformProps
  } = props;

  crops
    .filter(c => !!c.body.spread)
    .map(c => cropSpreadDict[c.body.slug] = c.body.spread);

  const maybeNoPointer = () => {
    switch (getMode()) {
      case Mode.boxSelect:
      case Mode.clickToAdd:
      case Mode.moveTo:
      case Mode.createPoint:
        return { "pointerEvents": "none" };
      default:
        return {};
    }
  };

  return <g id="plant-layer">
    {visible &&
      plants
        .filter(x => !!x.body.id)
        .map(p => defensiveClone(p))
        .map(p => {
          return p;
        })
        .map(p => {
          return {
            selected: !!(currentPlant && (p.uuid === currentPlant.uuid)),
            grayscale: !!(selectedForDel && (selectedForDel.includes(p.uuid))),
            plantId: (p.body.id || "IMPOSSIBLE_ERR_NO_PLANT_ID").toString(),
            uuid: p.uuid,
            plant: p
          };
        })
        .map(p => {
          return <Link className="plant-link-wrapper"
            style={maybeNoPointer()}
            to={"/app/designer/plants/" + p.plantId}
            id={p.plantId}
            onClick={_.noop}
            key={p.plantId}>
            <GardenPlant
              uuid={p.uuid}
              mapTransformProps={mapTransformProps}
              plant={p.plant}
              selected={p.selected}
              grayscale={p.grayscale}
              dragging={p.selected && dragging && editing}
              dispatch={dispatch}
              zoomLvl={props.zoomLvl}
              activeDragXY={props.activeDragXY} />
          </Link>;
        })}
  </g>;
}
