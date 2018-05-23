import * as React from "react";
import { equals } from "../util";

interface BIProps {
  value: string | number;
  onCommit(e: React.SyntheticEvent<HTMLInputElement>): void;
  min?: number;
  max?: number;
  type?:
  | "text"
  | "number"
  | "email"
  | "password"
  | "time"
  | "date"
  | "hidden";
  name?: string;
  id?: string;
  /** Allow the user to empty out the form control. If unset, form control
   * will reset itself to previous value. */
  allowEmpty?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  hidden?: boolean;
}

interface BIState {
  buffer: string;
  isEditing: boolean;
}

export class BlurableInput extends React.Component<BIProps, Partial<BIState>> {

  state: BIState = { buffer: "", isEditing: false };

  /** Called on blur. */
  maybeCommit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const shouldPassToParent = (this.state.buffer || (this.props.allowEmpty));
    if (shouldPassToParent) { this.props.onCommit(e); }
    this.setState({ isEditing: false, buffer: "" });
  }

  focus = () => {
    const { value } = this.props;
    this.setState({ isEditing: true, buffer: "" + (value || "") });
  }

  updateBuffer = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const buffer = e.currentTarget.value;
    this.setState({ buffer });
  }

  usualProps = () => {
    const value = this.state.isEditing ?
      this.state.buffer : this.props.value;
    return {
      value: value,
      hidden: !!this.props.hidden,
      onFocus: this.focus,
      onChange: this.updateBuffer,
      onSubmit: this.maybeCommit,
      onBlur: this.maybeCommit,
      name: this.props.name,
      id: this.props.id,
      type: this.props.type || "text",
      disabled: this.props.disabled,
      className: this.props.className,
      placeholder: this.props.placeholder,
    };
  }

  shouldComponentUpdate(nextProps: BIProps, nextState: Partial<BIState>) {
    return !equals(this.props, nextProps) || !equals(this.state, nextState);
  }

  render() {
    return <input {...this.usualProps() } />;
  }
}
