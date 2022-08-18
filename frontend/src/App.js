import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import AddReview from './components/AddReview';
import Login from "./components/Login";
import Logout from './components/Logout';
import Favorites from './components/Favorites';

import FavoriteDataService from "./services/favorites.js";
import MovieDataService from "./services/movies.js";

import "./App.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  console.log("APP RENDER");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesMovieData, setFavoritesMovieData] = useState([]);
  const [triggerSaves, setTriggerSaves] = useState(false);



  /**
   * Fetching the list of favorites of the user
   */
  const retrieveFavorites = useCallback(() => {
    FavoriteDataService.getFavorites(user.googleId)
      .then(response => {
        setFavorites(response.data.favorites);
      })
      .catch(e => {
        setFavorites([])
        console.log(e)
      });
  }, [user]);


  /**
 * A function to update the favorites in the DB
 */
  const updateFavorites = useCallback(() => {
    FavoriteDataService.updateFavorites({ _id: user.googleId, favorites: favorites })
      .catch(e => {
        console.log(e);
      })
  }, [favorites, user]);

  const retrieveFavoriteMoviesData = useCallback(() => {
    MovieDataService.getMovieByIds(favorites).then(response => {
      let favMovies = response.data;

      console.log("favMovies", favMovies)

      favMovies.sort((favMovieA, favMovieB) => favorites.indexOf(favMovieA._id) - favorites.indexOf(favMovieB._id));

      setFavoritesMovieData(
        favMovies.map((movie) => {
          return ({
            _id: movie._id,
            title: movie.title,
            poster: movie.poster
          });
        })
      );
    })
  }, [favorites])

  /**
   * A side effect that runs everytime we trigger a save of the favs
   */
  useEffect(() => {
    if (user && triggerSaves) {
      updateFavorites();
      setTriggerSaves(false);
    }
  }, [user, favorites, updateFavorites, triggerSaves]);

  /**
* If the user has changed, we retrieve the favorites.
* If user has been set to null/undefined, we set the favorites as empty.
*/
  useEffect(() => {
    if (user) {
      retrieveFavorites()
    }
    else {
      setFavorites([])
    }
  }, [user, retrieveFavorites])

  /**
* Fetching user information from localStorage.
*/
  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now() / 1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  const addFavorite = (movieId) => {
    const favs = [...favorites, movieId];
    FavoriteDataService.updateFavorites({ _id: user.googleId, favorites: favs });
    setFavorites(favs);
  }

  const deleteFavorite = (movieId) => {
    const favs = favorites.filter(f => f !== movieId);
    FavoriteDataService.updateFavorites({ _id: user.googleId, favorites: favs });
    setFavorites(favs);
  }

  const saveNewOrderFavs = (newOrderFavs) => {
    console.log("newFavs", newOrderFavs);
    setTriggerSaves(true);
    setFavorites(newOrderFavs)
  }



/**
 * If the list of favorites has changed, we obtain the information for each favorite
 */
  useEffect(() => {
    retrieveFavoriteMoviesData();
  }, [favorites, retrieveFavoriteMoviesData])



  

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <Navbar bg="primary" expand="lg" sticky="top" variant="dark" >
          <Container className="container-fluid">
            <Navbar.Brand className="brand" href="/">
              <img src="/images/movies-logo.png" alt="movies logo" className="moviesLogo" />
              MOVIE TIME
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link as={Link} to={"/movies"}>
                  Movies
                </Nav.Link>
                {
                  user &&
                  <Nav.Link as={Link} to={"/favorites"}>
                    Favorites
                  </Nav.Link>
                }
              </Nav>
            </Navbar.Collapse>
            {user ? (
              <Logout setUser={setUser} />
            ) : (
              <Login setUser={setUser} />
            )}
          </Container>
        </Navbar>

        <Routes>

          <Route exact path={"/"} element={
            <MoviesList
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />
          }
          />

          <Route exact path={"/movies"} element={
            <MoviesList
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />
          }
          />
          <Route exact path={"/movies/:id/"} element={
            <Movie user={user} />}
          />
          <Route exact path={"/movies/:id/review"} element={
            <AddReview user={user} />}
          />
          <Route path={"/favorites"} element={
            user ?
              <Favorites
                user={user}
                favoritesMovieData={favoritesMovieData}
                saveNewOrderFavs={saveNewOrderFavs}
              />
              :
              <MoviesList
                user={user}
                addFavorite={addFavorite}
                deleteFavorite={deleteFavorite}
                favorites={favorites} />
          } />


        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
