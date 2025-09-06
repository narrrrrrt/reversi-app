export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // 1) まずアセット
    const assetRes = await env.ASSETS.fetch(request);
    if (assetRes.status !== 404) return assetRes;

    // 2) DO へフォワード（絶対URL化）
    const url = new URL(request.url);
    const forwardUrl = new URL(url.pathname + url.search, "http://do");

    const init: RequestInit = {
      method: request.method,
      headers: request.headers,
      body: ["GET","HEAD"].includes(request.method) ? undefined : request.body,
    };
    const forwardReq = new Request(forwardUrl.toString(), init);

    const id = env.ReversiDO.idFromName("global-room");
    const stub = env.ReversiDO.get(id);
    return stub.fetch(forwardReq);
  },
};

export { ReversiDO } from "./ReversiDO";