import { getDevice } from "../../../device";
import { WDENVKey } from "./interfaces";
import { formatEnvKey } from "./translators";

/** Send a number to FBOS for storage on the device. */
export function envSave(key: WDENVKey, value: number) {
  getDevice()
    .setUserEnv({ [key]: JSON.stringify(formatEnvKey(key, value)) })
    .catch(() => { });
}
