import React, { Component } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs } from 'antd';


class ListNavBar extends Component {
    state = {
        defaultActiveKey : this.props.defaultActiveKey,
        navigater : this.props.navigate,
        items : [
            {
                key : 'stocklist',
                label : '股票'
            },
            {
                key : 'optional',
                label : '自选'
            },
            {
                key : 'position',
                label : '持仓'
            }
        ],
    }

    onChange = (activeKey) => {
        this.state.navigater('/' + activeKey);
    }

    render() { 
        return (
            <Tabs defaultActiveKey={this.state.defaultActiveKey} onChange={this.onChange}>
                {this.state.items.map((item) => (
                <Tabs.TabPane key={item.key} tab={item.label} />
                ))}
            </Tabs>
        )
    }
}

export default (props) => (
    <ListNavBar
        {...props}
        navigate = {useNavigate()}
    />
);