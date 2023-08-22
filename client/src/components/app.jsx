import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import StockList from './StockList';

class App extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>
                <Routes>
                    <Route path="/" element={<StockList />} />
                </Routes>
            </React.Fragment>
        );
    }
}
 
export default App;