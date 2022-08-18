import { memo, useCallback, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useDrop } from 'react-dnd'
import { FavMovieCard } from './FavMovieCard.js'
import update from 'immutability-helper'
import { ItemTypes } from './ItemTypes.js'

const style = {
    width: 500,
    margin: '1em',
}

export const FavoriteList = memo(function FavoriteList({
    favoritesMovieData,
    saveNewOrderFavs
}) {

    console.log("FAVORITE LIST RENDER");


    const [favMovieCards, setFavMovieCards] = useState(favoritesMovieData);


    useEffect(() => {
        if (favoritesMovieData.length > 0) {
            setFavMovieCards(favoritesMovieData);
        }
    }, [favoritesMovieData.toString()])

    /**
     * Everytime favMovieCards changes, we save it to the DB
     */
    useEffect(() => {
        let newFavorites = favMovieCards.map(c => c._id);
        console.log("newFavorite",newFavorites);
        saveNewOrderFavs(newFavorites);
    }, [favMovieCards])



    /**
     * Function to find a favMovie by movieId
     * Returns an object
     * {
     * favMovie: { movie object},
     * index: 0
     * }
     */
    const findFavMovie = useCallback(
        (movieId) => {
            const favMovie = favMovieCards.filter((c) => `${c._id}` === movieId)[0]
            console.log("findFaMovie", favMovie)
            console.log("findfavmoviv index", favMovieCards.indexOf(favMovie))
            return {
                favMovie,
                index: favMovieCards.indexOf(favMovie),
            }
        }, [favMovieCards],)

    /**
     * Removes the 'Card' that is being moved from its index.
     * Inserts the 'Card' at the new location
     */
    const moveCard = useCallback(
        (id, atIndex) => {
            console.log("movie ID in move card", id)
            console.log("movie ID in move card", atIndex)
            const { favMovie, index } = findFavMovie(id)
            console.log("foundMovie", favMovie);
            setFavMovieCards(
                update(favMovieCards, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, favMovie],
                    ],
                }),
            );
        }, [findFavMovie, favMovieCards, setFavMovieCards])




    const renderCard = useCallback((card, index) => {
        return (
            <FavMovieCard
                key={card._id}
                id={`${card._id}`}
                index={index}
                title={card.title}
                poster={card.poster}
                moveCard={moveCard}
                findFavMovie={findFavMovie}
            />
        )
    }, [])

    const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }))

    return (
        <div ref={drop} style={style}>
            {favMovieCards && favMovieCards.map((card, index) => card ? (
            <FavMovieCard
                key={card._id}
                movieId={`${card._id}`}
                index={index}
                title={card.title}
                poster={card.poster}
                moveCard={moveCard}
                findFavMovie={findFavMovie}
            />): (<div></div>))}
        </div>
    )
})

export default FavoriteList