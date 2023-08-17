const express = require('express');
const router = express.Router(); 
const userRouter = require('./users'); 
const taskRouter = require('./tasks'); 
const {jwtAuth, getKey, decode} = require('../utils/user-jwt'); 


router.use(jwtAuth); 

// 加载用户路由
router.use('/api', userRouter); 

//加载业务功能路由
router.use('/api', taskRouter); 


router.get('/protected', (req, res) => {
  res.json({ message: 'Access granted to protected route' });
});

router.use((err, req, res, next) => {
  // 自定义用户认证失败的错误返回
  console.log('err===', err);
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      code: status,
      msg: 'token失效，请重新登录',
      data: null
    })
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg = (output && output.payload && output.payload.error) || err.message;
    res.status(errCode).json({
      code: errCode,
      msg: errMsg
    })
  }
})

module.exports = router;
