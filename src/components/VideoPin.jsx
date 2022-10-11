import { Flex, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserInfo } from "../utils/fetchData";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./../firebase-config";
import { useColorModeValue } from "@chakra-ui/react";
import moment from "moment";
// import defaultProfilePicture from "./../assets/defaultProfile.png";

const defaultProfilePicture =
  "https://i.pinimg.com/564x/0b/d0/1f/0bd01f6d18fca385dbaf52c2186cfeea.jpg";

const VideoPin = ({ video }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const firestoreDb = getFirestore(firebaseApp);
  const bg = useColorModeValue("#eff0f3", "#0f0e17");
  const color = useColorModeValue("#0d0d0d", "#fffffe");

  useEffect(() => {
    if (video) setUserId(video.userId);
    if (userId)
      getUserInfo(firestoreDb, userId).then((video) => {
        setUserInfo(video);
      });
  }, [userId]);

  console.log(video);

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems="center"
      direction={"column"}
      cursor={"pointer"}
      _hover={{ shadow: "md" }}
      rounded={"10px"}
      overflow={"hidden"}
      position={"relative"}
      maxWidth={"300px"}
      shadow={"lg"}
    >
      <Link to={`/video/${video?.id}`}>
        <video
          src={video.videoUrl}
          onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => e.target.pause()}
        />
      </Link>
      <Flex
        position={"absolute"}
        bottom="0"
        left="0"
        p={2}
        width="full"
        direction={"column"}
      >
        <Flex
          width={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text
            color="white"
            fontSize={20}
            paddingTop={"12px"}
            borderRadius={10}
          >
            {video.title}
          </Text>
          <Link to={`/user/${userId}`}>
            <Image
              src={
                userInfo?.photoURL ? userInfo?.photoURL : defaultProfilePicture
              }
              borderRadius={"full"}
              width={"50px"}
              height={"50px"}
              border={"2px"}
              minHeight={"50px"}
              minWidth={"50px"}
              borderColor={bg}
              _hover={{
                transform: "scale(1.05)",
                transition: "all 0.1s ease-in",
              }}
              _active={{
                transform: "scale(0.95)",
                transition: "all 0.1s ease-in",
              }}
              referrerPolicy={"no-referrer"}
            />
          </Link>
        </Flex>
        <Text
          color={color}
          fontSize={12}
          ml="auto"
          bg={bg}
          borderRadius={"10px"}
          width={"fit-content"}
          height={"fit-content"}
          p={1}
          mt={2}
        >
          {moment(new Date(parseInt(video.id)).toISOString()).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
};

export default VideoPin;
