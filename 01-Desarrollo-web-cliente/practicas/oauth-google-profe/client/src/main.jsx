import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginRegistro from "./componentes/LoginRegistro.jsx";
import Home from "./componentes/Home.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegistro />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
