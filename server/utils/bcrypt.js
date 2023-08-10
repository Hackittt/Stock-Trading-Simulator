const bcrypt = require('bcryptjs');

// 哈希
async function crypt(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function compare(password,oldpassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.compare(password,oldpassword);
}
module.exports = {crypt, compare};