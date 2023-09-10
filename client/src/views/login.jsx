import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    // const response = await axios.post('api/login', {
    //   email: "testmai@test.com",
    //   password: "1234",
    // })

    // console.log(response.msg)

    try {
      const response = await axios.post('api/login', {
        email: email,
        password: password,
      });
      
      console.log('成功响应：', response);
      
      const token = response.data.data.token;
      const msg = response.data.msg;

      if (response.data.code === 0) {
        // 登录成功
        
        console.log(msg);

        localStorage.setItem('token', token);
        
      } else {
        // 登录失败
        console.log("nono");
        setShowResult(true); 
        
      }
    } catch (error) {
      // 处理请求错误
      console.error('请求错误：', error);
    }
  
    
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <Container component="main" maxWidth="xs" sx={{ marginTop: '40px', marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CssBaseline />
      <div sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Avatar sx={{ margin: 1, backgroundColor: theme => theme.palette.secondary.main }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginY: 3 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box sx={{ marginTop: 8 }}>
        &copy; {new Date().getFullYear()} 最无敌的网站
      </Box>
    </Container>
    </div>
  );
}

export default LogIn;
