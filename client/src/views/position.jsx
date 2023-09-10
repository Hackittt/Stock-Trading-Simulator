import React, { Component } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Table, Space, Button, Layout, Modal, Input } from 'antd';
import ListNavBar from '../components/listNavBar';

class Position extends Component {
    state = {
        searchParams: this.props.params[0],
        setSearchParams: this.props.params[1],

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
                title : '股数',
                dataIndex : 'count',
                key : 'count',
                align : 'right',
                sorter : (a, b) => a.count - b.count
            },
            {
                title : '持股成本',
                dataIndex : 'cost',
                key : 'cost',
                align : 'right',
                sorter : (a, b) => a.cost - b.cost
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
        let page = this.state.searchParams.get('page');
        if (page === null) {
            page = 1;
        }
        axios.get('api/position')
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
                            onOk={this.exchange(this.state.exchangeCode, this.state.exchangeCount)}
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
    <Position
        {...props}
        params={useSearchParams()}
    />
);