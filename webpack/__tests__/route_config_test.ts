jest.mock("fastclick", () => ({ attach: jest.fn() }));

import {
  topLevelRoutes,
  designerRoutes,
  maybeReplaceDesignerModules
} from "../route_config";
import { noop } from "lodash";
import { RouterState, RedirectFunction } from "react-router";

async function makeSureTheyAreRoutes(input: typeof topLevelRoutes.childRoutes) {
  const cb = jest.fn();
  const all = (input || []);
  await Promise.all(all.map(route => (route.getComponent || noop)({} as RouterState, cb)));
  expect(cb).toHaveBeenCalled();
  expect(cb).toHaveBeenCalledTimes(all.length);
  cb.mock.calls.map(x => expect(!!x[1]).toBeTruthy());
}

describe("top level routes", () => {
  it("generates all of them",
    () => makeSureTheyAreRoutes(topLevelRoutes.childRoutes));
});

describe("designer routes", () => {
  it("generates all of them",
    () => makeSureTheyAreRoutes(designerRoutes.childRoutes));
});

describe("maybeReplaceDesignerModules", () => {
  it("does replace the route", () => {
    const pathname = "/app/designer";
    const next = { location: { pathname } } as RouterState;
    const replace = jest.fn() as RedirectFunction;
    maybeReplaceDesignerModules(next, replace);
    expect(replace).toHaveBeenCalledWith(`${pathname}/plants`);
  });

  it("does not replace the route", () => {
    const pathname = "/app/nope";
    const next = { location: { pathname } } as RouterState;
    const replace = jest.fn() as RedirectFunction;
    maybeReplaceDesignerModules(next, replace);
    expect(replace).not.toHaveBeenCalled();
  });
});
