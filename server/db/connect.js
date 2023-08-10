const mongoose = require('mongoose');
const {mon} = require('./dbConfig');

// MongoDB 连接字符串
const uri = `mongodb://${mon.user}:${mon.password}@${mon.host}:${mon.port}/${mon.database}`; // 根据你的实际配置进行修改

// 连接选项
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// 连接数据库
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, options);
    console.log('成功连接到数据库');
  } catch (error) {
    console.error('连接数据库时出错：', error);
  }
}

// 导出连接函数和mongoose实例
module.exports = {
  connectToDatabase,
};
