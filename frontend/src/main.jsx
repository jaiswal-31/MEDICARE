import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === "pk_test_dummykey") {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center", marginTop: "50px" }}>
      <h2 style={{ color: "#e53e3e" }}>Missing Clerk Publishable Key</h2>
      <p>The application relies on Clerk for authentication.</p>
      <p>Please add your valid <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the <code>.env</code> file in this folder.</p>
      <p>You can get this key from <a href="https://clerk.com/docs/react/getting-started/quickstart" target="_blank" rel="noreferrer">Clerk's Dashboard</a>.</p>
    </div>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  );
}
