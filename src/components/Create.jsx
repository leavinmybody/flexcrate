import React, { useEffect, useRef } from "react";
import {
  Input,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  InputGroup,
  InputLeftElement,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoChevronDown, IoCloudUpload } from "react-icons/io5";
import { categories } from "./../data";
import { MdTag } from "react-icons/md";
import Spinner from "./Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseApp } from "../firebase-config";
import { IoMdTrash } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";
import { fetchUser } from "../utils/fetchUserLs";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pick a category");
  const [tags, setTags] = useState([]);
  const [videoAsset, setVideoAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0.1);
  const [description, setDescription] = useState("");

  const storage = getStorage(firebaseApp);
  const db = getFirestore(firebaseApp);

  const [userInfo] = fetchUser();

  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const videoFile = e.target.files[0];
    const storageRef = ref(storage, `videos/${Date.now()}-${videoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        toast.error(error, {
          duration: 5000,
          position: "top-right",
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAsset(downloadURL);
          setLoading(false);
          toast.success("Video uploaded successfully", {
            duration: 4000,
            position: "top-right",
          });
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  const handleDelete = () => {
    const deleteRef = ref(storage, videoAsset);
    deleteObject(deleteRef)
      .then(() => {
        setVideoAsset(null);
        toast.success("Video deleted successfully", {
          duration: 4000,
          position: "top-right",
          icon: "🗑️",
        });
      })
      .catch((error) => {
        toast.error(error, {
          duration: 5000,
          position: "top-right",
        });
      });
  };

  const handleUploadDetails = async () => {
    try {
      setLoading(true);
      if (!title && !category && !videoAsset) {
        toast.error("Please fill all the fields", {
          duration: 5000,
          position: "top-right",
        });
        setLoading(false);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          category: category,
          tags: tags,
          videoUrl: videoAsset,
          description: description,
        };

        await setDoc(doc(db, "videos", `${Date.now()}`), data);
        setLoading(false);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDescriptionValue = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.getContent());
    }
  };

  useEffect(() => {}, [title, category, tags, videoAsset, description]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems="center"
      width={"full"}
      minHeight="100vh"
      padding={10}
    >
      <Toaster />
      <Flex
        width={"80%"}
        height="full"
        border={"1px"}
        borderColor="gray.300"
        borderRadius={"10px"}
        p="4"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
        gap={2}
      >
        <Input
          variant={"filled"}
          placeholder="Title"
          focusBorderColor="gray-400"
          errorBorderColor="red"
          type={"text"}
          _placeholder={{ color: "gray.400" }}
          fontSize={"2xl"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Flex
          justifyContent={"space-between"}
          width="full"
          alignItems={"center"}
          gap={8}
          my={4}
        >
          <Menu>
            <MenuButton
              width={"full"}
              colorScheme="green"
              as={Button}
              rightIcon={<IoChevronDown fontSize={25} />}
            >
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={"md"} shadow={"xl"}>
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: "blackAlpha.300" }}
                    fontSize={20}
                    px={4}
                    onClick={() => setCategory(data.name)}
                  >
                    {data.iconSrc}
                    <Text fontSize={20} ml={4} mb={1}>
                      {data.name}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<MdTag color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Tags (optional)"
              focusBorderColor="gray.400"
              errorBorderColor="red"
              _placeholder={{ color: "gray.500" }}
              fontSize={20}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {/* File Selection */}
        <Flex
          border={"1px"}
          borderColor="gray.500"
          height={"400px"}
          borderStyle="dashed"
          width={"full"}
          borderRadius={"10px"}
          overflow={"hidden"}
          position={"relative"}
        >
          {!videoAsset ? (
            <FormLabel width={"full"}>
              <Flex
                direction={"column"}
                alignItems="center"
                justifyContent="center"
                height={"full"}
                width="full"
              >
                <Flex
                  direction={"column"}
                  alignItems="center"
                  justifyContent="center"
                  height={"full"}
                  width="full"
                  cursor={"pointer"}
                >
                  {loading ? (
                    <Spinner
                      msg={"Uploading your video..."}
                      progress={progress}
                    />
                  ) : (
                    <>
                      <IoCloudUpload fontSize={45} />
                      <Text fontSize={20} mt={2}>
                        Click to upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>

              {!loading && (
                <input
                  type="file"
                  name="upload-video"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                  accept="video/*"
                ></input>
              )}
            </FormLabel>
          ) : (
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"full"}
              height={"full"}
              position={"relative"}
              bg={"blackAlpha.300"}
            >
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"40px"}
                height={"40px"}
                rounded={"full"}
                bg={"red.500"}
                top={5}
                right={5}
                position={"absolute"}
                cursor={"pointer"}
                zIndex={10}
              >
                <IoMdTrash onClick={handleDelete} fontSize={25} />
              </Flex>
              <video
                src={videoAsset}
                width={"full"}
                height={"full"}
                controls
              ></video>
            </Flex>
          )}
        </Flex>
        <Editor
          onChange={getDescriptionValue}
          tinymceScriptSrc={import.meta.env.VITE_TINY_PUBLIC_URL}
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 500,
            width: "100%",
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            content_css: "dark",
            skin: "oxide-dark",
          }}
        />
        <Button
          isLoading={loading}
          loadingText="Uploading"
          colorScheme={"green"}
          variant={`${loading ? "outline" : "solid"}`}
          width={"md"}
          _hover={{ bg: "green.300", shadow: "lg" }}
          onClick={handleUploadDetails}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
