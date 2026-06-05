export const analyticsData = {
  viewsByMonth: [],
  genreDistribution: [],
  ratingDistribution: [],
  topMovies: [],
};

export const getAllGenres = () => [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Animation",
  "Thriller",
  "Romance",
  "Fantasy",
  "Documentary",
  "Mystery",
  "Crime",
  "Musical",
  "War",
  "Western",
  "Biography",
  "Family",
  "Sport",
  "History",
  "Music",
  "Superhero",
  "Film-Noir",
  "Short",
  "TV Movie",
];

export const getAnalytics = async () => ({ success: true, data: {} });
export const getUsers = async () => ({ success: true, data: [] });
export const updateRole = async () => ({ success: true });

export const getMovies = async () => ({ success: true, data: [] });
export const deleteMovie = async () => ({ success: true });

export const authClient = {
  signIn: {
    social: async () => ({ success: true }),
  },
  useSession: () => ({ data: null, status: "unauthenticated" }),
};
