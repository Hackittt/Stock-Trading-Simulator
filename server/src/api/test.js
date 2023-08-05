const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'mydb';

// 连接到 MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('连接到数据库时出错：', err);
    return;
  }

  console.log('成功连接到数据库');

  const db = client.db(dbName);
  const articlesCollection = db.collection('articles');

  // 要查找的条件
  const query = { author: 'John Doe' };

  // 使用 findOne 方法查询第一个符合条件的文档
  articlesCollection.findOne(query, (err, result) => {
    if (err) {
      console.error('查询时出错：', err);
      return;
    }

    if (result) 
    {
      console.log('找到匹配的文档：');
      console.log(result);
    } 
    else 
    {
      console.log('没有找到匹配的文档。');
    }

    client.close();
  });
});
