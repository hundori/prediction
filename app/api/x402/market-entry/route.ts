import type { NextRequest } from "next/server";
import { withX402 } from "@x402/next";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";
import { POST as freePOST } from "../../v1/market-entry/route";
import { NETWORK, payTo, server } from "../../../x402";

const handler = async (req: NextRequest): Promise<any> => freePOST(req);

export const POST = withX402(
  handler,
  {
    "/api/x402/market-entry": {
      accepts: {
        scheme: "exact",
        price: "$0.10",
        network: NETWORK,
        payTo
      },
      description: "Preliminary evidence-linked Korea digital-finance market-entry assessment.",
      mimeType: "application/json",
      extensions: {
        ...declareDiscoveryExtension({
          bodyType: "json",
          input: {
            businessDescription: "US fintech offering a non-custodial USD stablecoin wallet to Korean users."
          },
          inputSchema: {
            properties: {
              businessDescription: { type: "string" }
            },
            required: ["businessDescription"]
          },
          output: {
            example: {
              decision: "REVIEW_REQUIRED",
              confidence: "MEDIUM",
              evidenceStrength: "MEDIUM",
              humanReviewRequired: true
            }
          }
        })
      }
    }
  },
  server
);
