import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";

import Login from "./Login";
import Home from "./Home";
import CadastroUser from "./CadastroUser";
import CadastroFamilia from "./CadastroFamilia";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" replace />} />
        <Route path="/cadastro" element={<CadastroUser />} />
        <Route path="/CadastroFamilia" element={<CadastroFamilia />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;