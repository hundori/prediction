import { getRules } from "../../../../lib/rules-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const rules = getRules().filter((r:any) => {
    const hay = [r.rule_id,r.title,r.category,r.law_name,r.article,r.regulator].join(" ").toLowerCase();
    return (!q || hay.includes(q)) &&
      (!status || r.legal_state === status) &&
      (!category || r.category === category);
  });

  return Response.json({
    apiVersion: "v1",
    schemaVersion: "2026-10-05.2",
    decisionModelVersion: "beta-0.4",
    asOf: "2026-10-05",
    count: rules.length,
    rules
  });
}
