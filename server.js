const express = require('express');
const http = require('http');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');

const app = express();
const server = http.createServer(app);
const bare = createBareServer('/bare/');

// publicフォルダからフロントエンドファイルを配信
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bareサーバーのリクエスト処理
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.route(req, res);
    } else {
        app(req, res);
    }
});

// WebSocketのアップグレード処理（プロキシ動作に必須）
server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
