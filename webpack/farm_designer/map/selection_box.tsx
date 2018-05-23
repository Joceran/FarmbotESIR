import * as React from "react";
import { MapTransformProps } from "./interfaces";
import { transformXY, round } from "./util";
import { isNumber } from "lodash";

export type SelectionBoxData =
  Record<"x0" | "y0" | "x1" | "y1", number | undefined>;

export interface SelectionBoxProps {
  selectionBox: SelectionBoxData;
  mapTransformProps: MapTransformProps;
}

export function SelectionBox(props: SelectionBoxProps) {
  const { x0, y0, x1, y1 } = props.selectionBox;
  if (isNumber(x0) && isNumber(y0) && isNumber(x1) && isNumber(y1)) {
    const initial = transformXY(round(x0), round(y0), props.mapTransformProps);
    const drag = transformXY(round(x1), round(y1), props.mapTransformProps);
    const x = Math.min(initial.qx, drag.qx);
    const y = Math.min(initial.qy, drag.qy);
    const width = Math.max(initial.qx, drag.qx) - x;
    const height = Math.max(initial.qy, drag.qy) - y;
    return <g id="selection-box">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(256,256,256,0.1)"
        stroke="rgba(256,256,256,0.6)"
        strokeWidth={2} />
    </g>;
  } else {
    return <g id="selection-box" />;
  }
}
