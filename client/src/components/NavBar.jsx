import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Avatar, Typography } from '@mui/material';
import { Home, ShowChart, Person } from '@mui/icons-material';
// import { Menu } from 'antd';
// import { HomeOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';
// import { Link } from 'react-router-dom';


function generateAvatarText(username) {
  if (username) {
    return username.charAt(0).toUpperCase(); // 提取首字母并转为大写
  }
  return ''; // 如果用户名为空，则返回空字符串
}



function Navbar() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // 在组件加载时从数据库中获取用户名
    // 这里需要根据你的数据库操作方式来实现
    // 以下示例中假设使用MongoDB驱动程序
    // 你需要将下面的代码替换为实际的数据库查询操作

    // const fetchUsernameFromDatabase = async () => {
    //   try {
    //     // 执行数据库查询操作来获取用户名
    //     const user = await databaseQueryToGetUsername();
    //     setUsername(user.username); // 将用户名存储在组件状态中
    //   } catch (error) {
    //     console.error('从数据库获取用户名时出错：', error);
    //   }
    // };
    setUsername("testest")

    // fetchUsernameFromDatabase();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button color="inherit">
            <Home /> 首页
          </Button>
          <Button color="inherit">
            <ShowChart /> 股票
          </Button>
          <Button color="inherit">
            <Person /> 个人
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={() => console.log('头像点击')}>
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
