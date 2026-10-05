import type { NextRequest } from "next/server";
import { withX402 } from "@x402/next";
import { POST as freePOST } from "../../v1/market-entry/route";
import { NETWORK, payTo, server } from "../../../x402";

const handler = async (req: NextRequest): Promise<any> => freePOST(req);

export const POST = withX402(
  handler,
  {
    accepts: {
      scheme: "exact",
      price: "$0.10",
      network: NETWORK,
      payTo
    },
    description: "Preliminary evidence-linked Korea digital-finance market-entry assessment."
  },
  server
);
