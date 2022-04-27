import { Box } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface EmptyGridElementProps {}

const EmptyGridElement: FunctionComponent<EmptyGridElementProps> = () => {
  return <Box w="30px" h="30px"></Box>;
};

export default EmptyGridElement;
