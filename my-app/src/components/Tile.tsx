import { Box, Tooltip } from "@chakra-ui/react";
import React, { FunctionComponent, useEffect } from "react";
import useDragDrop from "../hooks/useDragDrop";
import {
  calculateColorDifference,
  createColorFromNumbers,
  rgbStringToNumbers,
  rgbStringToNumberString,
} from "../utils";

interface TileProps {
  sourcesColors?: Map<string, string>;
  width: number;
  height: number;
  index?: number[];
  color?: string;
  distance: number;
  changeable?: boolean;
  currentClosestColorArray?: number[];
  setCurrentClosestColorArray: React.Dispatch<React.SetStateAction<number[]>>;
  targetColorNumbers?: number[];
}

const Tile: FunctionComponent<TileProps> = ({
  sourcesColors,
  width,
  height,
  index,
  color = "rgb(0,0,0)",
  changeable = true,
  distance,
  currentClosestColorArray,
  setCurrentClosestColorArray,
  targetColorNumbers,
}) => {
  const { handleDragStart, currentColor, setCurrentColor } = useDragDrop(
    color,
    changeable
  );

  const distanceOfCurrentColor =
    targetColorNumbers &&
    calculateColorDifference(
      targetColorNumbers,
      rgbStringToNumbers(currentColor)
    );

  const isClosestToTarget =
    distanceOfCurrentColor &&
    currentColor !== "rgb(0,0,0)" &&
    distance > distanceOfCurrentColor;

  //manage closest color to target
  useEffect(() => {
    //for current closest to target shown above the matrix
    if (currentClosestColorArray) {
      setCurrentColor(createColorFromNumbers(currentClosestColorArray));
    }

    // after comparing the distance of the current best and the new one
    if (isClosestToTarget) {
      setCurrentClosestColorArray(rgbStringToNumbers(currentColor));
    }
  }, [
    currentClosestColorArray,
    currentColor,
    isClosestToTarget,
    setCurrentClosestColorArray,
    setCurrentColor,
  ]);

  // calculate color mixes
  useEffect(() => {
    if (index && sourcesColors && width && height) {
      const rowSourceColorLeft = rgbStringToNumberString(
        sourcesColors.get(JSON.stringify([index[0], 0])) ?? "rgb(0,0,0)"
      )
        .split(",")
        .map((rgbNumberString: string) => parseInt(rgbNumberString));
      const rowSourceColorTop = rgbStringToNumberString(
        sourcesColors.get(JSON.stringify([0, index[1]])) ?? "rgb(0,0,0)"
      )
        .split(",")
        .map((rgbNumberString: string) => parseInt(rgbNumberString));
      const rowSourceColorRight = rgbStringToNumberString(
        sourcesColors.get(JSON.stringify([index[0], width - 1])) ?? "rgb(0,0,0)"
      )
        .split(",")
        .map((rgbNumberString: string) => parseInt(rgbNumberString));
      const rowSourceColorBottom = rgbStringToNumberString(
        sourcesColors?.get(JSON.stringify([height - 1, index[1]])) ??
          "rgb(0,0,0)"
      )
        .split(",")
        .map((rgbNumberString: string) => parseInt(rgbNumberString));

      const distanceLeft = index[1];
      const distanceRight = width - index[1];
      const distanceTop = index[0];
      const distanceBottom = height - index[0];

      const colorNumberAdditionLeft = (width + 1 - distanceLeft) / (width + 1);
      const colorNumberAdditionTop = (height + 1 - distanceTop) / (height + 1);
      const colorNumberAdditionRight =
        (width + 1 - distanceRight) / (width + 1);
      const colorNumberAdditionBottom =
        (height + 1 - distanceBottom) / (height + 1);

      const resultNumbersLeft = rowSourceColorLeft.map(
        (value: number) => value * colorNumberAdditionLeft
      );
      const resultNumbersTop = rowSourceColorTop.map(
        (value: number) => value * colorNumberAdditionTop
      );
      const resultNumbersRight = rowSourceColorRight.map(
        (value: number) => value * colorNumberAdditionRight
      );
      const resultNumbersBottom = rowSourceColorBottom.map(
        (value: number) => value * colorNumberAdditionBottom
      );

      const redResult =
        resultNumbersLeft[0] +
        resultNumbersTop[0] +
        resultNumbersRight[0] +
        resultNumbersBottom[0];
      const greenResult =
        resultNumbersLeft[1] +
        resultNumbersTop[1] +
        resultNumbersRight[1] +
        resultNumbersBottom[1];
      const blueResult =
        resultNumbersLeft[2] +
        resultNumbersTop[2] +
        resultNumbersRight[2] +
        resultNumbersBottom[2];

      const f = 255 / Math.max(redResult, greenResult, blueResult, 255);

      const resultArray = [redResult * f, greenResult * f, blueResult * f];
      const result = createColorFromNumbers(resultArray);

      setCurrentColor(result);
    }
  }, [currentColor, height, index, setCurrentColor, sourcesColors, width]);

  return (
    <Tooltip label={rgbStringToNumberString(currentColor)}>
      <Box
        w="30px"
        h="30px"
        bgColor={currentColor}
        borderRadius="md"
        borderWidth={"2px"}
        borderColor={
          JSON.stringify(
            currentClosestColorArray?.map((value: number) => Math.floor(value))
          ) === JSON.stringify(rgbStringToNumbers(currentColor)) &&
          currentColor !== "rgb(0, 0, 0)"
            ? "blue"
            : "gray.400"
        }
        draggable={changeable}
        onDragStart={handleDragStart}
        onDragOver={(e) => e.preventDefault()}
      />
    </Tooltip>
  );
};

export default Tile;
