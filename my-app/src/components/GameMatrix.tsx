import { SimpleGrid } from "@chakra-ui/react";
import { FunctionComponent, useMemo, useState } from "react";
import EmptyGridElement from "./EmptyGridElement";
import Source from "./Source";
import Tile from "./Tile";

interface GameMatrixProps {
  width: number;
  height: number;
  distance: number;
  substractOneMoveFromMovesLeft: () => void;
  currentClosestColorArray: number[];
  setCurrentClosestColorArray: React.Dispatch<React.SetStateAction<number[]>>;
  targetColorNumbers: number[];
}

const GameMatrix: FunctionComponent<GameMatrixProps> = ({
  width,
  height,
  distance,
  substractOneMoveFromMovesLeft,
  currentClosestColorArray,
  setCurrentClosestColorArray,
  targetColorNumbers,
}) => {
  // These are for the first 3 moves
  const initialFirstSourcesColors = [
    "rgb(255,0,0)",
    "rgb(0,255,0)",
    "rgb(0,0,255)",
  ];

  const [firstSourceColors, setFirstSourceColors] = useState(
    initialFirstSourcesColors
  );

  const [sourcesColors, setSourcesColors] = useState<Map<string, string>>(
    new Map()
  );

  const elements = useMemo(() => {
    const elements: any[][] = [[]];

    for (var row = 0; row < height; row++) {
      const rowElements: any[] = [];

      // first or last row
      if (row === 0 || row === height - 1) {
        rowElements.push(<EmptyGridElement key={`${row} - 0`} />);

        for (let column = 1; column < width - 1; column++) {
          rowElements.push(
            <Source
              key={`${row}-${column}`}
              firstSourceColors={firstSourceColors}
              setFirstSourceColors={setFirstSourceColors}
              setSourcesColors={setSourcesColors}
              sourcesColors={sourcesColors}
              index={[row, column]}
              substractOneMoveFromMovesLeft={substractOneMoveFromMovesLeft}
            />
          );
        }

        rowElements.push(<EmptyGridElement key={`${row} - ${width - 1}`} />);
        elements.push(rowElements);
      } else {
        //first row element
        rowElements.push(
          <Source
            key={`${row} - 0`}
            firstSourceColors={firstSourceColors}
            setFirstSourceColors={setFirstSourceColors}
            setSourcesColors={setSourcesColors}
            sourcesColors={sourcesColors}
            index={[row, 0]}
            substractOneMoveFromMovesLeft={substractOneMoveFromMovesLeft}
          />
        );

        for (let column = 1; column < width - 1; column++) {
          rowElements.push(
            <Tile
              key={`${row} - ${column}`}
              index={[row, column]}
              sourcesColors={sourcesColors}
              width={width}
              height={height}
              distance={distance}
              setCurrentClosestColorArray={setCurrentClosestColorArray}
              targetColorNumbers={targetColorNumbers}
              currentClosestColorArray={currentClosestColorArray}
            />
          );
        }

        //last row element
        rowElements.push(
          <Source
            key={`${row} - ${width - 1}`}
            firstSourceColors={firstSourceColors}
            setFirstSourceColors={setFirstSourceColors}
            setSourcesColors={setSourcesColors}
            sourcesColors={sourcesColors}
            index={[row, width - 1]}
            substractOneMoveFromMovesLeft={substractOneMoveFromMovesLeft}
          />
        );

        elements.push(rowElements);
      }
    }
    return elements;
  }, [
    currentClosestColorArray,
    distance,
    firstSourceColors,
    height,
    setCurrentClosestColorArray,
    sourcesColors,
    substractOneMoveFromMovesLeft,
    targetColorNumbers,
    width,
  ]);

  return (
    <SimpleGrid w={width * 40} h={height * 40} gap={"2px"} columns={width}>
      {elements}
    </SimpleGrid>
  );
};

export default GameMatrix;
