const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// 连接到数据库
mongoose.connect('mongodb://localhost:27017/aaaaaaa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 创建用户模型
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true},
    userID: {type: Number, requeired: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const USER = mongoose.model('USER', UserSchema);

app.use(bodyParser.json());

// 注册路由
app.post('/register', async (req, res) => {
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

// 登录
app.post('/login', async (req, res) => {
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


// 验证输入格式，特别是密码格式和长度之类的
function validateReqBody(req) {
    const { id, password } = req.body;
  
    if (!id || typeof id !== 'string' || !password || typeof password !== 'string') 
    {
      return false;
    }
    return true;
  }


// 验证JWT是否有效
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录' });

  jwt.verify(token, 'csdn1acb8ck2sd0fs', (err, id) => {
    if (err) return res.status(403).json({ error: '验证失败' });
    req.user = id;
    next();
  });
}

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
