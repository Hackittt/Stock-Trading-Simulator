const jwt = require('jsonwebtoken'); 
const expressJwt = require('express-jwt');
const crypto = require('crypto');
const NodeCache = require("node-cache");
const { PRIVATE_KEY, JWT_EXPIRED } = require('./constant'); 


const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  credentialsRequired: true,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.headers.authorization) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token
    }
  }
}).unless({
  path: [
    '/',
    '/api/login',
    '/api/register',
    '/api/resetPwd',
    'api/login',
    'api/register',
    'api/resetPwd'
  ]
});


// 创建token并缓存
function settoken(email) {
  console.log("key:",PRIVATE_KEY);
  const token = jwt.sign(
    { email },
    PRIVATE_KEY,
    { algorithm: 'HS256', expiresIn: JWT_EXPIRED }
  );
  return token;
}

// jwt-token解析
function decode(req) {
  const token = req.get('Authorization');
  return jwt.verify(token, PRIVATE_KEY);
}


module.exports = {
  jwtAuth,
  decode,
  settoken
};
