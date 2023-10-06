const crypto = require('crypto');

let PRIVATE_KEY = generatePrivateKey(); // 初始化 PRIVATE_KEY

function generatePrivateKey() {
  return crypto.randomBytes(32).toString('hex');
}

// 每隔一段时间更新 PRIVATE_KEY
const privateKeyUpdateInterval = 24 * 60 * 60 * 1000; // 1天
setInterval(() => {
  PRIVATE_KEY = generatePrivateKey();
  console.log('PRIVATE_KEY updated:', PRIVATE_KEY);
}, privateKeyUpdateInterval);


module.exports = {
    CODE_ERROR: -1, 
    CODE_SUCCESS: 0, 
    CODE_TOKEN_EXPIRED: 401,
    // PRIVATE_KEY: "crypto.randomBytes(32).toString('hex')", 
    PRIVATE_KEY, 
    JWT_EXPIRED: 60 * 60 * 24,
  }
  