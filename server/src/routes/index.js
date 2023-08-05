const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('?');
});


// 导入登录和注册路由处理程序
const loginRouter = require('./login');
const registerRouter = require('./register');

// 挂载路由
router.use('/login', loginRouter);
router.use('/register', registerRouter);

module.exports = router;
