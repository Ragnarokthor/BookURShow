import { useState, useEffect } from 'react';
import { getAllTheatresForAdmin, updateTheatre } from '../../apiCalls/theatres';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { useDispatch } from 'react-redux';
import { message, Button, Table, Typography, Tag, Space } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import "./AdminStyles.css";

const { Title } = Typography;

const TheatresTable = () => {
    const [theatres, setTheatres] = useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await getAllTheatresForAdmin();
            if (response.success) {
                const allTheatres = response.data;
                setTheatres(
                    allTheatres.map(function (item) {
                        return { ...item, key: `theatre${item._id}` }
                    })
                );
            } else {
                message.error(response.message)
            }
            dispatch(hideLoading())

        } catch (err) {
            dispatch(hideLoading());
            message.error(err.message);
        }
    }

    const handleStatusChange = async (theatre) => {
        try {
            dispatch(showLoading());
            let values = { ...theatres, theatreId: theatre._id, isActive: !theatre.isActive }
            const response = await updateTheatre(values);
            if (response.success) {
                message.success(response.message);
                getData();
            }
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            message.error(err.message);
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            render: (text, data) => {
                return data.owner && <span>{data.owner.name}</span>;
            }
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status, data) => {
                return data.isActive ? 
                    <Tag color="success" icon={<CheckCircleOutlined />}>Approved</Tag> : 
                    <Tag color="error" icon={<StopOutlined />}>Pending/Blocked</Tag>;
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, data) => {
                return (
                    <Space>
                        {data.isActive ? 
                            <Button 
                                danger 
                                onClick={() => handleStatusChange(data)}
                                icon={<StopOutlined />}
                                className="action-button block-button"
                            >
                                Block
                            </Button> : 
                            <Button 
                                type="primary" 
                                onClick={() => handleStatusChange(data)}
                                icon={<CheckCircleOutlined />}
                                className="action-button approve-button"
                            >
                                Approve
                            </Button>
                        }
                    </Space>
                )
            }
        },
    ];

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="admin-content-container">
            <div className="admin-header">
                <Title level={3} className="admin-title">Theatres Management</Title>
            </div>

            <div className="admin-table-container">
                {theatres && theatres.length > 0 && 
                    <Table 
                        dataSource={theatres} 
                        columns={columns} 
                        className="custom-table"
                        pagination={{ 
                            pageSize: 5, 
                            position: ["bottomCenter"],
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} theatres`
                        }}
                    />
                }
            </div>
        </div>
    )
}

export default TheatresTable;