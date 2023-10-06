import React, { Component } from 'react';
import { Descriptions } from 'antd';
import axios from 'axios';

class FundInfo extends Component {
    state = {
        code : this.props.code,
        fundData: 'Loading',
        count : 'Loading'
    };

    componentDidMount() {
        this.fetchFundData();
        this.fetchCount();
    }

    async fetchFundData() {
        try {
            const response = await axios.post('/api/userfund');
            this.setState({ fundData: response.data });
        } catch (error) {
            console.log(error);
            this.setState({ fundData: 'Not Found' });
        }
    }

    async fetchCount() {
        try {
            const response = await axios.get('/api/position');
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].code === this.state.code) {
                    this.setState({count : response.data[i].count});
                    return;
                }
            }
            this.setState({count : '0'});
        } catch (error) {
            console.log(error);
            this.setState({count : 'Not Found'});
        }
    }

    render() {
        const items = [
            {
                key: '1',
                label: '可用资金',
                children : this.state.fundData,

            },
            {
                key: '2',
                label: '持股数量',
                children: this.state.count,
            },
        ];

        return <Descriptions items={items} size='small' />;
    }
}

export default FundInfo;