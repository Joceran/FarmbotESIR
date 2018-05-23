import * as React from "react";
import { GridProps } from "./interfaces";
import { getXYFromQuadrant, transformForQuadrant } from "./util";
import * as _ from "lodash";
import { Color } from "../../ui/index";

export function Grid(props: GridProps) {
  const { quadrant, gridSize } = props.mapTransformProps;
  const origin = getXYFromQuadrant(0, 0, quadrant, gridSize);
  const arrowEnd = getXYFromQuadrant(25, 25, quadrant, gridSize);
  const xLabel = getXYFromQuadrant(15, -10, quadrant, gridSize);
  const yLabel = getXYFromQuadrant(-11, 18, quadrant, gridSize);
  return <g className="drop-area-background" onClick={props.onClick}>
    <defs>
      <pattern id="minor_grid"
        width={10} height={10} patternUnits="userSpaceOnUse">
        <path d="M10,0 L0,0 L0,10" strokeWidth={1}
          fill="none" stroke="rgba(0, 0, 0, 0.15)" />
      </pattern>

      <pattern id={"major_grid"}
        width={100} height={100} patternUnits="userSpaceOnUse">
        <path d="M100,0 L0,0 0,100" strokeWidth={2}
          fill="none" stroke="rgba(0, 0, 0, 0.15)" />
      </pattern>

      <marker id="arrow"
        markerWidth={10} markerHeight={10} refX={0} refY={2} orient="auto"
        markerUnits="strokeWidth">
        <path d="M0,0 L0,4 L5,2 z" fill={Color.gridGray} />
      </marker>
    </defs>

    <g id="grid">
      <rect id="minor-grid"
        width={gridSize.x} height={gridSize.y} fill="url(#minor_grid)" />
      <rect id="major-grid" transform={transformForQuadrant(quadrant, gridSize)}
        width={gridSize.x} height={gridSize.y} fill="url(#major_grid)" />
      <rect id="border" width={gridSize.x} height={gridSize.y} fill="none"
        stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
    </g>

    <g id="origin-marker">
      <circle cx={origin.qx} cy={origin.qy} r={4} fill={Color.gridGray} />
      <g id="axis-labels" fontFamily="Arial" fontSize="10"
        textAnchor="middle" dominantBaseline="central">
        <text x={xLabel.qx} y={xLabel.qy}>X</text>
        <text x={yLabel.qx} y={yLabel.qy}>Y</text>
      </g>
      <g id="axis-arrows"
        stroke={Color.gridGray} strokeWidth="3" markerEnd="url(#arrow)">
        <line x1={origin.qx} y1={origin.qy} x2={arrowEnd.qx} y2={origin.qy} />
        <line x1={origin.qx} y1={origin.qy} x2={origin.qx} y2={arrowEnd.qy} />
      </g>
    </g>

    <g id="axis-values" fontFamily="Arial" fontSize="10"
      textAnchor="middle" dominantBaseline="central" fill="rgba(0, 0, 0, 0.3)">
      {_.range(100, gridSize.x, 100).map((i) => {
        const location = getXYFromQuadrant(i, -10, quadrant, gridSize);
        return <text key={"x-label-" + i}
          x={location.qx} y={location.qy}>{i}</text>;
      })}
      {_.range(100, gridSize.y, 100).map((i) => {
        const location = getXYFromQuadrant(-15, i, quadrant, gridSize);
        return <text key={"y-label-" + i}
          x={location.qx} y={location.qy}>{i}</text>;
      })}
    </g>
  </g>;
}
