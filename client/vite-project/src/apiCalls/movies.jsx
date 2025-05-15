import { axiosInstance } from "./index";

// Get all movies
export const GetAllMovies = async () => {
  try {
    const response = await axiosInstance.get("/api/movies/get-all-movies");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Add a movie
export const addMovie = async (values) => {
  try {
    const response = await axiosInstance.post("/api/movies/add-movie", values);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Update a movie
export const updateMovie = async (payload) => {
  try {
    const response = await axiosInstance.put("/api/movies/update-movie", payload);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

// Delete a movie
export const deleteMovie = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/movies/delete-movie/${id}`);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

// Get a single movie by ID
export const getMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/movies/movie/${id}`);
    return response.data;
  } catch (err) {
    return err.response;
  }
};
