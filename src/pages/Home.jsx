import React from "react";
import {
  Navbar,
  Category,
  Create,
  Search,
  Feed,
  VideoDetails,
  UserProfile,
} from "../components";
import { Routes, Route } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { categories } from "../data";

const Home = ({ user }) => {
  return (
    <>
      <Navbar user={user} />
      <Flex width={"100vw"}>
        {/* <Flex
          direction={"column"}
          justifyContent="start"
          alignItems={"center"}
          width="5%"
        >
          {categories &&
            categories.map((category) => (
              <Category key={category.id} category={category} />
            ))}
        </Flex> */}

        <Flex
          width={"95%"}
          px={4}
          justifyContent="center"
          alignItems={"center"}
        >
          <Routes>
            <Route path="" element={<Feed />} />
            <Route path="/category/:categoryId" element={<Feed />} />
            <Route path="/upload" element={<Create />} />
            <Route path="/video/:videoId" element={<VideoDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user/:userId" element={<UserProfile />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
