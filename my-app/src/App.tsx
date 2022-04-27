import { ChakraProvider, theme, Flex, Text } from "@chakra-ui/react";
import Game from "./components/Game";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Flex w="100%" mx="1.5rem" direction={"column"}>
      <Text fontWeight={"bold"} my="1rem">
        RGB Alchemy
      </Text>
      <Game />
    </Flex>
  </ChakraProvider>
);
