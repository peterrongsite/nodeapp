const qrcode = require('qrcode-terminal');
const axios = require('axios');
const { Client } = require('whatsapp-web.js');
const client = new Client();

const apiInstance = axios.create({
  baseURL: 'https://pay.maxp254.co.ke'
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async message => {
  const { body, from, type } = message;
  const phone = from.split('@')[0];
  const receivedMessage = body;

  // Ignore messages from statuses and group chats
  if (type === 'chat' && !phone.includes('g.us')) {
    const postData = {
      phone: phone,
      message: receivedMessage
    };

    try {
      const response = await apiInstance.post('/api.php', postData);
      const responseData = response.data;
      console.log(responseData);
      client.sendMessage(message.from, responseData); // Send WhatsApp message here
    } catch (error) {
      console.error(error);
    }
  }
});

client.initialize();
