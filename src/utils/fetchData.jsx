import {
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
  doc,
} from "firebase/firestore";

import { deleteDoc } from "firebase/firestore";

export const getAllVideos = async (firestoreDb) => {
  const videos = await getDocs(
    query(collection(firestoreDb, "videos")),
    orderBy("id", "desc")
  );

  return videos.docs.map((doc) => doc.data());
};

export const getUserInfo = async (firestoreDb, userId) => {
  const userRef = doc(firestoreDb, "users", userId);

  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return "No Such Document";
  }
};
export const fetchVideo = async (firestoreDb, videoId) => {
  const videoRef = doc(firestoreDb, "videos", videoId);

  const videoSnap = await getDoc(videoRef);
  if (videoSnap.exists()) {
    return videoSnap.data();
  } else {
    return "No Such Document";
  }
};

export const deleteVideo = async (firestoreDb, videoId) => {
  await deleteDoc(doc(firestoreDb, "videos", videoId));
};
