import { Modal, message, Typography } from 'antd';
import { deleteMovie } from '../../apiCalls/movies';
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./AdminStyles.css";

const { Text } = Typography;

const DeleteMovieModal = ({isDeleteModalOpen, setIsDeleteModalOpen, selectedMovie, setSelectedMovie, getData}) => {
    const dispatch = useDispatch();
    
    const handleOk = async () => {
        try {
            dispatch(showLoading());
            const movieId = selectedMovie._id;
            const response = await deleteMovie({ movieId });
          
            if(response.success) {
                message.success(response.message);
                getData();
            } else {
                message.error(response.message);
                setSelectedMovie(null);
            }
            setIsDeleteModalOpen(false);
            dispatch(hideLoading());
            
        } catch(err) {
            dispatch(hideLoading());
            setIsDeleteModalOpen(false);
            message.error(err.message);
        }        
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
        setSelectedMovie(null);
    };

    return (
        <Modal
            title={
                <div className="delete-modal-title">
                    <ExclamationCircleOutlined className="warning-icon" />
                    <span>Delete Movie</span>
                </div>
            }
            open={isDeleteModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            centered
            className="custom-delete-modal"
        >
            <div className="delete-modal-content">
                <Text className="delete-modal-message">
                    Are you sure you want to delete <strong>{selectedMovie?.title}</strong>?
                </Text>
                <Text type="danger" className="delete-modal-warning">
                    This action cannot be undone and you'll lose all data associated with this movie.
                </Text>
            </div>
        </Modal>
    );
};

export default DeleteMovieModal;