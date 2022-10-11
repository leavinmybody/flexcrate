import React, { useEffect } from "react";
import { Flex, Progress, Text } from "@chakra-ui/react";
import { ThreeDots } from "react-loader-spinner";

const Spinner = ({ msg, progress }) => {
  useEffect(() => {}, [progress]);

  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems="center"
      height={"full"}
      px={10}
    >
      <ThreeDots color="#9AE6B4" height={80} width={80} />
      <Text fontSize={"xl"}>{msg}</Text>

      {progress && (
        <Progress
          value={Number.parseInt(progress)}
          mt={50}
          size="sm"
          hasStripe
          isAnimated
          width="lg"
          rounded={"sm"}
          colorScheme="green"
        />
      )}
    </Flex>
  );
};

export default Spinner;
