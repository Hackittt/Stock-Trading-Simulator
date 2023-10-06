const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const url = require('url');
const { body } = require('express-validator');
const service = require('../controller/personalService');
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant'); 
const jwt = require('jsonwebtoken'); 

// 用户信息校验
const vaildator = [
    body('email').isString().withMessage('用户名类型错误'),
    body('first').isString().withMessage('个人信息类型错误'),
    body('last').isString().withMessage('个人信息类型错误')
]

// 编辑用户信息
router.post('/editpersonal', vaildator, service.editpersonal);

// 用户信息查询路由
router.get('/findpersonal', async (req, res) => {
    console.log(req.headers)
    // 从请求头中获取 Token
    const token = req.headers.authorization.split(' ')[1];

    // 解析 Token 获取 Payload
    const decodedToken = jwt.verify(token, PRIVATE_KEY); 
    // 从 Payload 中提取 email 数据
    const userEmail = decodedToken.email;
    let list = await service.findPersonal(userEmail);
    res.json(list);
});

module.exports = router;
