const jwt = require('jsonwebtoken'); 
const expressJwt = require('express-jwt');
const {PRIVATE_KEY} = require('./constant'); 

// 验证token是否过期
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
    '/api/resetPwd'
  ]
});

// jwt-token解析
function decode(req) {
  const token = req.get('Authorization')
  return jwt.verify(token, PRIVATE_KEY);
}

module.exports = {
  jwtAuth,
  decode
}
