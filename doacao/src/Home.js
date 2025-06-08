import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style//Home.css';
import { icons } from './Assets/Icons';
import MenuLateral from './Components/MenuLateral';
import homeLogo from './Assets/home.jpg';
import plano3 from "./Assets/plano3.png";

function Home() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const goToCadastro = () => {
    navigate('/Cadastro');
  };

  const goToFamilia = () => {
    navigate('/CadastroFamilia');
  };

  const goToLocal = () => {
    navigate('/CadastroLocal');
  };

  const goToDoacoes = () => {
    navigate('/CadastroDoacoes');
  };

  const goToSaidaDoacao = () => {
    navigate('/saidaDoacao');
  };

  const goToEstoque = () => {
    navigate('/estoque');
  };

  const goToPessoaAutorizada = () => {
    navigate('/pessoa-autorizada');
  };

  const goToAlterarFamilia = () => {
    navigate('/alterarFamilia');
  };

  const goToEstoqueLocal = () => {
    navigate('/estoque-local');
  };

  return (
    <div className="home-container" style={{ background: `url(${plano3}) center/cover no-repeat, #f5f5f5` }}>
      {/* Menu lateral */}
      <MenuLateral open={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={homeLogo} alt="Logo SIGEAS" className="home-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
          <button className="menu-hamburger" onClick={() => setMenuOpen(true)} title="Abrir menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e8b57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
        </div>
        <h2>Gerenciamento de Doações</h2>
        <div className="header-user-area">
          <span className="user-info">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: 6}}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            {usuarioLogado?.nome || 'Usuário'}
          </span>
          <button onClick={handleLogout} className="header-logout-btn" title="Sair">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1>Bem-vindo ao <strong>Gerenciamento de Doações</strong></h1>
        <p className="subtitle">Facilitando o controle de entradas e saídas de doações</p>

        <div className="options-grid">
          <div className="option-card" onClick={goToCadastro}>
            {icons.usuario}
            <h3>Cadastrar Usuários</h3>
            <p>Cadastrar novos usuários</p>
          </div>

          <div className="option-card" onClick={goToFamilia}>
            {icons.familia}
            <h3>Cadastrar Família</h3>
            <p>Registrar informações das famílias</p>
          </div>

          <div className="option-card" onClick={goToLocal}>
            {icons.local}
            <h3>Cadastrar Local</h3>
            <p>Registrar Novos Locais de retirada</p>
          </div>

          <div className="option-card" onClick={goToDoacoes}>
            {icons.produto}
            <h3>Cadastro de Produto</h3>
            <p>Registrar novos produtos</p>
          </div>

          <div className="option-card" onClick={goToSaidaDoacao}>
            {icons.saida}
            <h3>Saídas de Doações</h3>
            <p>Registrar retirada de doações</p>
          </div>

          <div className="option-card" onClick={goToEstoque}>
            {icons.estoque}
            <h3>Visualizar Estoque</h3>
            <p>Consultar movimentações de estoque</p>
          </div>

          <div className="option-card" onClick={goToPessoaAutorizada}>
            {icons.autorizada}
            <h3>Cadastrar Pessoa Autorizada</h3>
            <p>Autorizar retirada para pessoa externa ou membro</p>
          </div>

          <div className="option-card" onClick={goToAlterarFamilia}>
            {icons.alterar}
            <h3>Alterar Família</h3>
            <p>Excluir/adicionar membros e autorizar retirada</p>
          </div>

          <div className="option-card" onClick={goToEstoqueLocal}>
            {icons.estoqueLocal}
            <h3>Estoque por Local</h3>
            <p>Visualizar produtos disponíveis em um local específico</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;