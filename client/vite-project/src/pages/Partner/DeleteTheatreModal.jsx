import React from 'react';
import { Modal, Button, message } from "antd";
import { deleteTheatre } from "../../apiCalls/theatres";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './TheatreManagement.css'

const DeleteTheatreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const dispatch = useDispatch();
  
  const handleOk = async () => {
    try {
      dispatch(showLoading());
      const theatreId = selectedTheatre._id;
      const response = await deleteTheatre({ theatreId });
      
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
        setSelectedTheatre(null);
      }
      
      setIsDeleteModalOpen(false);
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      setIsDeleteModalOpen(false);
      message.error(err.message);
    }
  };
  
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          Delete Theatre
        </div>
      }
      open={isDeleteModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" danger type="primary" onClick={handleOk}>
          Yes, Delete
        </Button>,
      ]}
      className="delete-theatre-modal"
      centered
    >
      <p className="delete-message">
        Are you sure you want to delete <strong>{selectedTheatre?.name}</strong>?
      </p>
      <p className="delete-warning">
        This action cannot be undone. All data associated with this theatre will be permanently removed.
      </p>
    </Modal>
  );
};

export default DeleteTheatreModal;