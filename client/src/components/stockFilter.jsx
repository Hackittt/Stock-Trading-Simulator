import React, { Component } from 'react';
import { Button, Form, Input, Select, Space } from 'antd'; 
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

class StockFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params : [
                ['open', '开盘价'],
                ['volume', '成交量'],
                ['close', '现价'],
                ['amplitude', '涨跌幅']
            ],
            filter : props.filter
        };
    }

    render() { 

        return (
            <React.Fragment>
                <Form
                    name='dynamic_form'
                    onFinish={res => this.state.filter(res.filters)}
                    style={{
                        maxWidth : 600,
                        marginTop : 20,
                        marginBottom : 5
                    }}
                >
                    <Form.List name='filters'>
                        {(fields, { add, remove }) => (
                            <>
                            {fields.map((field, index) => (
                                <Space
                                key={field.key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 0,
                                }}
                                align='baseline'
                                >
                                <Form.Item
                                    label="Param"
                                    {...field}
                                    name={[field.name, 'param']}
                                    style={{
                                    marginTop: 0,
                                    marginBottom: 0,
                                    }}
                                >
                                    <Space.Compact>
                                    <Form.Item
                                        name={[field.name, 'name']}
                                        style={{
                                        margin: 0,
                                        padding: 0,
                                        }}
                                        rules={[
                                        {
                                            required : true,
                                            message : 'Unknown error'
                                        },
                                        ]}
                                    >
                                        <Select placeholder="选择参数">
                                        {this.state.params.map(param => (
                                            <Select.Option key={[field.name, param[0]]} value={param[0]}>{param[1]}</Select.Option>
                                        ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, 'low']}
                                        style={{
                                        margin: 0,
                                        padding: 0,
                                        }}
                                        rules={[
                                        {
                                            required: false,
                                        },
                                        ]}
                                    >
                                        <Input
                                        type='number'
                                        style={{
                                            width: 'auto',
                                        }}
                                        placeholder='最小值'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, 'high']}
                                        style={{
                                        margin: 0,
                                        padding: 0,
                                        }}
                                        rules={[
                                        {
                                            required: false,
                                        },
                                        ]}
                                    >
                                        <Input
                                        type='number'
                                        style={{
                                            width: 'auto',
                                        }}
                                        placeholder='最大值'
                                        />
                                    </Form.Item>
                                    </Space.Compact>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            ))}
                            <Form.Item
                                style={{
                                maxWidth: 200,
                                }}
                            >
                                <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />} >
                                    添加字段
                                </Button>
                            </Form.Item>
                            </>
                        )}
                        </Form.List>
                    <Form.Item label=" " colon={false} style={{margin : 0, padding : 0}}>
                        <Button
                            type='primary'
                            htmlType='submit'
                            style={{
                                margin : 0,
                            }}
                        >
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        );
    }
}
 
export default StockFilter;