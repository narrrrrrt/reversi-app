window.addEventListener("load", () => {
  const roomIds = [1, 2, 3, 4];

  roomIds.forEach((id) => {
    const evtSource = new EventSource(`/sse?id=${id}`);

    evtSource.onmessage = (event) => {
      const el = document.getElementById(`room-${id}`);
      if (el) {
        el.textContent = event.data; // JSONそのまま表示
      }
    };

    evtSource.onerror = (err) => {
      console.error(`SSE error (room ${id}):`, err);
      evtSource.close();
    };
  });
});