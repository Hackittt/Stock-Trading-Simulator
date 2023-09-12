const { compare, crypt } = require('../utils/bcrypt');
const { settoken } = require('../utils/user-jwt');
const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
const boom = require('boom');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
// const {jwtAuth, decode} = require('../utils/user-jwt');
const { PERSONAL } = require('../db/dbConfig')
const {
    CODE_ERROR,
    CODE_SUCCESS,
    PRIVATE_KEY,
    JWT_EXPIRED
} = require('../utils/constant');


async function editpersonal(req, res, next) {
    await personal(req, res, next);
    console.log("注册响应发送完毕")
}


// 设置用户信息
async function personal(req, res, next) {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            const [{ msg }] = err.errors;
            return next(boom.badRequest(msg));
        } else {
            const { email, first, last } = req.body;

            // 查找具有相同 email 的记录
            const userExist = await PERSONAL.findOne({ email });

            if (userExist) {
                // 更新现有记录的 first 和 last 字段
                await PERSONAL.updateOne({ email }, { first, last });

                console.log('编辑成功，准备发送响应');
                res.json({
                    code: CODE_SUCCESS,
                    msg: '编辑成功',
                    data: null
                });
            } else {
                console.log('用户不存在');
                res.json({
                    code: CODE_ERROR,
                    msg: '用户不存在',
                    data: null
                });
            }
        }
    } catch (error) {
        console.error('编辑时出错：', error);
        res.status(500).json({ error: '服务器错误！' });
    }
}



// 通过用户名查询用户信息
async function findPersonal(email) {
    const user = await PERSONAL.findOne({ email });
    if (user) {
        console.log('用户信息查询成功')
    } else {
        console.log('用户信息查询失败')
    }
    return user;
}

module.exports = {
    editpersonal,
    findPersonal
};
