//join
import { rooms, broadcast } from "./sse";

//export async function handleJoin(request: Request): Promise<Response> {
export async function join(request: Request): Promise<Response> {

  const url = new URL(request.url);

  const id = Number(url.searchParams.get("id"));
  if (!id) return new Response("Invalid room id", { status: 400 });

  const seat = url.searchParams.get("seat");
  if (!seat || !"bwo".includes(seat)) {
    return new Response("Invalid seat", { status: 400 });
  }

  const room = rooms.get(id);
  if (!room) return new Response("Room not found", { status: 404 });

  // トークン生成（8文字ランダム）
  const token = Math.random().toString(36).slice(-8);

  if (seat === "b" || seat === "w") {
    const key: "black" | "white" = seat === "b" ? "black" : "white";

    if (room[key]) {
      return new Response(JSON.stringify({
        status: "NG",
        reason: `${key} seat already taken`,
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    room[key] = token;
  } else {
    // 観戦者はそのまま push
    room.observers.push(token);
  }

  // 更新をブロードキャスト
  broadcast(id, room);

  // 成功レスポンス
  return new Response(JSON.stringify({
    status: "OK",
    token,
  }), {
    headers: { "Content-Type": "application/json" },
  });
}