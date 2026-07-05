import API from "@/app/config/api";

export const getMovies = async () => {
  try {
    const { data } = await API.get("/api/movies");
    return { success: true, data: data.movies };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getMovieById = async (id) => {
  try {
    const { data } = await API.get(`/api/movies/${id}`);
    return { success: true, data: data.movie };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const createMovie = async (movieData) => {
  try {
    const { data } = await API.post("/api/movies/create", movieData);
    return { success: true, data: data.movie };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateMovie = async (id, movieData) => {
  try {
    const { data } = await API.put(`/api/movies/${id}/update`, movieData);
    return { success: true, data: data.movie };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteMovie = async (id) => {
  try {
    await API.delete(`/api/movies/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getAllMoviesForAdmin = async (params = {}) => {
  try {
    let url = "/api/movies/admin/movies";
    if (typeof params === "string") {
      url += params ? `?query=${params}` : "";
    } else {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });
      const queryString = queryParams.toString();
      if (queryString) url += `?${queryString}`;
    }
    const { data } = await API.get(url);
    return { success: true, data: data.movies };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const searchMovies = async (query) => {
  try {
    const { data } = await API.get(`/api/movies/search?query=${query}`);
    return { success: true, data: data.movies };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
