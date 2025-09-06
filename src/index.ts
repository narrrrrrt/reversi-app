export { ReversiDO } from "./ReversiDO"; // ← 未エクスポート対策。必須

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // まず Assets
    const assetRes = await env.ASSETS.fetch(request);
    if (assetRes.status !== 404) return assetRes;

    try {
      // DO スタブ
      const id = env.ReversiDO.idFromName("global");
      const stub = env.ReversiDO.get(id);

      // 元リクエストの path + query をそのまま DO 用の絶対URLへ
      const src = new URL(request.url);
      const doUrl = new URL(src.pathname + src.search, "http://do");
      doUrl.searchParams.set("via", "index"); // ★切り分けマーカー

      const doReq = new Request(doUrl.toString(), request);
      console.log("INDEX -> DO", doUrl.toString());
      return await stub.fetch(doReq);
    } catch (e) {
      console.error("INDEX_ERROR", e);
      return new Response(
        JSON.stringify({ where: "index", error: String(e) }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
  },
};