const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 注册路由
router.post('/register', async (req, res) => {
  try {
    const {email, password } = req.body;

    const isValid = validateReqBody(req);
    if (!isValid) {
      return res.status(400).json({ error: '信息格式不正确' });
    }

    // 检查用户是否已存在
    const existingUser = await USER.findOne({email});
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在！' });
    }

    // 哈希
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 随机生成userID
    const userID = 156165;

    // 存到数据库
    const user = new USER({email, password: hashPassword, userID});
    await user.save();

    res.status(201).json({ message: '注册成功！' });
  } catch (error) {
    res.status(500).json({ error: '服务器错误！' });
  }
});

module.exports = router;