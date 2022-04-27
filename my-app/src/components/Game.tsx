import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { FunctionComponent, useEffect, useState, useRef } from "react";
import { GameInfo } from "../types";
import { calculateColorDifference, createColorFromNumbers } from "../utils";
import GameMatrix from "./GameMatrix";
import Tile from "./Tile";

interface GameProps {}

const Game: FunctionComponent<GameProps> = () => {
  const { onOpen, isOpen, onClose } = useDisclosure(); //managing alert
  const [fetchedGameInfo, setFetchedGameInfo] = useState<GameInfo>();
  const [currentClosestColorArray, setCurrentClosestColorArray] = useState<
    number[]
  >([0, 0, 0]); // current best color found
  const cancelRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:9876/init").then((result) => {
      setFetchedGameInfo(result.data);
    });
  }, []);

  const distance = calculateColorDifference(
    fetchedGameInfo?.target as number[],
    currentClosestColorArray
  );

  // when user wins i.e. gets a distance of under 10%
  useEffect(() => {
    if (fetchedGameInfo?.target && distance < 0.1) {
      onOpen();
    }
  }, [distance, fetchedGameInfo?.target, onOpen]);

  const substractOneMoveFromMovesLeft = () => {
    if (fetchedGameInfo && fetchedGameInfo?.maxMoves - 1 > 0) {
      setFetchedGameInfo({
        ...fetchedGameInfo,
        maxMoves: fetchedGameInfo?.maxMoves - 1,
      });
    }

    if (fetchedGameInfo && fetchedGameInfo?.maxMoves - 1 === 0) {
      onOpen();
    }
  };

  const handlePlayAgainClick = () => {
    axios
      .get(`http://localhost:9876/init/user/${fetchedGameInfo?.userId}`)
      .then((result) => {
        setFetchedGameInfo(result.data);
      });
    //TODO:Clear state of the game
    onClose();
  };

  if (!fetchedGameInfo) return <Text>Waiting for game info ...</Text>;

  return (
    <Flex w="100%" direction={"column"} gap={"1rem"}>
      <Text>User ID : {fetchedGameInfo.userId}</Text>
      <Text>Moves left : {fetchedGameInfo.maxMoves}</Text>
      <Flex gap={"1rem"} align={"center"}>
        <Text>Target color : </Text>
        <Tile
          color={createColorFromNumbers(fetchedGameInfo.target)}
          width={fetchedGameInfo.width}
          height={fetchedGameInfo.height}
          changeable={false}
          distance={distance}
          setCurrentClosestColorArray={setCurrentClosestColorArray}
        />
      </Flex>
      <Flex gap={"1rem"} align={"center"}>
        <Text>Closest color : </Text>
        <Tile
          color={createColorFromNumbers(currentClosestColorArray)}
          width={fetchedGameInfo.width}
          height={fetchedGameInfo.height}
          distance={distance}
          setCurrentClosestColorArray={setCurrentClosestColorArray}
          currentClosestColorArray={currentClosestColorArray}
        />
        <Text>Δ = {(distance * 100)?.toFixed(2)} %</Text>
      </Flex>
      <GameMatrix
        width={fetchedGameInfo.width}
        height={fetchedGameInfo.height}
        distance={distance}
        substractOneMoveFromMovesLeft={substractOneMoveFromMovesLeft}
        setCurrentClosestColorArray={setCurrentClosestColorArray}
        targetColorNumbers={fetchedGameInfo.target}
        currentClosestColorArray={currentClosestColorArray}
      />
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Play Again
            </AlertDialogHeader>

            <AlertDialogBody>
              {distance > 0.1
                ? "Failed! Do you want to try again ?"
                : "You Won! Do you want to try again ? "}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handlePlayAgainClick} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default Game;
