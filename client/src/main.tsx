// Import polyfills first
import './polyfills';

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./lib/wallet";

createRoot(document.getElementById("root")!).render(
  React.createElement(
    WalletProvider,
    null,
    React.createElement(App, null)
  )
);
