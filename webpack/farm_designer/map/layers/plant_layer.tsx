import * as React from "react";
import { Link } from "react-router";
import * as _ from "lodash";
import { GardenPlant } from "../garden_plant";
import { PlantLayerProps, CropSpreadDict } from "../interfaces";
import { defensiveClone } from "../../../util";
import { maybeNoPointer } from "../maybe_no_pointer";

const cropSpreadDict: CropSpreadDict = {};

export function PlantLayer(props: PlantLayerProps) {
  const {
    mapTransformProps,
    dispatch,
    visible,
    plants,
    crops,
    currentPlant,
    dragging,
    editing,
    selectedForDel,
    zoomLvl,
    activeDragXY,
  } = props;

  crops
    .filter(c => !!c.body.spread)
    .map(c => cropSpreadDict[c.body.slug] = c.body.spread);

  return <g id="plant-layer">
    {visible &&
      plants
        .filter(x => !!x.body.id)
        .map(p => defensiveClone(p))
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
            style={maybeNoPointer({})}
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
              zoomLvl={zoomLvl}
              activeDragXY={activeDragXY} />
          </Link>;
        })}
  </g>;
}
