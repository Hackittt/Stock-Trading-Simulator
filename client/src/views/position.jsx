import React, { Component } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

class Position extends Component {
    state = {
        searchParams: this.props.params[0],
        setSearchParams: this.props.params[1],
    };

    componentDidMount() {
        let page = this.state.searchParams.get('page');
        if (page === null) {
            page = 1;
        }
        axios.get('api/market/hq?page=' + page)
            .then(res => {
                this.setState({
                    stocks: res.data,
                    isLoaded: true
                });
            });
    }

    render() {
        if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <div className='d-flex p-2'>
                <table className="table table-striped table-borderless">
                    <thead>
                        <tr>
                            <th scope='col'>代码</th>
                            <th scope='col'>名称</th>
                            <th scope='col'>现价</th>
                            <th scope='col'>成交量</th>
                            <th scope='col'>振幅</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.stocks.map(stock => {
                            const color = 'text-success';
                            return (
                                <tr>
                                    <th scope='row'>{stock.code}</th>
                                    <td>{stock.name}</td>
                                    <td className={color}>{stock.close}</td>
                                    <td className={color}>{stock.volume}</td>
                                    <td className={color}>{stock.amplitude.toFixed(2)}</td>
                                    <td><button className='btn btn-primary'>加自选</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default (props) => (
    <Position
        {...props}
        params={useSearchParams()}
    />
);