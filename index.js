const bedrock = require('bedrock-protocol');
const express = require('express');

// 1. Tạo Web Server nhỏ để Render không bị chuyển sang trạng thái Sleep (ngủ) sau 15 phút
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot Bedrock !');
});

app.listen(PORT, () => {
  console.log(`Web server đang chạy trên cổng ${PORT}`);
});

const serverHost = process.env.MC_HOST || '9a3bedrock.mcsh.gg'; // Thay bằng IP server thực tế của bạn
const serverPort = parseInt(process.env.MC_PORT || '19132');  
const botUsername = process.env.MC_USERNAME || 'ServerBot_AFK';

function startBot() {
  console.log(`Đang kết nối bot tới ${serverHost}:${serverPort}...`);

  const client = bedrock.createClient({
    host: serverHost,
    port: serverPort,
    username: botUsername,
    offline: true         // Vì server của bạn bật online-mode=false
    // Đã lược bỏ trường version cố định để thư viện tự động tương thích giao thức mới nhất của server 1.26.63
  });

  client.on('join', () => {
    console.log('-> Bot đã vào server thành công và đang treo giữ server!');
  });

  client.on('disconnect', (reason) => {
    console.log('Bot bị mất kết nối:', reason);
    console.log('Đang thử kết nối lại sau 15 giây...');
    setTimeout(startBot, 15000);
  });

  client.on('error', (err) => {
    console.error('Lỗi kết nối bot:', err);
  });
}

startBot();
