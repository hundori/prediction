import { CdpX402Client } from "@coinbase/cdp-sdk/x402";

export async function GET() {
  try {
    const client = new CdpX402Client();
    const { evmAddress } = await client.getAddresses();
    return Response.json({ ok: true, evmAddress });
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        name: error?.name ?? "Error",
        message: String(error?.message ?? "Unknown error").slice(0, 500),
        status: error?.status ?? error?.response?.status ?? null
      },
      { status: 500 }
    );
  }
}
