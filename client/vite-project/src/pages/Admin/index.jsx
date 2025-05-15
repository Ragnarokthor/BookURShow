import React from 'react';
import { Tabs, Typography } from 'antd';
import MovieList from './MovieList';
import TheatreTable from './TheatreTable';
import { VideoCameraOutlined, BankOutlined } from '@ant-design/icons';
import './AdminStyles.css';

const { Title } = Typography;

function Admin() {
    const onChange = key => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: (
                <span className="admin-tab-label">
                    <VideoCameraOutlined /> Movies
                </span>
            ),
            children: <MovieList />,
        },
        {
            key: '2',
            label: (
                <span className="admin-tab-label">
                    <BankOutlined /> Theatres
                </span>
            ),
            children: <TheatreTable />
        },
    ];

    return (
        <div className="admin-container">
            <div className="admin-header-main">
                <Title level={2} className="admin-page-title">Admin Dashboard</Title>
            </div>
            <div className="admin-tabs-container">
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
}

export default Admin;