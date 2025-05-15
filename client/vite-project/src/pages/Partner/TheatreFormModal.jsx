import React from 'react';
import { Col, Modal, Row, Form, Input, Button, message } from 'antd';
import { showLoading, hideLoading } from '../../redux/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addTheatre, updateTheatre } from '../../apiCalls/theatres';
import { VideoCameraOutlined } from '@ant-design/icons'; // ✅ replaced invalid FilmOutlined
import TextArea from 'antd/es/input/TextArea';
import './TheatreManagement.css';

const TheatreFormModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  getData,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response = null;

      if (formType === 'add') {
        response = await addTheatre({ ...values, owner: user._id });
      } else {
        values.theatreId = selectedTheatre._id;
        response = await updateTheatre(values);
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setIsModalOpen(false);
      } else {
        message.error(response.message);
      }

      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      message.error(err.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTheatre(null);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <VideoCameraOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          {formType === 'add' ? 'Add New Theatre' : 'Edit Theatre Details'}
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="theatre-form-modal"
      centered
    >
      <Form
        layout="vertical"
        className="theatre-form"
        initialValues={selectedTheatre}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              className="theatre-form-item"
              rules={[{ required: true, message: 'Theatre name is required!' }]}
            >
              <Input
                className="theatre-input"
                placeholder="Enter the theatre name"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Theatre Address"
              name="address"
              className="theatre-form-item"
              rules={[{ required: true, message: 'Theatre address is required!' }]}
            >
              <TextArea
                className="theatre-textarea"
                rows={3}
                placeholder="Enter the theatre address"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              className="theatre-form-item"
              rules={[
                { required: true, message: 'Email is required!' },
                { type: 'email', message: 'Please enter a valid email address!' },
              ]}
            >
              <Input
                className="theatre-input"
                type="email"
                placeholder="Enter the email address"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              className="theatre-form-item"
              rules={[{ required: true, message: 'Phone number is required!' }]}
            >
              <Input
                className="theatre-input"
                type="number"
                placeholder="Enter the phone number"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="theatre-form-actions">
          <Button className="cancel-button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="submit-button">
            {formType === 'add' ? 'Add Theatre' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TheatreFormModal;
