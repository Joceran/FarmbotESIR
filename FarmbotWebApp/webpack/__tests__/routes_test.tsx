jest.mock("fastclick", () => ({
  attach: jest.fn(),
}));

let mockAuth: AuthState | undefined = undefined;
const mockClear = jest.fn();
jest.mock("../session", () => ({
  Session: {
    fetchStoredToken: jest.fn(() => mockAuth),
    deprecatedGetNum: () => undefined,
    deprecatedGetBool: () => undefined,
    getAll: () => undefined,
    clear: mockClear
  }
}));

import * as React from "react";
import { shallow } from "enzyme";
import { RootComponent } from "../routes";
import { store } from "../redux/store";
import { AuthState } from "../auth/interfaces";
import { auth } from "../__test_support__/fake_state/token";

describe("<RootComponent />", () => {
  beforeEach(function () {
    jest.clearAllMocks();
  });

  it("clears session when not authorized", () => {
    mockAuth = undefined;
    Object.defineProperty(location, "pathname", {
      value: "/app/account"
    });
    shallow(<RootComponent store={store} />);
    expect(mockClear).toHaveBeenCalled();
  });

  it("authorized", () => {
    mockAuth = auth;
    Object.defineProperty(location, "pathname", {
      value: "/app/account"
    });
    shallow(<RootComponent store={store} />);
    expect(mockClear).not.toHaveBeenCalled();
  });
});
