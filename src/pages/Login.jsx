import React from "react";
import { Flex, HStack, Button } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const Login = () => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const db = getFirestore(firebaseApp);

  const handleLogin = async () => {
    const { user } = await signInWithPopup(auth, provider);
    const { refreshToken, providerData } = user;

    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));

    await setDoc(doc(db, "users", providerData[0].uid), providerData[0]);
    navigate("/", { replace: true });
  };
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
      position={"relative"}
    >
      <Flex>
        <HStack>
          <Button
            leftIcon={<FaGoogle />}
            colorScheme="blackAlpha"
            shadow={"lg"}
            onClick={() => handleLogin()}
          >
            Login with Google
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Login;
