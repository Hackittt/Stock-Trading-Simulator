import React, { Component } from 'react';
import { Routes, Route, Link} from 'react-router-dom';
import StockList from './StockList';
import Optional from './optional';
import Position from './position';

class App extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>
                <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    <div className='container-fluid'>
                        <Link className='navbar-brand' href='/'>Home</Link>
                        <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
                            <div className='navbar-nav'>
                                <Link className='nav-link active' to='/'>首页</Link>
                                <Link className='nav-link' to='/optional'>自选</Link>
                                <Link className='nav-link' to='/position'>持仓</Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<StockList />} />
                    <Route path='/optional' element={<Optional />} />
                    <Route path='/position' element={<Position />} />
                </Routes>
            </React.Fragment>
        );
    }
}
 
export default App;