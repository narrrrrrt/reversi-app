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
    const url = new URL(request.url);
    const doUrl = "https://do.internal" + url.pathname + url.search;

    // いまはグローバル 1 インスタンスに集約（必要になったら idFromName(roomId) に切替）
    const doId = env.ReversiDO.idFromName("global-room");
    const stub = env.ReversiDO.get(doId);

    // 元のメソッド/ヘッダー/ボディを保持しつつ、URL だけ差し替えて転送
    const doRequest = new Request(doUrl, request);
    return await stub.fetch(doRequest);
  },
};
export { ReversiDO } from "./ReversiDO";