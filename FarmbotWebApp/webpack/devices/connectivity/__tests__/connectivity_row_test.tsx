import * as React from "react";
import { render } from "enzyme";
import { ConnectivityRow } from "../connectivity_row";

describe("<ConnectivityRow/>", () => {
  function expectCSS(color: string, givenStatus: boolean | undefined) {
    const el = render(<ConnectivityRow
      connectionStatus={givenStatus} from="A" to="B" />);
    expect(el.find("." + color).length).toBe(2);
  }

  it("renders saucer color: error", () => {
    expectCSS("red", false);
  });

  it("renders saucer color: unknown", () => {
    expectCSS("red", undefined);
  });

  it("renders saucer color: ok", () => {
    expectCSS("green", true);
  });

  it("renders saucer color: header", () => {
    const el = render(<ConnectivityRow from="from" to="to" />);
    expect(el.find(".grey").length).toBe(1);
  });
});
