import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F'];

const PieChartComponent = ({ availableFunds, holdingFunds }) => {
    availableFunds = 1000;
    holdingFunds = 2000;
    // totalFunds = availableFunds + holdingFunds;
    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={[
                            { name: '可用资金', value: availableFunds },
                            { name: '持仓资金', value: holdingFunds },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {[
                            { name: '可用资金', value: availableFunds },
                            { name: '持仓资金', value: holdingFunds },
                        ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div>
                    <strong>总资金：</strong> {availableFunds + holdingFunds} {/* 显示总资金 */}
                </div>
                <div>
                    <strong>可用资金：</strong> {availableFunds} {/* 显示可用资金 */}
                </div>
                <div>
                    <strong>持仓资金：</strong> {holdingFunds} {/* 显示持仓资金 */}
                </div>
            </div>
        </div>
    );
};

export default PieChartComponent;

