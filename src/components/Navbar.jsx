import React from "react";
import { Link } from "react-router-dom";
import {
  useColorMode,
  useColorModeValue,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Image,
} from "@chakra-ui/react";
import { IoSearch, IoMoon, IoSunny, IoLogOut } from "react-icons/io5";
import { RiVideoAddLine } from "react-icons/ri";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import logo from "./../assets/logo.png";
import defaultProfile from "../assets/defaultProfile.png";

const Navbar = ({ user }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("#eff0f3", "#0f0e17");
  const color = useColorModeValue("#0d0d0d", "#fffffe");

  // Check if the user is logged in then get the user's profile picture
  const profilePic = user ? user.photoURL : defaultProfile;

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems="center"
      width={"100vw"}
      p={4}
    >
      <Link to="/">
        <Image
          src={logo}
          alt="logo"
          width={200}
          _hover={{
            transform: "scale(1.1)",
            transition: "all 0.2s ease-in-out",
          }}
          _active={{
            transform: "scale(0.9)",
            transition: "all 0.2s ease-in-out",
          }}
        />
      </Link>

      <InputGroup mx={6} width="60vw">
        <InputLeftElement
          pointerEvents="none"
          children={<IoSearch fontSize={25} />}
        />
        <Input type="text" placeholder="Search" variant={"outline"} />
      </InputGroup>

      <Flex justifyContent="center" alignItems="center">
        {/* Upload button */}
        <Link to={"/upload"}>
          <Flex
            justifyContent={"center"}
            alignItems="center"
            cursor={"pointer"}
            borderRadius={"15px"}
            width={"40px"}
            height={"40px"}
            _active={{ transform: "scale(0.95)", bg: bg, color: color }}
            _hover={{ bg: bg, color: color }}
            mx={2}
          >
            <RiVideoAddLine fontSize={25} />
          </Flex>
        </Link>
        <Flex
          width={"40px"}
          height={"40px"}
          justifyContent={"center"}
          alignItems="center"
          cursor={"pointer"}
          borderRadius={"15px"}
          _active={{ transform: "scale(0.95)", bg: bg, color: color }}
          _hover={{ bg: bg, color: color }}
          onClick={toggleColorMode}
        >
          {colorMode == "light" ? (
            <IoMoon fontSize={25} />
          ) : (
            <IoSunny fontSize={25} />
          )}
        </Flex>
        <Menu>
          <MenuButton>
            <Image
              src={profilePic}
              width="25px"
              height="25px"
              rounded={"full"}
              mx={4}
              ml={4}
            />
          </MenuButton>
          <MenuList shadow={"lg"}>
            <Link to={""}>
              <MenuItem>Account</MenuItem>
            </Link>
            <MenuItem flexDirection={"row"} alignItems={"center"} gap={4}>
              Logout <IoLogOut fontSize={"20"} />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
