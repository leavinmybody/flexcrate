import {
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
  Image,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { IoHome, IoTrash } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchVideo, getUserInfo, deleteVideo } from "../utils/fetchData";
import { useState, useEffect, useRef } from "react";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./../firebase-config";
import Spinner from "./../components/Spinner";
import { useColorModeValue } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { IoPlay, IoPause, IoDownload } from "react-icons/io5";
import moment from "moment/moment";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverFooter,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import {
  MdOutlineForward10,
  MdOutlineReplay10,
  MdVolumeUp,
  MdVolumeOff,
  MdFullscreen,
} from "react-icons/md";
import logo from "./../assets/logo.png";
import screenfull from "screenfull";
import parse from "html-react-parser";
import defaultProfilePicture from "./../assets/defaultProfile.png";
import { FcApproval } from "react-icons/fc";
import { fetchUser } from "../utils/fetchUserLs";

const formatTime = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const VideoDetails = () => {
  const firestoreDb = getFirestore(firebaseApp);
  const [localUser] = fetchUser();
  const navigate = useNavigate();

  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { videoId } = useParams();
  const color = useColorModeValue("#0d0d0d", "#fffffe");
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Custom reference
  const playerRef = useRef();
  const playerContainer = useRef();

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      fetchVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);

        getUserInfo(firestoreDb, data.userId).then((user) => {
          setUserInfo(user);
        });

        setLoading(false);
      });
    }
  }, [videoId]);

  useEffect(() => {}, [muted, volume, played]);

  const onvolumechange = (e) => {
    setVolume(parseFloat(e / 100));

    e === 0 ? setMuted(true) : setMuted(false);
  };

  const handleFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 100));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const onSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e / 100));
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = formatTime(currentTime);
  const totalDuration = formatTime(duration);

  const handleVideoRemoval = (videoId) => {
    setLoading(true);
    deleteVideo(firestoreDb, videoId).then(() => {
      setLoading(false);
      navigate("/");
    });
  };

  if (loading) return <Spinner />;
  return (
    <Flex
      width={"full"}
      height={"auto"}
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      py={2}
      px={4}
    >
      <head>
        <title>{videoInfo?.title}</title>
      </head>
      <Flex alignItems={"center"} width={"full"} my={4}>
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <Box width="1px" height={"25px"} bg={"gray-500"} mx={2}></Box>
        <Text color={color} fontWeight="semibold" width={"full"}>
          {videoInfo?.title}
        </Text>
      </Flex>

      {/* Main Video Grid */}
      <Grid templateColumns="repeat(4, 1fr)" gap={2} width={"full"}>
        <GridItem width={"full"} colSpan="3">
          <Flex
            width={"full"}
            bg="black"
            position={"relative"}
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoUrl}
              width={"full"}
              height={"full"}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
            />
            {/* Controls */}
            <Flex
              position={"absolute"}
              left={0}
              top={0}
              right={0}
              bottom={0}
              direction={"column"}
              justifyContent={"space-between"}
              alignItems={"center"}
              zIndex={1}
              cursor={"pointer"}
            >
              {/* Play Icon */}
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
                width={"full"}
                height={"full"}
              >
                {!isPlaying && (
                  <IoPlay fontSize={50} color="fffffe" cursor={"pointer"} />
                )}
              </Flex>
              {/* Progress Controls */}
              <Flex
                width={"full"}
                alignItems={"center"}
                direction={"column"}
                px={4}
                bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
              >
                <Slider
                  aria-label="slider-ex-4"
                  min={0}
                  max={100}
                  value={played * 100}
                  transition="ease-in-out"
                  transitionDuration={0.2}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg={"green.50"}>
                    <SliderFilledTrack bg="green.300" />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={3}
                    bg="green.300"
                    transition="ease-in-out"
                    transitionDuration={0.2}
                  />
                </Slider>
                {/* Player Controls */}
                <Flex width={"full"} alignItems={"center"} my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color="#fffffe"
                    cursor={"pointer"}
                    onClick={handleFastRewind}
                  />
                  <Box
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                    }}
                  >
                    {!isPlaying ? (
                      <IoPlay fontSize={30} color="fffffe" cursor={"pointer"} />
                    ) : (
                      <IoPause
                        fontSize={30}
                        color="fffffe"
                        cursor={"pointer"}
                      />
                    )}
                  </Box>
                  <MdOutlineForward10
                    fontSize={30}
                    color="#fffffe"
                    cursor={"pointer"}
                    onClick={handleFastForward}
                  />
                  {/* Volume Controls */}
                  <Flex
                    alignItems={"center"}
                    gap={4}
                    justifyContent={"flex-end"}
                  >
                    <Box
                      onClick={() => {
                        setMuted(!muted);
                      }}
                    >
                      {!muted ? (
                        <MdVolumeUp
                          fontSize={30}
                          color="#fffffe"
                          cursor={"pointer"}
                        />
                      ) : (
                        <MdVolumeOff
                          fontSize={30}
                          color="#fffffe"
                          cursor={"pointer"}
                        />
                      )}
                    </Box>
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={volume * 100}
                      size="sm"
                      min={0}
                      max={100}
                      width={16}
                      mx={2}
                      onChangeStart={onvolumechange}
                      onChangeEnd={onvolumechange}
                    >
                      <SliderTrack bg={"green.50"}>
                        <SliderFilledTrack bg="green.300" />
                      </SliderTrack>
                      <SliderThumb boxSize={2} bg="green.300" />
                    </Slider>
                  </Flex>

                  {/* Duration text */}
                  <Flex alignItems={"center"} gap={2}>
                    <Text fontSize={16} color="whitesmoke">
                      {elapsedTime}
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      /
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      {totalDuration}
                    </Text>
                  </Flex>
                  <Image
                    src={logo}
                    width={100}
                    ml="auto"
                    _hover={{
                      transform: "scale(1.1)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    _active={{
                      transform: "scale(0.9)",
                      transition: "all 0.2s ease-in-out",
                    }}
                  />
                  <MdFullscreen
                    fontSize={30}
                    color="fffffe"
                    cursor={"pointer"}
                    onClick={() => {
                      screenfull.toggle(playerContainer.current);
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* Video Description */}
          {videoInfo?.description && (
            <Flex direction={"column"} my={6}>
              <Text my={2} fontSize={25} fontWeight="semibold">
                Description
              </Text>
              {parse(videoInfo?.description)}
            </Flex>
          )}
        </GridItem>
        <GridItem width={"full"} colSpan="1">
          {/* User Information */}
          {userInfo && (
            <Flex direction={"column"} width={"full"}>
              <Flex alignItems={"center"} width={"full"}>
                <Image
                  src={
                    userInfo?.photoURL
                      ? userInfo?.photoURL
                      : defaultProfilePicture
                  }
                  rounded={"full"}
                  width={"60px"}
                  height={"60px"}
                  // border={"2px solid"}
                  // borderColor={color}
                  minHeight={"60px"}
                  minWidth={"60px"}
                />
                <Flex direction={"column"} ml={3}>
                  <Flex alignItems={"center"}>
                    <Text fontWeight="semibold" color={color}>
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={12}>
                      {moment(
                        new Date(parseInt(videoInfo?.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>

              {/* Action Buttons */}
              <Flex justifyContent={"space-around"} marginTop={6}>
                {userInfo?.uid === localUser.uid && (
                  <Popover
                    placement="bottom"
                    closeOnBlur={true}
                    closeOnEsc={true}
                  >
                    <PopoverTrigger>
                      <Button mx={26} minWidth={48}>
                        <IoTrash fontSize={20} color="#fffffe"></IoTrash>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirm Deletion</PopoverHeader>
                      <PopoverBody>
                        This video will be deleted immediately. You can't undo
                        this action. Are you sure?
                      </PopoverBody>
                      <PopoverFooter display="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="red"
                            onClick={() => handleVideoRemoval(videoInfo?.id)}
                            isLoading={loading}
                            loadingText="Deleting"
                          >
                            Yes
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}
                <a
                  href={videoInfo?.videoUrl}
                  download
                  onClick={(e) => e.stopPropagation}
                >
                  <Button my={2} mt={"0"} width={"48"}>
                    <IoDownload fontSize={20} color="#fffffe"></IoDownload>
                  </Button>
                </a>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default VideoDetails;
