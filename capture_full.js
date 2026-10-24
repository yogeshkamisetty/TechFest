const { spawn } = require('child_process');

const edge = spawn("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", [
  "--headless=new",
  "--window-size=390,2000",
  "--remote-debugging-port=9227",
  "--user-data-dir=D:\\Yogesh\\Coding\\TechFest\\edge-profile-full",
  "http://localhost:3000/index.html"
]);

setTimeout(async () => {
  try {
    const res = await fetch("http://localhost:9227/json");
    const targets = await res.json();
    const t = targets.find(item => item.url.includes("index.html"));
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.enable" }));
      ws.send(JSON.stringify({
        id: 2,
        method: "Page.captureScreenshot",
        params: { format: "png", captureBeyondViewport: true }
      }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.id === 2 && data.result) {
        const fs = require('fs');
        fs.writeFileSync("C:\\Users\\kamis\\.gemini\\antigravity\\brain\\1afb3931-f688-43d0-a2a6-e8cce50bcf93\\index_mobile_full.png", Buffer.from(data.result.data, 'base64'));
        console.log("Full page captured!");
        edge.kill();
        process.exit(0);
      }
    };
  } catch (err) {
    console.error(err);
    edge.kill();
    process.exit(1);
  }
}, 1800);
