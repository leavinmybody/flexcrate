import { IoGameController, IoMusicalNote, IoShirt } from "react-icons/io5";
import { FaSmileWink, FaFilm, FaQq } from "react-icons/fa";
import { MdEmojiNature } from "react-icons/md";

export const categories = [
  {
    id: 1,
    name: "Gaming",
    iconSrc: <IoGameController fontSize={30} />,
  },
  {
    id: 2,
    name: "Music",
    iconSrc: <IoMusicalNote fontSize={30} />,
  },
  {
    id: 3,
    name: "Comedy",
    iconSrc: <FaSmileWink fontSize={30} />,
  },
  {
    id: 4,
    name: "Movies",
    iconSrc: <FaFilm fontSize={30} />,
  },
  {
    id: 5,
    name: "Anime",
    iconSrc: <FaQq fontSize={30} />,
  },
  {
    id: 6,
    name: "Fashion",
    iconSrc: <IoShirt fontSize={30} />,
  },
  {
    id: 7,
    name: "Nature",
    iconSrc: <MdEmojiNature fontSize={30} />,
  },
];
