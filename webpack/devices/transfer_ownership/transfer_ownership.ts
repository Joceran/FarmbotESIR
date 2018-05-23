import { Farmbot, rpcRequest } from "farmbot";
import { createTransferCert } from "./create_transfer_cert";
import { toPairs } from "../../util";

export interface TransferProps {
  email: string;
  password: string;
  device: Farmbot;
}

/** Pass control of your device over to another user. */
export async function transferOwnership(input: TransferProps): Promise<void> {
  const { email, device } = input;
  try {
    const secret = await createTransferCert(input);
    const body = toPairs({ email, secret });
    await device.send(rpcRequest([{ kind: "change_ownership", args: {}, body }]));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
