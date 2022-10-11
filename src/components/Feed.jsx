import React from "react";
import { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./../firebase-config";
import { getAllVideos } from "./../utils/fetchData";
import Spinner from "./../components/Spinner";
import { SimpleGrid } from "@chakra-ui/react";
import VideoPin from "./VideoPin";

const Feed = () => {
  // Firestore Database Instance
  const firestoreDb = getFirestore(firebaseApp);

  const [videos, setVideos] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllVideos(firestoreDb).then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner msg="Loading videos" />;

  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width={"full"}
      autoColumns={"max-content"}
      px={4}
      overflowX={"hidden"}
    >
      {videos &&
        videos.map((video) => (
          <VideoPin key={video.id} maxWidth={420} height={80} video={video} />
        ))}
    </SimpleGrid>
  );
};

export default Feed;
