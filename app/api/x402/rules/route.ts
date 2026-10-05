import type { NextRequest } from "next/server";
import { withX402 } from "@x402/next";
import { GET as freeGET } from "../../v1/rules/route";
import { NETWORK, payTo, server } from "../../../x402";

const handler = async (req: NextRequest): Promise<any> => freeGET(req);

export const GET = withX402(
  handler,
  {
    accepts: {
      scheme: "exact",
      price: "$0.01",
      network: NETWORK,
      payTo
    },
    description: "Search evidence-linked Korean digital-finance regulatory rules."
  },
  server
);
