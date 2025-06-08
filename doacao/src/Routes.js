import { useState, useEffect } from "react";
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
import UnidadesMedida from './UnidadesMedida';
import Estoque from './Estoque';
import EstoqueLocal from './EstoqueLocal';
import CadastroPessoaAutorizada from "./CadastroPessoaAutorizada";
import AlterarFamilia from './AlterarFamilia';
import EditarFamilia from './EditarFamilia';

const AppRoutes = () => {
  // Mantém a lógica de autenticação como estava
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verifica se há usuário logado no localStorage
    return !!localStorage.getItem('usuarioLogado');
  });

  // Atualiza autenticação ao logar
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Atualiza autenticação ao logout (caso queira implementar logout futuramente)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('usuarioLogado'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
        <Route path="/unidades-medida" element={<UnidadesMedida />} />
        <Route path="/estoque" element={isAuthenticated ? <Estoque /> : <Navigate to="/" replace />} />
        <Route path="/estoque-local" element={isAuthenticated ? <EstoqueLocal /> : <Navigate to="/" replace />} />
        <Route path="/pessoa-autorizada" element={isAuthenticated ? <CadastroPessoaAutorizada /> : <Navigate to="/" replace />} />
        <Route path="/alterarFamilia" element={<AlterarFamilia />} />
        <Route path="/editar-familia/:id" element={<EditarFamilia />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

