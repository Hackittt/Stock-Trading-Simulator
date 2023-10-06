import React, { Component } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import StockFilter from '../components/stockFilter';
import { Table, Space, Button, Pagination, Layout, Modal, Input, Radio, Result } from 'antd';
import ListNavBar from '../components/listNavBar';
import FundInfo from '../components/fundInfo';

class StockList extends Component {
    state = {
        exchangeCount : 0,
        exchangeCode : -1,
        exchangeType : null,

        showModal : false,
        showModal2 : false,
        showModal3 : false,

        searchParams : this.props.params[0],
        setSearchParams : this.props.params[1],
        navigate : this.props.navigate,
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
                title : '开盘价(￥)',
                dataIndex : 'open',
                key : 'open'
            },
            {
                title : '现价(￥)',
                dataIndex : 'close',
                key : 'close',
                sorter : (a, b) => a.close - b.close
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
                                <Button type='primary' onClick={() => this.addOptional(record.code)}>收藏</Button>
                            </Space>
                        );
                    } else {
                        return (
                            <Space size="middle">
                                <Button type='dashed' onClick={() => this.delOptional(record.code)}>删除</Button>
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

    showModal = (code) => {
        this.setState({ showModal: true, exchangeCode : code }); // 更新 showModal 的值为 true
    };

    closeModal = () => {
        this.setState({ showModal: false }); // 更新 showModal 的值为 false
    };

    showModal2 = () => {
        this.setState({showModal2 : true});
    }

    closeModal2 = () => {
        this.setState({showModal2 : false});
    }

    showModal3 = () => {
        this.setState({showModal3 : true});
    }

    closeModal3 = () => {
        this.setState({showModal3 : false});
    }


    componentDidMount() {
        // 配置拦截器
        axios.interceptors.request.use(
          config => {
            const token = localStorage.getItem('token');
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
          }, error => {
            return Promise.reject(error);
          }
        );

        let page = this.state.searchParams.get('page');
        if (page === null) {
            page = 1;
        }
        this.setState({
            currentPage : page
        });

        this.changeList(page);

        axios.get('api/stockscount')
        .then(res => {
            this.setState({
                stocksCount : res.data,
            });
        }).catch(error => {
            console.log(error);
            return;
        });
    }

    // 添加自选
    addOptional(code) {
        let data = {code : code};
        axios.post('api/addoptional', data)
        .then(res => {
        }).catch(error => {
            console.log(error);
            return;
        });

        delete this.historyList[this.state.currentPage];
        this.changeList(this.state.currentPage);
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

        delete this.historyList[this.state.currentPage];
        this.changeList(this.state.currentPage);
    }

    // 更新列表
    historyList = {};
    changeList(page) {
        if (this.historyList[page]) {
            this.setState({
                stocks : this.historyList[page]
            });
            return;
        }

        axios.get('api/hq?page=' + page)
        .then(res => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].key = i;
                res.data[i].amplitude = res.data[i].amplitude ? res.data[i].amplitude.toFixed(2) : res.data[i].amplitude;
            }
            this.historyList[page] = res.data;
            this.setState({
                stocks : res.data,
                isLoaded : true
            });
        }).catch(error => {
            console.log(error);
        });
    }

    // 页数改变
    modifyPage(page) {
        this.setState({
            currentPage : page
        });
        this.props.navigate('/stocklist?page=' + page);
        this.changeList(page);
    }

    // 筛选器
    filter = (params) => {
        console.log(params);
        axios.post('api/sizer', params)
        .then(res => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].amplitude = res.data[i].amplitude ? res.data[i].amplitude.toFixed(2) : res.data[i].amplitude;
            }
            this.setState({
                stocks : res.data,
                isLoaded : true
            });
        }).catch(error => {
            console.log(error);
        });
    }

    // 修改缓存
    modifyHistory(page) {
        if (!this.historyList[page]) {
            return;
        }

        axios.get('api/hq?page=' + page)
        .then(res => {
            this.historyList[page] = res.data;
        }).catch(error => console.log(error));
    }

    // 交易
    exchange(code, count) {
        if (this.state.exchangeType === 'out') {
            count = -count;
        }

        axios.post('api/exchange', {
            code : code,
            count : count
        }).then(res => {
            const data = res.data;
            if (data === false) {
                this.showModal3();
            } else if (data === true) {
                this.showModal2();
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
                            destroyOnClose={true}
                        >
                            <FundInfo code={this.state.exchangeCode} />
                            <>
                                <Radio.Group
                                    defaultValue='in'
                                    defaultActiveKey='a'
                                    buttonStyle='solid'
                                    style={{
                                        marginTop : 10,
                                        marginBottom : 10
                                    }}
                                    onChange={(e) => {
                                        this.setState({exchangeType : e.target.value});
                                    }}
                            >
                                    <Radio.Button value="in">买入</Radio.Button>
                                    <Radio.Button value="out">卖出</Radio.Button>
                                </Radio.Group>
                            </>
                            <Input 
                                placeholder='数量'
                                type='number'
                                style={{
                                    margin : 'auto',
                                    marginTop : 10,
                                    marginBottom : 15
                                }}
                                onChange={e => this.setState({exchangeCount : e.target.value})}
                            />
                        </Modal>
                        <Modal
                            open={this.state.showModal2}
                            onCancel={this.closeModal2}
                            centered={true}
                            confirmLoading={false}
                            onOk={this.closeModal2}
                            destroyOnClose={false}
                            footer={false}
                        >
                            <Result
                                status="success"
                                title="交易成功"
                                extra={
                                    <Button type='primary' onClick={this.closeModal2}>确定</Button>
                                }
                            />
                        </Modal>
                        <Modal
                            open={this.state.showModal3}
                            onCancel={this.closeModal3}
                            centered={true}
                            confirmLoading={false}
                            onOk={this.closeModal3}
                            destroyOnClose={false}
                            footer={false}
                        >
                            <Result
                                title="交易失败"
                                extra={
                                    <Button type='primary' onClick={this.closeModal3}>确定</Button>
                                }
                            />
                        </Modal>
                        <ListNavBar defaultActiveKey={'stocklist'} />
                        <StockFilter filter={this.filter} />
                        <Table dataSource={this.state.stocks} columns={this.state.columns} pagination={false} />
                        <Pagination simple  
                            defaultCurrent={this.state.currentPage} 
                            total={this.state.stocksCount} 
                            onChange={(page, pageSize) => this.modifyPage(page)} 
                            pageSize={30}
                            style={{ margin: '0 auto', display: 'block', bottom : 0 }}
                        />
                    </Layout>
                </div>
            </React.Fragment>
        );
    }
}

export default (props) => (
    <StockList
        {...props}
        params = {useSearchParams()}
        navigate = {useNavigate()}
    />
);