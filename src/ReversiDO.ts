import { sse } from "./handlers/sse";
import { join } from "./handlers/join";
//import { move } from "./handlers/move";
//import { leave } from "./handlers/leave";
//import { reset } from "./handlers/reset";

const handlers: Record<string, Function> = { sse, join, move, leave, reset };

export class ReversiDO {
  state: DurableObjectState;
  clients: Set<WritableStreamDefaultWriter>;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.clients = new Set();
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.slice(1); // "/join" → "join"

    if (path in handlers) {
      // 該当するハンドラーがあれば呼び出し
      return (handlers as any)[path](this, request);
    }

    return new Response("Not found", { status: 404 });
  }
}