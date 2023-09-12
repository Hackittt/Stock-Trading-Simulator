import React, { Component } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Table, Space, Button, Modal, Input, Layout } from 'antd';
import ListNavBar from '../components/listNavBar';

class Optional extends Component {
    state = {
        searchParams : this.props.params[0],
        setSearchParams : this.props.params[1],

        columns : [
            {
                title : '代码',
                dataIndex : 'code',
                key : 'code',
                sorter : (a, b) => a.code - b.code
            },
            {
                title : '名称',
                dataIndex : 'name',
                key : 'name'
            },
            {
                title : '开盘价',
                dataIndex : 'open',
                key : 'open'
            },
            {
                title : '现价',
                dataIndex : 'close',
                key : 'close',
                sorter : (a, b) => a.price - b.price
            },
            {
                title : '成交量',
                dataIndex : 'volume',
                key : 'volume',
                sorter : (a, b) => a.volume - b.volume
            },
            {
                title : '涨跌幅',
                dataIndex : 'amplitude',
                key : 'amplitude',
                align : 'right',
                sorter : (a, b) => a.amplitude - b.amplitude
            },
            {
                title : '操作',
                key : 'action',
                align : 'center',
                render : (_, record) => {
                    if (!record.isOptional) {
                        return (
                            <Space size="middle">
                                <Button onClick={() => this.addOptional(record.code)}>加自选</Button>
                            </Space>
                        );
                    } else {
                        return (
                            <Space size="middle">
                                <Button onClick={() => this.delOptional(record.code)}>删除</Button>
                            </Space>
                        )
                    }
                }
            },
            {
                title : '交易',
                key : 'exchange',
                align : 'center',
                width : '50',
                render : (_, record) => {
                    return (
                        <Space size="middle">
                            <Button type='primary'  onClick={() => this.showModal(record.code)} >交易</Button>
                        </Space>
                    )
                }
            }
        ]
    };

    componentDidMount() {
        axios.get('api/optional')
        .then(res => {
            for (let i = 0; i < res.data.length; i++) {
                res[i].amplitude = res.data[i].amplitude ? res.data[i].amplitude.toFixed(2) : 0;
            }
            this.setState({
                stocks : res.data,
                isLoaded : true
            });
        });
    }

    // 添加自选
    addOptional(code) {
        let data = {code : code};
        axios.post('api/addoptional', data)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
            return;
        });

        axios.get('api/optional')
        .then(res => {
            this.setState({
                stocks : res.data,
                isLoaded : true
            });
        });
    }


    // 删除自选
    delOptional(code) {
        let data = {code : code};
        axios.post('api/deloptional', data)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
            return;
        });

        axios.get('api/optional')
        .then(res => {
            this.setState({
                stocks : res.data,
                isLoaded : true
            });
        });
    }

    // 交易
    exchange(code, count) {
        axios.post('api/exchange', {
            code : code,
            count : count
        }).then(res => {
            const data = res.data;
            if (data === false) {
                console.log('exchange false');
            } else if (data === true) {
                console.log('true');
            }
        })
        .catch(error => {
            console.log(error);
        });

        this.closeModal();
    }

    render() {
        if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <React.Fragment>
                <div
                    style={{
                        width : '85%',
                        margin : '0 auto',
                        marginTop : 20,
                        background : '#F5F5F5',
                        borderRadius : '2%',
                        overflow : 'auto'
                    }}
                >
                    <Layout style={{
                            width : '95%',
                            margin : '0 auto',
                            marginTop : 5,
                            marginBottom : 20,
                        }}
                    >
                        <Modal
                            title="交易窗口"
                            open={this.state.showModal}
                            onCancel={this.closeModal}
                            centered={true}
                            confirmLoading={false}
                            onOk={() => this.exchange(this.state.exchangeCode, this.state.exchangeCount)}
                        >
                            <Input 
                                placeholder='数量'
                                type='number'
                                style={{
                                    margin : 'auto'
                                }}
                                onChange={e => this.setState({exchangeCount : e.target.value})}
                            />
                        </Modal>
                        <ListNavBar defaultActiveKey={'optional'} />
                        <Table dataSource={this.state.stocks} columns={this.state.columns} pagination={false} />
                    </Layout>
                </div>
            </React.Fragment>
        );
    }
}

export default (props) => (
    <Optional
        {...props}
        params = {useSearchParams()}
    />
)