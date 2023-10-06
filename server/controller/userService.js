const { compare, crypt } = require('../utils/bcrypt');
const { settoken } = require('../utils/user-jwt');
const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
const boom = require('boom');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
// const {jwtAuth, decode} = require('../utils/user-jwt');
const { USER, PERSONAL } = require('../db/dbConfig')
// const {createFund} = require('./taskService')
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED
} = require('../utils/constant');


async function login(req, res, next) {
  await loginto(req, res)
  console.log("登录响应发送完毕")
}

async function register(req, res, next) {
  await registerto(req, res)
  console.log("注册响应发送完毕")
}


// 登录
async function loginto(req, res, next) {
  try {
    console.log('开始登录函数');
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      return next(boom.badRequest(msg));
    }
    else {
      console.log(req.body);
      const { email, password } = req.body;
      const user = await findUser(email);
      if (!user) {
        console.log('没有找到用户');
        return res.status(400).json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        });
      }

      console.log('用户存在');
      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        console.log('密码不匹配');
        return res.status(400).json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        });
      }

      const token = settoken(email);

      const userData = {
        id: user._id,
        email: user.email
      };

      console.log('登录成功，准备发送响应');
      return res.status(200).json({
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
async function registerto(req, res, next) {
  try {
    console.log('开始注册函数');
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      return next(boom.badRequest(msg));
    }
    else {
      const { email, password } = req.body;
      const userExist = await findUser(email);

      if (userExist) {
        console.log('用户存在，无法注册');
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

        const newPersonal = new PERSONAL({
          email,
          first: '',
          last: ''
        });

        await newPersonal.save();

        // await createFund(email);
        const token = settoken(email);

        const userData = {
          // id: newUSER._id,
          email: newUser.email
        };
        console.log('注册成功，准备发送响应');
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
    console.log('开始重置')
    console.log(req.body)
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors;
      return next(boom.badRequest(msg));
    }
    else {

      let { email, oldPassword, newPassword } = req.body;


      const user = await USER.findOne({ email });
      if (!user) {
        console.log('没有找到用户');
        return res.status(400).json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        });
      }

      console.log('用户存在');

      const isMatch = await compare(oldPassword, user.password);
      if (!isMatch) {
        console.log('密码不匹配');
        return res.status(400).json({
          code: CODE_ERROR,
          msg: '用户名或密码错误',
          data: null
        });
      } else {
        if (newPassword) {
          const hashedNewPassword = await crypt(newPassword);
          await USER.updateOne({ email }, { password: hashedNewPassword });

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

      }
    }
  } catch (error) {
    console.error('重置密码时出错：', error);
    res.status(500).json({ error: '服务器错误！' });
  }
}

// 通过用户名更新密码
async function updatePassword(email, newPassword) {
  try {
    // 查找用户
    const user = await USER.findOne({ email });

    if (!user) {
      console.log('未找到具有此邮箱的用户');
      return;
    }

    // 更新用户的密码
    const updatedUser = await USER.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );

    console.log('成功更新用户密码', updatedUser);
  } catch (error) {
    console.error('查找用户和更新密码时出错', error);
  }
}


// 通过用户名查询用户信息
async function findUser(email) {
  console.log(email);
  const user = await USER.findOne({ email });
  return user;
}

module.exports = {
  login,
  register,
  resetPwd,
  findUser,
  updatePassword
};
