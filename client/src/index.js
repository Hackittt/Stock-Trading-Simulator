// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'; // 导入全局样式文件
import App from './App'; // 导入主组件
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById('root')
);

reportWebVitals();



// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router } from 'react-router-dom'; // 如果需要使用React Router
// // import 'antd/dist/antd.css'; // 引入Ant Design的样式
// import './index.css'; // 自定义全局样式
// import LoginContainer from './views/login'; // 假设你的登录容器在这个文件中

// ReactDOM.render(
//   <Router>
//     <LoginContainer />
//   </Router>,
//   document.getElementById('root')
// );
