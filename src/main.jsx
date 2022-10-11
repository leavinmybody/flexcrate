import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ColorModeScript } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Router>
      <App />
    </Router>
  </ChakraProvider>
);
