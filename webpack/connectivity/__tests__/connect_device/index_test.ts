jest.mock("farmbot-toastr", () => ({
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn()
}));

jest.mock("../../index", () => ({
  dispatchNetworkUp: jest.fn(),
  dispatchNetworkDown: jest.fn()
}));

const mockDevice = {
  readStatus: jest.fn(() => Promise.resolve()),
};

jest.mock("../../../device", () => ({
  getDevice: () => (mockDevice)
}));

let mockConfigValue = false;
jest.mock("../../../config_storage/actions", () => {
  return {
    getWebAppConfigValue: () => () => mockConfigValue,
  };
});

import { HardwareState } from "../../../devices/interfaces";
import {
  incomingStatus,
  actOnChannelName,
  showLogOnScreen,
  TITLE,
  bothUp,
  initLog,
  readStatus,
  onOffline,
  changeLastClientConnected,
  onSent,
  onOnline,
  onMalformed,
  onLogs,
  speakLogAloud
} from "../../connect_device";
import { Actions, Content } from "../../../constants";
import { Log } from "../../../interfaces";
import { ALLOWED_CHANNEL_NAMES, ALLOWED_MESSAGE_TYPES, Farmbot } from "farmbot";
import { success, error, info, warning } from "farmbot-toastr";
import { dispatchNetworkUp, dispatchNetworkDown } from "../../index";
import { getDevice } from "../../../device";
import { fakeState } from "../../../__test_support__/fake_state";
import { talk } from "browser-speech";

describe("readStatus()", () => {
  it("forces a read_status request to FarmBot", () => {
    readStatus();
    expect(getDevice().readStatus).toHaveBeenCalled();
  });
});

describe("incomingStatus", () => {
  it("creates an action", () => {
    const stub = {} as HardwareState;
    const result = incomingStatus(stub);
    expect(result.type).toEqual(Actions.BOT_CHANGE);
    expect(result.payload).toEqual(stub);
  });
});

function fakeLog(meta_type: ALLOWED_MESSAGE_TYPES,
  channels: ALLOWED_CHANNEL_NAMES[] = ["toast"]): Log {
  return {
    message: "toasty!",
    type: meta_type,
    channels,
    created_at: -1
  };
}

describe("actOnChannelName()", () => {
  it("skips irrelevant channels like `email`", () => {
    const callback = jest.fn();
    actOnChannelName(fakeLog("success", ["email"]), "toast", callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it("executes callback for `toast` type", () => {
    const callback = jest.fn();
    const fakeToast = fakeLog("success", ["toast", "email"]);
    actOnChannelName(fakeToast, "toast", callback);
    expect(callback).toHaveBeenCalledWith(fakeToast);
  });
});

describe("showLogOnScreen", () => {

  function assertToastr(types: ALLOWED_MESSAGE_TYPES[], toastr: Function) {
    jest.resetAllMocks();
    types.map((x) => {
      const fun = fakeLog(x, ["toast"]);
      showLogOnScreen(fun);
      expect(toastr).toHaveBeenCalledWith(fun.message, TITLE);
    });
  }

  it("routes `fun`, `info` and all others to toastr.info()", () => {
    assertToastr(["fun", "info", ("FOO" as ALLOWED_MESSAGE_TYPES)], info);
  });

  it("routes `busy`, `warn` and `error` to toastr.error()", () => {
    assertToastr(["busy", "warn", "error"], error);
  });

  it("routes `success` to toastr.success()", () => {
    assertToastr(["success"], success);
  });
});

describe("speakLogAloud", () => {
  const fakeSpeakLog = fakeLog("info");
  fakeSpeakLog.message = "hello";

  it("doesn't call browser-speech", () => {
    mockConfigValue = false;
    const speak = speakLogAloud(jest.fn());
    speak(fakeSpeakLog);
    expect(talk).not.toHaveBeenCalled();
  });

  it("calls browser-speech", () => {
    mockConfigValue = true;
    const speak = speakLogAloud(jest.fn());
    Object.defineProperty(navigator, "language", {
      value: "en_us", configurable: true
    });
    speak(fakeSpeakLog);
    expect(talk).toHaveBeenCalledWith("hello", "en");
  });
});

describe("initLog", () => {
  it("creates a Redux action (new log)", () => {
    const log = fakeLog("error");
    const action = initLog(log);
    expect(action.payload.kind).toBe("Log");
    // expect(action.payload.specialStatus).toBe(undefined);
    if (action.payload.kind === "Log") {
      expect(action.payload.body.message).toBe(log.message);
    } else {
      fail();
    }
  });
});

describe("bothUp()", () => {
  it("marks MQTT and API as up", () => {
    bothUp();
    expect(dispatchNetworkUp).toHaveBeenCalledWith("user.mqtt");
    expect(dispatchNetworkUp).toHaveBeenCalledWith("bot.mqtt");
  });
});

describe("onOffline", () => {
  it("tells the app MQTT is down", () => {
    jest.resetAllMocks();
    onOffline();
    expect(dispatchNetworkDown).toHaveBeenCalledWith("user.mqtt");
    expect(error).toHaveBeenCalledWith(Content.MQTT_DISCONNECTED);
  });
});

describe("onOnline", () => {
  it("tells the app MQTT is up", () => {
    jest.resetAllMocks();
    onOnline();
    expect(dispatchNetworkUp).toHaveBeenCalledWith("user.mqtt");
  });
});

describe("changeLastClientConnected", () => {
  it("tells farmbot when the last browser session was opened", () => {
    const setUserEnv = jest.fn(() => Promise.resolve({}));
    const fakeFarmbot = { setUserEnv: setUserEnv as any } as Farmbot;
    changeLastClientConnected(fakeFarmbot)();
    expect(setUserEnv).toHaveBeenCalledWith(expect.objectContaining({
      "LAST_CLIENT_CONNECTED": expect.any(String)
    }));
  });
});

describe("onSent", () => {
  it("marks MQTT as up", () => {
    jest.resetAllMocks();
    onSent({ connected: true })();
    expect(dispatchNetworkUp).toHaveBeenCalledWith("user.mqtt");
  });

  it("marks MQTT as down", () => {
    jest.resetAllMocks();
    onSent({ connected: false })();
    expect(dispatchNetworkDown).toHaveBeenCalledWith("user.mqtt");
  });
});

describe("onMalformed()", () => {
  it("handles malformed messages", () => {
    onMalformed();
    expect(warning)
      .toHaveBeenCalledWith(Content.MALFORMED_MESSAGE_REC_UPGRADE);
    jest.resetAllMocks();
    onMalformed();
    expect(warning) // Only fire once.
      .not
      .toHaveBeenCalledWith(Content.MALFORMED_MESSAGE_REC_UPGRADE);
  });
});

describe("onLogs", () => {
  it("Calls `networkUp` when good logs come in", () => {
    const fn = onLogs(jest.fn(), fakeState);
    const log = fakeLog("error", []);
    log.message = "bot xyz is offline";
    fn(log);
    expect(dispatchNetworkDown).toHaveBeenCalledWith("bot.mqtt");
  });
});
