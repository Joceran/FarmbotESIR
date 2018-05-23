import { Regimen } from "./interfaces";
import { destroy, save, edit } from "../api/crud";
import { TaggedRegimen, isTaggedRegimen } from "../resources/tagged_resources";

export function editRegimen(r: TaggedRegimen | undefined,
  update: Partial<Regimen>) {
  return (dispatch: Function) => {
    r && isTaggedRegimen(r) && dispatch(edit(r, update));
  };
}

export function saveRegimen(uuid: string) {
  return save(uuid);
}

export function deleteRegimen(uuid: string) {
  return destroy(uuid);
}

export function selectRegimen(payload: TaggedRegimen) {
  if (isTaggedRegimen(payload)) {
    return { type: "SELECT_REGIMEN", payload };
  } else {
    throw new Error("Not a regimen.");
  }
}
