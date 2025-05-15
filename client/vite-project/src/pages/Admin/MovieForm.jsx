import React from "react";
import { Col, Modal, Row, Form, Input, Select, Button, message, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { addMovie, updateMovie } from "../../apiCalls/movies";
import moment from "moment";
import { SaveOutlined, CloseOutlined, VideoCameraOutlined, CalendarOutlined } from "@ant-design/icons";
import "./AdminStyles.css";

const { Title } = Typography;

const MovieForm = ({
  isModalOpen,
  setIsModalOpen,
  selectedMovie,
  setSelectedMovie,
  formType, // add , edit
  getData,
}) => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      "YYYY-MM-DD"
    );
  }

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response = null;
      if (formType === "add") {
        response = await addMovie(values);
        setSelectedMovie(null);
      } else {
        response = await updateMovie({ ...values, movieId: selectedMovie._id });
        setSelectedMovie(null);
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
    setSelectedMovie(null);
  };

  return (
    <Modal
      centered
      title={
        <div className="movie-form-title">
          <VideoCameraOutlined className="movie-form-icon" />
          <span>{formType === "add" ? "Add New Movie" : "Edit Movie"}</span>
        </div>
      }
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="custom-movie-form-modal"
    >
      <Form
        layout="vertical"
        style={{ width: "100%" }}
        initialValues={selectedMovie}
        onFinish={onFinish}
        className="custom-form"
      >
        <Row
          gutter={{
            xs: 10,
            sm: 16,
            md: 20,
            lg: 24,
          }}
        >
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              htmlFor="title"
              name="title"
              className="form-item"
              rules={[{ required: true, message: "Movie name is required!" }]}
            >
              <Input
                id="title"
                type="text"
                placeholder="Enter the movie name"
                className="custom-input"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              htmlFor="description"
              name="description"
              className="form-item"
              rules={[{ required: true, message: "Description is required!" }]}
            >
              <TextArea
                id="description"
                rows="4"
                placeholder="Enter the description"
                className="custom-textarea"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row
              gutter={{
                xs: 10,
                sm: 16,
                md: 20,
                lg: 24,
              }}
            >
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Movie Duration (in min)"
                  htmlFor="duration"
                  name="duration"
                  className="form-item"
                  rules={[
                    { required: true, message: "Movie duration is required!" },
                  ]}
                >
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Enter the movie duration"
                    className="custom-input"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Select Movie Language"
                  htmlFor="language"
                  name="language"
                  className="form-item"
                  rules={[
                    { required: true, message: "Movie language is required!" },
                  ]}
                >
                  <Select
                    id="language"
                    placeholder="Select Language"
                    className="custom-select"
                    onChange={handleChange}
                    options={[
                      { value: "English", label: "English" },
                      { value: "Kannada", label: "Kannada" },
                      { value: "Hindi", label: "Hindi" },
                      { value: "Telugu", label: "Telugu" },
                      { value: "Bengali", label: "Bengali" },
                      { value: "German", label: "German" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Release Date"
                  htmlFor="releaseDate"
                  name="releaseDate"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Movie Release Date is required!",
                    },
                  ]}
                >
                  <Input
                    id="releaseDate"
                    type="date"
                    placeholder="Choose the release date"
                    className="custom-input"
                    prefix={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row
              gutter={{
                xs: 10,
                sm: 16,
                md: 20,
                lg: 24,
              }}
            >
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Select Movie Genre"
                  htmlFor="genre"
                  name="genre"
                  className="form-item"
                  rules={[
                    { required: true, message: "Movie genre is required!" },
                  ]}
                >
                  <Select
                    placeholder="Select Genre"
                    className="custom-select"
                    onChange={handleChange}
                    options={[
                      { value: "Action", label: "Action" },
                      { value: "Comedy", label: "Comedy" },
                      { value: "Horror", label: "Horror" },
                      { value: "Love", label: "Love" },
                      { value: "Patriot", label: "Patriot" },
                      { value: "Bhakti", label: "Bhakti" },
                      { value: "Thriller", label: "Thriller" },
                      { value: "Mystery", label: "Mystery" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item
                  label="Poster URL"
                  htmlFor="poster"
                  name="poster"
                  className="form-item"
                  rules={[
                    { required: true, message: "Movie Poster is required!" },
                  ]}
                >
                  <Input
                    id="poster"
                    type="text"
                    placeholder="Enter the poster URL"
                    className="custom-input"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            className="submit-button"
          >
            {formType === "add" ? "Add Movie" : "Save Changes"}
          </Button>
          <Button 
            icon={<CloseOutlined />}
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default MovieForm;