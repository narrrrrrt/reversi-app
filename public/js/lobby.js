window.addEventListener("load", () => {
  const roomIds = ["a", "b", "c", "d"];

  roomIds.forEach(id => {
    const eventSource = new EventSource(`/sse?id=${id}`);

    eventSource.onmessage = (event) => {
      // サーバーから返ってくる部屋ごとの状態
      // 例: { black: "taken", white: "waiting", observers: 2 }
      const state = JSON.parse(event.data);

      document.getElementById(`room-${id}-b`).innerText = state.black;
      document.getElementById(`room-${id}-w`).innerText = state.white;
      document.getElementById(`room-${id}-o`).innerText = `Observers: ${state.observers}`;
    };
  });
});