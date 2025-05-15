import React, { useEffect, useState } from "react";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import { Button, Table, Typography, Space, Tag } from "antd";
import MovieForm from "./MovieForm";
import { GetAllMovies } from "../../apiCalls/movies";
import { useDispatch } from "react-redux";
import moment from "moment";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import DeleteMovieModal from "./DeleteMovieModal";
import "./AdminStyles.css";

const { Title } = Typography;

function MovieList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(showLoading());
    const response = await GetAllMovies();
    const allMovies = response.data;
    setMovies(
      allMovies.map(function (item) {
        return { ...item, key: `movie${item._id}` };
      })
    );
    dispatch(hideLoading());
  };

  const tableHeadings = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, data) => {
        return (
          <img
            width="65"
            height="100"
            style={{
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
            }}
            src={data.poster}
            alt={data.title}
          />
        );
      },
    },
    {
      title: "Movie Name",
      dataIndex: "title",
      render: (text) => <strong>{text}</strong>,
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
      width: 'auto',
    },

    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => {
        return <Tag color="blue">{`${text} Min`}</Tag>;
      },
      width: 100,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      render: (text) => <Tag color="purple">{text}</Tag>,
      width: 120,
    },
    {
      title: "Language",
      dataIndex: "language",
      render: (text) => <Tag color="green">{text}</Tag>,
      width: 120,
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, data) => {
        return moment(data.releaseDate).format("DD-MMM-YYYY");
      },
      width: 130,
    },
    {
      title: "Action",
      render: (text, data) => {
        return (
          <Space>
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              className="action-button edit-button"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedMovie(data);
                setFormType("edit");
              }}
            >
              {/* Edit */}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              className="action-button delete-button"
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedMovie(data);
              }}
            >
              {/* Delete */}
            </Button>
          </Space>
        );
      },
      width: 180,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="admin-content-container">
      <div className="admin-header">
        <Title level={3} className="admin-title">Movies Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="add-button"
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
          }}
        >
          Add New Movie
        </Button>
      </div>

      <div className="admin-table-container" style={{ marginBottom: 0 }}>
        <Table
          dataSource={movies}
          columns={tableHeadings}
          className="custom-table"
          style={{ marginBottom: 0 }} // Fix bottom alignment
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"],
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} movies`
          }}
        />
      </div>

      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          formType={formType}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedMovie={selectedMovie}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )}
    </div>
  );
}

export default MovieList;
