import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Avatar, Typography } from '@mui/material';
import { Home, ShowChart, Person } from '@mui/icons-material';
import axios from 'axios';

function generateAvatarText(username) {
  if (username) {
    return username.charAt(0).toUpperCase(); // 提取首字母并转为大写
  }
  return ''; // 如果用户名为空，则返回空字符串
}

function isUserLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token;
}

function Navbar() {
  const [username, setUsername] = useState('');
  const [tokenValid, setTokenValid] = useState(true); // 用于存储 token 是否有效的状态
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('api/findpersonal', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.email);
        setTokenValid(true); // 设置 token 有效
      } catch (error) {
        console.error('获取用户信息失败', error);
        setTokenValid(false); // 设置 token 无效
        setUsername('登录'); // 设置用户名为 "登录"
      }
    };

    if (token) {
      fetchUser();
    } else {
      setUsername('登录'); // 设置用户名为 "登录"
    }
  }, [token]);

  // 头像按钮的点击事件处理函数
  const handleAvatarClick = async () => {
    if (token) {
      if (tokenValid) {
        // 如果存在 token 且有效，则跳转到 Profile 页面
        navigate('/profile');
      } else {
        // 如果存在 token 但无效，可以执行退出登录操作或其他操作
        // 例如清除本地存储中的无效 token 并跳转到登录页
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      // 如果不存在 token，则跳转到 Login 页面
      navigate('/login');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button color="inherit" component={Link} to="/Stocklist">
            <Home /> 首页
          </Button>
          <Button color="inherit" component={Link} to="/Optional">
            <ShowChart /> 股票
          </Button>
          {token ? (
            <Button color="inherit" component={Link} to="/profile">
              <Person /> 个人
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              <Person /> 个人
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar alt="用户头像">
              {generateAvatarText(username)}
            </Avatar>
          </IconButton>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {username}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
