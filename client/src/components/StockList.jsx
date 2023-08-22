import React, { Component } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

class StockList extends Component {
    state = {
        searchParams : this.props.params[0],
        setSearchParams : this.props.params[1],
    };

    componentDidMount() {
        const page = this.state.searchParams.get('page');
        axios.get('market/hq?page=' + page)
        .then(res => {
            this.setState({
                stocks : res.data,
                isLoaded : true
            });
        });
    }

    render() {
        if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>代码</th>
                        <th>名称</th>
                        <th>现价</th>
                        <th>成交量</th>
                        <th>振幅</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.stocks.map(stock => (
                        <tr>
                            <td>{stock.code}</td>
                            <td>{stock.name}</td>
                            <td>{stock.close}</td>
                            <td>{stock.volume}</td>
                            <td>{stock.amplitude.toFixed(2)}</td>
                            <td><button className='btn btn-danger'>加自选</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

export default (props) => (
    <StockList
        {...props}
        params = {useSearchParams()}
    />
);