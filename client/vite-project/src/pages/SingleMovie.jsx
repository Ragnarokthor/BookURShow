import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../apiCalls/movies";
import { getAllTheatresByMovie } from "../apiCalls/shows";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { message, Input, Row, Col, Card, Button, Skeleton } from "antd";
import { CalendarOutlined, ClockCircleOutlined, TagOutlined, GlobalOutlined } from "@ant-design/icons";
import moment from "moment";
import "./SingleMovie.css";

const SingleMovie = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDate = (e) => {
    const selectedDate = moment(e.target.value).format("YYYY-MM-DD");
    setDate(selectedDate);
    navigate(`/movie/${params.id}?date=${selectedDate}`);
  };

  const getData = async () => {
    try {
      dispatch(showLoading());
      setLoading(true);
      const response = await getMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
      setLoading(false);
    }
  };

  const getAllTheatres = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatresByMovie({ movie: params.id, date });
      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (movie) {
      getAllTheatres();
    }
  }, [date, movie]);

  return (
    <div className="premium-inner-content">
      <div className="premium-backdrop-overlay"></div>
      {loading ? (
        <Card className="premium-movie-card" bordered={false}>
          <Row gutter={[32, 16]}>
            <Col xs={24} md={8}>
              <Skeleton.Image active style={{ width: '100%', height: '400px' }} />
            </Col>
            <Col xs={24} md={16}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Col>
          </Row>
        </Card>
      ) : movie ? (
        <Card className="premium-movie-card" bordered={false}>
          <Row gutter={[32, 16]}>
            <Col xs={24} md={8}>
              <img
                src={movie.poster}
                alt={`${movie.title} Poster`}
                className="premium-movie-poster"
              />
            </Col>
            <Col xs={24} md={16}>
              <h1 className="premium-movie-title">{movie.title}</h1>
              
              <p className="premium-movie-info">
                <GlobalOutlined className="icon" style={{ marginRight: '10px' }} />
                <strong>Language:</strong> <span className="highlight">{movie.language}</span>
              </p>
              
              <p className="premium-movie-info">
                <TagOutlined className="icon" style={{ marginRight: '10px' }} />
                <strong>Genre:</strong> <span className="highlight">{movie.genre}</span>
              </p>
              
              <p className="premium-movie-info">
                <CalendarOutlined className="icon" style={{ marginRight: '10px' }} />
                <strong>Release Date:</strong> <span className="highlight">{moment(movie.date).format("MMM Do YYYY")}</span>
              </p>
              
              <p className="premium-movie-info">
                <ClockCircleOutlined className="icon" style={{ marginRight: '10px' }} />
                <strong>Duration:</strong> <span className="highlight">{movie.duration} Minutes</span>
              </p>
              
              <div className="premium-date-picker">
                <label>Select Showtime Date</label>
                <div className="date-input-wrapper">
                  <Input
                    type="date"
                    min={moment().format("YYYY-MM-DD")}
                    value={date}
                    onChange={handleDate}
                    className="premium-date-input"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      ) : (
        <div className="premium-empty">Movie not found</div>
      )}

      <div className="premium-theatres-section">
        <h2 className="premium-section-title">Available Theatres & Showtimes</h2>
        {loading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="premium-theatre-card">
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ))
        ) : theatres.length === 0 ? (
          <div className="premium-empty">No theatres available for this movie on selected date.</div>
        ) : (
          theatres.map((theatre) => (
            <Card key={theatre._id} className="premium-theatre-card">
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={8}>
                  <h3>{theatre.name}</h3>
                  <p>{theatre.address}</p>
                </Col>
                <Col xs={24} md={16}>
                  <div className="premium-showtimes">
                    {theatre.shows
                      .sort((a, b) =>
                        moment(a.time, "HH:mm").diff(moment(b.time, "HH:mm"))
                      )
                      .map((show) => (
                        <Button
                          key={show._id}
                          shape="round"
                          onClick={() => navigate(`/book-show/${show._id}`)}
                          className="premium-showtime-button"
                        >
                          {moment(show.time, "HH:mm").format("hh:mm A")}
                        </Button>
                      ))}
                  </div>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SingleMovie;