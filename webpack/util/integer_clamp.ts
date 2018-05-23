import * as _ from "lodash";

/** The firmware will have an integer overflow if you don't check this one. */
const MAX_SHORT_INPUT = 32000;
const MAX_LONG_INPUT = 2000000000;
const MIN_INPUT = 0;

interface High { outcome: "high"; result: number; }
interface Low { outcome: "low"; result: number; }
interface Malformed { outcome: "malformed"; result: undefined; }
interface Ok { outcome: "ok", result: number; }
type ClampResult = High | Low | Malformed | Ok;

export type IntegerSize = "short" | "long" | undefined;

/** Handle all the possible ways a user could give us bad data or cause an
 * integer overflow in the firmware. */
export function clampUnsignedInteger(
  input: string, size: IntegerSize): ClampResult {
  const result = Math.round(parseInt(input, 10));
  const maxInput = () => {
    switch (size) {
      case "long":
        return MAX_LONG_INPUT;
      case "short":
      default:
        return MAX_SHORT_INPUT;
    }
  };

  // Clamp to prevent overflow.
  if (_.isNaN(result)) { return { outcome: "malformed", result: undefined }; }
  if (result > maxInput()) { return { outcome: "high", result: maxInput() }; }
  if (result < MIN_INPUT) { return { outcome: "low", result: MIN_INPUT }; }

  return { outcome: "ok", result };
}
