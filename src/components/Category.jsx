import React from "react";
import { Link } from "react-router-dom";
import { Flex, Tooltip, Box } from "@chakra-ui/react";

const Category = ({ category }) => {
  return (
    <Flex cursor={"pointer"} my="5">
      <Link to={`/category/${category.name}`}>
        <Tooltip
          hasArrow
          placement="right"
          shadow="md"
          label={category.name}
          closeDelay={300}
          arrowSize={5}
          borderRadius={5}
        >
          <Box>{category.iconSrc}</Box>
        </Tooltip>
      </Link>
    </Flex>
  );
};

export default Category;
