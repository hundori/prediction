export async function GET() {
  return Response.json({
    openapi: "3.1.0",
    info: {
      title: "Korea Fintech Entry Intelligence API",
      version: "1.0.0",
      description: "Decision-support API. Not legal advice. Inspect each rule's verification_status before reliance."
    },
    paths: {
      "/api/v1/rules": {
        get: {
          summary: "Search Korea regulatory decision rules",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { enum: ["IN_FORCE","ENACTED_NOT_EFFECTIVE","PROPOSED","PENDING"] } },
            { name: "category", in: "query", schema: { type: "string" } }
          ],
          responses: { "200": { description: "Rule list with evidence metadata" } }
        }
      },
      "/api/v1/market-entry": {
        post: {
          summary: "Preliminary Korea fintech market-entry assessment",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["businessDescription"],
                  properties: { businessDescription: { type: "string" } }
                }
              }
            }
          },
          responses: { "200": { description: "Structured decision-support output" } }
        }
      },
      "/api/health": {
        get: { summary: "Health check", responses: { "200": { description: "Service status" } } }
      }
    }
  });
}
