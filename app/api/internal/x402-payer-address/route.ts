import { CdpX402Client } from "@coinbase/cdp-sdk/x402";

export async function GET() {
  const client = new CdpX402Client();
  const { evmAddress } = await client.getAddresses();
  return Response.json({ evmAddress });
}
