import * as React from "react";
import { Popover, Position } from "@blueprintjs/core";
import { Saucer } from "../ui/index";
import { Color } from "../interfaces";
import { colors } from "../util";

interface PickerProps {
  current: Color;
  onChange?: (color: Color) => void;
}

export class ColorPicker extends React.Component<PickerProps, {}> {

  private renderColors(color: Color, key: number) {
    const isActive = color === this.props.current;
    const cb = this.props.onChange || function () { };
    return <div key={key} onClick={() => cb(color)} >
      <Saucer color={color} active={isActive} />
    </div>;
  }

  public render() {
    return <Popover
      position={Position.BOTTOM}
      popoverClassName="colorpicker-menu gray">
      <Saucer color={this.props.current} />
      <div>
        {colors.map((color, inx) => this.renderColors(color, inx))}
      </div>
    </Popover>;
  }
}
