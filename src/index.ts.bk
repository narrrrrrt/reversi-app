export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // まず静的アセットを探す
    const res = await env.ASSETS.fetch(request);

    // アセットが存在すれば返す
    if (res.status !== 404) {
      return res;
    }

    // 存在しなければ DO に丸投げ
    const id = env.ReversiDO.idFromName("global-room");
    const stub = env.ReversiDO.get(id);
    return stub.fetch(request);
  },
};
export { ReversiDO } from "./ReversiDO.ts";