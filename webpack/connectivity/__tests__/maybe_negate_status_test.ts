import {
  determineStrategy,
  SyncStrat,
  maybeNegateStatus,
  maybeNegateConsistency
} from "../maybe_negate_status";

describe("determineStrategy()", () => {
  it("finds detects AUTO users", () => {
    expect(determineStrategy({ fbosVersion: "6.0.0", autoSync: true }))
      .toBe(SyncStrat.AUTO);
  });

  it("finds detects MANUAL users", () => {
    expect(determineStrategy({ fbosVersion: "6.0.0", autoSync: false }))
      .toBe(SyncStrat.MANUAL);
  });

  it("finds detects LEGACY users", () => {
    expect(determineStrategy({ fbosVersion: "2.0.0", autoSync: true }))
      .toBe(SyncStrat.LEGACY);
  });

  it("finds detects OFFLINE users", () => {
    expect(determineStrategy({ autoSync: false })).toBe(SyncStrat.OFFLINE);
  });
});

describe("maybeNegateStatus()", () => {
  it("returns initial value every time when consistent is true", () => {
    const result = maybeNegateStatus({
      consistent: true,
      syncStatus: "synced",
      fbosVersion: "1.2.3",
      autoSync: false,
    });
    expect(result).toEqual("synced");
  });

  it("returns `synced` when consistent on AUTO mode", () => {
    const result = maybeNegateStatus({
      consistent: true,
      syncStatus: "synced",
      fbosVersion: "6.0.0",
      autoSync: true,
    });
    expect(result).toEqual("synced");
  });

  it("returns `syncing` when inconsistent on AUTO mode", () => {
    const result = maybeNegateStatus({
      consistent: false,
      syncStatus: "unknown",
      fbosVersion: "6.0.0",
      autoSync: true,
    });

    expect(result).toEqual("syncing");
  });

  it("returns `sync_now` when inconsistent on MANUAL mode", () => {
    const result = maybeNegateStatus({
      consistent: false,
      syncStatus: "unknown",
      fbosVersion: "6.0.0",
      autoSync: false,
    });

    expect(result).toEqual("sync_now");
  });

  it("always returns `unknown` when offline", () => {
    const result = maybeNegateStatus({
      consistent: false,
      syncStatus: "synced",
      fbosVersion: undefined,
      autoSync: false,
    });

    expect(result).toEqual("unknown");
  });

  it("return `SYNC_NOW` for inconsistent legacy devices", () => {
    const result = maybeNegateStatus({
      consistent: false,
      syncStatus: "unknown",
      fbosVersion: "1.2.3",
      autoSync: false,
    });

    expect(result).toEqual("sync_now");
  });
});

describe("maybeNegateConsistency()", () => {
  it("sets consistency to `true` when bot is `syncing` (legacy mode)", () => {
    const result = maybeNegateConsistency({
      autoSync: false,
      fbosVersion: "0.0.1",
      syncStatus: "syncing",
      consistent: false
    });
    expect(result).toBe(true);
  });

  it("returns original value when Legacy && !syncing", () => {
    expect(maybeNegateConsistency({
      autoSync: false,
      fbosVersion: "0.0.1",
      syncStatus: "unknown",
      consistent: false
    })).toBe(false);

    expect(maybeNegateConsistency({
      autoSync: false,
      fbosVersion: "0.0.1",
      syncStatus: "unknown",
      consistent: true
    })).toBe(true);
  });

  it("Skips this step for non-legacy versions", () => {
    expect(maybeNegateConsistency({
      autoSync: false,
      fbosVersion: "6.0.0",
      syncStatus: "unknown",
      consistent: true
    })).toBe(true);

    expect(maybeNegateConsistency({
      autoSync: false,
      fbosVersion: "6.0.0",
      syncStatus: "unknown",
      consistent: false
    })).toBe(false);
  });
});
