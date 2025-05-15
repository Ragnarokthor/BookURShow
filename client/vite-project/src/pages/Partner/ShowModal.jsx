import React, { useEffect, useState } from 'react';
import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Button,
  Select,
  Table,
  message,
} from "antd";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { GetAllMovies } from "../../apiCalls/movies";
import {
  addShow,
  deleteShow,
  getShowsByTheatre,
  updateShow,
} from "../../apiCalls/shows";
import moment from "moment";
import './TheatreManagement.css';

const ShowModal = ({
  isShowModalOpen,
  setIsShowModalOpen,
  selectedTheatre,
}) => {
  const [view, setView] = useState("table");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());

      const movieResponse = await GetAllMovies();
      if (movieResponse.success) {
        setMovies(movieResponse.data);
      } else {
        message.error(movieResponse.message);
      }

      const showResponse = await getShowsByTheatre({
        theatreId: selectedTheatre._id,
      });
      if (showResponse.success) {
        setShows(showResponse.data);
      } else {
        message.error(showResponse.message);
      }

      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      let response = null;

      if (view === "form") {
        response = await addShow({ ...values, theatre: selectedTheatre._id });
      } else {
        response = await updateShow({
          ...values,
          showId: selectedShow._id,
          theatre: selectedTheatre._id,
        });
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setView("table");
      } else {
        message.error(response.message);
      }

      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const handleCancel = () => {
    setIsShowModalOpen(false);
  };

  const handleDelete = async (showId) => {
    try {
      dispatch(showLoading());
      const response = await deleteShow({ showId: showId });

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }

      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: 'Show Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Show Date',
      dataIndex: 'date',
      render: (text) => {
        return moment(text).format("MMM Do YYYY");
      },
    },
    {
      title: 'Show Time',
      dataIndex: 'time',
      render: (text) => {
        return moment(text, "HH:mm").format("hh:mm A");
      },
    },
    {
      title: 'Movie',
      dataIndex: 'movie',
      render: (text, data) => {
        return data.movie.title;
      },
    },
    {
      title: 'Ticket Price',
      dataIndex: 'ticketPrice',
      render: (price) => {
        return `$${price}`;
      },
    },
    {
      title: 'Total Seats',
      dataIndex: 'totalSeats',
      key: 'totalSeats',
    },
    {
      title: 'Available Seats',
      dataIndex: 'seats',
      render: (text, data) => {
        return data.totalSeats - data.bookedSeats.length;
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, data) => {
        return (
          <div className="action-button-group">
            <Button
              className="edit-button"
              onClick={() => {
                setView("edit");
                setSelectedMovie(data.movie._id);
                setSelectedShow({
                  ...data,
                  movie: data.movie._id,
                  date: moment(data.date).format("YYYY-MM-DD"),
                });
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              className="delete-button"
              onClick={() => handleDelete(data._id)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      title={selectedTheatre.name}
      open={isShowModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
      className="show-modal"
      centered
    >
      <div className="show-content">
        {view === "table" && (
          <>
            <div className="show-header">
              <h3 className="show-header-title">Shows Management</h3>
              <Button
                type="primary"
                className="add-theatre-button"
                onClick={() => {
                  setView("form");
                  setSelectedShow(null);
                }}
              >
                <PlusOutlined /> Add Show
              </Button>
            </div>
            <Table
              dataSource={shows}
              columns={columns}
              className="show-table"
              pagination={{ pageSize: 5 }}
            />
          </>
        )}

        {(view === "form" || view === "edit") && (
          <Form
            layout="vertical"
            className="show-form"
            onFinish={onFinish}
            initialValues={selectedShow || {}}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="name"
                  label="Show Name"
                  rules={[{ required: true, message: "Show name is required" }]}
                  className="theatre-form-item"
                >
                  <Input
                    placeholder="Enter show name"
                    className="theatre-input"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="movie"
                  label="Select Movie"
                  rules={[{ required: true, message: "Movie is required" }]}
                  className="theatre-form-item"
                >
                  <Select
                    placeholder="Select a movie"
                    value={selectedMovie}
                    onChange={(value) => setSelectedMovie(value)}
                    options={movies.map((movie) => ({
                      label: movie.title,
                      value: movie._id,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="date"
                  label="Select Date"
                  rules={[{ required: true, message: "Date is required" }]}
                  className="theatre-form-item"
                >
                  <Input
                    type="date"
                    className="theatre-input"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="time"
                  label="Select Time"
                  rules={[{ required: true, message: "Time is required" }]}
                  className="theatre-form-item"
                >
                  <Input
                    type="time"
                    className="theatre-input"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="ticketPrice"
                  label="Ticket Price"
                  rules={[{ required: true, message: "Ticket price is required" }]}
                  className="theatre-form-item"
                >
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter ticket price"
                    className="theatre-input"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="totalSeats"
                  label="Total Seats"
                  rules={[{ required: true, message: "Total seats are required" }]}
                  className="theatre-form-item"
                >
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter total seats"
                    className="theatre-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="show-form-actions">
              <Button
                className="back-button"
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  setView("table");
                  setSelectedShow(null);
                }}
              >
                Back
              </Button>

              <Button
                type="default"
                className="cancel-button"
                onClick={() => {
                  setView("table");
                  setSelectedShow(null);
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                {view === "edit" ? "Update Show" : "Add Show"}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default ShowModal;
