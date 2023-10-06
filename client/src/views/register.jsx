import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');


  const handleOpenDialog = (message) => {
    setDialogMessage(message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/register', {
        email: email,
        password: password,
      });

      console.log('成功响应：', response);

      const token = response.data.data.token;
      const msg = response.data.msg;

      if (response.data.code === 0) {
        // 注册成功
        console.log(msg);

        localStorage.setItem('token', token);

        navigate('/login');

      } else {
        // 注册失败
        console.log(msg);
        handleOpenDialog('注册失败');

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
          Sign Up
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginY: 3 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Sign in"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box sx={{ marginTop: 8 }}>
        &copy; {new Date().getFullYear()} Our Sweet Web
      </Box>
    </Container>
    <Dialog open={openDialog} onClose={handleCloseDialog}>
<DialogTitle>注册失败</DialogTitle>
<DialogContent>
  <DialogContentText>{dialogMessage}</DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseDialog}>关闭</Button>
</DialogActions>
</Dialog>
    </div>



  );
}

export default SignUp;
