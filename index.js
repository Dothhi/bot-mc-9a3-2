
const mineflayer = require('mineflayer');
const http = require('http');

const CONFIG = {
  host: '9a3smp.mcsh.gg',
  port: 25565,
  username: 'Bot_AFK_247_2',
  version: '1.21.3',
  reconnectDelay: 15000,
};

let bot = null;
let reconnectTimeout = null;

function createBot() {
  console.log('Đang kết nối...');

  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version,
    viewDistance: 'tiny',
    physicsEnabled: false,
  });

  bot.once('spawn', () => {
    console.log('Bot đã vào game');
    setTimeout(() => bot.chat('/server pvp'), 3000);
    if (bot.entities) bot.entities = {};
  });

  bot.on('kicked', reason => console.log('Bị kick:', reason));
  bot.on('error', err => console.log('Lỗi:', err.message));

  bot.on('end', () => {
    console.log('Mất kết nối, vào lại sau 15s...');
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

process.on('uncaughtException', err => console.log('Uncaught:', err.message));
process.on('unhandledRejection', reason => console.log('Rejection:', reason));

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 10000);

createBot();
