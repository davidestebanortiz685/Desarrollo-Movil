import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiKey = 'fba301c8779f60d93720791bef628924';

  const getMovies = async () => {
    try {
      let allMovies = [];
      const totalPages = 5; 
      
      for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=${page}`);
        allMovies = [...allMovies, ...response.data.results];
      }
      
      setMovies(allMovies);
    } catch (error) {
      console.error('Error fetching data from TMDb:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h1 id="popular">Películas Populares</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <li key={movie.id} style={{ marginBottom: '20px' }}>
                  <h2>{movie.title}</h2>
                  <p>Fecha de lanzamiento: {movie.release_date}</p>
                  <p>Calificación: {movie.vote_average}</p>
                </li>
              ))
            ) : (
              <p>No hay películas disponibles.</p>
            )}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Movies;
