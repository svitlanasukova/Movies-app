import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchMoviesHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(
				'https://react-movies-app-4cf14-default-rtdb.firebaseio.com/movies.json',
			);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();

			const loadedMovies = [];
			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					releaseDate: data[key].releaseDate,
					openingText: data[key].openingText,
				});
			}
			setMovies(loadedMovies);
			setIsLoading(false);
		} catch (error) {
			setError(error.message);
			setIsLoading(false);
		}
	}, []);

	async function addMovieHandler(movie) {
		const response = await fetch(
			'https://react-movies-app-4cf14-default-rtdb.firebaseio.com/movies.json',
			{
				method: 'POST',
				body: JSON.stringify(movie),
				header: {
					'Content-Type': 'qpplication/json',
				},
			},
		);
		const data = response.json();
		fetchMoviesHandler();
	}

	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

	let content = <p>Found no movies.</p>;

	if (movies.length > 0) {
		content = <MoviesList movies={movies} />;
	}
	if (error) {
		content = <p>{error}</p>;
	}

	if (isLoading) {
		content = <p>Loading...</p>;
	}
	return (
		<React.Fragment>
			<section>
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
