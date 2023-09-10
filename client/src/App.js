import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/NavBar'; // 导入导航栏组件
import StockList from './views/StockList';
import Optional from './views/optional';
import Position from './views/position';
import LogIn from './views/login';
import SignUp from './views/register';
import Profile from './views/profile';

class App extends Component {
    state = {}
    render() {
        return (
            <React.Fragment>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Profile />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/stocklist" element={<StockList />} />
                    <Route path='/optional' element={<Optional />} />
                    <Route path='/position' element={<Position />} />
                </Routes>
            </React.Fragment>
        );
    }
}

export default App;
