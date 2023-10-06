import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'; // 使用React Router库
import 'antd/dist/antd.css';
import Login from './views/login'; // 假设你的视图组件在这个路径下
import Home from './views/login'; // 同上

function App() {
  return (
    <Router>
      <Route path="/login" exact component={Login} />
      <Route path="/" exact component={Home} />
      <Redirect from="**" to="/" />
    </Router>
  );
}

export default App;
