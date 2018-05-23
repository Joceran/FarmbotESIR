import {
  unsavedCheck,
  stopThem,
  dontStopThem
} from "../subscribers";
import {
  buildResourceIndex
} from "../../__test_support__/resource_index_builder";
import { WebAppConfig } from "../../config_storage/web_app_configs";
import { SpecialStatus, TaggedWebAppConfig } from "../../resources/tagged_resources";
import { fakeState } from "../../__test_support__/fake_state";

describe("unsavedCheck", () => {
  function setItUp(specialStatus: SpecialStatus, body: Partial<WebAppConfig>) {

    const config: TaggedWebAppConfig = {
      kind: "WebAppConfig",
      uuid: "NOT SET HERE!",
      specialStatus,
      body: (body as any)
    };
    const output = fakeState();
    output.resources = buildResourceIndex([config]);
    // `buildResourceIndex` clears specialStatus. Set it again:
    const uuid = output.resources.index.all[0];
    (output.resources.index.references[uuid] || {} as any)
      .specialStatus = specialStatus;
    return output;
  }

  it("stops users if they have unsaved work", () => {
    localStorage.session = "YES";
    unsavedCheck(setItUp(SpecialStatus.DIRTY, { discard_unsaved: false }));
    expect(window.onbeforeunload).toBe(stopThem);
  });

  it("does nothing when logged out", () => {
    localStorage.session = undefined;
    unsavedCheck(setItUp(SpecialStatus.DIRTY, { discard_unsaved: false }));
    expect(window.onbeforeunload).toBe(dontStopThem);
  });

  it("attaches dontStopThem", () => {
    unsavedCheck(setItUp(SpecialStatus.SAVED, { discard_unsaved: false }));
    expect(window.onbeforeunload).toBe(dontStopThem);
    expect(stopThem()).toBe("You have unsaved work.");
  });

  it("skips checks when user decides so", () => {
    unsavedCheck(setItUp(SpecialStatus.DIRTY, { discard_unsaved: true }));
    expect(window.onbeforeunload).toBe(dontStopThem);
  });
});
