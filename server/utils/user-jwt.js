const jwt = require('jsonwebtoken'); 
const expressJwt = require('express-jwt');
const crypto = require('crypto');
const NodeCache = require("node-cache");
const { PRIVATE_KEY, JWT_EXPIRED } = require('./constant'); 


// const tokenCache = new NodeCache();
// // 验证token是否过期
// const jwtAuth = expressJwt({
//   // secret: (req)=>{
//   //   const token = getTokenFromRequest(req);
//   //   const load = jwt.decode(token);
//   //   console.log("Decoded Token Payload:", load);
//   //   const { email } = load;
//   //   const cachedToken = tokenCache.get(email);
//   //   console.log("Cached :", cachedToken);
//   //   // req.cachedToken = cachedToken;
//   //   // next();
//   //   return cachedToken;
//   // }, // 获取并使用token作为secret
//   secret:PRIVATE_KEY,
//   credentialsRequired: true,
//   algorithms: ['HS256'],
//   getToken:  (req) => {
//     if (req.headers.authorization) {
//       return req.headers.authorization
//     } else if (req.query && req.query.token) {
//       return req.query.token
//     }
//   }
// }).unless({
//   path: [
//     '/',
//     '/api/login',
//     '/api/register',
//     '/api/resetPwd'
//   ]
// });


// // function jwtAuth(req,res) {
// //   const key = getKey;
// //   console.log(key);
// //   return expressJwt({
// //     secret: getKey, // 获取并使用token作为secret
// //     credentialsRequired: true,
// //     algorithms: ['HS256'],
// //     getToken: getTokenFromRequest // 异步获取token
// //   }).unless({
// //     path: [
// //       '/',
// //       '/api/login',
// //       '/api/register',
// //       '/api/resetPwd'
// //     ]
// //   });
// // }


// // 获取token
// async function getTokenFromRequest(req) {
//   if (req.headers.authorization) {
//     return req.headers.authorization.split(' ')[1];
//   } else if (req.query && req.query.token) {
//     return req.query.token;
//   }
// }


// // 从cache获取key
// function getKey(req, res) {
//   const token = getTokenFromRequest(req);
//   const load = jwt.decode(token);
//   console.log("Decoded Token Payload:", load);
//   const { email } = load;
//   const cachedToken = tokenCache.get(email);
//   console.log("Cached Token:", cachedToken);
//   // req.cachedToken = cachedToken;
//   // next();
//   return cachedToken;
// }

// // 创建token并缓存
// function settoken(email) {
//   const privateKey = crypto.randomBytes(32).toString('hex');
//   console.log("key:",privateKey);
//   const token = jwt.sign(
//     { email },
//     privateKey,
//     { algorithm: 'HS256', expiresIn: JWT_EXPIRED }
//   );
//   tokenCache.set(email, privateKey, JWT_EXPIRED);
//   return token;
// }


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
