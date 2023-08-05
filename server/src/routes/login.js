const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
    try {
      const isValid = validateReqBody(req);
      if (!isValid) {
        return res.status(400).json({ error: '信息格式不正确' });
      }
      
      const {id, password} = req.body;
  
      // 查找用户
      const userexist = await USER.find({
          $or: [
            { email: id },
            { userID: id }
          ]
      });
      const isMatch = await bcrypt.compare(password, USER.password);
      if (!userexist || !isMatch) {
        return res.status(400).json({ error: '登录信息不正确或不存在' });
      }
      // 创建并返回JWT
      const token = jwt.sign({ userId: USER.userID }, 'csdn1acb8ck2sd0fs');
  
      res.json({token});
    } catch (error) {
      res.status(500).json({ error: '服务器错误！' });
    }
  });

  module.exports = router;