import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";

import Login from "./Login";
import Home from "./Home";
import CadastroUser from "./CadastroUser";
import CadastroFamilia from "./CadastroFamilia";
import CadastroLocal from "./CadastroLocal";
// *** ADICIONE A IMPORTAÇÃO DO NOVO COMPONENTE AQUI ***
import CadastroResponsavel from "./CadastroResponsavel"; // Certifique-se que o caminho está correto
import CadastroDoacoes from "./CadastroDoacoes";
import CadastroMembroFamiliar from "./CadastroMembroFamiliar";
import CadastroSaidaDoacao from "./CadastroSaidaDoacao";

const AppRoutes = () => {
  // Mantém a lógica de autenticação como estava
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Exemplo: Simula autenticação após login para testes
  // Você deve ajustar isso conforme sua lógica real de login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login setIsAuthenticated={handleLoginSuccess} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" replace />} />
        <Route path="/cadastro" element={isAuthenticated ? <CadastroUser /> : <Navigate to="/" replace />} />
        <Route path="/CadastroFamilia" element={isAuthenticated ? <CadastroFamilia /> : <Navigate to="/" replace />} />
        <Route path="/CadastroLocal" element={isAuthenticated ? <CadastroLocal /> : <Navigate to="/" replace />} />
        <Route path="/cadastroResponsavel" element={isAuthenticated ? <CadastroResponsavel /> : <Navigate to="/" replace />} />
        <Route path="/cadastroDoacoes" element={isAuthenticated ? <CadastroDoacoes /> : <Navigate to="/" replace />} />
        <Route path="/cadastroMembroFamiliar" element={isAuthenticated ? <CadastroMembroFamiliar /> : <Navigate to="/" replace />} />
        <Route path="/saidaDoacao" element={isAuthenticated ? <CadastroSaidaDoacao /> : <Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

