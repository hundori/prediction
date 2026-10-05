import { x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { bazaarResourceServerExtension } from "@x402/extensions/bazaar";
import { createCdpFacilitatorClient } from "@coinbase/cdp-sdk/x402";

export const NETWORK = "eip155:8453" as const;
export const payTo = (process.env.X402_PAY_TO_ADDRESS ?? "") as `0x${string}`;

if (!payTo) {
  throw new Error("X402_PAY_TO_ADDRESS is required");
}

export const server = new x402ResourceServer(createCdpFacilitatorClient())
  .register(NETWORK, new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension);
