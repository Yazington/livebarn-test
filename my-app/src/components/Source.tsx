import { Box, Tooltip } from "@chakra-ui/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import { rgbStringToNumberString } from "../utils";

interface SourceProps {
  firstSourceColors: string[];
  setFirstSourceColors: React.Dispatch<React.SetStateAction<string[]>>;
  setSourcesColors: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  index: number[];
  sourcesColors: Map<string, string>;
  changeable?: boolean;
  substractOneMoveFromMovesLeft: () => void;
}

const Source: FunctionComponent<SourceProps> = ({
  firstSourceColors,
  setFirstSourceColors,
  setSourcesColors,
  sourcesColors,
  index,
  changeable = true,
  substractOneMoveFromMovesLeft,
}) => {
  const [color, setColor] = useState("rgb(0,0,0)");

  useEffect(() => {
    if (color)
      setSourcesColors(
        new Map(sourcesColors.set(JSON.stringify(index), color))
      );
  }, []);

  const handleDragStart = (event: React.DragEvent) => {
    if (color) event.dataTransfer.setData("tile_color", color);
  };

  const handleDrop = (event: React.DragEvent) => {
    const draggedColor = event.dataTransfer.getData("tile_color");
    setSourcesColors(
      new Map(sourcesColors.set(JSON.stringify(index), draggedColor))
    );
    setColor(draggedColor);
    substractOneMoveFromMovesLeft();
  };

  const handleSourceClick = (event: React.MouseEvent) => {
    if (firstSourceColors.length > 0) {
      setSourcesColors(
        new Map(sourcesColors.set(JSON.stringify(index), firstSourceColors[0]))
      );

      setColor(firstSourceColors[0]);
      setFirstSourceColors(firstSourceColors.slice(1));
      substractOneMoveFromMovesLeft();
    }
  };

  useEffect(() => {
    setColor("rgb(0,0,0)");
  }, []);

  return (
    <Tooltip label={rgbStringToNumberString(color ?? "rgb(0,0,0)")}>
      <Box
        w="30px"
        h="30px"
        bgColor={color}
        borderRadius="full"
        borderWidth={"2px"}
        borderColor="gray.400"
        draggable={changeable}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleSourceClick}
      />
    </Tooltip>
  );
};

export default Source;
