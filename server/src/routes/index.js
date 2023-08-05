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


// 验证输入格式，特别是密码格式和长度之类的
function validateReqBody(req) {
  const { id, password } = req.body;

  if (!id || typeof id !== 'string' || !password || typeof password !== 'string') 
  {
    return false;
  }
  return true;
}


// 验证JWT是否有效
function authenticateToken(req, res, next) {
const token = req.header('Authorization')?.split(' ')[1];
if (!token) return res.status(401).json({ error: '未登录' });

jwt.verify(token, 'csdn1acb8ck2sd0fs', (err, id) => {
  if (err) return res.status(403).json({ error: '验证失败' });
  req.user = id;
  next();
});
}

module.exports = router;
