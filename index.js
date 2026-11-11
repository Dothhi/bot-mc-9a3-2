
const mineflayer = require('mineflayer');
const http = require('http');

const CONFIG = {
  host: '9a3smp.mcsh.gg',
  port: 25565,
  username: 'Bot_AFK_247_2',
  version: '1.20',
  targetServer: 'pvp',
  reconnectDelay: 15000,
  switchDelay: 3000,
};

let bot = null;
let reconnectTimeout = null;
let switching = false;

function createBot() {
  if (bot) {
    try {
      bot.removeAllListeners();
      bot.quit();
    } catch {}
    bot = null;
  }

  switching = false;
  console.log('Đang kết nối tới Velocity...');

  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version,
    viewDistance: 'tiny',
    physicsEnabled: false,
  });

  bot.once('spawn', () => {
    console.log('Bot đã vào Lobby!');

    setTimeout(() => {
      if (!bot || !bot.player || switching) return;

      switching = true;
      console.log(`Đang chuyển tới server ${CONFIG.targetServer}...`);

      bot.chat(`/server ${CONFIG.targetServer}`);
    }, CONFIG.switchDelay);
  });

  bot.on('message', (message) => {
    console.log('[CHAT]', message.toString());
  });

  bot.on('kicked', (reason) => {
    console.log(
      'Bot bị kick:',
      typeof reason === 'object'
        ? JSON.stringify(reason)
        : reason
    );
  });

  bot.on('error', (err) => {
    console.log('[ERROR]', err.message);
  });

  bot.on('end', () => {
    console.log('Bot mất kết nối!');
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) return;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    createBot();
  }, CONFIG.reconnectDelay);
}

process.on('uncaughtException', (err) => {
  console.log('[UNCAUGHT]', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.log('[REJECTION]', reason);
});

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('PVP AFK BOT IS ALIVE');
}).listen(process.env.PORT || 10000, () => {
  console.log('Keep-alive đang chạy!');
});

createBot();
