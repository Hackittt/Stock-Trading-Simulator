const { compare, crypt } = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
const boom = require('boom');
const mongoose = require('mongoose');
const {body, validationResult } = require('express-validator');
// const {jwtAuth, decode} = require('../utils/user-jwt');
const {USER} = require('../db/dbConfig')
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED
} = require('../utils/constant');


// 登录
async function login(req, res, next) {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{msg}] = err.errors;
      return next(boom.badRequest(msg));
    }
    else {
      const {email, password} = req.body;
      const user = await findUser(email);

      if (!user) {
        return res.status(400).json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        });
      }

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        });
      }


      const token = jwt.sign(
        {email},
        PRIVATE_KEY,
        {expiresIn: JWT_EXPIRED}
      );

      const userData = {
        id: user._id,
        email: user.email
      };

      res.json({
        code: CODE_SUCCESS,
        msg: '登录成功',
        data: {
          token,
          userData
        }
      });
    }
  } catch (error) {
    console.error('登录时出错：', error);
    res.status(500).json({ error: '服务器错误！' });
  }
}

// 注册
async function register(req, res, next) {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{msg}] = err.errors;
      return next(boom.badRequest(msg));
    }
    else {
      const {email, password} = req.body;
      const userExist = await findUser(email);

      if (userExist) {
        res.json({
          code: CODE_ERROR,
          msg: '用户已存在',
          data: null
        });
      }
      else {
        const hashedPassword = await crypt(password);
        const newUser = new USER({
          email,
          password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
          {email},
          PRIVATE_KEY,
          {expiresIn: JWT_EXPIRED}
        );

        const userData = {
          // id: newUSER._id,
          email: newUser.email
        };

        res.json({
          code: CODE_SUCCESS,
          msg: '注册成功',
          data: {
            token
            // userData
          }
        });
      }
    }
  } catch (error) {
    console.error('注册时出错：', error);
    res.status(500).json({ error: '服务器错误！' });
  }
}

// 重置密码
async function resetPwd(req, res, next) {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{msg}] = err.errors;
      return next(boom.badRequest(msg));
    }
    else {
      let {email, oldPassword, newPassword} = req.body;
      oldPassword = crypt(oldPassword);

      const user = await USER.findOne({email, password: oldPassword});

      if (user) {
        if (newPassword) {
          const hashedNewPassword = crypt(newPassword);
          await USER.updateOne({email}, {password: hashedNewPassword});

          res.json({
            code: CODE_SUCCESS,
            msg: '重置密码成功',
            data: null
          });
        } else {
          res.json({
            code: CODE_ERROR,
            msg: '新密码不能为空',
            data: null
          });
        }
      } else {
        res.json({
          code: CODE_ERROR,
          msg: '用户名或旧密码错误',
          data: null
        });
      }
    }
  } catch (error) {
    console.error('重置密码时出错：', error);
    res.status(500).json({error: '服务器错误！'});
  }
}

// 通过用户名查询用户信息
async function findUser(email) {
  const user = await USER.findOne({email});
  return user;
}

module.exports = {
  login,
  register,
  resetPwd
};
