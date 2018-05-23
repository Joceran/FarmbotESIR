import * as React from "react";
import { getXYFromQuadrant } from "./util";
import { BotExtentsProps } from "./interfaces";

export function BotExtents(props: BotExtentsProps) {
  const { stopAtHome, botSize, mapTransformProps } = props;
  const { quadrant, gridSize } = mapTransformProps;
  const homeLength = getXYFromQuadrant(
    botSize.x.value, botSize.y.value, quadrant, gridSize);
  const homeZero = getXYFromQuadrant(2, 2, quadrant, gridSize);

  return <g
    id="extents"
    strokeWidth={4}
    strokeLinecap="square"
    stroke="rgba(0, 0, 0, 0.2)"
    strokeDasharray={12}>
    <g id="home-lines">
      {stopAtHome.x &&
        <line
          x1={homeZero.qx} y1={homeZero.qy}
          x2={homeZero.qx} y2={homeLength.qy} />
      }
      {stopAtHome.y &&
        <line
          x1={homeZero.qx} y1={homeZero.qy}
          x2={homeLength.qx} y2={homeZero.qy} />
      }
    </g>
    <g id="max-lines">
      {!botSize.x.isDefault &&
        <line
          x1={homeLength.qx} y1={homeZero.qy}
          x2={homeLength.qx} y2={homeLength.qy} />
      }
      {!botSize.y.isDefault &&
        <line
          x1={homeZero.qx} y1={homeLength.qy}
          x2={homeLength.qx} y2={homeLength.qy} />
      }
    </g>
  </g>;
}
