// index.ts
export interface Env {
  ASSETS: Fetcher;                 // wrangler.toml の [assets] バインド
  ReversiDO: DurableObjectNamespace; // [[durable_objects.bindings]] name = "ReversiDO"
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 1) まず静的アセットを試す（404 以外なら即返す）
    const assetResp = await env.ASSETS.fetch(request);
    if (assetResp.status !== 404) return assetResp;

    // 2) DO にフォワード（pathname + search をそのまま引き継ぐ）
    const id = env.ReversiDO.idFromName("global");
    const stub = env.ReversiDO.get(id);

    const doUrl = new URL(request.url);
    doUrl.protocol = "http:";
    doUrl.host = "do";

    // メソッド/ヘッダ/ボディは request から引き継ぎ、URL だけ差し替え
    const doReq = new Request(doUrl.toString(), request);
    return stub.fetch(doReq);

  },
};
export { ReversiDO } from "./ReversiDO";