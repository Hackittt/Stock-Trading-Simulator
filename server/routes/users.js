const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const url = require('url');
const { body } = require('express-validator');
const service = require('../controller/userService');
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant'); 
const jwt = require('jsonwebtoken'); 

// 登录/注册校验
const vaildator = [
  body('email').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误')
]

// 重置密码校验
const resetPwdVaildator = [
  body('email').isString().withMessage('用户名类型错误'),
  body('oldPassword').isString().withMessage('密码类型错误'),
  body('newPassword').isString().withMessage('密码类型错误')
]

// 用户登录路由
router.post('/login', vaildator, service.login);

// 用户注册路由
router.post('/register', vaildator, service.register);

// 密码重置路由
router.post('/resetPwd', resetPwdVaildator, service.resetPwd);

// 用户信息查询路由
router.get('/finduser', async (req, res) => {

  // 从请求头中获取 Token
  const token = req.headers.authorization.split(' ')[1]; // 假设 Token 放在请求头的 Authorization 字段中

  // 解析 Token 获取 Payload
  const decodedToken = jwt.verify(token, PRIVATE_KEY); // 请替换为实际的密钥
  console.log(decodedToken)

  // 从 Payload 中提取 email 数据
  const userEmail = decodedToken.email;
  let list = await service.findUser(userEmail);
  res.json(list);
});


module.exports = router;
