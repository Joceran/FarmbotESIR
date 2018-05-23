jest.mock("../auto_sync", () => ({
  handleCreateOrUpdate: jest.fn()
}));

jest.mock("../../resources/actions", () => ({
  destroyOK: jest.fn()
}));

import { fakeState } from "../../__test_support__/fake_state";
import { GetState } from "../../redux/interfaces";
import { handleInbound } from "../auto_sync_handle_inbound";
import {
  handleCreateOrUpdate
} from "../auto_sync";
import { destroyOK } from "../../resources/actions";
import { SkipMqttData, BadMqttData, UpdateMqttData, DeleteMqttData } from "../interfaces";

describe("handleInbound()", () => {
  const dispatch = jest.fn();
  const getState: GetState = jest.fn(fakeState);

  it("handles SKIP", () => {
    jest.clearAllMocks();
    const fixtr: SkipMqttData = { status: "SKIP" };
    const result = handleInbound(dispatch, getState, fixtr);
    expect(result).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
    expect(getState).not.toHaveBeenCalled();
  });

  it("handles ERR", () => {
    jest.clearAllMocks();
    const fixtr: BadMqttData = { status: "ERR", reason: "Whatever" };
    const result = handleInbound(dispatch, getState, fixtr);
    expect(result).toBeUndefined();
    expect(dispatch).not.toHaveBeenCalled();
    expect(getState).not.toHaveBeenCalled();
  });

  it("handles UPDATE", () => {
    jest.clearAllMocks();
    const fixtr: UpdateMqttData = {
      status: "UPDATE",
      kind: "Sequence",
      id: 4,
      body: {},
      sessionId: "456"
    };
    handleInbound(dispatch, getState, fixtr);
    expect(handleCreateOrUpdate).toHaveBeenCalled();
  });

  it("handles DELETE when the record is in system", () => {
    jest.clearAllMocks();
    const i = getState().resources.index.byKind.Sequence;
    // Pick an ID that we know will be in the DB
    const id = parseInt(Object.values(i)[0].split(".")[1], 10);
    const fixtr: DeleteMqttData = { status: "DELETE", kind: "Sequence", id };
    handleInbound(dispatch, getState, fixtr);
    expect(dispatch).toHaveBeenCalled();
    expect(destroyOK).toHaveBeenCalled();
  });

  it("handles DELETE when the record is *not* in system", () => {
    jest.clearAllMocks();
    const fixtr: DeleteMqttData = {
      status: "DELETE",
      kind: "Sequence",
      id: -1
    };
    handleInbound(dispatch, getState, fixtr);
    expect(dispatch).not.toHaveBeenCalled();
    expect(destroyOK).not.toHaveBeenCalled();
  });
});
