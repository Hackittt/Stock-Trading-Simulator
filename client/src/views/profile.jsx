import React, { useState } from 'react';
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
    const [activePage, setActivePage] = useState('个人信息');
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [password, setPassword] = useState('heyhey');

    // 保存原始的个人信息数据
    const [originalData, setOriginalData] = useState({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    });

    // 用于显示输入框错误消息的状态
    const [inputErrors, setInputErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleEditClick = () => {
        setOriginalData({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        });
        setIsEditing(true);
    };

    const handleSaveClick = () => {
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
        // 密码验证逻辑
        if (password.length < 6) {
            errors.password = '密码长度至少为6个字符';
        }

        // 有error，更新错误消息并不保存
        if (Object.keys(errors).length > 0) {
            setInputErrors(errors);
        } else {
            // 保存逻辑（将修改后的值提交到后端）
            setIsEditing(false);
        }
    };

    const handleCancelClick = () => {
        // 恢复到原始数据
        setFirstName(originalData.firstName);
        setLastName(originalData.lastName);
        setEmail(originalData.email);
        setPassword(originalData.password);
        setInputErrors({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });
        setIsEditing(false);
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
                            <ListItem button onClick={() => handleNavClick('持仓情况')}>
                                <ListItemText primary="持仓情况" />
                            </ListItem>
                            <ListItem button onClick={() => handleNavClick('资金情况')}>
                                <ListItemText primary="资金情况" />
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
                                        <Typography>密码: {isEditing ? password : '********'}</Typography>
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
                                        />
                                        <TextField
                                            label="密码"
                                            variant="outlined"
                                            fullWidth
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            margin="normal"
                                            error={!!inputErrors.password}
                                            helperText={inputErrors.password}
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
                        {activePage === '持仓情况' ? (
                            <Box mt={2}>
                                <Paper elevation={3}>
                                    <Typography variant="h5" mt={2} mx={2}>
                                        持仓情况
                                    </Typography>
                                    {/* 持仓情况内容 */}
                                </Paper>
                            </Box>
                        ) : null}
                        {activePage === '资金情况' ? (
                            <Box mt={2}>
                                <Paper elevation={3}>
                                    <Typography variant="h5" mt={2} mx={2}>
                                        资金情况
                                    </Typography>
                                    {/* 资金情况内容 */}
                                </Paper>
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default App;
