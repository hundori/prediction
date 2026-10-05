import { NextRequest } from "next/server";
import { paymentProxy } from "@x402/next";
import { x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import {
  bazaarResourceServerExtension,
  declareDiscoveryExtension,
  withBazaar,
} from "@x402/extensions/bazaar";
import { createCdpFacilitatorClient } from "@coinbase/cdp-sdk/x402";

const payTo = process.env.X402_PAY_TO_ADDRESS;
if (!payTo) throw new Error("X402_PAY_TO_ADDRESS is required");

const facilitator = withBazaar(createCdpFacilitatorClient());
const server = new x402ResourceServer(facilitator)
  .register("eip155:8453", new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension);

const routes = {
  "GET /api/x402/rules": {
    accepts: {
      scheme: "exact",
      price: "$0.01",
      network: "eip155:8453",
      payTo,
    },
    resource: {
      url: "https://prediction-hundori.vercel.app/api/x402/rules",
      description: "Search evidence-linked Korean digital-finance regulatory rules.",
      mimeType: "application/json",
      serviceName: "Korea Digital Finance Rules",
      tags: ["korea", "regulation", "fintech", "crypto", "compliance"],
    },
    extensions: {
      ...declareDiscoveryExtension({
        input: { q: "stablecoin", status: "IN_FORCE" },
        inputSchema: {
          properties: {
            q: { type: "string", description: "Search term such as stablecoin, KYC, custody, privacy, or law name." },
            status: { type: "string", description: "Optional legal-state filter." },
            category: { type: "string", description: "Optional regulatory-domain filter." },
          },
          required: [],
        },
        output: {
          example: {
            apiVersion: "v1",
            count: 1,
            rules: [{ rule_id: "KR-001", legal_state: "IN_FORCE", verification_status: "VERIFIED" }],
          },
        },
      }),
    },
  },
  "POST /api/x402/market-entry": {
    accepts: {
      scheme: "exact",
      price: "$0.10",
      network: "eip155:8453",
      payTo,
    },
    resource: {
      url: "https://prediction-hundori.vercel.app/api/x402/market-entry",
      description: "Preliminary evidence-linked Korea digital-finance market-entry assessment.",
      mimeType: "application/json",
      serviceName: "Korea Market Entry Check",
      tags: ["korea", "market-entry", "fintech", "crypto", "compliance"],
    },
    extensions: {
      ...declareDiscoveryExtension({
        input: {
          businessDescription: "US fintech offering a non-custodial USD stablecoin wallet to Korean users.",
        },
        inputSchema: {
          properties: {
            businessDescription: {
              type: "string",
              description: "Business model, customer location, custody model, payment flows and Korea nexus.",
            },
          },
          required: ["businessDescription"],
        },
        output: {
          example: {
            decision: "REVIEW_REQUIRED",
            confidence: "MEDIUM",
            evidenceStrength: "MEDIUM",
            humanReviewRequired: true,
          },
        },
      }),
    },
  },
} as const;

const proxy = paymentProxy(routes, server);

export async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: ["/api/x402/rules", "/api/x402/market-entry"],
};
