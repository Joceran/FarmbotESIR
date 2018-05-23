import { connectivityReducer, DEFAULT_STATE } from "../reducer";
import { networkUp, networkDown } from "../actions";

describe("connectivityReducer", () => {
  it("goes up", () => {
    const state = connectivityReducer(DEFAULT_STATE, networkUp("user.mqtt"));
    expect(state).toBeDefined();
    const x = state && state["user.mqtt"];
    if (x) {
      expect(x.state).toBe("up");
      expect(x.at).toBeTruthy();
    } else {
      fail();
    }
  });

  it("goes down", () => {
    const state = connectivityReducer(DEFAULT_STATE, networkDown("user.api"));
    const x = state && state["user.api"];
    if (x) {
      expect(x.state).toBe("down");
      expect(x.at).toBeTruthy();
    } else {
      fail();
    }
  });
});
