import axios from 'axios';

const API_KEY = '1fae2d37'; // Reemplaza esto con tu clave de OMDb
const BASE_URL = 'https://www.omdbapi.com/';

// Función para buscar películas por título
export const searchMovies = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s: title, // Parámetro de búsqueda de título
      },
    });
    return response.data.Search; // Retorna los resultados de la búsqueda
  } catch (error) {
    console.error("Error al buscar películas:", error);
    return [];
  }
};

// Función para obtener los detalles de una película
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        i: movieId, // Parámetro de búsqueda de ID de la película
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los detalles de la película:", error);
    return null;
  }
};
