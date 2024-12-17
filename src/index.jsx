import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Correct path to App.jsx
import "./styles/App.css"; // Make sure this path is correct

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") // Ensure this matches the ID in index.html
);
