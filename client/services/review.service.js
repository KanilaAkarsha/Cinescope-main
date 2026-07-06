import API from "@/app/config/api";

export const getReviewsForMovie = async (movieId) => {
  try {
    const { data } = await API.get(`/api/movies/${movieId}/reviews`);
    return { success: true, data: data.reviews };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const createReview = async ({ movieId, rating, comment }) => {
  try {
    console.log("Sending review:", { movieId, rating, comment }); // ← debug
    const { data } = await API.post(`/api/movies/${movieId}/reviews`, {
      rating,
      comment,
    });
    return { success: true, data: data.review };
  } catch (error) {
    console.error("createReview error:", error.response?.data); // ← debug
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getAdminReviews = async () => {
  try {
    const { data } = await API.get("/api/movies/reviews/all");
    const normalizedReviews = data.reviews.map((review) => ({
      id: review._id,
      movieId: review.movieId,
      movieTitle: review.movieTitle,
      userId: review.userId?._id,
      userName:
        `${review.userId?.first_name || "Anonymous"} ${review.userId?.last_name || ""}`.trim(),
      userAvatar: review.userId?.profilePicture || "",
      rating: review.rating,
      comment: review.comment,
      status: review.status || "approved",
      createdAt: review.createdAt,
    }));
    return { success: true, data: normalizedReviews };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateReviewStatus = async (reviewId, status) => {
  try {
    // In our simplified logic, we need both movieId and reviewId
    // But getAdminReviews provides both. However, the frontend call in page.jsx only passes reviewId.
    // We need to either find the movie for this review on the backend or adjust the frontend.
    // Let's assume for now we can get the movieId from the review object if we had it.
    // Since we can't easily change the frontend call signature without more edits,
    // let's try to find a way.
    // For now, I'll implement it assuming we might need to search for the movie first on backend if only reviewId is provided.
    // Or I can use a generic "update review" endpoint if I had one.
    // Given the current backend, I'll need a different approach or a new backend route.

    // WAIT, I'll check how the frontend calls it.
    // result = await updateReviewStatus(reviewId, status);
    // It only passes reviewId.

    // I will add a smarter backend route that finds the movie by reviewId.
    const { data } = await API.put(`/api/movies/reviews/${reviewId}/status`, {
      status,
    });
    return { success: true, data: data.review };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const { data } = await API.delete(`/api/movies/reviews/${reviewId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
