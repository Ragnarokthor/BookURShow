import React from 'react';
import { Tabs, Typography } from 'antd';
import TheatreList from './TheatreList';
import { BankOutlined } from '@ant-design/icons';
import './TheatreManagement.css'

const { Title } = Typography;

const Partner = () => {
    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: (
                <span className="partner-tab-label">
                    <BankOutlined /> Theatres
                </span>
            ),
            children: <TheatreList />,
        }
    ];

    return (
        <div className="partner-container">
            <div className="partner-header-main">
                <Title level={2} className="partner-page-title">Partner Dashboard</Title>
            </div>
            <div className="partner-tabs-container">
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                    className="custom-tabs"
                    size="large"
                    animated={{ inkBar: true, tabPane: true }}
                />
            </div>
        </div>
    );
};

export default Partner;
