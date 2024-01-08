import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login/Login";
import Visitor from "./pages/User/Visitor";
import Operator from "./pages/User/Operator";
import UserProvider from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/visitor" element={<Visitor />} />
          <Route path="/operator" element={<Operator />} />
        </Routes>
        <Toaster
          toastOptions={{
            style: {
              fontSize: "20px",
            },
          }}
        />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
