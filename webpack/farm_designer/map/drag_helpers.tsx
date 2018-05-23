import * as React from "react";
import { DragHelpersProps } from "./interfaces";
import { round, getXYFromQuadrant, getMapSize } from "./util";
import { isUndefined } from "util";
import { BotPosition } from "../../devices/interfaces";
import { Color } from "../../ui/index";

enum Alignment {
  NONE = "not aligned",
  HORIZONTAL = "horizontally aligned",
  VERTICAL = "vertically aligned",
  BOTH = "horizontally and vertically aligned"
}

enum Line {
  Left = 0,
  Up = 90,
  Right = 180,
  Down = 270,
}

export function DragHelpers(props: DragHelpersProps) {

  function getAlignment
    (activeXYZ: BotPosition | undefined, plantXYZ: BotPosition): Alignment {
    if (activeXYZ && !isUndefined(activeXYZ.x) && !isUndefined(activeXYZ.y)) {
      // Plant editing (dragging) is occuring
      const activeXY = { x: round(activeXYZ.x), y: round(activeXYZ.y) };
      if (activeXY.x == plantXYZ.x && activeXY.y == plantXYZ.y) {
        return Alignment.BOTH;
      }
      if (activeXY.x == plantXYZ.x) {
        return Alignment.VERTICAL;
      }
      if (activeXY.y == plantXYZ.y) {
        return Alignment.HORIZONTAL;
      }
    }
    return Alignment.NONE;
  }

  function rotationArray(alignment: Alignment): number[] {
    switch (alignment) {
      case (Alignment.HORIZONTAL):
        return [Line.Left, Line.Right];
      case (Alignment.VERTICAL):
        return [Line.Up, Line.Down];
      case (Alignment.BOTH):
        return [Line.Left, Line.Right, Line.Up, Line.Down];
      default:
        return [];
    }
  }

  const {
    dragging, plant, zoomLvl, activeDragXY, mapTransformProps, plantAreaOffset
   } = props;
  const { quadrant, gridSize } = mapTransformProps;
  const mapSize = getMapSize(gridSize, plantAreaOffset);
  const { radius, x, y } = plant.body;

  const scale = 1 + Math.round(15 * (1.8 - zoomLvl)) / 10; // scale factor

  const { qx, qy } = getXYFromQuadrant(round(x), round(y), quadrant, gridSize);
  const gardenCoord: BotPosition = { x: round(x), y: round(y), z: 0 };

  return <g id="drag-helpers" fill={Color.darkGray}>
    {dragging && // Active plant
      <text id="coordinates-tooltip"
        x={qx} y={qy} dy={-20 * scale} fontSize={1.25 * scale + "rem"}>
        {gardenCoord.x}, {gardenCoord.y}
      </text>}
    {dragging && // Active plant
      <g id="long-crosshair">
        <rect x={qx - 0.5} y={-plantAreaOffset.y} width={1} height={mapSize.y} />
        <rect x={-plantAreaOffset.x} y={qy - 0.5} width={mapSize.x} height={1} />
      </g>}
    {dragging && // Active plant
      <g id="short-crosshair">
        <defs>
          <g id={"crosshair-segment-" + plant.body.id}>
            <rect
              x={qx - 10 * scale}
              y={qy - 1 * scale}
              width={8 * scale}
              height={2 * scale} />
          </g>
        </defs>
        {[0, 90, 180, 270].map(rotation => {
          return <use key={rotation.toString()}
            xlinkHref={"#crosshair-segment-" + plant.body.id}
            transform={`rotate(${rotation}, ${qx}, ${qy})`} />;
        })}
      </g>}
    {!dragging && // Non-active plants
      <g id="alignment-indicator" fill={Color.red}>
        <defs>
          <g id={"alignment-indicator-segment-" + plant.body.id}>
            <rect
              x={qx - radius - 10 * scale}
              y={qy - 1 * scale}
              width={8 * scale}
              height={2 * scale} />
          </g>
        </defs>
        {rotationArray(getAlignment(activeDragXY, gardenCoord)).map(rotation => {
          return <use key={rotation.toString()}
            xlinkHref={"#alignment-indicator-segment-" + plant.body.id}
            transform={`rotate(${rotation}, ${qx}, ${qy})`} />;
        })}
      </g>}
  </g>;
}
