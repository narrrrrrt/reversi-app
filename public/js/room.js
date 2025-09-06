window.addEventListener("load", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const seat = params.get("seat");

  try {
    // JOIN リクエスト
    const joinRes = await fetch(`/join?id=${id}&seat=${seat}`, { method: "POST" });

    const joinText = await joinRes.text(); // JSON でもエラー HTML でも拾える
    document.body.innerHTML = `<pre>${joinText}</pre>`;

    // 成功時だけ SSE につなぐ（HTTP OK の場合）
    if (joinRes.ok) {
      const evtSource = new EventSource(`/sse?id=${id}`);
      evtSource.onmessage = (event) => {
        document.body.innerHTML = `<pre>${event.data}</pre>`;
      };
      evtSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        evtSource.close();
      };
    }

  } catch (err) {
    document.body.innerHTML = `<pre>Error: ${err.message}</pre>`;
  }
});