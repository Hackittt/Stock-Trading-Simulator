const bodyParser = require('body-parser'); 
const express = require('express'); 
const cors = require('cors'); 
const routes = require('./routes'); 
const {connectToDatabase, getDb} = require('./db/connect');
const app = express();

// 连接到数据库
connectToDatabase();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors()); 

app.use('/', routes);

app.listen(8088, () => { // 监听8088端口
	console.log('服务已启动 http://localhost:8088');
})
