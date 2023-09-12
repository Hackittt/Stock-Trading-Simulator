import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/system';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import axios from 'axios';

import FundsChart from '../components/fundchart'
import { useNavigate } from 'react-router-dom';


const NavMenu = styled('div')({
    backgroundColor: (theme) => theme.palette.primary.main,
    color: '#fff',
    borderRadius: '4px',
});

const NavMenuItem = styled('div')({
    padding: '8px 16px',
    '&:hover': {
        backgroundColor: (theme) => theme.palette.primary.dark,
        cursor: 'pointer',
    },
});


function App() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [userInfo, setuserInfo] = useState({
        email: '',
        first: '',
        last: '',
    });

    // 获取用户登录信息
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('api/findpersonal', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setuserInfo(response.data);
                setEmail(response.data.email);
                setFirstName(response.data.first);
                setLastName(response.data.last)
            } catch (error) {
                console.error('获取用户信息失败', error);
            }
        };

        fetchUser(); // 调用异步函数
    }, [token]);

    // 获取用户持仓
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('api/position', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setstock(response.data);
            } catch (error) {
                console.error('获取用户信息失败', error);
            }
        };

        // 调用 fetchUser 函数来获取用户的持仓信息
        fetchUser();
    }, [token]);





    const [activePage, setActivePage] = useState('个人信息');
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(userInfo.first ? userInfo.first : '');
    const [lastName, setLastName] = useState(userInfo.last ? userInfo.last : '');
    const [email, setEmail] = useState(userInfo.email ? userInfo.email : '');
    const [stock, setstock] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');




    const [availableFunds, setAvailableFunds] = useState(1000); // 可用资金
    const [holdingFunds, setHoldingFunds] = useState(2000); // 持仓资金

    // 保存原始的个人信息数据
    const [originalData, setOriginalData] = useState({
        firstName: firstName,
        lastName: lastName,
        email: email,
    });

    // 用于显示输入框错误消息的状态
    const [inputErrors, setInputErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const handleEditClick = () => {
        setOriginalData({
            firstName: firstName,
            lastName: lastName,
            email: email,
        });
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        // 输入栏验证逻辑
        const errors = {};
        if (firstName.trim() === '') {
            errors.firstName = '名字不能为空';
        }
        if (lastName.trim() === '') {
            errors.lastName = '姓氏不能为空';
        }
        if (email.trim() === '') {
            errors.email = '电子邮件不能为空';
        }

        // 有error，更新错误消息并不保存
        if (Object.keys(errors).length > 0) {
            setInputErrors(errors);
        } else {
            // 保存逻辑（将修改后的值提交到后端）
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const requestData = {
                email: email,
                first: firstName,
                last: lastName,
            };

            try {
                const response = await axios.post('api/editpersonal', requestData, { headers });
                setIsEditing(false);
                // 在这里可以处理成功保存后的逻辑
            } catch (error) {
                console.error('保存个人信息失败', error);
                // 在这里可以处理保存失败后的逻辑
            }

        }
    };

    const handleCancelClick = () => {
        // 恢复到原始数据
        setFirstName(originalData.firstName);
        setLastName(originalData.lastName);
        setEmail(originalData.email);
        setInputErrors({
            firstName: '',
            lastName: '',
            email: '',
        });
        setIsEditing(false);
    };


    // 密码更新按钮
    const handlePasswordUpdate = async () => {
        // 输入栏验证逻辑
        const errors = {};
        if (oldPassword.trim() === '') {
            errors.oldPassword = '旧密码不能为空';
        }
        if (newPassword.length < 6) {
            errors.newPassword = '新密码长度至少为6个字符';
        }

        // 有error，更新错误消息不保存
        if (Object.keys(errors).length > 0) {
            setInputErrors(errors);
        } else {
            //将旧密码和新密码提交到后端
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const requestData = {
                email: email,
                oldPassword: oldPassword,
                newPassword: newPassword,
            };

            try {
                // 成功更新密码后
                const response = await axios.post('api/resetPwd', requestData, { headers });
                console.log(response.msg)
            } catch (error) {
                // 更新密码失败后
                console.error('更新密码失败', error);
            }
        }
    };

    const handleLogoutClick = () => {
        // 删除本地存储中的 token
        localStorage.removeItem('token');
        // 跳转到登录页面
        navigate('/login');
    };


    const handleNavClick = (page) => {
        setActivePage(page);
    };

    return (
        <div>
            <Container>
                <Box display="flex">
                    <Box width={200} mt={2}>
                        <List>
                            <ListItem button onClick={() => handleNavClick('个人信息')}>
                                <ListItemText primary="个人信息" />
                            </ListItem>
                            <ListItem button onClick={() => handleNavClick('更新密码')}>
                                <ListItemText primary="更新密码" />
                            </ListItem>
                            <ListItem button onClick={() => handleNavClick('持仓情况')}>
                                <ListItemText primary="持仓情况" />
                            </ListItem>
                            <ListItem button onClick={() => handleNavClick('资金情况')}>
                                <ListItemText primary="资金情况" />
                            </ListItem>
                            <ListItem button onClick={() => handleNavClick('退出登录')}>
                                <ListItemText primary="退出登录" />
                            </ListItem>
                        </List>
                    </Box>
                    <Box flex={1} mt={2}>
                        {activePage === '个人信息' ? (
                            <Box mt={2}>
                                <Typography variant="h5">个人信息</Typography>
                                {!isEditing ? (
                                    <Box mt={2}>
                                        <Typography>名字: {firstName}</Typography>
                                        <Typography>姓氏: {lastName}</Typography>
                                        <Typography>电子邮件: {email}</Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={handleEditClick}
                                            disabled={isEditing}
                                            style={{ marginTop: '16px' }}
                                        >
                                            编辑
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box mt={2}>
                                        <TextField
                                            label="名字"
                                            variant="outlined"
                                            fullWidth
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            margin="normal"
                                            error={!!inputErrors.firstName}
                                            helperText={inputErrors.firstName}
                                        />
                                        <TextField
                                            label="姓氏"
                                            variant="outlined"
                                            fullWidth
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            margin="normal"
                                            error={!!inputErrors.lastName}
                                            helperText={inputErrors.lastName}
                                        />
                                        <TextField
                                            label="电子邮件"
                                            variant="outlined"
                                            fullWidth
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            margin="normal"
                                            error={!!inputErrors.email}
                                            helperText={inputErrors.email}
                                            disabled={isEditing}
                                        />
                                        <Box mt={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSaveClick}
                                                style={{ marginRight: '32px' }}
                                            >
                                                保存
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleCancelClick}
                                            >
                                                取消
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        ) : null}

                        {activePage === '更新密码' ? (
                            <Box mt={2}>
                                <Typography variant="h5">更新密码</Typography>
                                <Box mt={2}>
                                    <TextField
                                        label="旧密码"
                                        variant="outlined"
                                        fullWidth
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        margin="normal"
                                        error={!!inputErrors.oldPassword}
                                        helperText={inputErrors.oldPassword}
                                    />
                                    <TextField
                                        label="新密码"
                                        variant="outlined"
                                        fullWidth
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        margin="normal"
                                        error={!!inputErrors.newPassword}
                                        helperText={inputErrors.newPassword}
                                    />
                                    <Box mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handlePasswordUpdate}
                                        >
                                            更新密码
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        ) : null}

                        {activePage === '持仓情况' ? (
                            <Box mt={2}>
                                <Paper elevation={3}>
                                    <Typography variant="h5" mt={2} mx={2}>
                                        持仓情况
                                    </Typography>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="持仓情况表格">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>代码</TableCell>
                                                    <TableCell>名称</TableCell>
                                                    <TableCell>开盘价</TableCell>
                                                    <TableCell>现价</TableCell>
                                                    <TableCell>持仓量</TableCell>
                                                    <TableCell>持仓成本</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stock.map((stockItem, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{stockItem.code}</TableCell>
                                                        <TableCell>{stockItem.name}</TableCell>
                                                        <TableCell>{stockItem.open}</TableCell>
                                                        <TableCell>{stockItem.close}</TableCell>
                                                        <TableCell>{stockItem.count}</TableCell>
                                                        <TableCell>{stockItem.cost}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        ) : null}

                        {activePage === '资金情况' ? (
                            <Box mt={2}>
                                <Paper elevation={3}>
                                    <Typography variant="h5" mt={2} mx={2}>
                                        资金情况
                                    </Typography>
                                    <FundsChart
                                        availableFunds={availableFunds}
                                        holdingFunds={holdingFunds}
                                    />
                                </Paper>
                            </Box>
                        ) : null}

                        {activePage === '退出登录' ? (
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleLogoutClick}
                                    style={{ margin: '16px' }}
                                >
                                    退出登录
                                </Button>
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            </Container>

        </div>
    );
}

export default App;
