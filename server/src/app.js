var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



const app = express();
const port = 3000;


// 连接数据库
mongoose.connect('mongodb://localhost:27017/aaaaaaa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 用户model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    userID: {type: Number, requeired: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const USER = mongoose.model('USER', UserSchema);

/*
设置 views 文件夹为存放视图文件的目录,
即存放模板文件的地方,__dirname 为全局变量,
存储当前正在执行的脚本所在的目录。
 */
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎为ejs
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
app.use(logger('dev'));
//加载解析json的中间件
app.use(bodyParser.json());
//加载解析urlencoded请求体的中间件。  post请求
app.use(bodyParser.urlencoded({extended: false}));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public文件夹为放置静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制器。
// app.use('/', index);  // http://localhost:3000
// app.use('/users', users);   //http://localhost:3000/users

// 加载路由文件
// var index = require('./routes/index');
// var users = require('./routes/users');
const routes = require('./routes/index');
app.use('/api', routes);






// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//把app导出。  别的地方就可以通过 require("app") 获取到这个对象
module.exports = app;