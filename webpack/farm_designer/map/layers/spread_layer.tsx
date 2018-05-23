import * as React from "react";
import { Component } from "react";
import { TaggedPlantPointer } from "../../../resources/tagged_resources";
import { round, getXYFromQuadrant } from "../util";
import { cachedCrop } from "../../../open_farm/icons";
import { MapTransformProps } from "../interfaces";
import { SpreadOverlapHelper } from "../spread_overlap_helper";
import { BotPosition } from "../../../devices/interfaces";
import { Session } from "../../../session";
import { BooleanSetting } from "../../../session_keys";

export interface SpreadLayerProps {
  visible: boolean;
  plants: TaggedPlantPointer[];
  currentPlant: TaggedPlantPointer | undefined;
  mapTransformProps: MapTransformProps;
  dragging: boolean;
  zoomLvl: number;
  activeDragXY: BotPosition | undefined;
  activeDragSpread: number | undefined;
  editing: boolean;
}

export function SpreadLayer(props: SpreadLayerProps) {
  const { plants, visible, mapTransformProps, currentPlant,
    dragging, zoomLvl, activeDragXY, activeDragSpread, editing } = props;
  return <g id="spread-layer">
    <defs>
      <radialGradient id="SpreadGradient">
        <stop offset="90%" stopColor="rgb(85, 50, 10)" stopOpacity={0.1} />
        <stop offset="100%" stopColor="rgb(85, 50, 10)" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="DefaultSpreadGradient">
        <stop offset="90%" stopColor="rgb(255, 255, 255)" stopOpacity={0.1} />
        <stop offset="100%" stopColor="rgb(255, 255, 255)" stopOpacity={0} />
      </radialGradient>
    </defs>

    {plants.map((p) => {
      const selected = !!(currentPlant && (p.uuid === currentPlant.uuid));
      return <g id={"spread-components-" + p.body.id} key={p.uuid}>
        {visible &&
          <SpreadCircle
            plant={p}
            key={"spread-" + p.uuid}
            mapTransformProps={mapTransformProps}
            selected={selected} />}
        <SpreadOverlapHelper
          key={"overlap-" + p.uuid}
          dragging={selected && dragging && editing}
          plant={p}
          mapTransformProps={mapTransformProps}
          zoomLvl={zoomLvl}
          activeDragXY={activeDragXY}
          activeDragSpread={activeDragSpread} />
      </g>;
    })
    }
  </g>;
}

interface SpreadCircleProps {
  plant: TaggedPlantPointer;
  mapTransformProps: MapTransformProps;
  selected: boolean;
}

interface SpreadCircleState {
  spread: number | undefined;
}

export class SpreadCircle extends
  Component<SpreadCircleProps, SpreadCircleState> {

  state: SpreadCircleState = { spread: undefined };

  componentDidMount() {
    cachedCrop(this.props.plant.body.openfarm_slug)
      .then(({ spread }) => this.setState({ spread }));
  }

  render() {
    const { radius, x, y, id } = this.props.plant.body;
    const { selected, mapTransformProps } = this.props;
    const { quadrant, gridSize } = mapTransformProps;
    const { qx, qy } = getXYFromQuadrant(round(x), round(y), quadrant, gridSize);
    const animate = !Session.deprecatedGetBool(BooleanSetting.disable_animations);

    return <g id={"spread-" + id}>
      {!selected &&
        <circle
          className={"spread " + (animate ? "animate" : "")}
          id={"spread-" + id}
          cx={qx}
          cy={qy}
          // Convert `spread` from diameter in cm to radius in mm.
          // `radius * 10` is the default value for spread diameter (in mm).
          r={(this.state.spread || radius) / 2 * 10}
          fill={!this.state.spread
            ? "url(#DefaultSpreadGradient)"
            : "url(#SpreadGradient)"} />}
    </g>;
  }
}
