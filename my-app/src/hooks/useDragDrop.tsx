import { useState } from "react";

const useDragDrop = (color: string, changeable: boolean) => {
  //this hook was supposed to be used both for Source and Tile, but Source had different logic for each drag and drop functions
  const [currentColor, setCurrentColor] = useState(color);

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("tile_color", currentColor);
  };

  const handleDrop = (event: React.DragEvent) => {
    const draggedColor = event.dataTransfer.getData("tile_color");
    setCurrentColor(draggedColor);
  };

  if (!changeable) return { currentColor, setCurrentColor };
  return { handleDragStart, handleDrop, currentColor, setCurrentColor };
};

export default useDragDrop;
