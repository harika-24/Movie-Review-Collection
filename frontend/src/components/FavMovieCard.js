import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import Card from 'react-bootstrap/Card';


const style = {
  padding: "10px",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};

export const FavMovieCard = memo(function FavMovieCard({ movieId, title, index, poster, moveCard, findFavMovie }) {
  
  const currIndex = findFavMovie(movieId).index;


    /**
   * Wiring Card component as a drag source.
   * If the item is not dropped after dragging, we put it back in it current location.
   */
     const [{ isDragging }, drag] = useDrag(
      () => ({
        type: ItemTypes.CARD,
        item: { movieId, currIndex },
        collect: (monitor) => ({
          isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
          const { movieId: droppedMovieId, currIndex } = item;
          console.log("drag droppedMovieId", droppedMovieId)
          console.log("drag movieId", movieId)
          const didDrop = monitor.didDrop();
          if (!didDrop) {
            moveCard(droppedMovieId, currIndex);
          }
        }
      }),
      [movieId, currIndex, moveCard]
    );

  /**
   * Wiring Card component as a drop target.
   * If a different Card is dropped on to this Card, we insert the dragged Card into the location of the current Card
   *
   */
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ movieId: draggedMovieId }) {
        console.log("drop draggedMovieId", draggedMovieId)
        console.log("drop movieId", movieId)
        if (draggedMovieId !== movieId) {
          const { index:overIndex } = findFavMovie(movieId);

          moveCard(draggedMovieId, overIndex);
        }
      }
    }),
    [findFavMovie,moveCard]
  );
  

 
  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => drag(drop(node))} style={{ ...style, opacity }}>
        <Card className="favoritesCard">
          { index < 9 ?
          <div className="favoritesNumber favoritesNumberOneDigit">
            { index + 1 }
          </div>
          :
          <div className="favoritesNumber favoritesNumberTwoDigit">
             { index+1 }
          </div>
          }
        <div>
        <Card.Img
              className="favoritesPoster"
              src={poster+"/100px180"}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="/images/NoPosterAvailable-crop.jpg";
              }}/>
        </div>
        <div className="favoritesTitle">
        { title }
        </div>
        </Card>
    </div>
  );
});
