import React, { useEffect, useState, useRef } from "react";
import { GetAllMovies } from "../apiCalls/movies";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";
import "./Home.css";

function Home({ searchQuery = "" }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const moviesSectionRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    const response = await GetAllMovies();
    if (response?.success) {
      setMovies(response.data);
      setFilteredMovies(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  const scrollToMovies = () => {
    if (!loading && moviesSectionRef.current) {
      moviesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="premium-home-wrapper">
      {/* ✅ Show Search Results at the Top if searchQuery exists */}
      {searchQuery.trim() && (
        <section className="premium-search-results">
          <h2 className="premium-section-title">Search Results</h2>
          <div className="premium-section-divider"></div>
          {loading ? (
            <div className="premium-loading">
              <Spin size="large" />
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="premium-movies-container">
              {filteredMovies.map((movie) => (
                <div
                  key={movie._id}
                  className="premium-movie-card"
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <div className="premium-movie-poster">
                    <img src={movie.poster} alt={movie.title} />
                    <div className="premium-movie-overlay">
                      <span className="premium-view-details">View Details</span>
                    </div>
                  </div>
                  <div className="premium-movie-info">
                    <h3 className="premium-movie-title">{movie.title}</h3>
                    <p className="premium-movie-date">
                      {moment(movie.releaseDate).format("MMMM YYYY")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-no-results">No movies found.</div>
          )}
        </section>
      )}

      {/* ✅ Show Default Hero and Now Showing only if not searching */}
      {!searchQuery.trim() && (
        <>
          {/* Hero Section */}
          <section className="premium-hero">
            <div className="premium-hero-content">
              <h1 className="premium-hero-title">Cinematic Excellence</h1>
              <p className="premium-hero-subtitle">
                Experience movies as they were meant to be seen
              </p>
              <div className="premium-hero-cta">
                <button className="premium-hero-button" onClick={scrollToMovies}>
                  Explore Now
                </button>
              </div>
            </div>
          </section>

          {/* Now Showing Header */}
          <section className="premium-featured-section">
            <div className="premium-section-header">
              <h2>Now Showing</h2>
              <div className="premium-section-divider"></div>
            </div>
          </section>

          {/* Movies Section */}
          <section ref={moviesSectionRef} className="premium-movies-section">
            {loading ? (
              <div className="premium-loading">
                <Spin size="large" />
              </div>
            ) : (
              <div className="premium-movies-container">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="premium-movie-card"
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  >
                    <div className="premium-movie-poster">
                      <img src={movie.poster} alt={movie.title} />
                      <div className="premium-movie-overlay">
                        <span className="premium-view-details">View Details</span>
                      </div>
                    </div>
                    <div className="premium-movie-info">
                      <h3 className="premium-movie-title">{movie.title}</h3>
                      <p className="premium-movie-date">
                        {moment(movie.releaseDate).format("MMMM YYYY")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="premium-footer">
        <div className="premium-footer-content">
          <div className="premium-footer-brand">
            <h3>BookMyShow Premium</h3>
            <p>Your gateway to extraordinary entertainment</p>
          </div>
          <div className="premium-footer-copyright">
            <p>
              <strong>Created by Kaushik</strong> | All Rights Reserved &copy; 2025
            </p>
            <p style={{ display: "none" }}>
              This code is created by Kaushik. Anyone copying it from GitHub should credit the
              original creator.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
