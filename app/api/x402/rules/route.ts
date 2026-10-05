import type { NextRequest } from "next/server";
import { withX402 } from "@x402/next";
import { declareDiscoveryExtension } from "@x402/extensions/bazaar";
import { GET as freeGET } from "../../v1/rules/route";
import { NETWORK, payTo, server } from "../../../x402";

const handler = async (req: NextRequest): Promise<any> => freeGET(req);

export const GET = withX402(
  handler,
  {
    "/api/x402/rules": {
      accepts: {
        scheme: "exact",
        price: "$0.01",
        network: NETWORK,
        payTo
      },
      description: "Search evidence-linked Korean digital-finance regulatory rules.",
      mimeType: "application/json",
      extensions: {
        ...declareDiscoveryExtension({
          input: { q: "stablecoin", status: "IN_FORCE" },
          inputSchema: {
            properties: {
              q: { type: "string" },
              status: { type: "string" },
              category: { type: "string" }
            },
            required: []
          },
          output: {
            example: {
              apiVersion: "v1",
              count: 1,
              rules: [{ rule_id: "KR-001", legal_state: "IN_FORCE", verification_status: "VERIFIED" }]
            }
          }
        })
      }
    }
  },
  server
);
