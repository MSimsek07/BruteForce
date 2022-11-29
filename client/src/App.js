import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Header from "./components/Header";
import React from "react";
import Store from "./components/Storage";
import { NotFound } from "./components/NotFound";

function App() {
  return (
    <main>
      <Store>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Store>
      <p
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          width: "100%",
          color: "lightgray",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      ></p>
    </main>
  );
}

export default App;
