import React from 'react';
import Container from 'react-bootstrap/Container';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {FavoriteList} from './FavoriteList.js';

import "./Favorites.css";

const Favorites = ({
  user,
  favoritesMovieData,
  saveNewOrderFavs}) => {
  console.log("FAVORITES RENDER");
  console.log("favMovies", favoritesMovieData)
  console.log("favMovieslength", favoritesMovieData.length)
  return (
    <div>
      <Container className="favoritesContainer">
        <div className="favoritesPanel">
          {
            favoritesMovieData.length < 1 ?
              "You haven't chosen any favorites yet"
              :
              "Drag your favorites to rank them"
          }
        </div>
        <DndProvider backend={HTML5Backend}>
          { <FavoriteList
            favoritesMovieData={ favoritesMovieData }
            saveNewOrderFavs={ saveNewOrderFavs }
            /> }
        </DndProvider>
      </Container>
    </div>
  )
}

export default Favorites;