import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Drizzle } from "@drizzle/store";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import Petshop from "./contracts/Petshop.json";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const options = {
  contracts: [Petshop],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545",
    },
  },
  events: {
    Petshop: ["PetCreated", 'PetPurchase'],
  },
  // networkWhitelist: [
  //   1337, // Local testnet
  //   4, // Rinkeby testnet
  // ],
};

// setup drizzle
const drizzle = new Drizzle(options);

const { DrizzleProvider } = drizzleReactHooks;

ReactDOM.render(
  <React.StrictMode>
    <DrizzleProvider drizzle={drizzle}>
      <App />
    </DrizzleProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
