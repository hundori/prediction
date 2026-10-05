import { gunzipSync } from "node:zlib";
import c1 from "./rules-chunk-1";
import c2 from "./rules-chunk-2";
import c3 from "./rules-chunk-3";
import c4 from "./rules-chunk-4";
import c5 from "./rules-chunk-5";

let cache: any[] | null = null;

export function getRules(): any[] {
  if (!cache) {
    const encoded = c1 + c2 + c3 + c4 + c5;
    cache = JSON.parse(gunzipSync(Buffer.from(encoded, "base64")).toString("utf8")) as any[];
  }
  return cache!;
}
