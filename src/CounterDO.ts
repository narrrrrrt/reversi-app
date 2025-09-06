import * as handlers from "./handlers";

export class ReversiDO {
  state: DurableObjectState;
  clients: Set<WritableStreamDefaultWriter>;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.clients = new Set();
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.slice(1); // 先頭の / を削除

    if (path in handlers) {
      return (handlers as any)[path](this, request);
    }

    return new Response("Not found", { status: 404 });
  }
}